import app from '../server/index.js';
import { initializeDatabase } from '../server/db.js';
import { seedDatabase } from '../server/seed.js';

let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    await initializeDatabase();
    await seedDatabase();
    initialized = true;
  }
  return app(req, res);
}
