# 🤖 自动代码审查 (Auto Code Review)

> 基于 GitHub Actions 的自动代码审查流程，在 PR 提交后自动运行 lint、test、静态分析并生成审查评论。

## 工作流程

```mermaid
graph LR
    A[PR 提交/同步] --> B{Lint & Format}
    A --> C{TypeScript Check}
    A --> D{Test Matrix}
    A --> E{Security Scan}
    B --> F[Review Summary]
    C --> F
    D --> F
    E --> F
    F --> G[Checks 状态]
    F --> H[PR 评论 <br/>(仅失败时)]
```

## 检查内容

| 检查项 | 工具 | 说明 |
|--------|------|------|
| **代码风格** | ESLint + Prettier | 代码质量、最佳实践、统一格式 |
| **类型安全** | TypeScript (`tsc --noEmit`) | 静态类型检查，防止类型错误 |
| **单元测试** | Vitest + Coverage | 多 Node 版本测试 (18/20/22)，覆盖率阈值 ≥80% |
| **安全扫描** | npm audit + CodeQL | 依赖漏洞扫描 + 代码安全分析 |

## 快速开始

### 前提条件

- Node.js >= 18
- npm >= 9
- Git
- GitHub 仓库

### 方式一：一键初始化

```bash
chmod +x setup.sh && ./setup.sh
```

### 方式二：手动初始化

```bash
# 1. 安装依赖
npm install

# 2. 创建源码目录
mkdir -p src src/utils src/__tests__

# 3. 本地运行全套检查
npm run check:all
```

### 推送到 GitHub

```bash
# 在 GitHub 上创建仓库后
git add .
git commit -m "chore: initial setup with auto code review"
git remote add origin https://github.com/your-org/your-repo.git
git push -u origin main
```

### 触发器

流程在以下事件中自动触发：

| 事件 | 触发条件 |
|------|----------|
| `pull_request` | 向 `main`/`master` 提交 PR、推送新 commit、重新打开 PR |
| `push` | 直接推送到 `main`/`master` |

## PR 评论展示

当检查全部通过时，Checks 显示 ✅ 状态，PR 上无额外评论。

**当检查有失败项时**，PR 上自动生成汇总评论：

---

## 🤖 自动代码审查结果

| 检查项 | 状态 | 详情 |
|--------|------|------|
| :white_check_mark: Lint & Format | 通过 | 0 errors, 0 warnings |
| :x: TypeScript Check | **失败** | 2 errors |
| :white_check_mark: Test (Node 18) | 通过 | 42 passed |
| :x: Security Scan | **失败** | 发现安全问题 |

### ❌ 失败的检查项

- [:x: **TypeScript Check**](...) — 类型错误
- [:x: **Security Scan**](...) — 发现安全问题

请修复上述问题后重新推送代码。

---

## 本地开发命令

```bash
npm run lint          # ESLint 检查
npm run lint:fix      # 自动修复 ESLint 问题
npm run format        # Prettier 格式化
npm run format:check  # 检查格式
npm run typecheck     # TypeScript 类型检查
npm test              # 运行测试
npm run test:coverage # 测试 + 覆盖率
npm run check:all     # 完整检查 (lint + format + typecheck + test)
```

## 技术栈

- **语言**: TypeScript 5.5+
- **Lint**: ESLint 8 + TypeScript-ESLint
- **格式**: Prettier 3
- **测试**: Vitest 2 + c8/v8 coverage
- **安全**: CodeQL + npm audit
- **CI/CD**: GitHub Actions

## 自定义配置

### 修改 Node.js 版本

在 `.github/workflows/code-review.yml` 中修改 `env.NODE_VERSION` 和 `test.matrix.node-version`。

### 修改覆盖率阈值

编辑 `vitest.config.ts` 中的 `coverage.thresholds`。

### 添加额外检查

在 `code-review.yml` 中添加新的 job，然后在 `review-comment` job 的 `script` 中将其加入目标列表。

## 许可

MIT
