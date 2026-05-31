import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono();

// Simple test endpoint
app.get('/api/v2/test', (c) => {
  return c.json({ success: true, message: 'API is working!' });
});

// Try to import your actual app with error handling
let routesLoaded = false;
try {
  const hiAnimeRoutes = require('../src/routes/routes').default;
  app.route('/api/v2', hiAnimeRoutes);
  routesLoaded = true;
} catch (err) {
  app.get('/api/v2/error', (c) => {
    return c.json({ 
      success: false, 
      error: 'Routes failed to load',
      details: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : null
    });
  });
}

app.get('/api/v2/status', (c) => {
  return c.json({ 
    success: true, 
    routesLoaded,
    nodeVersion: process.version
  });
});

export default handle(app);
