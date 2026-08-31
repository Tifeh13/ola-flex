import app from '../server/index.js';
import { initializeDatabase } from '../server/db.js';
import { seedDatabase } from '../server/seed.js';

let initialized = false;

export default async function handler(req, res) {
  // Ensure every response is JSON, even on catastrophic failure
  try {
    if (!initialized) {
      await initializeDatabase();
      await seedDatabase();
      initialized = true;
    }
  } catch (err) {
    console.error('Database init failed:', err.message);
    // Mark initialized so we don't retry on every request in warm instances
    initialized = true;
    // Don't return yet — on warm starts the tables already exist,
    // so the Express app can still handle the request.
  }

  try {
    // Express expects certain node-like properties on the request/response
    // Vercel's serverless provides raw Node req/res — this should work.
    return app(req, res);
  } catch (err) {
    console.error('Express handler crashed:', err.message);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({ error: 'Internal server error: ' + err.message });
    }
  }
}
