import { Express, Request, Response } from 'express';
import { db } from './db';
import { featureFlags, learningModules, dictionaryTerms } from '../shared/schema';
import { eq, not, sql } from 'drizzle-orm';

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

  // Modules API - Get all modules
  app.get('/v2/api/modules', async (req: Request, res: Response) => {
    try {
      const modules = await db.select().from(learningModules);
      
      // Extract unique categories
      const categories = [...new Set(modules.map(module => module.category))];
      
      res.json({
        modules,
        categories,
        totalModules: modules.length
      });
    } catch (error) {
      console.error('[v2] Error fetching modules:', error);
      res.status(500).json({
        message: 'Failed to fetch modules'
      });
    }
  });
  
  // Get module by slug
  app.get('/v2/api/modules/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      
      const [module] = await db
        .select()
        .from(learningModules)
        .where(eq(learningModules.slug, slug));
      
      if (!module) {
        return res.status(404).json({
          message: `Module with slug '${slug}' not found`
        });
      }
      
      // Get related modules (same category, excluding current module)
      const relatedModules = await db
        .select()
        .from(learningModules)
        .where(eq(learningModules.category, module.category))
        .where(not(eq(learningModules.id, module.id)))
        .limit(3);
      
      res.json({
        module,
        related: relatedModules
      });
    } catch (error) {
      console.error('[v2] Error fetching module:', error);
      res.status(500).json({
        message: 'Failed to fetch module'
      });
    }
  });

  // Dictionary API - Get all terms
  app.get('/v2/api/dictionary', async (_req: Request, res: Response) => {
    try {
      const terms = await db.select().from(dictionaryTerms);
      
      // Extract unique categories
      const categories = [...new Set(terms.map(term => term.category))];
      
      res.json({
        terms,
        categories,
        totalTerms: terms.length
      });
    } catch (error) {
      console.error('[v2] Error fetching dictionary terms:', error);
      res.status(500).json({
        message: 'Failed to fetch dictionary terms'
      });
    }
  });

  // Dictionary term API - Get term by slug
  app.get('/v2/api/dictionary/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      
      const [term] = await db
        .select()
        .from(dictionaryTerms)
        .where(eq(dictionaryTerms.slug, slug));
      
      if (!term) {
        return res.status(404).json({
          message: `Term with slug '${slug}' not found`
        });
      }
      
      // Get related terms based on the related_terms array in the current term
      let related = [];
      if (term.relatedTerms && term.relatedTerms.length > 0) {
        related = await db
          .select()
          .from(dictionaryTerms)
          .where(sql`${dictionaryTerms.slug} = ANY(${term.relatedTerms})`);
      }
      
      // If no related terms found or none defined, get terms from the same category
      if (related.length === 0) {
        related = await db
          .select()
          .from(dictionaryTerms)
          .where(eq(dictionaryTerms.category, term.category))
          .where(not(eq(dictionaryTerms.id, term.id)))
          .limit(3);
      }
      
      res.json({
        term,
        related
      });
    } catch (error) {
      console.error('[v2] Error fetching dictionary term:', error);
      res.status(500).json({
        message: 'Failed to fetch dictionary term'
      });
    }
  });

  console.log('[v2] API routes initialized');
}