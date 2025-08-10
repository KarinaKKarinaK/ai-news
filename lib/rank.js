// lib/rank.js

/** Exponential time decay: newer = higher score */
function timeDecayScore(published_at) {
  if (!published_at) return 0;
  const now = Date.now();
  const t = new Date(published_at).getTime();
  const hoursOld = Math.max(0, (now - t) / (1000 * 60 * 60));
  const halfLifeHours = 24; // half-life of 1 day
  const lambda = Math.log(2) / halfLifeHours;
  return Math.exp(-lambda * hoursOld); // 1 when fresh, decays over time
}

/**
 * Combine recency with click popularity.
 * clicksWeight: how much clicks matter vs. recency (0..1).
 */
export function scoreArticle({ published_at, clicks = 0 }, clicksWeight = 0.35) {
  const recency = timeDecayScore(published_at);         // 0..1
  const pop = Math.log1p(clicks) / Math.log(20 + 1);    // ~0..1 for 0..20+ clicks
  return (1 - clicksWeight) * recency + clicksWeight * pop;
}

/** Sort helper */
export function sortRanked(a, b) {
  return scoreArticle(b) - scoreArticle(a);
}
