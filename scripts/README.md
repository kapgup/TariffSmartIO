# Country Data Management Scripts

This directory contains scripts for managing country tariff data in the TariffSmart application.

## Export Countries Data

To export all countries from the database to a CSV file:

```bash
node scripts/export_countries.js
```

This will create a CSV file at `data_exports/countries.csv` containing all countries in the database.

## Import Countries Data

To import countries data from a CSV file:

```bash
node scripts/import_countries.js [path/to/csv/file]
```

If no file path is provided, the script will look for a file at `data_exports/countries_updated.csv`.

### CSV Format

The CSV file should have the following columns:
- id
- name
- base_tariff
- reciprocal_tariff
- effective_date
- impact_level

### Workflow

Typical workflow for updating country data:

1. Export current data: `node scripts/export_countries.js`
2. Edit the CSV file in your preferred spreadsheet application
3. Save the edited file as `data_exports/countries_updated.csv`
4. Import the updated data: `node scripts/import_countries.js`

## Note

These scripts require access to the PostgreSQL database and the DATABASE_URL environment variable must be set.
They are written using ES module syntax to match the project's configuration.
