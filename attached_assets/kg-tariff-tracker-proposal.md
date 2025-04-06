# TariffSmart Application: Product Planning Document

## Product Concept
A consumer-facing application designed to help everyday people understand and navigate the impact of the recently announced US "reciprocal tariffs" on imported goods.

## Problem Statement
The US government has announced reciprocal tariffs in April 2025 that will significantly impact consumer prices across many product categories. These tariffs include:
- A baseline 10% tariff on all imports
- Country-specific "reciprocal" tariffs that vary widely (10% to 54%)
- Implementation on different timelines (starting April 5th and 9th, 2025)

Consumers need help understanding how these policies will affect their purchasing power and budgets.

## Key Consumer Problems Identified

1. **Price Impact Uncertainty**: Consumers can't easily predict which products will increase in price and by how much
2. **Budgeting Challenges**: Families need to adjust household budgets to accommodate potential price increases
3. **Shopping Decision Complexity**: Different tariff rates by country of origin make price comparisons difficult
4. **Timeline Confusion**: Varying implementation dates create uncertainty about when price changes will occur
5. **Alternative Product Options**: Consumers need help finding affordable alternatives to heavily tariffed goods
6. **Product Availability Concerns**: Supply chain disruptions may affect product availability
7. **Business Impact Information**: Small business owners need to understand how tariffs might affect their operations

## Proposed Features

1. **Personalized Impact Calculator**: Users enter typical purchases to see estimated tariff impact on their budget
2. **Product Price Prediction Tool**: Database showing expected price changes by product category and country of origin
3. **Alternative Product Finder**: Suggestions for domestic alternatives to highly-tariffed imported products
4. **Timeline Visualizer**: Clear information about implementation dates and expected retail price change timing
5. **Local Business Impact Map**: Shows how tariffs affect businesses in the user's geographic area
6. **Real-time Price Tracking**: Monitors actual price changes to confirm tariff impact predictions
7. **Email Alerts**: Notifications about tariff changes relevant to user's tracked products and categories

## Data Architecture

### Essential Data Sources
1. **Official Government Tariff Data**
   - US International Trade Commission's Harmonized Tariff Schedule
   - USTR published tariff lists
   - Customs and Border Protection import data
   - Federal Register for official announcements

2. **Product Information**
   - Product category databases (HS codes)
   - Country of origin data
   - Retailer inventory APIs
   - Manufacturer information

3. **Price Data**
   - Bureau of Labor Statistics CPI data
   - Commercial price tracking APIs
   - Retailer website data
   - Point-of-sale aggregators

4. **Economic Impact Data**
   - Industry association reports
   - Economic research publications
   - Supply chain analysis
   - Financial institution reports

5. **Alternative Product Information**
   - Made in USA product databases
   - Manufacturer associations
   - Retail inventory APIs

### Data Flow Architecture
Detailed data flow diagrams for each feature, including:
- User input collection
- Data processing pipelines
- Analysis engines
- Visualization layers
- Alert systems

## Development Phases

1. **MVP (Minimum Viable Product)**
   - Basic tariff database
   - Simple impact calculator
   - Initial product category coverage
   - Web analytics instrumentation using Google Analytics to understand user behavior
   - Feature flags with the ability to turn selected features off
   - Initial setup and preparation for Role-based authentication to be implemented later in Phase 2

2. **Phase 2**
   - Price prediction integration
   - Alternative product finder
   - Expanded product categories
   - Google ad banners
   - Role based authentication using Google OAuth

3. **Phase 3**
   - Local business impact map
   - Advanced analytics
   - API for third-party integrations

## Monetization Strategy

### Hybrid Approach Recommended
1. **Free Tier with Ads**
   - Basic tariff lookup by product category
   - Limited product tracking (5-10 items)
   - General impact calculator
   - Weekly email digest
   - Ad-supported

2. **Premium Tier ($4.99-$7.99/month)**
   - Unlimited product tracking
   - Detailed impact reports
   - Ad-free experience
   - Daily price change alerts
   - Alternative product recommendations
   - Export capabilities

3. **Professional Tier ($14.99-$19.99/month)**
   - All Premium features
   - API access
   - Local business impact insights
   - Advanced predictive analytics
   - Historical trend analysis
   - Custom reports

4. **Enterprise Tier ($99-$499/month)**
   - Custom business solutions
   - Bulk import analysis
   - Supply chain impact assessment
   - White-labeled reports
   - Dedicated account support

### Additional Revenue Streams
- Affiliate partnerships with domestic manufacturers
- Data licensing to research firms
- API access fees
- Sponsored content opportunities
- Custom business reports
