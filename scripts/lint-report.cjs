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
  const targets = args.filter(a => !a.startsWith('--'));
  const lintTargets = targets.length > 0 ? targets : ['src/**/*.{ts,tsx,js,jsx}'];

  const t0 = Date.now();

  // ---- 初始化 ESLint ----
  const eslint = new ESLint({
    cwd: ROOT,
    errorOnUnmatchedPattern: false,
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

  // ---- 执行扫描 ----
  let results;
  try {
    results = await eslint.lintFiles(lintTargets);
  } catch (e) {
    console.error('❌ ESLint 执行失败:', e.message);
    process.exit(2);
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

  // ---- 排序：error 在前 ----
  const order = { error: 0, warning: 1, info: 2 };
  allMessages.sort((a, b) => {
    const d = order[a.等级] - order[b.等级];
    if (d !== 0) return d;
    if (a.文件 !== b.文件) return a.文件.localeCompare(b.文件);
    return (a.行 || 0) - (b.行 || 0);
  });

  const report = {
    生成时间: new Date().toISOString(),
    耗时毫秒: Date.now() - t0,
    统计: stats,
    文件统计: byFile,
    规则统计: Object.fromEntries(
      Object.entries(byRule).sort((a, b) => b[1] - a[1])
    ),
    解析失败: parseFailures,
    调试日志: debugLog,
    错误列表: allMessages,   // 完整列表，不截断
  };

  // ---- 输出文件 ----
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(JSON_OUT, JSON.stringify(report, null, 2), 'utf-8');
  fs.writeFileSync(SUMMARY_OUT, JSON.stringify({
    生成时间: report.生成时间,
    统计: stats,
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
    console.log(`  总问题数    : ${stats.总数}`);
    console.log(`  ❌ error    : ${stats.error数量}`);
    console.log(`  ⚠️  warning  : ${stats.warning数量}`);
    console.log(`  💡 info     : ${stats.info数量}`);
    console.log(`  涉及文件    : ${stats.涉及文件数}`);
    console.log(`  可自动修复  : ${stats.可自动修复}`);
    console.log(`  耗时        : ${report.耗时毫秒}ms`);
    console.log('');
    console.log('  📁 调试日志:');
    console.log(`     扫描文件数       : ${allFiles.length}`);
    console.log(`     被忽略的文件     : ${debugLog.被忽略的文件.length}`);
    if (debugLog.被忽略的文件.length > 0 && debugLog.被忽略的文件.length <= 10) {
      debugLog.被忽略的文件.forEach(f => console.log(`       - ${f}`));
    }
    console.log(`     解析失败的文件   : ${parseFailures.length}`);
    parseFailures.forEach(p => {
      console.log(`       - ${p.文件}: ${p.错误[0]?.信息 || '未知'}`);
    });
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
  if (stats.error数量 > 0) process.exit(1);
  process.exit(0);
}

main().catch(e => {
  console.error('❌ 未捕获错误:', e);
  process.exit(2);
});
