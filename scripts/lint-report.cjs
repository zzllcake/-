#!/usr/bin/env node
/**
 * 代码审查引擎 - 完整统计版
 * ============================================================
 * 解决的问题:
 *   1. 解析失败的文件不再静默跳过，记录为 info 并在报告中列出
 *   2. 区分 error / warning / info 三个级别，全部保留返回
 *   3. 输出完整统计（总数/分级数量），不截断
 *   4. 生成 JSON 报告供前端/后续步骤消费
 *   5. 记录扫描过的文件、被忽略的文件，便于排查漏检
 *
 * 用法:
 *   node scripts/lint-report.cjs              # 扫描 src/
 *   node scripts/lint-report.cjs src/foo.ts   # 扫描指定文件
 *   node scripts/lint-report.cjs --json       # 只输出 JSON
 */
const { ESLint } = require('eslint');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'reports');
const JSON_OUT = path.join(REPORT_DIR, 'eslint-report.json');
const SUMMARY_OUT = path.join(REPORT_DIR, 'eslint-summary.json');

async function main() {
  const args = process.argv.slice(2);
  const jsonOnly = args.includes('--json');
  const noIgnore = args.includes('--no-ignore');   // 诊断用: 绕过 ignorePatterns
  const targets = args.filter(a => !a.startsWith('--'));
  const lintTargets = targets.length > 0 ? targets : ['src/**/*.{ts,tsx,js,jsx}'];

  const t0 = Date.now();

  // ---- 初始化 ESLint ----
  const eslint = new ESLint({
    cwd: ROOT,
    errorOnUnmatchedPattern: false,
    ignore: !noIgnore,   // --no-ignore 时强制扫描全部文件
  });

  // ---- 记录忽略的文件（调试用）----
  const debugLog = {
    扫描目标: lintTargets,
    开始时间: new Date().toISOString(),
    被忽略的文件: [],
    解析失败的文件: [],
    成功解析的文件数: 0,
  };

  // 找出所有可能的文件，逐个检查是否被忽略
  const allFiles = [];
  const glob = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', 'dist', 'coverage', '.git', 'reports'].includes(entry.name)) continue;
        glob(full);
      } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        allFiles.push(full);
      }
    }
  };
  glob(path.join(ROOT, 'src'));

  for (const f of allFiles) {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    const ignored = await eslint.isPathIgnored(rel);
    if (ignored) debugLog.被忽略的文件.push(rel);
  }

  // ---- 忽略配置体检：检查是否有"看起来像源码"的文件被忽略 ----
  const SUSPICIOUS_PATTERNS = [
    { re: /error/i, msg: '文件名含 error，可能是测试样本，请确认是否需要审查' },
    { re: /sample|example|demo|test-data/i, msg: '文件名疑似测试数据，请确认是否需要审查' },
    { re: /\.(ts|tsx|js|jsx)$/, msg: '源码文件被忽略' },
  ];
  const suspicious = [];
  for (const f of debugLog.被忽略的文件) {
    // 排除典型的非源码目录
    if (/^(node_modules|dist|coverage|reports|\.git)\//.test(f)) continue;
    for (const p of SUSPICIOUS_PATTERNS) {
      if (p.re.test(f)) {
        suspicious.push({ 文件: f, 原因: p.msg });
        break;
      }
    }
  }
  debugLog.可疑忽略文件 = suspicious;
  if (suspicious.length > 0) {
    debugLog.警告 = `有 ${suspicious.length} 个疑似源码/测试文件被 ignore 配置排除，可能导致漏检`;
  }

  // ---- 执行扫描（P1-4: 分批 + 超时保护）----
  const BATCH_SIZE = 20;        // 每批文件数
  const BATCH_TIMEOUT = 120000; // 每批超时 2 分钟

  // 展开 glob 得到实际文件列表（用于分批）
  let fileList = [];
  try {
    const { globSync } = require('glob');
    for (const t of lintTargets) {
      fileList.push(...globSync(t, { cwd: ROOT, absolute: false, ignore: ['node_modules/**'] }));
    }
  } catch (e) {
    // 没有 glob 包时退回单次扫描
    fileList = null;
  }

  let results = [];
  const timeouts = [];

  if (fileList && fileList.length > BATCH_SIZE) {
    console.log(`📦 分批扫描: ${fileList.length} 个文件，分 ${Math.ceil(fileList.length / BATCH_SIZE)} 批`);
    for (let i = 0; i < fileList.length; i += BATCH_SIZE) {
      const batch = fileList.slice(i, i + BATCH_SIZE);
      const batchNo = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(fileList.length / BATCH_SIZE);
      try {
        const batchResults = await Promise.race([
          eslint.lintFiles(batch),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('BATCH_TIMEOUT')), BATCH_TIMEOUT)
          ),
        ]);
        results.push(...batchResults);
        console.log(`   批次 ${batchNo}/${totalBatches}: ${batch.length} 个文件 ✅`);
      } catch (e) {
        if (e.message === 'BATCH_TIMEOUT') {
          timeouts.push(...batch);
          console.log(`   批次 ${batchNo}/${totalBatches}: ⏱️ 超时，跳过 ${batch.length} 个文件`);
        } else {
          console.log(`   批次 ${batchNo}/${totalBatches}: ❌ ${e.message}`);
        }
      }
    }
  } else {
    try {
      results = await eslint.lintFiles(lintTargets);
    } catch (e) {
      console.error('❌ ESLint 执行失败:', e.message);
      process.exit(2);
    }
  }

  // ---- 汇总统计 ----
  const stats = {
    总数: 0,
    error数量: 0,
    warning数量: 0,
    info数量: 0,
    可自动修复: 0,
    涉及文件数: 0,
  };

  const byRule = {};      // 按规则统计
  const byFile = {};      // 按文件统计
  const byType = { error: 0, warning: 0, info: 0 };
  const allMessages = []; // 完整错误列表（不截断）
  const parseFailures = [];

  for (const r of results) {
    const rel = path.relative(ROOT, r.filePath).replace(/\\/g, '/');

    // 解析失败（fatal）单独记录
    const fatal = r.messages.filter(m => m.fatal);
    if (fatal.length > 0) {
      parseFailures.push({
        文件: rel,
        错误: fatal.map(m => ({
          行: m.line,
          列: m.column,
          信息: m.message,
        })),
      });
      debugLog.解析失败的文件.push(rel);
    }

    if (r.messages.length > 0) stats.涉及文件数++;

    for (const m of r.messages) {
      const severity = m.severity === 2 ? 'error' : m.severity === 1 ? 'warning' : 'info';
      // 解析错误按 info 处理（不阻断，但提示）
      const level = m.fatal ? 'info' : severity;

      stats.总数++;
      byType[level]++;

      const ruleId = m.ruleId || '(parse-error)';
      byRule[ruleId] = (byRule[ruleId] || 0) + 1;

      if (!byFile[rel]) byFile[rel] = { error: 0, warning: 0, info: 0, 总数: 0 };
      byFile[rel][level]++;
      byFile[rel].总数++;

      if (m.fix) stats.可自动修复++;

      allMessages.push({
        文件: rel,
        行: m.line,
        列: m.column,
        等级: level,
        规则: ruleId,
        信息: m.message,
        可修复: !!m.fix,
        来源: m.fatal ? 'parse' : 'lint',
      });
    }

    if (r.messages.length === 0) debugLog.成功解析的文件数++;
  }

  stats.error数量 = byType.error;
  stats.warning数量 = byType.warning;
  stats.info数量 = byType.info;
  stats.涉及文件数 = Object.keys(byFile).length;

  // ---- P1-2: 轻量去重（只合并完全相同的错误）----
  // 严禁按错误类型批量合并，只合并「同文件+同行+同列+同规则+同消息」的完全重复项
  const seen = new Set();
  const dedupRemoved = [];
  const uniqueMessages = allMessages.filter(m => {
    const key = `${m.文件}|${m.行}|${m.列}|${m.规则}|${m.信息}`;
    if (seen.has(key)) {
      dedupRemoved.push(key);
      return false;
    }
    seen.add(key);
    return true;
  });

  // 重新按统计口径计数（去重后）
  const finalStats = {
    总数: uniqueMessages.length,
    error数量: uniqueMessages.filter(m => m.等级 === 'error').length,
    warning数量: uniqueMessages.filter(m => m.等级 === 'warning').length,
    info数量: uniqueMessages.filter(m => m.等级 === 'info').length,
    可自动修复: uniqueMessages.filter(m => m.可修复).length,
    涉及文件数: new Set(uniqueMessages.map(m => m.文件)).size,
    去重合并数: dedupRemoved.length,
  };

  // ---- 排序：error 在前 ----
  const order = { error: 0, warning: 1, info: 2 };
  uniqueMessages.sort((a, b) => {
    const d = order[a.等级] - order[b.等级];
    if (d !== 0) return d;
    if (a.文件 !== b.文件) return a.文件.localeCompare(b.文件);
    return (a.行 || 0) - (b.行 || 0);
  });

  const report = {
    生成时间: new Date().toISOString(),
    耗时毫秒: Date.now() - t0,
    统计: finalStats,
    文件统计: byFile,
    规则统计: Object.fromEntries(
      Object.entries(byRule).sort((a, b) => b[1] - a[1])
    ),
    解析失败: parseFailures,
    超时文件: timeouts,
    调试日志: debugLog,
    错误列表: uniqueMessages,   // 完整列表，不截断
  };

  // ---- 输出文件 ----
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(JSON_OUT, JSON.stringify(report, null, 2), 'utf-8');
  fs.writeFileSync(SUMMARY_OUT, JSON.stringify({
    生成时间: report.生成时间,
    统计: finalStats,
    规则统计: report.规则统计,
    解析失败数: parseFailures.length,
    被忽略文件数: debugLog.被忽略的文件.length,
  }, null, 2), 'utf-8');

  // ---- 控制台输出 ----
  if (jsonOnly) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('');
    console.log('══════════════════════════════════════════════════');
    console.log('  📊 代码审查完整统计');
    console.log('══════════════════════════════════════════════════');
    console.log(`  总问题数    : ${finalStats.总数}`);
    console.log(`  ❌ error    : ${finalStats.error数量}`);
    console.log(`  ⚠️  warning  : ${finalStats.warning数量}`);
    console.log(`  💡 info     : ${finalStats.info数量}`);
    console.log(`  涉及文件    : ${finalStats.涉及文件数}`);
    console.log(`  可自动修复  : ${finalStats.可自动修复}`);
    if (finalStats.去重合并数 > 0) console.log(`  去重合并    : ${finalStats.去重合并数}`);
    console.log(`  耗时        : ${report.耗时毫秒}ms`);
    console.log('');
    console.log('  📁 调试日志:');
    console.log(`     扫描文件数       : ${allFiles.length}`);
    console.log(`     被忽略的文件     : ${debugLog.被忽略的文件.length}`);
    if (debugLog.被忽略的文件.length > 0 && debugLog.被忽略的文件.length <= 10) {
      debugLog.被忽略的文件.forEach(f => console.log(`       - ${f}`));
    }
    console.log(`     解析失败的文件   : ${parseFailures.length}`);
    console.log(`     扫描超时的文件   : ${timeouts.length}`);
    parseFailures.forEach(p => {
      console.log(`       - ${p.文件}: ${p.错误[0]?.信息 || '未知'}`);
    });

    // 忽略配置警告（防漏检）
    if (suspicious.length > 0) {
      console.log('');
      console.log('  ⚠️  忽略配置警告:');
      console.log(`     ${debugLog.警告}`);
      suspicious.forEach(s => console.log(`       - ${s.文件} (${s.原因})`));
      console.log('     👉 如果这些文件需要被审查，请从 .eslintrc.cjs 的 ignorePatterns 中移除');
    }
    console.log('');
    console.log('  🔝 规则命中 TOP 10:');
    Object.entries(report.规则统计).slice(0, 10).forEach(([rule, cnt]) => {
      console.log(`     ${String(cnt).padStart(5)}  ${rule}`);
    });
    console.log('');
    console.log(`  📄 完整报告: ${path.relative(ROOT, JSON_OUT)}`);
    console.log(`  📄 统计摘要: ${path.relative(ROOT, SUMMARY_OUT)}`);
    console.log('══════════════════════════════════════════════════');
    console.log('');
  }

  // ---- 退出码：有 error 才非零（warning 不阻断）----
  if (finalStats.error数量 > 0) process.exit(1);
  process.exit(0);
}

main().catch(e => {
  console.error('❌ 未捕获错误:', e);
  process.exit(2);
});
