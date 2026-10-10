---
title: 你好，世界：这个博客是怎么跑起来的
date: 2026-10-10
tags: [随笔, 建站]
summary: 第一篇博文，聊聊为什么要自己手写一个博客，以及它的整体结构。
---

## 为什么自己写一个博客

市面上有太多现成的博客系统，但我还是选择自己**手写**一个。理由很简单：

- 想彻底搞清楚一个网站从 HTML、CSS 到 JS 是怎么组织起来的；
- 不想被平台的功能和样式限制，想改哪里就改哪里；
- 自己的东西，长期维护也更放心。

整个博客**没有任何框架**，只有三样东西：HTML、CSS、JavaScript。

## 整体结构

```text
BlogWeb/
├── index.html        # 首页：文章列表
├── post.html         # 文章页：渲染 Markdown
├── archive.html      # 归档页：按年份列出
├── about.html        # 关于页
├── css/style.css     # 全部样式
├── js/
│   ├── theme.js      # 主题切换
│   ├── main.js       # 首页逻辑
│   └── post.js       # 文章页逻辑
├── posts/            # 所有文章（Markdown）
│   └── posts.json    # 自动生成的索引
└── scripts/
    └── build-index.js
```

## 它是怎么工作的

核心思路非常朴素：

1. 每篇文章是一个 **Markdown 文件**，放在 `posts/` 目录；
2. 运行 `node scripts/build-index.js`，脚本读取每篇文件的头部信息，生成 `posts.json` 索引；
3. 首页读取索引，把文章列出来；
4. 点进某篇文章时，页面用 `marked.js` 把 Markdown **实时渲染**成 HTML。

> 换句话说：写文章 = 写 Markdown，其他交给几行 JS。

## 一行代码看看

```js
// 首页从索引里拿数据
fetch('posts/posts.json')
  .then((r) => r.json())
  .then((posts) => posts.forEach((p) => console.log(p.title)));
```

## 接下来

我会在这里持续记录技术学习中的笔记和踩坑。如果你也在学前端，欢迎一起交流。
