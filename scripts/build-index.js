#!/usr/bin/env node
/**
 * build-index.js — 扫描 posts/*.md，读取每篇文章顶部的 frontmatter，
 * 生成 posts/posts.json 索引，供首页 / 归档页读取。
 *
 * 用法：  node scripts/build-index.js
 * 无任何第三方依赖，纯 Node 内置模块。
 *
 * frontmatter 格式（位于文件最上方，用 --- 包裹）：
 *   ---
 *   title: 文章标题
 *   date: 2026-10-10
 *   tags: [标签1, 标签2]
 *   summary: 一句话摘要
 *   ---
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const OUT_FILE = path.join(POSTS_DIR, 'posts.json');

/** 解析 frontmatter 与正文 */
function parseFrontmatter(raw) {
  const meta = {};
  let body = raw;
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
  if (!match) return { meta, body };

  const block = match[1];
  body = raw.slice(match[0].length);

  block.split(/\r?\n/).forEach((line) => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    // 去掉可能存在的引号
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // 支持 [a, b, c] 形式的数组
    if (value.startsWith('[') && value.endsWith(']')) {
      meta[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      meta[key] = value;
    }
  });

  return { meta, body };
}

/** 取正文第一段非空、非标题文字作为摘要兜底 */
function fallbackSummary(body) {
  const line = body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('#') && !l.startsWith('!') && !l.startsWith('>') && !l.startsWith('|'));
  if (!line) return '';
  return line.replace(/[*_`\[\]()]/g, '').slice(0, 80);
}

function build() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error('✗ 找不到 posts 目录：' + POSTS_DIR);
    process.exit(1);
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.toLowerCase().endsWith('.md'));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const slug = file.replace(/\.md$/i, '');
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
      summary: meta.summary || fallbackSummary(body),
      file,
    };
  });

  posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  fs.writeFileSync(OUT_FILE, JSON.stringify(posts, null, 2) + '\n', 'utf8');
  console.log('✓ 已生成索引：' + path.relative(ROOT, OUT_FILE));
  console.log('  共 ' + posts.length + ' 篇文章：');
  posts.forEach((p) => console.log('   - [' + (p.date || '无日期') + '] ' + p.title));
}

build();
