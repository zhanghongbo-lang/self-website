# AGENTS.md

## 项目概述
<!-- 一两句话说清楚项目是什么、用什么技术栈，帮助 AI 建立整体认知 -->
这是一个个人展示网站（个人介绍 / 技能 / 项目 / 博客）。
技术栈：Next.js（App Router）+ React + TypeScript + Tailwind CSS，详见 TECH_DESIGN.md。

## 环境与运行
<!-- 提供精确的命令，让 AI 能自己把项目跑起来 -->
- **安装依赖**：`npm install`
- **启动开发**：`npm run dev`
- **运行测试**：`npm test`
- **代码检查**：`npm run lint`

## 编码约定 (Do & Don't)
<!-- 这是核心部分，列出你最在意、AI 最容易违反的几条规则 -->
**必须遵守：**
- 使用 TypeScript 严格模式，**禁止使用 `any`**。
- 优先使用函数组件和 Hooks。
- 样式使用 Tailwind CSS（配合设计令牌 CSS 变量），**禁止内联样式**。

**绝对禁止：**
- **未经确认，不要自行安装或删除任何依赖**。
- 不要提交 `console.log` 或调试代码。
- 不要修改 `package.json` 中的脚本，除非我明确要求。

## 关键架构/目录说明
<!-- 简单说明核心目录的职责，防止 AI 把文件放错地方 -->
- `components/`：存放可复用的 UI 组件。
- `lib/`：存放工具函数（内容读取、Markdown 渲染、SEO 等）。
- `content/`：存放内容数据源（Markdown/JSON，改内容不改代码）。
- `types/`：存放共享 TypeScript 类型。

## 安全与提交
- **永远不要**提交 `.env` 文件或任何密钥。
- 提交前确保 `npm run lint` 和 `npm test` 通过。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
