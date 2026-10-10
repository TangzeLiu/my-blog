/* post.js — 文章详情页：读取 ?slug=，加载对应 Markdown 并渲染 */
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

  if (!slug) {
    fail('缺少文章参数。请从<a href="index.html">首页</a>进入文章。');
    return;
  }

  // 从索引里找到元数据，再加载对应的 md 文件
  fetch('posts/posts.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var meta = (data || []).find(function (p) { return p.slug === slug; });
      if (!meta) throw new Error('未找到该文章：' + slug);

      return fetch('posts/' + meta.file)
        .then(function (r) {
          if (!r.ok) throw new Error('无法读取文章文件：' + meta.file);
          return r.text();
        })
        .then(function (md) {
          document.title = meta.title + ' · 我的技术笔记';
          var body = marked.parse(md);
          articleEl.innerHTML = renderMeta(meta) + '<div class="markdown-body">' + body + '</div>';
          // 代码高亮
          articleEl.querySelectorAll('pre code').forEach(function (block) {
            if (window.hljs) window.hljs.highlightElement(block);
          });
        });
    })
    .catch(function (err) {
      fail('文章加载失败：' + escapeHtml(err.message));
    });
})();
