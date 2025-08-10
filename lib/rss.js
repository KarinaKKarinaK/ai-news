// lib/rss.js
import Parser from 'rss-parser';

const parser = new Parser();

/** Build a Google News RSS URL for the last 7 days */
export function googleNewsFeed(query) {
  const q = encodeURIComponent(`${query} when:7d`);
  return `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;
}

/** Define your topics and queries here */
export const TOPICS = [
  { slug: 'tech',     keywords: 'technology OR AI OR startup' },
  { slug: 'ai',       keywords: 'artificial intelligence OR machine learning' },
  { slug: 'startups', keywords: 'startup OR fundraising OR venture capital' },
];

/** Fetch feed items for a topic (Google News by default) */
export async function fetchFeedItems(topic) {
  const url = googleNewsFeed(topic.keywords);
  const feed = await parser.parseURL(url);

  return (feed.items || []).map(i => ({
    url: i.link,
    title: i.title,
    source: i.creator || i.author || (i.source && i.source.title) || 'Unknown',
    published_at: i.isoDate || i.pubDate || new Date().toISOString(),
    // Fallback to contentSnippet/summary if present (not all feeds have full text)
    description: i.contentSnippet || i.content || i.summary || '',
  }));
}
