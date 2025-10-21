const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Enable CORS for frontend communication
app.use(cors());

// Initialize BigQuery client with the service account key
const bigquery = new BigQuery({
  keyFilename: './service-account-key.json', // Path to your key file
});

// Example endpoint to fetch live data from BigQuery
app.get('/api/data', async (req, res) => {
  try {
    const query = `
      SELECT 
        campaign_name,
        total_spend,
        total_sales,
        active_keywords,
        acos
      FROM \`your_project_id.your_dataset.your_table\`
      LIMIT 100
    `;

    const [rows] = await bigquery.query(query);
    res.json(rows); // Send queried data as JSON response
  } catch (error) {
    console.error('Error querying BigQuery:', error);
    res.status(500).json({ error: 'Failed to fetch data from BigQuery' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
