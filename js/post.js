/* post.js — 文章详情页：读取 ?slug=，加载对应 Markdown 并渲染
   含数学公式（LaTeX）支持：渲染前先保护公式，渲染后用 MathJax 排版。 */
(function () {
  var articleEl = document.getElementById('article');
  var slug = new URLSearchParams(location.search).get('slug');

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(str) {
    var d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日';
  }

  function renderMeta(meta) {
    var tags = (meta.tags || []).map(function (t) {
      return '<span class="tag">#' + escapeHtml(t) + '</span>';
    }).join('');
    return '<header class="article-header">' +
      '<h1 class="article-title">' + escapeHtml(meta.title) + '</h1>' +
      '<div class="article-meta">' +
        '<time>' + formatDate(meta.date) + '</time>' +
        (tags ? '<span class="post-card-tags">' + tags + '</span>' : '') +
      '</div>' +
    '</header>';
  }

  function fail(msg) {
    articleEl.innerHTML = '<p class="empty">' + msg + '</p>';
  }

  /* ------------------------------------------------------------------
   * 数学公式保护
   * 问题：marked 会按 Markdown 语法解析正文，公式里的 `\\` 换行、`_` 下标、
   *       `*`、`\` 等会被吃掉或改写，导致公式损坏。
   * 做法：渲染前把 $$...$$ 与 $...$ 整段摘出来，用占位符 @@MATH0@@ 顶替；
   *       marked 渲染完后再把原文放回去，交给 MathJax 排版。
   * 注意：``` 代码围栏内的内容不处理（其中的 $ 不是公式）。
   * ------------------------------------------------------------------ */
  function protectMath(md) {
    var store = [];
    var parts = md.split(/(```[\s\S]*?```)/g);
    var text = parts.map(function (part) {
      if (part.indexOf('```') === 0) return part; // 代码块原样保留

      // 先块级公式 $$...$$（可跨行）
      var out = part.replace(/\$\$([\s\S]+?)\$\$/g, function (m) {
        var i = store.length;
        store.push(m);
        return '\n\n@@MATH' + i + '@@\n\n';
      });
      // 再行内公式 $...$（不跨行）
      out = out.replace(/\$([^\$\n]+?)\$/g, function (m) {
        var i = store.length;
        store.push(m);
        return '@@MATH' + i + '@@';
      });
      return out;
    }).join('');
    return { text: text, store: store };
  }

  function restoreMath(html, store) {
    return html.replace(/@@MATH(\d+)@@/g, function (m, idx) {
      var v = store[Number(idx)];
      return v == null ? m : v;
    });
  }

  /* 触发 MathJax 排版（等它初始化完成后再对正文区域排版） */
  function typesetMath(el) {
    if (!window.MathJax || !MathJax.startup) return;
    MathJax.startup.promise
      .then(function () { return MathJax.typesetPromise([el]); })
      .catch(function () { /* 公式渲染失败不影响正文显示 */ });
  }

  if (!slug) {
    fail('缺少文章参数。请从<a href="index.html">首页</a>进入文章。');
    return;
  }

  // 从索引里找到元数据，再加载对应的 md 文件
  // cache: 'no-store' —— 避免缓存旧的文章索引与正文
  fetch('posts/posts.json', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var meta = (data || []).find(function (p) { return p.slug === slug; });
      if (!meta) throw new Error('未找到该文章：' + slug);

      return fetch('posts/' + meta.file, { cache: 'no-store' })
        .then(function (r) {
          if (!r.ok) throw new Error('无法读取文章文件：' + meta.file);
          return r.text();
        })
        .then(function (md) {
          document.title = meta.title + ' · 我的技术笔记';

          var protectedMd = protectMath(md);                 // 1) 保护公式
          var body = marked.parse(protectedMd.text);          // 2) 渲染 Markdown
          body = restoreMath(body, protectedMd.store);        // 3) 还原公式原文

          articleEl.innerHTML = renderMeta(meta) + '<div class="markdown-body">' + body + '</div>';

          // 代码高亮（在公式排版之前）
          articleEl.querySelectorAll('pre code').forEach(function (block) {
            if (window.hljs) window.hljs.highlightElement(block);
          });

          // 数学公式排版
          typesetMath(articleEl);
        });
    })
    .catch(function (err) {
      fail('文章加载失败：' + escapeHtml(err.message));
    });
})();
