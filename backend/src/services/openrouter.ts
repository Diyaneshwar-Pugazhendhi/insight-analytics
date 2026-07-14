import { env } from '../env.js';

export async function chatWithClaude(prompt: string): Promise<string> {
  if (!env.OPENROUTER_API_KEY) {
    throw new Error('OpenRouter is not configured (set OPENROUTER_API_KEY)');
  }
  const response = await fetch(`${env.OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      // Optional headers required by OpenRouter TOS
      'HTTP-Referer': 'https://your-app.example.com',
      'X-Title': 'Dashboard-Project',
    },
    body: JSON.stringify({
      model: env.OPENROUTER_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${err}`);
  }

  const data = await response.json();
  // OpenRouter returns choices[0].message.content
  return data.choices?.[0]?.message?.content ?? '';
}
