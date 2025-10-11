import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1ytcD6CM_Nb408WKRpT6ZWoCxyJupkTjIiRC8rQ9wgLI/export?format=csv&gid=1676055671';

  try {
    const response = await fetch(SHEET_URL);
    
    if (!response.ok) {
      return res.status(400).json({ 
        error: 'Failed to fetch sheet. Make sure it is publicly accessible' 
      });
    }

    const csvText = await response.text();
    
    // Parse CSV
    const rows = csvText.split('\n').map(row => {
      const cells = [];
      let current = '';
      let inQuotes = false;
      
      for (let char of row) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cells.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      cells.push(current.trim().replace(/^"|"$/g, ''));
      return cells;
    });

    const products = rows.slice(1)
      .filter(row => row.length > 1 && row[0] && row[0].length > 0)
      .map((row, index) => ({
        id: index + 1,
        name: row[0] || 'Unnamed Product',
        category: row[1] || 'General',
        useCase: row[2] || 'gardening',
        benefits: row[3] || 'improves soil health',
        targetAudience: row[4] || 'gardeners',
      }));

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to load products',
      details: error.message 
    });
  }
}
