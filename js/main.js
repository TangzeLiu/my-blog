/* main.js — 首页逻辑：加载文章索引、渲染列表、标签筛选、搜索 */
(function () {
  var listEl = document.getElementById('post-list');
  var searchEl = document.getElementById('search-input');
  var tagWrap = document.getElementById('tag-filter');

  var posts = [];
  var activeTag = 'all';
  var keyword = '';

  function formatDate(str) {
    var d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderTags() {
    var tags = {};
    posts.forEach(function (p) {
      (p.tags || []).forEach(function (t) { tags[t] = (tags[t] || 0) + 1; });
    });
    var names = Object.keys(tags).sort();
    var html = '<button class="tag-pill is-active" data-tag="all">全部 (' + posts.length + ')</button>';
    names.forEach(function (t) {
      html += '<button class="tag-pill" data-tag="' + escapeHtml(t) + '">' +
        escapeHtml(t) + ' (' + tags[t] + ')</button>';
    });
    tagWrap.innerHTML = html;

    tagWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.tag-pill');
      if (!btn) return;
      activeTag = btn.getAttribute('data-tag');
      Array.prototype.forEach.call(tagWrap.children, function (c) {
        c.classList.toggle('is-active', c === btn);
      });
      render();
    });
  }

  function getFiltered() {
    return posts.filter(function (p) {
      var okTag = activeTag === 'all' || (p.tags || []).indexOf(activeTag) !== -1;
      var text = (p.title + ' ' + (p.summary || '') + ' ' + (p.tags || []).join(' ')).toLowerCase();
      var okKey = !keyword || text.indexOf(keyword) !== -1;
      return okTag && okKey;
    });
  }

  function render() {
    var data = getFiltered();
    if (!data.length) {
      listEl.innerHTML = '<p class="empty">没有找到匹配的文章 🥲</p>';
      return;
    }
    listEl.innerHTML = data.map(function (p) {
      var tags = (p.tags || []).map(function (t) {
        return '<span class="tag">#' + escapeHtml(t) + '</span>';
      }).join('');
      return '' +
        '<a class="post-card" href="post.html?slug=' + encodeURIComponent(p.slug) + '">' +
          '<div class="post-card-main">' +
            '<h2 class="post-card-title">' + escapeHtml(p.title) + '</h2>' +
            '<p class="post-card-summary">' + escapeHtml(p.summary || '') + '</p>' +
            '<div class="post-card-meta">' +
              '<time>' + formatDate(p.date) + '</time>' +
              (tags ? '<span class="dot">·</span><span class="post-card-tags">' + tags + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<span class="post-card-arrow">→</span>' +
        '</a>';
    }).join('');
  }

  if (searchEl) {
    searchEl.addEventListener('input', function () {
      keyword = searchEl.value.trim().toLowerCase();
      render();
    });
  }

  fetch('posts/posts.json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      posts = (data || []).sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      renderTags();
      render();
    })
    .catch(function (err) {
      listEl.innerHTML =
        '<p class="empty">文章索引加载失败：' + escapeHtml(err.message) +
        '<br/>请确认 <code>posts/posts.json</code> 存在（可运行 <code>node scripts/build-index.js</code> 生成）。</p>';
    });
})();
