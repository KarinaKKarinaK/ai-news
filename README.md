# AI News Dashboard

> A full-stack productivity app that aggregates news and generates AI-powered summaries using OpenAI

![AI News Dashboard](https://img.shields.io/badge/Next.js-15.4.6-black) ![OpenAI](https://img.shields.io/badge/OpenAI-API-green) ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-blue)

## Features

- **Smart News Aggregation**: Fetches news from multiple RSS feeds and Google News
- **AI-Powered Summaries**: Uses OpenAI GPT to generate concise 3-bullet summaries 
- **Topic Filtering**: Personalized categories (Tech, AI, Startups)
- **Intelligent Ranking**: Scores articles by recency and relevance
- **Dark Mode Support**: Beautiful UI that works in light and dark themes
- **Server-Side Rendering**: Fast loading with Next.js App Router
- **Responsive Design**: Works perfectly on desktop and mobile

## Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KarinaKKarinaK/ai-news.git
cd ai-news
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Frontend**: React 19, Next.js 15.4.6, TailwindCSS 4
- **AI**: OpenAI GPT-4.1-mini for summarization
- **Data Sources**: RSS Parser, Google News API
- **Deployment**: Vercel (ready to deploy)
- **Language**: JavaScript (ES6+)

## How It Works

1. **News Aggregation**: Fetches articles from RSS feeds based on configured topics
2. **Smart Ranking**: Scores articles using time decay and relevance algorithms
3. **AI Summarization**: Sends top articles to OpenAI for 60-word summaries
4. **User Interface**: Displays articles in a clean, filterable dashboard

## 🔧 Configuration

### Adding New Topics

Edit `lib/rss.js` to add new news categories:

```javascript
export const TOPICS = [
  { slug: 'tech', keywords: 'technology OR AI OR startup' },
  { slug: 'ai', keywords: 'artificial intelligence OR machine learning' },
  { slug: 'crypto', keywords: 'cryptocurrency OR bitcoin OR blockchain' }, // Add new topics
];
```

### Customizing AI Summaries

Modify the prompt in `lib/summarize.js`:

```javascript
const sys = `You are a concise news summarizer.
- Output exactly 3 bullet points, <= 60 words total, neutral tone.
- The last bullet must be: "Read more: ${url}".
- If details are sparse, say what's known and avoid speculation.`;
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your `OPENAI_API_KEY` in Vercel's environment variables
4. Deploy! ✨

### Manual Deployment

```bash
npm run build
npm start
```

## Roadmap

- [ ] **Database Integration**: Store articles and summaries
- [ ] **Email Digests**: Weekly AI-generated newsletters  
- [ ] **User Preferences**: Personalized topic subscriptions
- [ ] **Search Functionality**: Find specific articles
- [ ] **PWA Support**: Installable web app
- [ ] **Analytics**: Track popular articles and topics

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Use Cases

- **Personal News Digest**: Stay updated with AI-curated summaries
- **Research Tool**: Quickly scan multiple sources on specific topics
- **Team Dashboard**: Share focused news with your organization
- **Content Curation**: Find trending stories in your industry
