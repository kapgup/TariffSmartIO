// Script to import countries data from CSV with name matching and impact level calculation
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

// Function to determine impact level based on reciprocal tariff
const calculateImpactLevel = (reciprocalTariff) => {
  // Convert percentage string to number (remove % and convert to number)
  const tariffValue = parseFloat(reciprocalTariff.replace('%', ''));
  
  if (tariffValue >= 20) {
    return 'High';
  } else if (tariffValue >= 10) {
    return 'Medium';
  } else {
    return 'Low';
  }
};

// Function to process tariff values (remove % and convert to number)
const processTariffValue = (tariffStr) => {
  return parseFloat(tariffStr.replace('%', ''));
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
      
      // Get the maximum ID to use for new countries
      const maxIdResult = await client.query('SELECT MAX(id) FROM countries');
      let maxId = maxIdResult.rows[0].max || 0;
      
      // First, get all existing countries for name-based matching
      const existingCountriesResult = await client.query('SELECT id, name FROM countries');
      const existingCountries = new Map();
      
      // Create a map for case-insensitive matching
      existingCountriesResult.rows.forEach(country => {
        existingCountries.set(country.name.toLowerCase(), country.id);
      });
      
      // Process each country record
      for (const country of countries) {
        // Calculate impact level based on reciprocal tariff
        const impactLevel = calculateImpactLevel(country.reciprocal_tariff);
        
        // Process tariff values
        const baseTariff = processTariffValue(country.base_tariff);
        const reciprocalTariff = processTariffValue(country.reciprocal_tariff);
        
        // Check if country exists by name (case-insensitive)
        const existingId = existingCountries.get(country.name.toLowerCase());
        
        if (existingId) {
          // Update existing country
          console.log(`Updating country: ${country.name} with impact level ${impactLevel}`);
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
              baseTariff,
              reciprocalTariff, 
              country.effective_date,
              impactLevel,
              existingId
            ]
          );
        } else {
          // Insert new country with a new ID
          maxId++;
          console.log(`Creating new country: ${country.name} with ID ${maxId} and impact level ${impactLevel}`);
          await client.query(
            `INSERT INTO countries 
             (id, name, base_tariff, reciprocal_tariff, effective_date, impact_level)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              maxId,
              country.name,
              baseTariff,
              reciprocalTariff,
              country.effective_date,
              impactLevel
            ]
          );
          
          // Add to our map to handle duplicates in the CSV
          existingCountries.set(country.name.toLowerCase(), maxId);
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
const filePath = process.argv[2] || path.join(__dirname, '../attached_assets/countries-reciprocal-20250407.csv');

// Run the import
importCountries(filePath);