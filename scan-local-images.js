import { createWorker } from 'tesseract.js';
import * as fs from 'fs';
import * as path from 'path';

async function scanLocalScreenshots() {
  const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
  const files = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png') && f !== 'logo-with-tagline.png' && f !== 'wrong.png');

  console.log('Scanning local screenshots for bottle label text...\n');

  const worker = await createWorker('eng');

  try {
    for (const file of files) {
      const filePath = path.join(screenshotsDir, file);
      console.log(`\n=== Scanning: ${file} ===`);

      try {
        const { data } = await worker.recognize(filePath);
        const text = data.text.trim();

        console.log('Raw OCR text:');
        console.log(text);
        console.log('---');

        // Extract meaningful tokens
        const tokens = text
          .toUpperCase()
          .replace(/[^A-Z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter(token => token.length > 2 && !/^\d+$/.test(token));

        console.log('Filtered tokens:', tokens.join(', '));

      } catch (error) {
        console.error(`Error scanning ${file}:`, error);
      }
    }
  } finally {
    await worker.terminate();
  }
}

scanLocalScreenshots().catch(console.error);
