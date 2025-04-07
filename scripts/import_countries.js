// Script to import countries data from CSV
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

// Function to parse CSV data
const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  
  // Filter out empty lines
  return lines.slice(1)
    .filter(line => line.trim() !== '')
    .map(line => {
      // Handle quoted values with commas inside them
      const values = [];
      let inQuote = false;
      let currentValue = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue); // Add the last value
      
      // Create an object from the header keys and parsed values
      return headers.reduce((obj, header, i) => {
        obj[header.trim()] = values[i] ? values[i].trim().replace(/^"(.*)"$/, '$1') : null;
        return obj;
      }, {});
    });
};

// Import countries from CSV
const importCountries = async (filePath) => {
  try {
    console.log(`Reading CSV file from: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      return;
    }
    
    const csvContent = fs.readFileSync(filePath, 'utf8');
    const countries = parseCSV(csvContent);
    
    console.log(`Parsed ${countries.length} countries from CSV`);
    
    // Start a database transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Process each country record
      for (const country of countries) {
        // Check if country exists
        const checkResult = await client.query(
          'SELECT id FROM countries WHERE id = $1',
          [country.id]
        );
        
        if (checkResult.rows.length > 0) {
          // Update existing country
          console.log(`Updating country: ${country.name}`);
          await client.query(
            `UPDATE countries 
             SET name = $1, 
                 base_tariff = $2, 
                 reciprocal_tariff = $3, 
                 effective_date = $4, 
                 impact_level = $5
             WHERE id = $6`,
            [
              country.name,
              country.base_tariff,
              country.reciprocal_tariff, 
              country.effective_date || null,
              country.impact_level || null,
              country.id
            ]
          );
        } else {
          // Insert new country
          console.log(`Creating new country: ${country.name}`);
          await client.query(
            `INSERT INTO countries 
             (name, base_tariff, reciprocal_tariff, effective_date, impact_level)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              country.name,
              country.base_tariff,
              country.reciprocal_tariff,
              country.effective_date || null,
              country.impact_level || null
            ]
          );
        }
      }
      
      await client.query('COMMIT');
      console.log('Countries import completed successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error during import transaction:', error);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error importing countries:', error);
  } finally {
    pool.end();
  }
};

// Get the CSV file path from command line argument or use default
const filePath = process.argv[2] || path.join(__dirname, '../data_exports/countries_updated.csv');

// Run the import
importCountries(filePath);