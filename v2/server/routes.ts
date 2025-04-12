import { Express, Request, Response } from 'express';
import { db } from './db';
import { featureFlags } from '../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Set up API routes for the v2 platform
 * @param app Express application
 */
export async function setupRoutes(app: Express) {
  // API routes are prefixed with /v2/api
  
  // Feature flags endpoint
  app.get('/v2/api/feature-flags/:name', async (req: Request, res: Response) => {
    try {
      const { name } = req.params;
      
      const [flag] = await db
        .select()
        .from(featureFlags)
        .where(eq(featureFlags.name, name));
      
      if (!flag) {
        return res.status(404).json({
          message: `Feature flag '${name}' not found`
        });
      }
      
      res.json({
        flag,
        isEnabled: flag.isEnabled
      });
    } catch (error) {
      console.error('[v2] Error fetching feature flag:', error);
      res.status(500).json({
        message: 'Failed to fetch feature flag'
      });
    }
  });
  
  // All feature flags endpoint
  app.get('/v2/api/feature-flags', async (_req: Request, res: Response) => {
    try {
      const flags = await db.select().from(featureFlags);
      
      res.json({
        flags,
        count: flags.length
      });
    } catch (error) {
      console.error('[v2] Error fetching feature flags:', error);
      res.status(500).json({
        message: 'Failed to fetch feature flags'
      });
    }
  });

  // Health check endpoint
  app.get('/v2/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: 'v2'
    });
  });

  // Modules API stub
  app.get('/v2/api/modules', (_req: Request, res: Response) => {
    // We'll return stub data for now until we implement the actual database
    const modules = [
      {
        id: 1,
        title: "Introduction to Tariffs",
        slug: "intro-to-tariffs",
        description: "Learn about the basics of tariffs, their purpose, and how they impact global trade.",
        content: "# Introduction to Tariffs\n\nTariffs are taxes imposed on imported goods and services...",
        category: "tariffs",
        difficulty: "beginner",
        estimatedMinutes: 30,
        featured: true,
        order: 1,
        createdAt: "2025-03-15T00:00:00Z",
        updatedAt: "2025-03-15T00:00:00Z"
      },
      {
        id: 2,
        title: "Trade Agreements Fundamentals",
        slug: "trade-agreements-fundamentals",
        description: "Understand the structure and purpose of international trade agreements and their role in global commerce.",
        content: "# Trade Agreements Fundamentals\n\nTrade agreements are contracts between countries that reduce barriers to trade...",
        category: "agreements",
        difficulty: "beginner",
        estimatedMinutes: 45,
        featured: true,
        order: 2,
        createdAt: "2025-03-20T00:00:00Z",
        updatedAt: "2025-03-20T00:00:00Z"
      },
      {
        id: 3,
        title: "Advanced Tariff Classification",
        slug: "advanced-tariff-classification",
        description: "Master the complexities of the Harmonized System and learn how to properly classify goods for customs purposes.",
        content: "# Advanced Tariff Classification\n\nThe Harmonized System (HS) is an international nomenclature...",
        category: "tariffs",
        difficulty: "advanced",
        estimatedMinutes: 60,
        featured: true,
        order: 3,
        createdAt: "2025-03-25T00:00:00Z",
        updatedAt: "2025-03-25T00:00:00Z"
      }
    ];
    
    res.json({
      modules,
      categories: ["tariffs", "trade_policy", "customs", "shipping", "regulations", "agreements"],
      totalModules: modules.length
    });
  });

  // Dictionary API stub
  app.get('/v2/api/dictionary', (_req: Request, res: Response) => {
    // We'll return stub data for now until we implement the actual database
    const terms = [
      {
        id: 1,
        term: "Tariff",
        slug: "tariff",
        definition: "A tax imposed on imported goods and services. Tariffs are used to restrict trade, as they increase the price of imported goods and services, making them more expensive to consumers.",
        category: "tariffs",
        createdAt: "2025-03-15T00:00:00Z",
        updatedAt: "2025-03-15T00:00:00Z"
      },
      {
        id: 2,
        term: "Most Favored Nation (MFN)",
        slug: "most-favored-nation",
        definition: "A status or level of treatment accorded by one state to another in international trade. The term means the country which is the recipient of this treatment must receive equal trade advantages as the 'most favored nation' by the country granting such treatment.",
        category: "trade_policy",
        createdAt: "2025-03-16T00:00:00Z",
        updatedAt: "2025-03-16T00:00:00Z"
      },
      {
        id: 3,
        term: "Harmonized System (HS)",
        slug: "harmonized-system",
        definition: "An international nomenclature for the classification of products. It allows participating countries to classify traded goods on a common basis for customs purposes.",
        category: "customs",
        createdAt: "2025-03-17T00:00:00Z",
        updatedAt: "2025-03-17T00:00:00Z"
      }
    ];
    
    res.json({
      terms,
      categories: ["tariffs", "trade_policy", "customs", "shipping", "regulations", "agreements"],
      totalTerms: terms.length
    });
  });

  // Dictionary term API stub
  app.get('/v2/api/dictionary/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    
    // Sample terms
    const terms = [
      {
        id: 1,
        term: "Tariff",
        slug: "tariff",
        definition: "A tax imposed on imported goods and services. Tariffs are used to restrict trade, as they increase the price of imported goods and services, making them more expensive to consumers.",
        category: "tariffs",
        examples: [
          "A 25% tariff on imported steel",
          "Reciprocal tariffs between trading nations"
        ],
        createdAt: "2025-03-15T00:00:00Z",
        updatedAt: "2025-03-15T00:00:00Z"
      },
      {
        id: 2,
        term: "Most Favored Nation (MFN)",
        slug: "most-favored-nation",
        definition: "A status or level of treatment accorded by one state to another in international trade. The term means the country which is the recipient of this treatment must receive equal trade advantages as the 'most favored nation' by the country granting such treatment.",
        category: "trade_policy",
        examples: [
          "WTO members must extend MFN status to all other members",
          "Permanent Normal Trade Relations (PNTR) is the US term for MFN"
        ],
        createdAt: "2025-03-16T00:00:00Z",
        updatedAt: "2025-03-16T00:00:00Z"
      },
      {
        id: 3,
        term: "Harmonized System (HS)",
        slug: "harmonized-system",
        definition: "An international nomenclature for the classification of products. It allows participating countries to classify traded goods on a common basis for customs purposes.",
        category: "customs",
        examples: [
          "HS code 8471.30 for portable computers",
          "Six-digit HS codes are used globally, while countries may add additional digits for local specificity"
        ],
        createdAt: "2025-03-17T00:00:00Z",
        updatedAt: "2025-03-17T00:00:00Z"
      }
    ];
    
    const term = terms.find(t => t.slug === slug);
    
    if (!term) {
      return res.status(404).json({
        message: `Term with slug '${slug}' not found`
      });
    }
    
    // Find related terms (for demo purposes, just return other terms)
    const related = terms.filter(t => t.id !== term.id);
    
    res.json({
      term,
      related
    });
  });

  console.log('[v2] API routes initialized');
}