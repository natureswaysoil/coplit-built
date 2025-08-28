// Lightweight OCR matcher using dynamic import of tesseract.js to avoid SSR costs
// Extracts uppercase alphanumerics from image and matches against keywords from titles

export type MatchResult = {
  text: string;
  score: number; // 0..1
};

function tokenizeUpper(s: string): string[] {
  return (s || '')
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export async function ocrImageToTokens(imgUrl: string): Promise<string[]> {
  // Proxy to avoid CORS
  const proxied = `/api/fetch-image?src=${encodeURIComponent(imgUrl)}`;
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng');
  try {
    const { data } = await worker.recognize(proxied);
    const tokens = tokenizeUpper(data.text || '');
    return tokens;
  } finally {
    await worker.terminate();
  }
}

export function scoreTitleAgainstTokens(title: string, tokens: string[]): MatchResult {
  const titleTokens = tokenizeUpper(title);
  if (titleTokens.length === 0) return { text: '', score: 0 };
  const set = new Set(tokens);
  const matches = titleTokens.filter(t => set.has(t));
  const score = matches.length / titleTokens.length;
  return { text: matches.join(' '), score };
}
