# 我的技术笔记 · 个人博客

一个用 **HTML / CSS / 原生 JavaScript** 手写的静态博客，文章用 **Markdown** 撰写，
可免费托管到 **GitHub Pages**。无框架、无打包工具、无第三方运行时依赖。

## ✨ 特性

- 手写前端，零框架，代码全部可读可改
- 文章用 Markdown 写，页面端用 `marked.js` 实时渲染
- 代码语法高亮（highlight.js）
- 首页支持**标签筛选**与**关键词搜索**
- 归档页按年份汇总
- 一键切换**浅色 / 深色**主题（记忆用户选择）
- 响应式布局，手机端也好看

## 📁 目录结构

```
BlogWeb/
├── index.html            # 首页：文章列表 + 搜索 + 标签筛选
├── post.html             # 文章页：渲染 Markdown
├── archive.html          # 归档页：按年份列出全部文章
├── about.html            # 关于页
├── css/
│   └── style.css         # 全部样式（变量驱动，含深色主题）
├── js/
│   ├── theme.js          # 主题切换
│   ├── main.js           # 首页逻辑
│   └── post.js           # 文章页逻辑
├── posts/
│   ├── posts.json        # 文章索引（由脚本自动生成，勿手改）
│   └── *.md              # 每一篇文章
├── scripts/
│   └── build-index.js    # 扫描 md，生成 posts.json
└── .nojekyll             # 让 GitHub Pages 跳过 Jekyll 处理
```

## ✍️ 如何写一篇新文章

**第 1 步**：在 `posts/` 目录新建一个 `.md` 文件，例如 `my-first-post.md`。

**第 2 步**：在文件最上方写上 `frontmatter`（文章元信息）：

```markdown
---
title: 我的第一篇文章
date: 2026-10-12
tags: [Java, 学习笔记]
summary: 用一句话概括这篇文章讲了什么。
---

正文从这里开始，支持标准 Markdown 语法，包括代码块：

```java
System.out.println("Hello, blog!");
```
```

> `slug` 就是文件名（去掉 `.md`），文章的链接即 `post.html?slug=my-first-post`。

**第 3 步**：生成/更新索引：

```bash
node scripts/build-index.js
```

**第 4 步**：本地预览（见下方），确认无误后提交发布。

## 💻 本地预览

因为要用 `fetch` 读取文件，**不能直接双击打开 html**（会遇到跨域限制），
需要用一个本地服务器。任选一种：

```bash
# 方式一：Node（推荐，无需安装依赖）
npx serve .

# 方式二：Python
python -m http.server 8080
```

然后浏览器打开 `http://localhost:8080`（或终端提示的地址）。

## 🚀 部署到 GitHub Pages

> 📋 **完整命令（可复制粘贴、含常见报错排查）见 [DEPLOY.md](./DEPLOY.md)。** 下面是简明版。

1. **建仓库**：在 GitHub 新建一个仓库，例如 `my-blog`（公开仓库才能用免费 Pages）。

2. **推代码**（在项目目录执行）：
   ```bash
   git init
   git add .
   git commit -m "init: 初始化博客"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/my-blog.git
   git push -u origin main
   ```

3. **开启 Pages**：
   进入仓库 → `Settings` → 左侧 `Pages` →
   - **Source** 选择 `Deploy from a branch`
   - **Branch** 选择 `main`，目录选 `/ (root)`
   - 点击 `Save`

4. **访问**：等待 1~2 分钟，站点会发布在
   `https://<你的用户名>.github.io/my-blog/`

> 之后每次更新文章，只需 `git add . && git commit -m "新文章" && git push`，Pages 会自动重新部署。

### 可选的进阶玩法

- **自定义域名**：在仓库 `Settings → Pages → Custom domain` 填入自己的域名，并按提示配置 DNS；再在项目根目录加一个内容为域名的 `CNAME` 文件。
- **自动化构建索引**：可加一个 GitHub Actions workflow，在推送时自动运行 `node scripts/build-index.js`，这样本地就不用手动跑了。
- **本地自动化**：也可以配置 git pre-commit 钩子，提交前自动生成索引。

## 🔧 想改成自己的

- **站点名称**：搜索 `我的技术笔记`，替换为你喜欢的名字（出现在每个 html 的 header、标题、footer）。
- **首页自我介绍**：改 `index.html` 里的 `.hero` 区块。
- **关于页**：改 `about.html`。
- **配色**：改 `css/style.css` 顶部 `:root` 里的 CSS 变量（如 `--accent`）。

---

用 HTML / CSS / JS 手写而成 · 愿你写得开心 📓
