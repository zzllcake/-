#!/usr/bin/env node
/**
 * P2: 逐类验证样本 —— 每个类别单独扫描，验证对应规则是否生效
 *
 * 用途: 定位"哪一类错误的规则没生效"，而不是笼统地说"检出少"
 * 用法: node scripts/verify-samples.cjs
 */
const { ESLint } = require('eslint');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SAMPLES_DIR = path.join(ROOT, 'src', 'samples');

// 每类预期命中的规则（从生成脚本同步）
const EXPECTED = {
    '01-js-syntax': ['eqeqeq', 'no-var', 'no-cond-assign', 'no-constant-condition'],
    '02-undefined-vars': ['no-undef', 'no-unused-vars', 'no-shadow'],
    '03-naming': ['naming-convention'],
    '04-unsafe-api': ['no-eval', 'no-new-func', 'no-restricted-syntax'],
    '05-import-errors': ['import/no-unresolved', 'import/no-useless-path-segments'],
    '06-duplicate-import': ['import/no-duplicates'],
    '07-deprecated-api': ['no-restricted-properties', 'no-restricted-globals'],
    '08-null-safety': ['no-non-null-assertion', 'no-unnecessary-condition'],
    '09-ts-types': ['no-explicit-any', 'no-unsafe-assignment', 'no-unsafe-return'],
    '10-complexity': ['max-params', 'complexity', 'max-depth'],
    '11-async-patterns': ['no-floating-promises', 'require-await', 'no-await-in-loop'],
};

async function main() {
    console.log('');
    console.log('████████████████████████████████████████████████████████████');
    console.log('  🧪 P2 逐类验证 —— 每类样本的规则是否生效');
    console.log('████████████████████████████████████████████████████████████');

    // 关键: ignore:false 才能扫描被 ignorePatterns 排除的样本
    const eslint = new ESLint({
        cwd: ROOT,
        errorOnUnmatchedPattern: false,
        ignore: false,
    });

    const files = fs.readdirSync(SAMPLES_DIR)
        .filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts'))
        .sort();

    let allPass = true;
    const summary = [];

    for (const file of files) {
        const key = file.replace('.ts', '');
        const expected = EXPECTED[key] || [];
        const rel = `src/samples/${file}`;

        const results = await eslint.lintFiles([rel]);
        const msgs = results.flatMap(r => r.messages.filter(m => !m.fatal));

        const errors = msgs.filter(m => m.severity === 2).length;
        const warnings = msgs.filter(m => m.severity === 1).length;

        // 检查预期规则是否命中
        const hitRules = [...new Set(msgs.map(m => m.ruleId))];
        const matched = expected.filter(e => hitRules.some(h => h && h.includes(e)));
        const missed = expected.filter(e => !hitRules.some(h => h && h.includes(e)));

        const pass = msgs.length > 0 && matched.length > 0;
        if (!pass) allPass = false;

        const icon = pass ? '✅' : '❌';
        console.log('');
        console.log(`${icon} ${file}`);
        console.log(`   检出: ${msgs.length} 条 (error ${errors} / warning ${warnings})`);

        if (matched.length > 0) {
            console.log(`   ✅ 命中预期规则: ${matched.join(', ')}`);
        }
        if (missed.length > 0) {
            console.log(`   ⚠️  未命中预期: ${missed.join(', ')}`);
        }

        // 显示实际命中的规则
        const ruleCount = {};
        msgs.forEach(m => { ruleCount[m.ruleId || 'parse'] = (ruleCount[m.ruleId || 'parse'] || 0) + 1; });
        const top = Object.entries(ruleCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
        console.log(`   📋 实际命中 TOP5:`);
        top.forEach(([r, c]) => console.log(`        ${String(c).padStart(3)} × ${r}`));

        summary.push({ file, total: msgs.length, errors, warnings, matched: matched.length, missed: missed.length, pass });
    }

    // ---- 汇总 ----
    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('  📊 验证汇总');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');
    console.log('  | 类别文件 | 检出 | error | warning | 预期规则命中 |');
    console.log('  |---------|------|-------|---------|-------------|');
    for (const s of summary) {
        console.log(`  | ${s.file.padEnd(24)} | ${String(s.total).padStart(4)} | ${String(s.errors).padStart(5)} | ${String(s.warnings).padStart(7)} | ${s.pass ? '✅' : '❌'} ${s.matched} 条 |`);
    }
    console.log('');

    const totalMsgs = summary.reduce((a, s) => a + s.total, 0);
    const totalErr = summary.reduce((a, s) => a + s.errors, 0);
    const totalWarn = summary.reduce((a, s) => a + s.warnings, 0);
    const passCount = summary.filter(s => s.pass).length;

    console.log(`  总计: ${totalMsgs} 条 (${totalErr} error / ${totalWarn} warning)`);
    console.log(`  规则生效: ${passCount}/${summary.length} 个类别`);
    console.log('');

    if (allPass) {
        console.log('  ✅ 所有类别的规则均已生效，引擎配置正确');
    } else {
        console.log('  ⚠️  有类别的预期规则未命中，请检查 .eslintrc.cjs 配置');
    }
    console.log('');

    // 保存报告
    const outPath = path.join(ROOT, 'reports', 'samples-verify.json');
    if (!fs.existsSync(path.dirname(outPath))) fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify({ 生成时间: new Date().toISOString(), 汇总: summary }, null, 2), 'utf-8');
    console.log(`  📄 报告: ${path.relative(ROOT, outPath)}`);
    console.log('');
}

main().catch(e => { console.error('验证失败:', e); process.exit(2); });
