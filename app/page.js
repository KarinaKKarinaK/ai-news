import { TOPICS } from '../lib/rss.js';
import NewsCard from '../components/NewsCard.js';
import { fetchFeedItems } from '../lib/rss.js';
import { summarize } from '../lib/summarize.js';
import { scoreArticle } from '../lib/rank.js';

export default async function Home({ searchParams }) {
  const currentTopic = searchParams?.topic || 'tech';
  
  // Fetch and process news on the server side
  let articles = [];
  let error = null;

  try {
    const topic = TOPICS.find(t => t.slug === currentTopic);
    if (topic) {
      const rawArticles = await fetchFeedItems(topic);
      
      // Score and sort articles
      const scoredArticles = rawArticles
        .map(article => ({
          ...article,
          score: scoreArticle(article)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 9); // Limit to 9 articles for better performance

      // Summarize articles
      articles = await Promise.all(
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
          } catch (err) {
            console.error(`Failed to summarize: ${article.title}`, err);
            return {
              ...article,
              summary: null
            };
          }
        })
      );
    }
  } catch (err) {
    console.error('Error loading news:', err);
    error = 'Failed to load news';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI News Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            AI-summarized news from top sources
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Topic Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TOPICS.map(topic => (
            <a
              key={topic.slug}
              href={`/?topic=${topic.slug}`}
              className={`px-4 py-2 rounded-full transition-colors capitalize ${
                currentTopic === topic.slug
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
              }`}
            >
              {topic.slug}
            </a>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">
              {error}. Please try again later.
            </p>
          </div>
        )}

        {/* Loading/Empty State */}
        {!error && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">
              Loading news articles...
            </p>
          </div>
        )}

        {/* News Grid */}
        {articles.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <NewsCard key={`${article.url}-${index}`} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
