# Mindows 下载站

> 一个基于 [Next.js](https://nextjs.org) + [Tailwind CSS](https://tailwindcss.com) 构建的静态系统镜像下载站。

提供 Windows / Linux / PE 等系统镜像的检索与下载服务。结构清晰、SEO 友好、便于管理。

## ✨ 特性

- ⚡ **静态导出** — 使用 Next.js `output: "export"` 生成纯静态文件，任意 CDN / Pages 均可托管
- 🎨 **Tailwind CSS** — 原子化样式，主题色与暗色模式
- 🔍 **SEO 优化** — 自动生成 sitemap.xml / robots.txt / JSON-LD 结构化数据、完整 OpenGraph、面包屑导航
- 📦 **数据驱动** — 每个系统一个独立 JSON 文件，添加/修改/删除资源无需改动代码
- ✅ **数据校验** — 基于 [Zod](https://zod.dev) 在构建时校验所有资源数据，slug 重复、字段缺失、格式错误立即报错
- 🚀 **CI/CD** — GitHub Actions 自动构建并部署到 GitHub Pages

## 🛠️ 技术栈

| 用途 | 技术 |
| --- | --- |
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 |
| 校验 | Zod |
| 部署 | GitHub Pages via GitHub Actions |

## 📁 项目结构

```
.
├── content/
│   ├── systems/            # 系统镜像数据（每个系统一个 JSON）
│   │   ├── windows-11-23h2-official.json
│   │   ├── ubuntu-24-04-lts.json
│   │   └── ...
│   ├── sponsors/           # 赞助商数据（每个赞助商一个 JSON）
│   │   ├── afdian.json
│   │   ├── racknerd.json
│   │   └── ...
│   └── announcements/      # 公告数据（每个公告一个 Markdown）
│       ├── about-ads.md
│       ├── 2025-08-update.md
│       └── ...
├── public/                 # 静态资源（自动拷贝到构建产物）
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── app/                # Next.js App Router 页面
│   ├── components/         # 复用组件
│   ├── config/             # 站点与分类配置
│   ├── lib/                # 数据访问层
│   └── types/              # 共享类型与 Zod schema
├── .github/workflows/      # GitHub Actions 工作流
└── next.config.ts
```

## 🚀 本地开发

环境要求：**Node.js 20+**

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:3000）
npm run dev

# 构建生产版本（输出到 ./out 目录）
npm run build

# 代码检查
npm run lint
```

## ➕ 添加 / 修改系统资源

所有系统数据存放在 `content/systems/` 目录下，每个系统一个独立 JSON 文件，文件名即 `slug`。

### 添加新系统

1. 在 `content/systems/` 下新建文件 `your-system-slug.json`
2. 参考现有文件填写字段
3. 提交代码，CI 自动构建部署

### 字段说明

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `slug` | ✅ | 唯一标识，仅小写字母、数字、短横线，文件名需与之一致 |
| `name` | ✅ | 显示名称 |
| `category` | ✅ | 分类：`windows` / `linux` / `pe` / `other` |
| `version` | ✅ | 版本号 |
| `arch` | ✅ | 架构数组，至少包含一个：`x86` / `x64` / `arm64` |
| `size` | ✅ | 文件大小（如 `6.2 GB`） |
| `languages` | ✅ | 支持语言数组 |
| `updatedAt` | ✅ | 更新日期，格式 `YYYY-MM-DD` |
| `description` | ✅ | 简介 |
| `features` | ✅ | 特性列表 |
| `requirements.cpu/ram/disk` | ✅ | 硬件要求 |
| `mirrors` | ✅ | 下载镜像（至少 1 个） |
| `tags` | ❌ | 标签数组 |
| `featured` | ❌ | 是否首页推荐 |
| `cover` | ❌ | 封面图路径 |

### 修改现有系统

直接编辑对应 JSON 文件即可。CI 会在构建时进行校验。

## 📢 管理公告

公告使用 **Markdown 编写**，存放在 `content/announcements/` 目录下，每个公告一个 `.md` 文件，文件名即访问路径中的 `slug`。

公告展示在 `/announcements` 列表页，详情页地址为 `/announcement/{slug}`。

### 添加新公告

1. 在 `content/announcements/` 下新建文件 `your-announcement-slug.md`
2. 在文件顶部编写 YAML 前置元数据（frontmatter），正文使用 Markdown 编写
3. 提交代码，CI 自动构建部署

示例：

```markdown
---
title: 示例公告
date: 2025-09-10
pinned: true
tags: ["公告", "示例"]
summary: 这是一条示例公告
---

## 标题

支持 **粗体**、*斜体*、`行内代码` 等 Markdown 语法。

- 列表项 1
- 列表项 2

| 列 1 | 列 2 |
| --- | --- |
| A | B |

> 引用块、[链接](https://example.com)、表格、代码块均可正常渲染。
```

### 字段说明

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | ✅ | 公告标题 |
| `date` | ✅ | 发布日期，格式 `YYYY-MM-DD` |
| `pinned` | ❌ | 是否置顶，`true` 或 `false`，默认 `false` |
| `tags` | ❌ | 标签数组，列表页展示 |
| `summary` | ❌ | 摘要，列表页展示，未填写则只显示标题 |

### 修改 / 删除公告

直接编辑或删除 `content/announcements/` 下对应的 `.md` 文件即可。

## 💼 管理赞助商

所有赞助商数据存放在 `content/sponsors/` 目录下，每个赞助商一个独立 JSON 文件，文件名即 `slug`。

### 添加 / 修改赞助商

1. 在 `content/sponsors/` 下新建文件 `your-sponsor-slug.json`（修改则编辑已有文件）
2. 将赞助商 Logo 放到 `public/sponsors/` 目录
3. 参考现有文件填写字段，提交代码后 CI 自动部署

### 字段说明

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `slug` | ✅ | 唯一标识，仅小写字母、数字、短横线，文件名需与之一致 |
| `title` | ✅ | 赞助商名称 |
| `description` | ❌ | 一句简介 |
| `image` | ✅ | Logo 路径，如 `/sponsors/your-logo.png` |
| `href` | ✅ | 跳转链接 |
| `cta` | ❌ | 按钮文案，默认「查看详情」 |
| `priority` | ❌ | 排序权重，数字越小越靠前，缺省排最后 |

### 删除赞助商

删除 `content/sponsors/` 下对应的 JSON 文件即可。

## 🌐 部署

本项目通过 `.github/workflows/deploy.yml` 自动部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. Actions 自动安装依赖、构建静态文件
3. 将 `./out` 目录部署到 GitHub Pages

### 首次启用 Pages

1. 进入仓库 **Settings → Pages**
2. **Source** 选择 **GitHub Actions**
3. 之后每次推送到 `main` 都会自动触发部署

## 🤝 贡献

欢迎提交 Issue 与 Pull Request 来改进项目：
- 修正资源数据
- 新增系统镜像条目
- 完善文档
- 优化样式与功能

## 📄 许可

MIT
