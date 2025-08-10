// lib/summarize.js
import { openai } from './openai.js';

/**
 * Summarize an article using OpenAI.
 * You can pass { title, url, description, content } — content is optional.
 */
export async function summarize({ title, url, description = '', content = '' }) {
  const sys = `You are a concise news summarizer.
- Output exactly 3 bullet points, <= 60 words total, neutral tone.
- The last bullet must be: "Read more: ${url}".
- If details are sparse, say what's known and avoid speculation.`;

  const body = (content || description || '').slice(0, 4000); // keep it short

  const user = `Title: ${title}\nURL: ${url}\nContent:\n${body}`;

  // Using the Responses API (JS SDK)
  const resp = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      { role: 'system', content: sys },
      { role: 'user', content: user }
    ],
  });

  // The SDK gives a convenience string:
  const text = resp.output_text?.trim();
  return text || '';
}
