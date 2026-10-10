# 项目长期记忆 · BlogWeb

## 项目定位
个人技术博客。作者本人 = 刘唐泽（学生，学软件/计算机，方向偏后端与软件测试）。

## 技术选型（已确定，请遵循）
- 纯手写 HTML / CSS / 原生 JS，**不引入框架、不用打包工具、不引入运行时 npm 依赖**。
- 文章用 Markdown 撰写，页面端用 CDN 的 `marked.js` 渲染，`highlight.js` 高亮。
- 托管目标：**GitHub Pages**（免费）。
- 需要联网加载的 CDN：marked@12、highlight.js@11.9（含 github / github-dark 两套主题）。

## 约定与结构
- 每篇文章 = `posts/*.md`，文件名即 slug；顶部必须有 frontmatter：`title / date / tags / summary`。
- 文章列表/归档全部读 `posts/posts.json`，该文件由 `node scripts/build-index.js` 生成，**不要手改**。
- 站点名称当前为「我的技术笔记」，硬编码在各 html 的 header/footer/标题中（后续若改名需全局替换）。
- 页面：index.html（首页）、post.html（详情，靠 ?slug=）、archive.html（归档）、about.html（关于）。
- 样式集中在 `css/style.css`，主题靠 `html[data-theme]` + CSS 变量切换，主题偏好存 localStorage key `blog-theme`。

## 写作/发布流程
1. 在 `posts/` 新建 md 并写好 frontmatter → 2. `node scripts/build-index.js` → 3. 本地 `python -m http.server 8000` 预览 → 4. git push，GitHub Pages 自动部署。

## 注意
- 本地预览**必须**用 http 服务器，直接双击打开 html 会因 fetch 跨域而失败。
- 新增页面时记得同步引入 `js/theme.js`（除 about/archive 外，post.html 还需 hljs 的明暗样式切换）。
