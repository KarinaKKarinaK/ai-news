// components/NewsCard.js
export default function NewsCard({ article }) {
  if (!article) return null;

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Source & Date */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
        <span className="font-medium">{article.source}</span>
        <time>{new Date(article.published_at).toLocaleDateString()}</time>
      </div>

      {/* Title */}
      <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          {article.title}
        </a>
      </h2>

      {/* AI Summary */}
      {article.summary && (
        <div className="mb-4">
          <div className="text-sm text-blue-600 dark:text-blue-400 mb-2 flex items-center">
            🤖 AI Summary
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {article.summary}
          </p>
        </div>
      )}

      {/* Original Description (fallback) */}
      {!article.summary && article.description && (
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.description}
        </p>
      )}

      {/* Read More Button */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        Read full article →
      </a>
    </article>
  );
}
