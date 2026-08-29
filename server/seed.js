import bcrypt from 'bcryptjs';
import { dbGet, dbRun, dbAll, dbTransaction } from './db.js';

export async function seedDatabase() {
  // Create admin user
  const existingUser = await dbGet('SELECT id FROM users WHERE username = ?', ['olaflex1']);

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('olaflex', 12);
    await dbRun(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      ['olaflex1', hashedPassword, 'admin']
    );
    console.log('✓ Admin user created (olaflex1 / olaflex)');
  } else {
    console.log('✓ Admin user already exist');
  }

  // No products seeded — start with empty store
}

// Run if called directly
if (process.argv[1] && process.argv[1].includes('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('Database seeded successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
