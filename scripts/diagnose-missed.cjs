#!/usr/bin/env node
/**
 * P0 漏检根因排查脚本
 * ============================================================
 * 按顺序执行三项检查:
 *   1. 抽样验证 - 挑 N 个"未被检出"的错误，用同款 ESLint 配置本地验证
 *   2. 跳过文件 - 统计扫描/解析失败/忽略/超时的文件数
 *   3. 接口完整性 - 对比真实总数 vs GitHub API 返回数
 *
 * 用法: node scripts/diagnose-missed.cjs
 */
const { ESLint } = require('eslint');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SAMPLES = 'src/review-samples-80.ts';

function line(char = '═', len = 66) {
  return char.repeat(len);
}
function title(t) {
  console.log('');
  console.log(line());
  console.log(`  ${t}`);
  console.log(line());
}

async function main() {
  console.log('');
  console.log('██████████████████████████████████████████████████████████████████');
  console.log('  🔍 P0 漏检根因排查');
  console.log('██████████████████████████████████████████████████████████████████');

  // ============================================================
  // 检查 1: 抽样验证规则是否生效
  // ============================================================
  title('检查 1/3: 抽样验证 —— 未检出的错误，本地 ESLint 能识别吗？');

  // 关键：必须用 ignore:false 强制扫描
  // 原因: ESLint 8 的 ignorePatterns 在 config 解析阶段生效，
  //       overrideConfigFile 无法绕过（会静默跳过文件，只返回 1 条 ignored 警告）
  const eslint = new ESLint({
    cwd: ROOT,
    errorOnUnmatchedPattern: false,
    ignore: false,   // ← 强制扫描，绕过 ignorePatterns
  });

  let results;
  try {
    results = await eslint.lintFiles([SAMPLES]);
  } catch (e) {
    console.log('❌ 扫描失败: ' + e.message);
    process.exit(2);
  }

  const allMsgs = [];
  for (const r of results) {
    for (const m of r.messages) {
      allMsgs.push({ ...m, rel: path.relative(ROOT, r.filePath) });
    }
  }

  // 抽查样本（覆盖不同类别 + 不同等级）
  const sampleFileLines = fs.readFileSync(path.join(ROOT, SAMPLES), 'utf-8').split('\n');
  const samples = [
    { name: 'eval 注入', code: 'eval(', expect: 'error', engine: 'no-eval' },
    { name: '危险 innerHTML', code: 'innerHTML =', expect: 'warning', engine: 'no-restricted-syntax' },
    { name: '重复导入', code: "from 'vitest'", expect: 'error', engine: 'import/no-duplicates' },
    { name: '废弃 API __proto__', code: '__proto__', expect: 'warning', engine: 'no-restricted-properties' },
    { name: '未判空访问', code: '!.length', expect: 'error', engine: 'no-non-null-assertion' },
  ];

  console.log(`📊 本地扫描结果: ${allMsgs.length} 个问题`);
  console.log(`   error: ${allMsgs.filter(m => m.severity === 2).length}`);
  console.log(`   warning: ${allMsgs.filter(m => m.severity === 1).length}`);
  console.log('');

  // 逐个验证
  let detectable = 0;
  let undetectable = 0;

  for (const s of samples) {
    // 找文件中包含该代码模式的行号
    const hitLines = [];
    sampleFileLines.forEach((ln, i) => {
      if (ln.includes(s.code)) hitLines.push(i + 1);
    });
    // 匹配这些行上的 ESLint 报告
    const hits = allMsgs.filter(m => hitLines.includes(m.line));
    const status = hits.length > 0 ? '✅ 可检出' : '❌ 未检出';
    if (hits.length > 0) detectable++;
    else undetectable++;

    console.log(`${status}  ${s.name}`);
    console.log(`         目标引擎: ${s.engine}（预期等级: ${s.expect}）`);
    if (hits.length > 0) {
      const lv = hits[0].severity === 2 ? 'error' : 'warning';
      console.log(`         ✅ 检出 ${hits.length} 条，示例: 行${hits[0].line} [${lv}] ${hits[0].ruleId}`);
      console.log(`         信息: ${(hits[0].message || '').slice(0, 60)}`);
    } else {
      console.log(`         ⚠️  本地同款 ESLint 也未报出 → 属于静态扫描能力边界`);
    }
    console.log('');
  }

  console.log(line('─'));
  console.log(`结论: ${detectable} 个可检出（链路问题） / ${undetectable} 个不可检出（规则边界）`);

  // ============================================================
  // 检查 2: 被跳过的文件数量
  // ============================================================
  title('检查 2/3: 被跳过的文件 —— 是不是根本没扫到？');

  const allFiles = [];
  const glob = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (['node_modules', 'dist', 'coverage', '.git', 'reports'].includes(e.name)) continue;
        glob(full);
      } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) allFiles.push(full);
    }
  };
  glob(path.join(ROOT, 'src'));

  const prodEslint = new ESLint({ cwd: ROOT });
  const ignored = [];
  const scanned = [];
  for (const f of allFiles) {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    if (await prodEslint.isPathIgnored(rel)) ignored.push(rel);
    else scanned.push(rel);
  }

  // 解析失败统计
  let parseFailures = [];
  try {
    const testResults = await eslint.lintFiles(['src/**/*.ts']);
    for (const r of testResults) {
      const fatal = r.messages.filter(m => m.fatal);
      if (fatal.length > 0) parseFailures.push({ 文件: path.relative(ROOT, r.filePath), 错误: fatal[0].message });
    }
  } catch (e) { /* 忽略 */ }

  console.log('');
  console.log(`  📁 源码文件总数     : ${allFiles.length}`);
  console.log(`  ✅ 参与扫描         : ${scanned.length}`);
  console.log(`  ⏭️  被忽略跳过       : ${ignored.length}`);
  console.log(`  ⚠️  解析失败         : ${parseFailures.length}`);
  console.log(`  ⏱️  扫描超时         : 0（无超时保护，见 P1-4）`);
  console.log('');

  if (ignored.length > 0) {
    console.log('  被忽略的文件明细:');
    ignored.forEach(f => console.log(`     - ${f}`));
    console.log('');
    const pct = ((ignored.length / allFiles.length) * 100).toFixed(0);
    console.log(`  ⚠️  跳过率: ${pct}%`);
    if (Number(pct) > 30) {
      console.log(`  🔴 结论: 跳过率过高！检出少是因为"根本没扫到"，不是规则不够`);
    } else {
      console.log(`  🟡 结论: 跳过率可接受，但需确认是否有源码被误排除`);
    }
  } else {
    console.log('  ✅ 结论: 无文件被跳过，漏检与忽略配置无关');
  }

  // ============================================================
  // 检查 3: 接口返回完整性
  // ============================================================
  title('检查 3/3: 接口返回 —— total 与实际返回是否一致？');

  const realTotal = allMsgs.length;
  const realErrors = allMsgs.filter(m => m.severity === 2).length;
  const realWarnings = allMsgs.filter(m => m.severity === 1).length;

  console.log('');
  console.log('  【本地完整扫描（等价于后端 total）】');
  console.log(`     总数   : ${realTotal}`);
  console.log(`     error  : ${realErrors}`);
  console.log(`     warning: ${realWarnings}`);
  console.log('');

  // 查询 GitHub API 实际返回
  let apiCount = '无法查询（需 gh CLI）';
  let apiPerJob = [];
  try {
    const runId = execSync(
      `gh run list --limit 1 --json databaseId --jq ".[0].databaseId"`,
      { cwd: ROOT, encoding: 'utf-8' }
    ).trim();
    const jobsRaw = execSync(
      `gh api repos/zzllcake/-/actions/runs/${runId}/jobs --jq ".jobs[] | select(.conclusion==\\"failure\\") | .check_run_url"`,
      { cwd: ROOT, encoding: 'utf-8' }
    ).trim();
    if (jobsRaw) {
      for (const url of jobsRaw.split('\n')) {
        const cid = url.split('/').pop();
        const n = execSync(`gh api repos/zzllcake/-/check-runs/${cid}/annotations --jq "length"`,
          { cwd: ROOT, encoding: 'utf-8' }).trim();
        apiPerJob.push({ checkRun: cid, 返回数: Number(n) });
      }
    }
    apiCount = apiPerJob.reduce((s, x) => s + x.返回数, 0);
  } catch (e) {
    apiCount = '查询失败: ' + e.message.split('\n')[0];
  }

  console.log('  【GitHub API 实际返回】');
  console.log(`     ${apiCount}`);
  if (Array.isArray(apiPerJob)) {
    apiPerJob.forEach(x => console.log(`       check-run ${x.checkRun.slice(-8)}: ${x.返回数} 条`));
  }
  console.log('');

  if (typeof apiCount === 'number' && realTotal > 0) {
    const ratio = ((realTotal - apiCount) / realTotal * 100).toFixed(0);
    console.log(`  🔴 结论: API 只返回了 ${((apiCount / realTotal) * 100).toFixed(0)}% 的结果`);
    console.log(`     丢失 ${realTotal - apiCount} 条（${ratio}%）`);
    console.log('');
    console.log('  原因: GitHub Check Run Annotations API 硬限制');
    console.log('        · 每个 check run 最多 50 条注解');
    console.log('        · GitHub Actions UI 每个步骤只展示前 10 条');
    console.log('');
    console.log('  这是平台限制，不是工具 bug。修复方案见 P1/P3。');
  }

  // ============================================================
  // 汇总
  // ============================================================
  title('📋 排查结论汇总');

  console.log('');
  console.log('  ┌─────────────────────────────┬────────────┬──────────────────────┐');
  console.log('  │ 检查项                       │ 结果       │ 结论                 │');
  console.log('  ├─────────────────────────────┼────────────┼──────────────────────┤');
  console.log(`  │ 1. 规则是否生效              │ ${String(detectable + '/' + (detectable + undetectable)).padEnd(10)} │ ${detectable > 0 ? '链路问题，非规则问题' : '规则配置正常'}     │`);
  console.log(`  │ 2. 跳过文件                  │ ${String(ignored.length + ' 个').padEnd(10)} │ ${ignored.length > 0 ? '存在漏扫，需修复' : '无跳过'}             │`);
  console.log(`  │ 3. API 返回完整性            │ ${typeof apiCount === 'number' ? String(apiCount + '/' + realTotal).padEnd(10) : '查询失败    '} │ ${typeof apiCount === 'number' && apiCount < realTotal ? '严重截断，需修复' : '完整'}          │`);
  console.log('  └─────────────────────────────┴────────────┴──────────────────────┘');
  console.log('');

  // 保存报告
  const report = {
    生成时间: new Date().toISOString(),
    检查1_规则验证: { 可检出: detectable, 不可检出: undetectable, 样本: samples.map(s => s.name) },
    检查2_文件跳过: { 源码总数: allFiles.length, 参与扫描: scanned.length, 被忽略: ignored, 解析失败: parseFailures },
    检查3_接口完整性: { 本地总数: realTotal, error: realErrors, warning: realWarnings, api返回: apiCount },
    结论: {
      链路问题: detectable > 0,
      跳过问题: ignored.length > 0,
      截断问题: typeof apiCount === 'number' && apiCount < realTotal,
    },
  };
  const outPath = path.join(ROOT, 'reports', 'diagnose-report.json');
  if (!fs.existsSync(path.dirname(outPath))) fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`  📄 报告已保存: ${path.relative(ROOT, outPath)}`);
  console.log('');
  process.exit(detectable > 0 && ignored.length > 0 ? 0 : 0);
}

main().catch(e => {
  console.error('排查失败:', e);
  process.exit(2);
});
