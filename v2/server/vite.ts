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
      server: { middlewareMode: true },
      appType: 'spa',
      root: path.resolve(__dirname, '../client')
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
    
    // Handle all other routes for SPA
    app.use('/v2*', async (req: Request, res: Response, next: NextFunction) => {
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
    app.use('/v2', express.static(distPath, { index: false }));
    
    // Serve index.html for all other routes
    app.get('/v2*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }
}

/**
 * Serve static files from the client/public directory
 */
export function serveStatic(app: Express) {
  const publicPath = path.resolve(__dirname, '../client/public');
  
  // Use a specific path for v2 static assets
  app.use('/v2/assets', express.static(publicPath));
}