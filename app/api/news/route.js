// app/api/news/route.js
import { NextResponse } from 'next/server';
import { fetchFeedItems, TOPICS } from '../../../lib/rss.js';
import { summarize } from '../../../lib/summarize.js';
import { scoreArticle } from '../../../lib/rank.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const topicSlug = searchParams.get('topic') || 'tech';
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    // Find the topic
    const topic = TOPICS.find(t => t.slug === topicSlug);
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    console.log(`Fetching news for topic: ${topic.slug}`);
    
    // Fetch raw articles
    const articles = await fetchFeedItems(topic);
    console.log(`Found ${articles.length} articles`);

    // Score and sort articles
    const scoredArticles = articles
      .map(article => ({
        ...article,
        score: scoreArticle(article)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Summarize top articles
    console.log(`Summarizing top ${scoredArticles.length} articles...`);
    const summarizedArticles = await Promise.all(
      scoredArticles.map(async (article) => {
        try {
          const summary = await summarize({
            title: article.title,
            url: article.url,
            description: article.description
          });
          
          return {
            ...article,
            summary: summary || null
          };
        } catch (error) {
          console.error(`Failed to summarize article: ${article.title}`, error);
          return {
            ...article,
            summary: null
          };
        }
      })
    );

    return NextResponse.json({
      topic: topicSlug,
      articles: summarizedArticles,
      total: summarizedArticles.length
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' }, 
      { status: 500 }
    );
  }
}
