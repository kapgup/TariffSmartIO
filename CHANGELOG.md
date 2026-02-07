# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-02-06

### Security
- Resolved **Critical** vulnerability in `form-data`.
- Resolved **High** severity vulnerabilities in `qs`, `axios`, and `glob`.
- Updated `esbuild`, `drizzle-kit`, and `react-syntax-highlighter` to resolve Moderate/High transitive vulnerabilities in `PrismJS`.

### Fixed
- Resolved type regressions in server and authentication modules caused by stricter dependency types (Vite, Passport, Drizzle ORM).
- Fixed deprecated properties in Vite server configuration.

## [1.0.0] - Initial Release
- Initial project setup with Express, Vite, and Drizzle.
