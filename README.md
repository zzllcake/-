# 🤖 自动代码审查 (Auto Code Review)

> 基于 GitHub Actions 的自动代码审查系统。提交 PR 后自动运行 **代码规范检查、TypeScript 类型检查、单元测试、安全扫描**，并通过 Checks 状态 + PR 评论反馈结果。

---

## 📋 目录

- [工作流程概览](#-工作流程概览)
- [开发者操作流程](#-开发者操作流程)
- [每个检查项说明](#-每个检查项说明)
- [审查结果怎么看](#-审查结果怎么看)
- [PR 评论展示](#-pr-评论展示)
- [本地开发命令](#-本地开发命令)
- [技术栈](#-技术栈)
- [自定义配置](#-自定义配置)
- [常见问题](#-常见问题)

---

## 🔄 工作流程概览

```
你本地开发                          GitHub 自动执行
─────────────                      ─────────────────

写代码 ──→ git push ──→ 创建 PR ──→ GitHub Actions 启动
                                        │
                          ┌──────────────┼──────────────┐
                          ▼              ▼              ▼
                    ┌──────────┐  ┌──────────┐  ┌──────────┐
                    │ 🔍 Lint  │  │ 🔷 Type  │  │ 🧪 Test  │
                    │ & Format │  │   Check  │  │  × 3 版本 │
                    └────┬─────┘  └────┬─────┘  └────┬─────┘
                          │            │            │
                    ┌─────▼────────────▼────────────▼─────┐
                    │       🛡️ Security Scan              │
                    │   (npm audit + CodeQL)              │
                    └──────────────────┬──────────────────┘
                                       │
                          ┌────────────▼────────────┐
                          │    汇总所有检查结果       │
                          └────────────┬────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
           全部通过 ✅                            有失败项 ❌
                    │                                     │
        PR 显示绿色通过状态              PR 上自动发布评论
        (无额外评论)                     指出哪里失败 + 链接
                                               │
                                     你修复代码 → 重新推送
                                               │
                                    工作流自动重新运行 ↻
```

---

## 🚀 开发者操作流程

### 第 1 步：创建功能分支

```bash
git checkout -b feat/你的功能名称
```

### 第 2 步：编写代码

在 `src/` 目录下写你的代码。

### 第 3 步：本地验证（建议）

```bash
npm run check:all
```

这条命令会依次跑完所有检查，确保代码在提交前没问题。

### 第 4 步：提交并推送

```bash
git add .
git commit -m "feat: 描述你的改动"
git push -u origin feat/你的功能名称
```

### 第 5 步：创建 Pull Request

推送后，去 GitHub 仓库页面：

1. 会弹出黄色提示条 → 点击 **Compare & pull request**
2. 填写 PR 标题和描述
3. 点击 **Create pull request**

### 第 6 步：等待自动审查

PR 创建后 **不需要你做任何操作**，GitHub Actions 会自动运行所有检查。

### 第 7 步：查看结果

去 PR 页面查看结果：

- **全部通过 ✅** → PR 显示绿色，可直接合并
- **有失败项 ❌** → 看 PR 评论区或 Checks 标签页，修复后重新推送

### 第 8 步：修复后重新推送

如果有失败项，修改代码后：

```bash
git add .
git commit -m "fix: 修复审查发现的问题"
git push
```

推送后工作流**自动重新运行**，之前失败的评论也会自动更新。

---

## 🔍 每个检查项说明

| 检查项 | 运行什么 | 检查什么 | 为什么重要 |
|--------|----------|----------|-----------|
| **Lint & Format** | ESLint + Prettier | 代码规范、未使用变量、错误语法、格式一致性 | 保证代码风格统一，减少低级 bug |
| **TypeScript Check** | `tsc --noEmit` | 类型错误、null 安全、类型推断 | 在运行前就发现类型相关的 bug |
| **Test (Node 18/20/22)** | Vitest + 覆盖率 | 功能正确性、代码覆盖率 ≥ 80% | 确保改动不破坏现有功能 |
| **Security Scan** | npm audit + CodeQL | 依赖漏洞、代码安全风险 | 防止将安全漏洞引入生产环境 |

> **Test 在 3 个 Node.js 版本上并行运行**（18、20、22），确保兼容性。

### 各个检查触发的工作

```
Lint & Format            TypeScript Check           Test (Node 18/20/22)
────────────             ────────────────           ────────────────────
├─ Checkout code         ├─ Checkout code           ├─ Checkout code
├─ Install deps          ├─ Install deps            ├─ Install deps
├─ Run ESLint            ├─ Run tsc --noEmit        ├─ Run tests + coverage
├─ Run Prettier check    └─ Done ✅                 ├─ Publish results
└─ Done ✅                                          └─ Upload coverage report

Security Scan            Review Summary
─────────────            ──────────────
├─ Checkout code         ├─ Wait for all jobs
├─ Install deps          ├─ Collect statuses
├─ npm audit             ├─ Build summary table
├─ CodeQL Init           ├─ Post comment (if failed)
├─ CodeQL Analyze        └─ Done ✅
└─ Done ✅
```

---

## 👀 审查结果怎么看

### 方式 1：PR 页面底部（最直观）

PR 页面最下方会显示 **Checks** 区域：

```
All checks have passed ✓    ← 全部通过
  ✅ Lint & Format — pass
  ✅ TypeScript Check — pass
  ✅ Test (Node 18) — pass
  ✅ Test (Node 20) — pass
  ✅ Test (Node 22) — pass
  ✅ Security Scan — pass
  ✅ Review Summary — pass
```

如果有失败的，会显示红字：

```
Some checks were not successful ✗
  ❌ TypeScript Check — fail     ← 点链接看详情
  ❌ Test (Node 20) — fail
```

### 方式 2：PR 评论区（有失败时自动发布）

当有检查项失败时，一个 GitHub Bot 会自动在 PR 评论区发布汇总评论：

```
## 🤖 自动代码审查结果

| 检查项 | 状态 | 详情 |
|--------|------|------|
| ✅ Lint & Format | 通过 | 0 errors |
| ❌ TypeScript Check | **失败** | 2 errors |
| ✅ Test (Node 18) | 通过 | 8 passed |
| ❌ Test (Node 20) | **失败** | 1 failed |

### ❌ 失败的检查项
- [:x: TypeScript Check](链接) — 类型错误
- [:x: Test (Node 20)](链接) — 有测试失败

请修复上述问题后重新推送代码。
```

点击每个失败的检查项链接，可以直接跳转到 GitHub Actions 的日志页面，查看具体的错误信息。

### 方式 3：Actions 标签页（最详细）

在仓库顶部的 **Actions** 标签页可以查看每次运行的完整日志。

---

## 💬 PR 评论展示

### 全部通过时

- Checks 显示 7 个 ✅
- PR 上**没有额外评论**（整洁干净）

### 有失败项时

- Checks 显示对应的 ❌
- PR 评论区**自动发布汇总评论**，包含：

  | 内容 | 说明 |
  |------|------|
  | ✅/❌ 状态表格 | 一目了然看哪些通过、哪些失败 |
  | ❌ 失败项列表 | 带链接，点击直接跳转到错误日志 |
  | 提交 SHA | 显示当前检查的 commit |
  | 工作流运行链接 | 查看完整运行详情 |

### 评论自动更新

- 第一次推送 → 如果有失败 → 创建评论
- 修复后再次推送 → 结果变化 → **自动更新已有评论**（不会重复创建）
- 全部修复通过 → 评论更新为全部 ✅

---

## 💻 本地开发命令

```bash
# 代码规范
npm run lint              # ESLint 检查
npm run lint:fix          # 自动修复 ESLint 问题

# 代码格式
npm run format            # Prettier 格式化代码
npm run format:check      # 检查格式（不改文件）

# 类型检查
npm run typecheck         # TypeScript 类型检查

# 测试
npm test                  # 运行测试
npm run test:watch        # 监听模式运行测试
npm run test:coverage     # 测试 + 覆盖率报告

# 一键全套（推荐提交前运行）
npm run check:all         # lint + format + typecheck + test
```

> **建议**：每次提交前运行 `npm run check:all`，确保代码在本地就已经通过了所有检查。

---

## 🛠 技术栈

| 类别 | 工具 | 版本 |
|------|------|------|
| 语言 | TypeScript | 5.5+ |
| 代码规范 | ESLint + typescript-eslint | 8.x |
| 代码格式 | Prettier | 3.x |
| 测试框架 | Vitest | 2.x |
| 覆盖率 | c8 (v8) | — |
| 安全扫描 | CodeQL + npm audit | — |
| CI/CD | GitHub Actions | — |

---

## ⚙️ 自定义配置

### 修改 Node.js 版本

编辑 `.github/workflows/code-review.yml`：

```yaml
env:
  NODE_VERSION: "22"              # 默认版本

jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]  # 测试矩阵
```

### 修改覆盖率阈值

编辑 `vitest.config.ts`：

```typescript
thresholds: {
  statements: 80,    // 语句覆盖率
  branches: 75,      // 分支覆盖率
  functions: 80,     // 函数覆盖率
  lines: 80,         // 行覆盖率
}
```

### 添加新的检查

1. 在 `.github/workflows/code-review.yml` 中添加新的 job
2. 在 `review-comment` job 的 `needs` 列表中加入新 job 名称
3. 在 `review-comment` 的 `script` 中的 `targetJobs` 列表加入匹配规则

---

## ❓ 常见问题

### Q: 工作流没有触发？

确保：
1. PR 的目标分支是 `main` 或 `master`
2. 仓库的 Actions 功能已启用（Settings → Actions → Allow all actions）
3. 推送的分支已经创建了 PR

### Q: npm ci 安装失败？

检查 `package-lock.json` 是否与 `package.json` 同步。重新生成：

```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "chore: update lock file"
git push
```

### Q: 覆盖率不达标？

1. 为新增代码编写测试
2. 或在 `vitest.config.ts` 中调整 `coverage.thresholds`

### Q: 如何跳过某个检查？

**不建议跳过**，但可以临时在 workflow 文件的对应步骤添加 `if: false`：

```yaml
- name: Run tests with coverage
  if: false   # 临时跳过
  run: npm run test:ci
```

### Q: 审查评论不显示？

只有**有失败项时**才会发布评论。全部通过时 PR 保持整洁，没有额外评论。

---

## 📄 许可

MIT
