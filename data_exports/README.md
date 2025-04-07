# Data Exports Directory

This directory stores CSV exports of the TariffSmart database tables.

## Countries.csv

The countries.csv file contains information about countries, their tariff rates, and effective dates.

### Structure

The CSV file includes the following columns:
- id: Unique identifier for the country
- name: Name of the country
- base_tariff: Basic tariff rate (percentage)
- reciprocal_tariff: Reciprocal tariff rate (percentage)
- effective_date: Date when the tariff took effect
- impact_level: Categorization of tariff impact (e.g., "High", "Medium", "Low")

## Usage

You can export the current database data to this directory using:

```bash
node scripts/export_countries.js
```

You can update the database with changes made to these files using:

```bash
node scripts/import_countries.js data_exports/countries_updated.csv
```

## Workflow

A typical workflow for updating country data is:
1. Export the current data
2. Make changes to the CSV file
3. Save it with a new name (e.g., countries_updated.csv)
4. Run the import script to update the database
