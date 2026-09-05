# Mindows 下载站开发文档

> 面向开发者 / 内容管理者的完整上手指南。本文档覆盖：环境搭建、架构说明、数据层、页面路由、样式体系、构建部署与常见操作。

## 目录

1. [快速开始](#1-快速开始)
2. [技术栈与版本](#2-技术栈与版本)
3. [项目架构](#3-项目架构)
4. [数据层详解](#4-数据层详解)
5. [页面与路由](#5-页面与路由)
6. [组件体系](#6-组件体系)
7. [样式与主题](#7-样式与主题)
8. [SEO 与元数据](#8-seo-与元数据)
9. [构建与部署](#9-构建与部署)
10. [常见任务速查](#10-常见任务速查)
11. [常见问题排查](#11-常见问题排查)

---

## 1. 快速开始

### 环境要求

| 工具 | 版本 |
| --- | --- |
| Node.js | 20+ |
| npm | 9+ |

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/xgp2012/xgp2012.github.io.git
cd xgp2012.github.io

# 2. 安装依赖
npm install

# 3. 启动开发服务器（默认 http://localhost:3000）
npm run dev

# 4. 构建生产版本（输出到 ./out 目录，纯静态）
npm run build

# 5. 代码检查
npm run lint
```

> ⚠️ 注意：本项目使用 `output: "export"` 静态导出，所有数据在**构建时**读取。修改 `content/` 下的数据后需重新构建（`npm run build`）才能看到效果；`npm run dev` 下修改会实时生效。

---

## 2. 技术栈与版本

| 类别 | 技术 | 说明 |
| --- | --- | --- |
| 框架 | Next.js 16（App Router） | 服务端组件 + 静态导出 |
| 语言 | TypeScript 5 | 严格模式 |
| UI 组件 | HeroUI v3（@heroui/react） | 基于 React Aria + Tailwind v4 |
| 样式 | Tailwind CSS v4 | 原子化样式 + CSS 变量主题 |
| 数据校验 | Zod v4 | 构建时校验内容数据 |
| Markdown | gray-matter + remark | 公告解析 |
| 排版 | @tailwindcss/typography | 公告正文 prose 样式 |
| 部署 | GitHub Actions + GitHub Pages | push 到 main 自动部署 |

路径别名：`@/*` → `src/*`（见 `tsconfig.json`）。

---

## 3. 项目架构

```
.
├── content/                  # ★ 内容数据（唯一需要日常维护的目录）
│   ├── systems/              #   系统镜像（每个系统一个 JSON）
│   ├── sponsors/             #   赞助商（每个赞助商一个 JSON）
│   └── announcements/        #   公告（每个公告一个 Markdown）
├── public/                   # 静态资源（原样拷贝到 out/）
│   ├── sponsors/             #   赞助商 Logo（.svg / .png）
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── sitemap.xml           # 注意：手写维护，需与 content 同步
├── src/
│   ├── app/                  # 页面路由（App Router）
│   │   ├── layout.tsx        #   根布局（Header / Footer / 元数据）
│   │   ├── page.tsx          #   首页
│   │   ├── about/            #   关于页
│   │   ├── announcements/    #   公告列表页
│   │   ├── announcement/[slug]/  # 公告详情页（静态生成）
│   │   ├── category/[category]/  # 分类页（静态生成）
│   │   ├── system/[slug]/    #   系统详情页（静态生成）
│   │   ├── not-found.tsx     #   404 页
│   │   └── globals.css       #   全局样式入口
│   ├── components/           # 复用组件
│   │   ├── Header.tsx        #   顶部导航
│   │   ├── Footer.tsx        #   页脚
│   │   ├── SystemCard.tsx    #   系统卡片（HeroUI Card + Chip）
│   │   ├── CategoryTabs.tsx  #   分类 Tab + 搜索（客户端组件）
│   │   └── SponsorCard.tsx   #   赞助商卡片
│   ├── config/               # 站点级配置
│   │   ├── site.ts           #   站点名称、导航、社交、群组
│   │   └── categories.ts     #   分类定义
│   ├── lib/                  # 数据访问层（构建时读取 content/）
│   │   ├── systems.ts        #   系统数据加载 + 查询
│   │   ├── sponsors.ts       #   赞助商数据加载
│   │   ├── announcements.ts  #   公告数据加载 + Markdown 解析
│   │   └── stats.ts          #   分类统计
│   └── types/                # 类型定义与校验 schema
│       ├── index.ts          #   TS 接口（SystemItem / Sponsor / ...）
│       └── schema.ts         #   Zod 校验 schema
├── .github/workflows/
│   └── deploy.yml            # CI/CD：构建 + 部署 GitHub Pages
├── next.config.ts            # output: "export" 配置
└── package.json
```

**核心设计原则：**
- **内容与代码分离**：所有可编辑内容在 `content/`，添加/修改内容无需改代码
- **数据驱动**：页面通过 `lib/` 层读取数据，构建时自动生成静态页
- **强校验**：Zod 在构建时校验所有 JSON，错误立即阻断构建并指出文件与字段

---

## 4. 数据层详解

### 4.1 系统（content/systems/*.json）

**添加系统：** 在 `content/systems/` 新建 `{slug}.json`，文件名即访问路径中的 slug。

**字段说明（由 `src/types/schema.ts` 校验）：**

| 字段 | 类型 | 必填 | 约束 |
| --- | --- | --- | --- |
| `slug` | string | ✅ | 仅小写字母、数字、短横线；**必须与文件名一致** |
| `name` | string | ✅ | 显示名称 |
| `category` | "windows"\|"linux"\|"pe"\|"other" | ✅ | 分类 |
| `version` | string | ✅ | 版本号 |
| `arch` | ("x86"\|"x64"\|"arm64")[] | ✅ | 至少 1 个 |
| `size` | string | ✅ | 文件大小（如 `6.2 GB`） |
| `languages` | string[] | ✅ | 语言 |
| `updatedAt` | string | ✅ | `YYYY-MM-DD` 格式 |
| `description` | string | ✅ | 简介 |
| `features` | string[] | ✅ | 特性列表 |
| `requirements` | object | ✅ | `{ cpu, ram, disk }` 三项必填 |
| `mirrors` | {label,url}[] | ✅ | 至少 1 个下载镜像 |
| `tags` | string[] | ❌ | 标签 |
| `cover` | string | ❌ | 封面图路径 |
| `featured` | boolean | ❌ | 是否首页「推荐系统」展示 |

**示例：**

```json
{
  "slug": "ubuntu-24-04-lts",
  "name": "Ubuntu 24.04 LTS Server",
  "category": "linux",
  "version": "24.04 LTS",
  "arch": ["x64", "arm64"],
  "size": "5.7 GB",
  "languages": ["简体中文", "多语言"],
  "updatedAt": "2025-06-15",
  "description": "Ubuntu 24.04 LTS 长期支持版命令行镜像。",
  "features": ["官方原版 ISO", "长期支持至 2029 年 4 月"],
  "requirements": { "cpu": "2 GHz 双核", "ram": "4 GB", "disk": "25 GB" },
  "mirrors": [
    { "label": "Ubuntu 官方", "url": "https://releases.ubuntu.com/24.04/" }
  ],
  "tags": ["LTS", "服务器"],
  "featured": true
}
```

**⭐ slug 注意事项：** slug 是 URL 的一部分（`/system/{slug}`）。路由由文件列表生成，详情查询按 slug 匹配，**两者必须一致**，否则详情页会 404。改名时请同步重命名文件。

### 4.2 赞助商（content/sponsors/*.json）

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `slug` | ✅ | 唯一标识，与文件名一致 |
| `title` | ✅ | 赞助商名称 |
| `description` | ❌ | 一句话简介 |
| `image` | ✅ | Logo 路径，`/sponsors/xxx.svg`（放 `public/sponsors/`） |
| `href` | ✅ | 跳转链接 |
| `cta` | ❌ | 按钮文案，默认「查看详情」 |
| `priority` | ❌ | 排序权重，数字越小越靠前 |

> ⚠️ 图片文件需放到 `public/sponsors/`，而非 `content/sponsors/`。

### 4.3 公告（content/announcements/*.md）

公告使用 Markdown + YAML frontmatter：

```markdown
---
title: 公告标题
date: 2025-09-10
pinned: true
tags: ["公告", "示例"]
summary: 列表页摘要
---

## 正文标题

支持 Markdown 语法：**粗体**、`代码`、表格、引用、链接、代码块等。
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | ✅ | 公告标题 |
| `date` | ✅ | `YYYY-MM-DD` |
| `pinned` | ❌ | 是否置顶 |
| `tags` | ❌ | 标签数组 |
| `summary` | ❌ | 列表页摘要 |

正文用 `remark` 渲染为 HTML，并通过 `@tailwindcss/typography` 的 prose 样式美化。

### 4.4 站点配置（src/config/site.ts）

站点名称、描述、导航、社交链接、QQ 群等集中在 `siteConfig`，改动后需重新构建。

---

## 5. 页面与路由

| 路由 | 文件 | 类型 | 说明 |
| --- | --- | --- | --- |
| `/` | `src/app/page.tsx` | SSG | 首页：英雄区 + 推荐系统 + 分类 Tab |
| `/category/{windows\|linux\|pe\|other}` | `src/app/category/[category]/page.tsx` | SSG | 分类页 |
| `/system/{slug}` | `src/app/system/[slug]/page.tsx` | SSG | 系统详情页（含 JSON-LD） |
| `/announcements` | `src/app/announcements/page.tsx` | SSG | 公告列表 |
| `/announcement/{slug}` | `src/app/announcement/[slug]/page.tsx` | SSG | 公告详情 |
| `/about` | `src/app/about/page.tsx` | SSG | 关于页 |
| 404 | `src/app/not-found.tsx` | SSG | 404 页 |

所有页面均使用 `generateStaticParams` / 构建时数据读取，产出纯静态 HTML。

---

## 6. 组件体系

| 组件 | 客户端/服务端 | 说明 |
| --- | --- | --- |
| `Header` | 服务端 | 顶部导航（来自 `siteConfig.nav`） |
| `Footer` | 服务端 | 页脚 + 赞助商区块 |
| `SystemCard` | 服务端 | 系统卡片，HeroUI `Card` + `Chip` |
| `CategoryTabs` | 客户端（`"use client"`） | 分类 Tabs + 搜索过滤，HeroUI `Tabs` / `SearchField` |
| `SponsorCard` | 服务端 | 赞助商卡片，HeroUI `Card` |

> 说明：HeroUI 组件均为客户端组件。在服务端组件中引用它们没问题（Next.js 会在边界自动处理），但**需要交互状态的逻辑必须放入 `"use client"` 组件**（如 `CategoryTabs`）。

---

## 7. 样式与主题

### 7.1 全局样式入口（src/app/globals.css）

```css
@import "tailwindcss";
@import "@heroui/styles";          /* HeroUI 样式，必须在 tailwindcss 之后 */
@plugin "@tailwindcss/typography"; /* prose 排版 */
```

### 7.2 主题色

在 `globals.css` 的 `@theme inline` 中定义 CSS 变量：

```css
@theme inline {
  --color-primary: #ff8c00;
  --color-primary-hover: #e67e00;
  --color-background: #0d0d0d;
  ...
}
```

页面中可直接使用 `bg-primary`、`text-primary`、`bg-surface` 等工具类。

### 7.3 暗色主题

站点固定为暗色（深黑渐变背景 + 橙色点缀），未做亮色切换。修改配色请调整 `globals.css` 与组件中的 `bg-[#...]` 类。

---

## 8. SEO 与元数据

- **根布局** `layout.tsx`：全局 `metadata`（title 模板、description、keywords、OG、Twitter、robots）
- **各页面**：导出 `generateMetadata` 生成页面级元数据（含 canonical）
- **首页**：`page.tsx` 中含必应验证标签 `msvalidate.01`
- **结构化数据**：系统详情页注入 JSON-LD（`SoftwareApplication`），分类页注入 `CollectionPage`
- **sitemap**：`public/sitemap.xml` 为**手写文件**，新增系统/公告时需同步添加 `<url>` 条目
- **robots**：`public/robots.txt`

---

## 9. 构建与部署

### 9.1 本地构建

```bash
npm run build   # 产物在 ./out
```

构建会：读取 `content/` → Zod 校验 → 生成全部静态页面 → 拷贝 `public/` → 输出 `out/`。

### 9.2 CI/CD（GitHub Actions）

`.github/workflows/deploy.yml`：

1. push 到 `main` 触发
2. `npm ci` 安装依赖
3. `npm run build` 构建
4. `actions/upload-pages-artifact` 上传 `out/`
5. `actions/deploy-pages` 部署到 GitHub Pages

> 前提：仓库 **Settings → Pages → Source** 必须选 **GitHub Actions**。

### 9.3 自定义域名

仓库根目录的 `CNAME` 文件指向 `www.947563.xyz`，请勿删除或修改。

---

## 10. 常见任务速查

| 任务 | 操作 |
| --- | --- |
| 添加系统 | 在 `content/systems/` 新建 `{slug}.json`（字段见 4.1） |
| 修改系统 | 编辑对应 JSON |
| 删除系统 | 删除对应 JSON 文件 |
| 添加赞助商 | `content/sponsors/` 新建 JSON + 把 Logo 放 `public/sponsors/` |
| 发布公告 | `content/announcements/` 新建 `.md` |
| 改导航/群组 | 编辑 `src/config/site.ts` |
| 改首页推荐 | 给系统 JSON 设 `"featured": true` |
| 加分类 | `src/config/categories.ts` + `src/types/index.ts` 的 `CategoryId` |
| 同步 sitemap | 新增页面/系统后更新 `public/sitemap.xml` |

### 推送上线流程

```bash
git add .
git commit -m "feat: 描述改动"
git push origin main   # push 后自动构建部署
```

---

## 11. 常见问题排查

### 构建报「系统数据校验失败」

构建日志会指出**文件名**和**具体字段**问题，常见原因：

- `slug` 含中文/大写/下划线 → 只允许 `[a-z0-9-]`
- `slug` 与文件名不一致 → 保持二者一致
- 日期不是 `YYYY-MM-DD`
- `mirrors` / `arch` / `features` 为空数组
- JSON 语法错误（缺逗号/括号）→ 用编辑器 JSON 校验

### 详情页 404

多为 `slug` 与文件名不一致导致。确认 `content/systems/{文件名}.json` 内的 `"slug"` 字段与文件名完全相同。

### 赞助商图片不显示

确认图片在 `public/sponsors/`（不是 `content/sponsors/`），且 JSON 中 `image` 为 `/sponsors/文件名`。

### 修改内容后线上没变化

- 确认已 `git push origin main` 且 CI 运行成功（仓库 Actions 页查看）
- 自定义域名前有 CDN，等待缓存刷新
- 确认 Pages Source 为 **GitHub Actions**

### 修改站点文案无效

站点名称、导航等在 `src/config/site.ts`，属于**代码**，修改后需重新构建再推送。
