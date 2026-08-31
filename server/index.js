import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dbGet, dbRun, dbAll, dbTransaction, initializeDatabase } from './db.js';
import { seedDatabase } from './seed.js';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'olaflex_jwt_secret_key_2024_production';

// Middleware
app.use(cors());
app.use(express.json());

// Serve placeholder SVG
app.get('/placeholder-watch.svg', (req, res) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none">
    <rect width="400" height="400" fill="#111"/>
    <circle cx="200" cy="200" r="80" stroke="#d6ad58" stroke-width="2" fill="none"/>
    <circle cx="200" cy="200" r="6" fill="#d6ad58"/>
    <line x1="200" y1="200" x2="200" y2="145" stroke="#d6ad58" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="200" y1="200" x2="240" y2="200" stroke="#d6ad58" stroke-width="2" stroke-linecap="round"/>
    <line x1="200" y1="200" x2="175" y2="230" stroke="#d6ad58" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="190" y="100" width="20" height="20" rx="3" stroke="#d6ad58" stroke-width="1.5" fill="none"/>
    <rect x="190" y="280" width="20" height="20" rx="3" stroke="#d6ad58" stroke-width="1.5" fill="none"/>
    <text x="200" y="340" text-anchor="middle" fill="#555" font-family="serif" font-size="14" letter-spacing="4">OLAFLEX</text>
  </svg>`;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// Auth middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ===== AUTH ROUTES =====

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const user = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const user = await dbGet('SELECT id, username, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Admin: Change password
app.put('/api/auth/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await dbRun('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ===== PRODUCT ROUTES =====

// Public: Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { search, brand, category, availability, sort, featured, limit } = req.query;
    let query = 'SELECT id, name, brand, category, CAST(price AS TEXT) AS price, description, short_description, availability, stock_quantity, is_featured, specifications, reference, created_at, updated_at FROM products WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (brand) {
      query += ' AND brand = ?';
      params.push(brand);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (availability) {
      query += ' AND availability = ?';
      params.push(availability);
    }
    if (featured === 'true') {
      query += ' AND is_featured = 1';
    }

    switch (sort) {
      case 'price_asc': query += ' ORDER BY price ASC'; break;
      case 'price_desc': query += ' ORDER BY price DESC'; break;
      case 'newest': query += ' ORDER BY created_at DESC'; break;
      case 'oldest': query += ' ORDER BY created_at ASC'; break;
      default: query += ' ORDER BY created_at DESC';
    }

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const products = await dbAll(query, params);

    // Fetch primary image for each product separately
    const productIds = products.map(p => p.id);
    if (productIds.length > 0) {
      const placeholders = productIds.map(() => '?').join(',');
      const images = await dbAll(
        `SELECT * FROM product_images WHERE product_id IN (${placeholders})`,
        productIds
      );
      const imagesByProduct = {};
      images.forEach(img => {
        if (!imagesByProduct[img.product_id]) imagesByProduct[img.product_id] = [];
        imagesByProduct[img.product_id].push(img);
      });
      products.forEach(p => {
        const imgs = imagesByProduct[p.id] || [];
        const primary = imgs.find(i => i.is_primary === 1) || imgs[0];
        p.primary_image = primary ? primary.image_url : null;
        p.image_count = imgs.length;
      });
    }

    res.json(products);
  } catch (err) {
    console.error('Products fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products: ' + err.message });
  }
});

// Public: Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await dbGet(
      'SELECT id, name, brand, category, CAST(price AS TEXT) AS price, description, short_description, availability, stock_quantity, is_featured, specifications, reference, created_at, updated_at FROM products WHERE id = ?',
      [req.params.id]
    );

    if (!product) return res.status(404).json({ error: 'Product not found' });

    const images = await dbAll(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
      [req.params.id]
    );

    const related = await dbAll(
      'SELECT id, name, brand, category, CAST(price AS TEXT) AS price, description, short_description, availability, stock_quantity, is_featured, specifications, reference, created_at, updated_at FROM products WHERE brand = ? AND id != ? ORDER BY created_at DESC LIMIT 3',
      [product.brand, product.id]
    );
    // Add primary image to related products
    if (related.length > 0) {
      const relIds = related.map(r => r.id).join(',');
      const relImages = await dbAll(
        `SELECT * FROM product_images WHERE product_id IN (${relIds})`,
        related.map(r => r.id)
      );
      related.forEach(r => {
        const primary = relImages.find(i => i.product_id === r.id && i.is_primary === 1) || relImages.find(i => i.product_id === r.id);
        r.primary_image = primary ? primary.image_url : null;
      });
    }

    res.json({ ...product, images, related });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Public: Get brands
app.get('/api/brands', async (req, res) => {
  try {
    const brands = await dbAll('SELECT DISTINCT brand FROM products ORDER BY brand');
    res.json(brands.map(b => b.brand));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// Admin: Create product
app.post('/api/products', async (req, res) => {
  try {
    const { name, brand, category, price, description, short_description, availability, stock_quantity, is_featured, specifications, reference, image_url } = req.body;

    if (!name || !brand || !price) {
      return res.status(400).json({ error: 'Name, brand, and price are required' });
    }

    const result = await dbRun(
      `INSERT INTO products (name, brand, category, price, description, short_description, availability, stock_quantity, is_featured, specifications, reference)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, brand, category || 'watches', price,
        description || '', short_description || '',
        availability || 'in_stock', stock_quantity || 0,
        is_featured ? 1 : 0,
        specifications ? JSON.stringify(specifications) : '{}',
        reference || ''
      ]
    );

    // If an image URL was provided, add it
    if (image_url) {
      await dbRun(
        'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)',
        [result.lastInsertRowid, image_url, 1, 0]
      );
    }

    const product = await dbGet('SELECT id, name, brand, category, CAST(price AS TEXT) AS price, description, short_description, availability, stock_quantity, is_featured, specifications, reference, created_at, updated_at FROM products WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(product);
  } catch (err) {
    console.error('Product create error:', err.message);
    res.status(500).json({ error: 'Failed to create product: ' + err.message });
  }
});

// Admin: Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const existing = await dbGet('SELECT id, name, brand, category, CAST(price AS TEXT) AS price, description, short_description, availability, stock_quantity, is_featured, specifications, reference, created_at, updated_at FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const { name, brand, category, price, description, short_description, availability, stock_quantity, is_featured, specifications, reference } = req.body;

    await dbRun(
      `UPDATE products SET
        name = ?, brand = ?, category = ?, price = ?, description = ?,
        short_description = ?, availability = ?, stock_quantity = ?,
        is_featured = ?, specifications = ?, reference = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        name || existing.name,
        brand || existing.brand,
        category || existing.category,
        price || existing.price,
        description !== undefined ? description : existing.description,
        short_description !== undefined ? short_description : existing.short_description,
        availability || existing.availability,
        stock_quantity !== undefined ? stock_quantity : existing.stock_quantity,
        is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
        specifications ? JSON.stringify(specifications) : existing.specifications,
        reference !== undefined ? reference : existing.reference,
        req.params.id
      ]
    );

    const product = await dbGet('SELECT id, name, brand, category, CAST(price AS TEXT) AS price, description, short_description, availability, stock_quantity, is_featured, specifications, reference, created_at, updated_at FROM products WHERE id = ?', [req.params.id]);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Admin: Delete ALL products
app.delete('/api/admin/products', async (req, res) => {
  try {
    await dbRun('DELETE FROM product_images');
    await dbRun('DELETE FROM products');
    res.json({ message: 'All products deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete all products' });
  }
});

// Admin: Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const existing = await dbGet('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    await dbRun('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);
    await dbRun('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ===== IMAGE ROUTES (URL-based) =====

// Add image URL for a product
app.post('/api/products/:id/images', async (req, res) => {
  try {
    const product = await dbGet('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { image_url } = req.body;
    if (!image_url) return res.status(400).json({ error: 'image_url is required' });

    const existingCount = await dbGet('SELECT COUNT(*) as count FROM product_images WHERE product_id = ?', [req.params.id]);

    const isPrimary = Number(existingCount.count) === 0 ? 1 : 0;
    const result = await dbRun(
      'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)',
      [req.params.id, image_url, isPrimary, Number(existingCount.count)]
    );

    res.status(201).json({ id: result.lastInsertRowid, image_url, is_primary: isPrimary });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add image' });
  }
});

// Set primary image
app.put('/api/images/:id/primary', async (req, res) => {
  try {
    const image = await dbGet('SELECT * FROM product_images WHERE id = ?', [req.params.id]);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    await dbRun('UPDATE product_images SET is_primary = 0 WHERE product_id = ?', [image.product_id]);
    await dbRun('UPDATE product_images SET is_primary = 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Primary image updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update primary image' });
  }
});

// Delete image
app.delete('/api/images/:id', async (req, res) => {
  try {
    const image = await dbGet('SELECT * FROM product_images WHERE id = ?', [req.params.id]);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    await dbRun('DELETE FROM product_images WHERE id = ?', [req.params.id]);

    // If deleted was primary, make first remaining image primary
    if (image.is_primary) {
      const next = await dbGet(
        'SELECT id FROM product_images WHERE product_id = ? ORDER BY sort_order LIMIT 1',
        [image.product_id]
      );
      if (next) {
        await dbRun('UPDATE product_images SET is_primary = 1 WHERE id = ?', [next.id]);
      }
    }

    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// ===== DASHBOARD STATS =====

app.get('/api/admin/stats', async (req, res) => {
  try {
    const total = await dbGet('SELECT COUNT(*) as count FROM products');
    const inStock = await dbGet("SELECT COUNT(*) as count FROM products WHERE availability = 'in_stock'");
    const lowStock = await dbGet("SELECT COUNT(*) as count FROM products WHERE availability = 'low_stock'");
    const outOfStock = await dbGet("SELECT COUNT(*) as count FROM products WHERE availability = 'out_of_stock'");
    const featured = await dbGet('SELECT COUNT(*) as count FROM products WHERE is_featured = 1');

    const recent = await dbAll('SELECT id, name, brand, category, CAST(price AS TEXT) AS price, description, short_description, availability, stock_quantity, is_featured, specifications, reference, created_at, updated_at FROM products ORDER BY created_at DESC LIMIT 5');
    if (recent.length > 0) {
      const rIds = recent.map(r => r.id).join(',');
      const rImages = await dbAll(`SELECT * FROM product_images WHERE product_id IN (${rIds})`);
      recent.forEach(r => {
        const primary = rImages.find(i => i.product_id === r.id && i.is_primary === 1) || rImages.find(i => i.product_id === r.id);
        r.primary_image = primary ? primary.image_url : null;
      });
    }

    const brands = await dbAll('SELECT DISTINCT brand, COUNT(*) as count FROM products GROUP BY brand ORDER BY count DESC');

    res.json({
      total: Number(total.count),
      inStock: Number(inStock.count),
      lowStock: Number(lowStock.count),
      outOfStock: Number(outOfStock.count),
      featured: Number(featured.count),
      recent,
      brands
    });
  } catch (err) {
    console.error('Stats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch stats: ' + err.message });
  }
});

// ===== HEALTH CHECK (no auth needed) =====
app.get('/api/health', async (req, res) => {
  try {
    const user = await dbGet('SELECT id FROM users WHERE username = ?', ['olaflex1']);
    res.json({
      status: 'ok',
      database: 'connected',
      adminExists: !!user,
      tursoUrl: process.env.TURSO_DATABASE_URL ? 'set' : 'not set (using local file)',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: err.message,
      tursoUrl: process.env.TURSO_DATABASE_URL ? 'set' : 'not set (using local file)',
    });
  }
});

// ===== GLOBAL ERROR HANDLER (must be last) =====
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err.message || err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== INIT & START (local dev only) =====

async function startServer() {
  await initializeDatabase();
  await seedDatabase();
  const PORT = process.env.PORT || 3001;
  const port = PORT === '0' || PORT === 0 ? 3001 : PORT;
  app.listen(port, '0.0.0.0', () => {
    console.log(`OLAFLEX API running on port ${port}`);
  });
}

// Only start the server when running directly (not imported by Vercel)
const isVercel = process.env.VERCEL;
if (!isVercel) {
  startServer().catch(console.error);
}

export default app;
