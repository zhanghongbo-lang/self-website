# 个人展示网站 · 技术设计文档（TECH_DESIGN）

> 版本：v1.0
> 日期：2026-10-18
> 关联文档：[PRD.md](./PRD.md)

---

## 1. 技术栈选择

本项目是**静态优先（static-first）的内容型网站**，因此架构上「后端」与「数据库」采用轻量方案：内容以本地文件为唯一数据源，构建时生成静态页面。下面按「前端 / 后端 / 数据库」分述。

### 1.1 前端

| 类别 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | Next.js（App Router，最新稳定版） | 支持 SSG/ISR、Server Components、SEO，是内容站首选 |
| 语言 | TypeScript | 全量类型安全 |
| UI | React + Tailwind CSS | 原子化样式，配合设计令牌落地深色主题 |
| 组件 | shadcn/ui（按需引入） | 基于 Radix，可访问性好，样式可控 |
| 内容渲染 | MDX / Markdown + `rehype-pretty-code` 或 `shiki` | 代码高亮、支持表格/图片/引用 |
| 动效 | CSS Transition + 轻量 Framer Motion（可选） | 入场/悬浮动效，星空用 Canvas 自绘 |

### 1.2 后端

**默认无独立后端服务**。Next.js 本身是全栈框架，承担「后端」职责：

- 通过 **Server Components** 在构建时读取本地内容，无需运行时 API。
- 需要动态能力的场景（如未来接入评论、生成 RSS、提交表单），使用：
  - **Route Handlers**（`app/api/*/route.ts`）或 **Server Actions**。
- 评论/统计等重交互功能，优先接入第三方服务（如 Giscus 评论、Vercel Analytics），避免自建后端。

### 1.3 数据库

**默认无数据库**：

- 内容数据（简介、技能、项目、博客）全部存放在本地 Markdown/JSON 文件，**Git 仓库即唯一数据源与版本历史**。
- 若未来需要持久化数据（评论、点赞、访客统计），可选方案：

| 方案 | 技术 | 适用场景 |
| --- | --- | --- |
| BaaS | Supabase（PostgreSQL） | 需要关系数据 + 鉴权 |
| 轻量评论 | Giscus / Utterances | 基于 GitHub Discussions，零自建成本（推荐） |
| 自托管 | SQLite + Drizzle/Prisma | 单机、数据量小 |

### 1.4 工具链与部署

| 类别 | 选型 |
| --- | --- |
| 包管理 | pnpm |
| 代码规范 | ESLint + Prettier |
| 部署 | Vercel（推荐），或 `next build` 静态导出到任意静态托管 |

---

## 2. 项目结构

采用 Next.js App Router 约定式结构，内容与代码分离。

```text
self-website/
├── app/                          # 路由层（App Router）
│   ├── layout.tsx                # 全局布局：导航 + 星空背景 + 页脚
│   ├── page.tsx                  # 首页 / 个人介绍
│   ├── globals.css               # Tailwind 入口 + 设计令牌（CSS 变量）
│   ├── skills/page.tsx           # 技能展示
│   ├── projects/page.tsx         # 项目列表
│   ├── projects/[slug]/page.tsx  # 项目详情
│   ├── blog/page.tsx             # 博客列表（分页/筛选）
│   ├── blog/[slug]/page.tsx      # 文章详情
│   ├── not-found.tsx             # 404
│   ├── sitemap.ts                # 站点地图
│   ├── robots.ts                 # robots.txt
│   └── api/                      # 可选：Route Handlers（RSS 等）
├── components/
│   ├── ui/                       # 基础组件：Button / Card / Tag / Badge
│   ├── layout/                   # Navbar / Footer / MobileMenu / BackToTop
│   ├── starfield/                # 星空背景（Canvas 粒子，客户端组件）
│   ├── home/                     # 首页区块组件
│   ├── skills/                   # 技能区块组件
│   ├── projects/                 # 项目卡片 / 筛选
│   └── blog/                     # 文章卡片 / 目录(TOC)
├── content/                      # 内容数据源（Git 管理，改内容不改代码）
│   ├── about.md                  # 个人简介、定位、亮点数据
│   ├── skills.json               # 技能分组与熟练度
│   ├── projects/*.md             # 项目（frontmatter + 正文）
│   └── blog/*.md                 # 博客文章（frontmatter + 正文）
├── lib/                          # 纯函数工具
│   ├── content.ts                # 读取并解析内容文件
│   ├── markdown.ts               # MD/MDX 渲染管线 + 高亮
│   ├── seo.ts                    # 元数据 / OG / JSON-LD
│   └── site.ts                   # 站点配置（姓名、社交链接）
├── types/                        # 共享 TypeScript 类型
│   └── index.ts
├── public/                       # 静态资源：头像、封面图、favicon
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

**组织原则**：

- 页面（`app/`）只负责组装与数据获取，业务 UI 下沉到 `components/`。
- 所有内容读写集中在 `lib/content.ts`，页面不直接操作文件系统。
- `types/` 统一数据模型，与 frontmatter 校验共用（见 §3）。

---

## 3. 数据模型

数据分为两类：**站点配置**（少量、常驻）与**内容条目**（技能/项目/博客）。内容文件用 **frontmatter（YAML 头）** 存元数据，正文存正文；用 `gray-matter` 解析、`zod` 做运行时校验，保证类型安全。

### 3.1 站点配置（`lib/site.ts` / `config`）

```ts
interface SiteConfig {
  name: string;               // 姓名 / 站点名
  title: string;              // 一句话定位
  description: string;        // 站点描述（SEO 用）
  url: string;                // 站点地址
  avatar: string;             // 头像路径
  social: {                   // 社交 / 联系方式
    github?: string;
    email?: string;
    wechat?: string;
    blog?: string;
  };
}
```

### 3.2 个人介绍（`content/about.md`）

```ts
interface About {
  headline: string;           // 一句话定位
  bio: string;                // 100–200 字简介
  highlights: {               // 亮点数据
    label: string;            // 如「工作经验」
    value: string;            // 如「5 年」
  }[];
  timeline?: {                // 可选：时间线
    period: string;
    title: string;
    description: string;
  }[];
}
```

### 3.3 技能（`content/skills.json`）

```ts
interface Skill {
  name: string;               // 技能名，如 "React"
  level: number;              // 熟练度 0–100
  note?: string;              // 简述
}

interface SkillGroup {
  group: string;              // 分组：前端 / 后端 / 工具
  items: Skill[];
}
```

### 3.4 项目（`content/projects/*.md`）

```yaml
---
slug: "my-project"          # 可选，默认取文件名
title: "项目名称"
description: "一句话描述"
cover: "/images/projects/xxx.png"
tech: ["Next.js", "TypeScript"]
tags: ["前端", "开源"]
demo: "https://..."
source: "https://github.com/..."
featured: true             # 是否在首页/列表置顶
date: "2026-01-01"
---
# 正文：背景、挑战、技术选型、成果
```

```ts
interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  tech: string[];
  tags?: string[];
  demo?: string;
  source?: string;
  featured?: boolean;
  date: string;
}

interface Project extends ProjectMeta {
  content: string;            // 渲染后的正文
}
```

### 3.5 博客文章（`content/blog/*.md`）

```yaml
---
slug: "hello-world"          # 可选，默认取文件名
title: "文章标题"
date: "2026-01-01"
summary: "摘要（列表页展示）"
tags: ["Next.js", "前端"]
category: "技术"
cover?: "/images/blog/xxx.png"
draft: false                # true 时不参与构建
---
# 正文（Markdown）
```

```ts
interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category?: string;
  cover?: string;
  draft?: boolean;
}

interface Post extends PostMeta {
  content: string;
  readingMinutes: number;     // 阅读时长，按字数估算
}
```

### 3.6 校验策略

- 每个内容文件的 frontmatter 用 `zod` schema 校验，解析失败时在构建阶段直接报错，避免脏数据上线。
- `lib/content.ts` 提供统一读取函数：`getAllProjects()`、`getProject(slug)`、`getAllPosts()`、`getPost(slug)`，内部处理排序、过滤 `draft`、按 `date` 倒序。

---

## 4. 关键技术点

### 4.1 星空背景的性能与 SSR 安全

- **实现**：`components/starfield/` 使用 `<canvas>` + `requestAnimationFrame` 绘制星点（缓慢漂移/闪烁）。组件声明为客户端组件（`'use client'`），避免服务端渲染时访问 `window`/`canvas`。
- **性能控制**：
  - 星点数量按视口面积与设备降级（移动端减少粒子数）。
  - 使用 `document.hidden` 时暂停动画；页面不可见时释放 `requestAnimationFrame`。
  - 动画放在独立层（`will-change` / 独立 canvas），不阻塞首屏渲染。
- **可访问性**：监听 `prefers-reduced-motion`，开启「减少动态」时停用或大幅降低动画。
- **层级**：星空 canvas 置于内容底层（`z-index` 最低），不拦截点击与滚动。

### 4.2 Markdown/MDX 渲染与代码高亮

- 使用 `gray-matter` 解析 frontmatter，`remark`/`rehype` 管线处理正文，`rehype-pretty-code`（或 `shiki`）做代码高亮，主题与深色风格一致。
- 渲染放在**服务端/构建时**完成，避免客户端引入大型解析库，减小首屏 JS。
- 支持文章目录（TOC）：解析标题层级，详情页侧边生成锚点导航。
- 对用户内容做必要的 HTML 白名单处理（如用 `rehype-sanitize`），防止 XSS。

### 4.3 内容读取与类型安全

- 文件系统读取集中在 `lib/content.ts`，配合 `generateStaticParams` 预生成所有详情页路径。
- 所有 frontmatter 经 `zod` 校验，保证运行时数据结构与 `types/` 一致，避免「数据与类型脱节」。

### 4.4 SSG/ISR 与 SEO

- 首页、技能、项目、博客列表用 **SSG**（构建时生成），详情页用 **SSG + `generateStaticParams`**；若需要文章发布后无需重新构建，可将详情页升级为 **ISR**（设置 `revalidate`）。
- 每个页面用 `generateMetadata` 输出独立 `title`/`description`/Open Graph；博客详情生成 JSON-LD 结构化数据。
- 生成 `sitemap.ts` 与 `robots.ts`；OG 分享图使用固定封面或动态生成。

### 4.5 图片优化

- 封面、头像统一走 `next/image`，自动响应式尺寸与懒加载，控制 LCP。
- 项目封面缺失时提供优雅占位图，避免布局抖动（固定卡片宽高比，保证 CLS 达标）。

### 4.6 深色主题与设计令牌

- 颜色、间距、字号等设计令牌落地为 **CSS 变量 + Tailwind 主题扩展**（`globals.css` 定义、`tailwind.config.ts` 引用），保证全站深色配色一致。
- 默认深色，预留主题切换能力的扩展点（PRD 中的「主题切换」）。

### 4.7 响应式与多端适配

- 移动优先，断点建议：手机 `<640px`、平板 `640–1024px`、桌面 `>1024px`。
- 导航在移动端折叠为汉堡菜单；触控目标 ≥44×44px；卡片网格随断点从单列切到多列。
- 星空粒子数量随视口/设备动态调整，低端机不掉帧。

### 4.8 可选动态能力（预留）

- 评论：接入 **Giscus**（GitHub Discussions），无自建后端。
- 访客统计：Vercel Analytics 或第三方埋点。
- RSS：用 Route Handler 从 `content/blog` 生成。
- 多语言：后续用 Next.js 路由分组（`[locale]`）+ 内容文件多语言副本。

---

## 附：技术风险与注意

1. **星空动画性能**：粒子数量与帧率需在真机（尤其是低端安卓）验证，必要时降到纯 CSS 星点。
2. **代码高亮体积**：服务端渲染可避免首屏加载高亮库，但需确保深色主题与整体配色统一。
3. **内容一致性**：frontmatter 必须经 `zod` 严格校验，构建时快速失败，防止脏数据上线。
4. **SEO 与 ISR 取舍**：SSG 最省资源但更新需重新构建；ISR 更灵活但有缓存延迟，需按发布频率选择。
