// Script to update countries data from CSV
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import csvParser from 'csv-parser';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database using connection string from environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Impact level thresholds based on reciprocal tariff percentage
const IMPACT_THRESHOLDS = {
  HIGH: 35, // 35% and above is high impact
  MEDIUM: 25, // 25% to 34.9% is medium impact
  LOW: 0  // Below 25% is low impact
};

// Function to determine impact level based on reciprocal tariff
function determineImpactLevel(reciprocalTariff) {
  // Convert percentage string (e.g., "35%") to number (35)
  const tariffValue = parseFloat(reciprocalTariff.replace('%', ''));
  
  if (tariffValue >= IMPACT_THRESHOLDS.HIGH) {
    return 'High';
  } else if (tariffValue >= IMPACT_THRESHOLDS.MEDIUM) {
    return 'Medium';
  } else {
    return 'Low';
  }
}

// Function to process CSV and update database
async function updateCountries() {
  console.log('Starting country data update...');
  
  try {
    // Read countries from CSV
    const countries = [];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, '../attached_assets/countries-reciprocal-20250407.csv'))
        .pipe(csvParser())
        .on('data', (data) => {
          // Process each row and determine impact level
          data.impact_level = determineImpactLevel(data.reciprocal_tariff);
          countries.push(data);
        })
        .on('end', () => {
          console.log(`Read ${countries.length} countries from CSV`);
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
    
    // Sort countries alphabetically by name
    countries.sort((a, b) => a.name.localeCompare(b.name));
    
    // Begin transaction
    await pool.query('BEGIN');
    
    // Delete all existing countries
    await pool.query('DELETE FROM countries');
    console.log('Deleted existing countries from database');
    
    // Insert countries with new IDs in alphabetical order
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      // Convert percentage strings to numeric values by removing '%' and parsing
      const baseTariff = parseFloat(country.base_tariff.replace('%', ''));
      const reciprocalTariff = parseFloat(country.reciprocal_tariff.replace('%', ''));
      
      await pool.query(
        'INSERT INTO countries (id, name, base_tariff, reciprocal_tariff, effective_date, impact_level) VALUES ($1, $2, $3, $4, $5, $6)',
        [i + 1, country.name, baseTariff, reciprocalTariff, country.effective_date, country.impact_level]
      );
    }
    
    // Commit transaction
    await pool.query('COMMIT');
    console.log(`Successfully updated ${countries.length} countries in database`);
    
  } catch (error) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    console.error('Error updating countries:', error);
    throw error;
  } finally {
    // Close pool
    await pool.end();
  }
}

// Run the update function
updateCountries()
  .then(() => {
    console.log('Country update completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Country update failed:', error);
    process.exit(1);
  });