// Script to export countries data to CSV
import fs from 'fs';
import path from 'path';
import pkg from 'pg';
import { fileURLToPath } from 'url';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Query to get all countries
const exportCountries = async () => {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    console.log('Fetching countries data...');
    const result = await client.query('SELECT * FROM countries ORDER BY name');
    const countries = result.rows;
    
    console.log(`Found ${countries.length} countries`);
    
    // Create CSV header
    const headers = [
      'id', 
      'name', 
      'base_tariff', 
      'reciprocal_tariff', 
      'effective_date',
      'impact_level'
    ];
    
    // Format the data as CSV
    const csvContent = [
      headers.join(','),
      ...countries.map(country => {
        return [
          country.id,
          `"${country.name}"`,
          country.base_tariff,
          country.reciprocal_tariff,
          `"${country.effective_date || ''}"`,
          `"${country.impact_level || ''}"`
        ].join(',');
      })
    ].join('\n');
    
    // Write to file
    const outputPath = path.join(__dirname, '../data_exports/countries.csv');
    fs.writeFileSync(outputPath, csvContent);
    
    console.log(`CSV file created at: ${outputPath}`);
    client.release();
  } catch (error) {
    console.error('Error exporting countries:', error);
  } finally {
    pool.end();
  }
};

exportCountries();