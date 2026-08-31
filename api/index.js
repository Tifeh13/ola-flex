import app from '../server/index.js';
import { initializeDatabase } from '../server/db.js';
import { seedDatabase } from '../server/seed.js';

let initialized = false;
let initError = null;

export default async function handler(req, res) {
  try {
    if (!initialized && !initError) {
      try {
        await initializeDatabase();
        await seedDatabase();
        initialized = true;
      } catch (err) {
        console.error('Database initialization failed:', err.message);
        initError = err;
        // Still try to serve the request — tables may already exist on warm starts
        initialized = true;
      }
    }
    return app(req, res);
  } catch (err) {
    console.error('Handler error:', err.message);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
