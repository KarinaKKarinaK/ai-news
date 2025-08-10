// lib/db.js
import { sql } from '@vercel/postgres';

/** One-time table creation (safe to call repeatedly) */
export async function createTables() {
  await sql`CREATE TABLE IF NOT EXISTS articles(
    id SERIAL PRIMARY KEY,
    url TEXT UNIQUE,
    title TEXT,
    source TEXT,
    published_at TIMESTAMPTZ,
    content TEXT
  );`;

  await sql`CREATE TABLE IF NOT EXISTS summaries(
    id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(id) ON DELETE CASCADE,
    model TEXT,
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`;

  await sql`CREATE TABLE IF NOT EXISTS clicks(
    id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`;
}

/** Upsert an article shell (title/metadata) and return its row */
export async function upsertArticle({ url, title, source, published_at, content = null }) {
  const { rows } = await sql`
    INSERT INTO articles (url, title, source, published_at, content)
    VALUES (${url}, ${title}, ${source}, ${published_at}, ${content})
    ON CONFLICT (url) DO UPDATE SET
      title = EXCLUDED.title,
      source = EXCLUDED.source,
      published_at = COALESCE(articles.published_at, EXCLUDED.published_at),
      content = COALESCE(articles.content, EXCLUDED.content)
    RETURNING *;`;
  return rows[0];
}

export async function articleHasSummary(article_id) {
  const { rows } = await sql`SELECT 1 FROM summaries WHERE article_id=${article_id} LIMIT 1;`;
  return rows.length > 0;
}

export async function insertSummary({ article_id, model, summary }) {
  await sql`
    INSERT INTO summaries(article_id, model, summary)
    VALUES(${article_id}, ${model}, ${summary});`;
}

export async function recentSummaries(limit = 50) {
  const { rows } = await sql`
    SELECT a.id, a.title, a.url, a.source, a.published_at, s.summary
    FROM articles a
    JOIN summaries s ON s.article_id = a.id
    ORDER BY a.published_at DESC NULLS LAST, a.id DESC
    LIMIT ${limit};`;
  return rows;
}

export async function recordClick(article_id) {
  await sql`INSERT INTO clicks(article_id) VALUES(${article_id});`;
}

export async function clickCounts() {
  const { rows } = await sql`
    SELECT article_id, COUNT(*)::int AS clicks
    FROM clicks
    GROUP BY article_id;`;
  // return as map
  return Object.fromEntries(rows.map(r => [String(r.article_id), r.clicks]));
}

export const db = { sql };
