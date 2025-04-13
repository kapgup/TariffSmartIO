import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import { Server } from 'http';
import path from 'path';
import fs from 'fs';

/**
 * Log a message with an optional source tag
 */
export function log(message: string, source = "v2-express") {
  console.log(`[${source}] ${message}`);
}

/**
 * Set up Vite for development mode
 */
export async function setupVite(app: Express, server: Server) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: {
          server,
          clientPort: 443,
          host: '5a6bca4a-2b7c-4dbe-adbb-6c6324cb6c03-00-24h17hqacvzwc.spock.replit.dev'
        },
        host: '0.0.0.0',
        cors: true
      },
      appType: 'spa',
      root: path.resolve(__dirname, '../client')
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
    
    // Handle remaining v2 routes for SPA (after our static routes)
    app.use('/v2*', async (req: Request, res: Response, next: NextFunction) => {
      // Skip if we're accessing known static paths
      if (req.path.startsWith('/v2/modules/') || 
          req.path.startsWith('/v2/dictionary/') || 
          req.path === '/v2/modules' || 
          req.path === '/v2/dictionary' ||
          req.path === '/v2') {
        return next();
      }
      
      try {
        const indexPath = path.resolve(__dirname, '../client/index.html');
        
        // Read the index.html
        let html = fs.readFileSync(indexPath, 'utf-8');
        
        // Apply Vite HTML transforms
        html = await vite.transformIndexHtml(req.url, html);
        
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        const error = e as Error;
        vite.ssrFixStacktrace(error);
        next(error);
      }
    });
  } else {
    // In production, serve the built files
    const distPath = path.resolve(__dirname, '../client/dist');
    const clientPath = path.resolve(__dirname, '../client');
    
    app.use('/v2', express.static(distPath, { index: false }));
    
    // Handle remaining routes - but give priority to our specific routes
    app.get('/v2*', (req: Request, res: Response) => {
      // Skip if we're accessing known static paths that are handled elsewhere
      if (req.path.startsWith('/v2/modules/') || 
          req.path.startsWith('/v2/dictionary/') || 
          req.path === '/v2/modules' || 
          req.path === '/v2/dictionary') {
        return;
      }
      
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }
}

/**
 * Serve static files from the client directory
 */
export function serveStatic(app: Express) {
  const publicPath = path.resolve(__dirname, '../client/public');
  const clientPath = path.resolve(__dirname, '../client');
  
  // Use a specific path for v2 static assets
  app.use('/v2/assets', express.static(publicPath));
  
  // Serve static HTML files from modules directory
  app.get('/v2/modules', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(clientPath, 'modules/index.html'));
  });

  app.get('/v2/modules/:moduleName', (req: Request, res: Response) => {
    const moduleName = req.params.moduleName;
    const modulePath = path.resolve(clientPath, `modules/${moduleName}`);
    res.sendFile(modulePath);
  });

  // Serve static HTML files from dictionary directory
  app.get('/v2/dictionary', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(clientPath, 'dictionary/index.html'));
  });

  app.get('/v2/dictionary/:termName', (req: Request, res: Response) => {
    const termName = req.params.termName;
    const termPath = path.resolve(clientPath, `dictionary/${termName}`);
    res.sendFile(termPath);
  });
}