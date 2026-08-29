import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { productsAPI, brandsAPI } from '../services/api.js';
import { formatPrice, getImageUrl, getAvailabilityLabel } from '../utils/helpers.js';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (brand) params.brand = brand;
      if (category) params.category = category;
      if (availability) params.availability = availability;
      if (sort) params.sort = sort;
      const data = await productsAPI.getAll(params);
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, brand, category, availability, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { brandsAPI.getAll().then(setBrands).catch(console.error); }, []);

  const clearFilters = () => {
    setSearch(''); setBrand(''); setCategory(''); setAvailability(''); setSort('newest');
  };

  const hasActiveFilters = search || brand || category || availability;

  return (
    <>
      <Helmet>
        <title>Collection — OLAFLEX</title>
        <meta name="description" content="Browse the OLAFLEX collection of premium luxury watches." />
      </Helmet>

      {/* Header */}
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 bg-white">
        <div className="max-w-7xl mx-auto text-center px-5 sm:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-ink"
          >
            Shop <span className="italic text-brand-500">Timepieces</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 text-ink-muted text-lg"
          >
            Find your perfect statement piece.
          </motion.p>
        </div>
      </section>

      <section className="pb-24 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search watches..."
                  className="w-full px-4 py-3 bg-surface-alt border border-border text-ink text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="sm:hidden flex items-center justify-center gap-2 px-5 py-3 bg-surface-alt border border-border text-sm text-ink-secondary hover:text-ink transition-colors"
              >
                <SlidersHorizontal size={16} /> Filters
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-brand-500" />}
              </button>
              <div className="hidden sm:flex items-center gap-3">
                <select value={brand} onChange={(e) => setBrand(e.target.value)} className="px-4 py-3 bg-surface-alt border border-border text-ink text-sm outline-none focus:border-brand-400">
                  <option value="">All Brands</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-3 bg-surface-alt border border-border text-ink text-sm outline-none focus:border-brand-400">
                  <option value="">All Categories</option>
                  <option value="luxury">Luxury</option>
                  <option value="sport">Sport</option>
                  <option value="casual">Casual</option>
                </select>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-3 bg-surface-alt border border-border text-ink text-sm outline-none focus:border-brand-400">
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-3 text-xs text-ink-muted hover:text-ink transition-colors">
                    <X size={14} /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Mobile filters */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="sm:hidden overflow-hidden"
                >
                  <div className="p-4 bg-surface-alt border border-border space-y-3 mt-2">
                    <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full px-4 py-3 bg-white border border-border text-ink text-sm outline-none">
                      <option value="">All Brands</option>
                      {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-white border border-border text-ink text-sm outline-none">
                      <option value="">All Categories</option>
                      <option value="luxury">Luxury</option>
                      <option value="sport">Sport</option>
                      <option value="casual">Casual</option>
                    </select>
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-4 py-3 bg-white border border-border text-ink text-sm outline-none">
                      <option value="newest">Newest</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-sm text-ink-muted mt-4">
              {loading ? 'Loading...' : <>{products.length} product{products.length !== 1 ? 's' : ''} found</>}
            </p>
          </motion.div>

          {/* Product grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={`/product/${product.id}`} className="group block">
                    <div className="aspect-square bg-surface-alt rounded-2xl overflow-hidden mb-4 relative">
                      <img
                        src={getImageUrl(product.primary_image)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      {product.is_featured === 1 && (
                        <div className="absolute top-3 left-3 bg-brand-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1">
                          Featured
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-ink-muted font-medium">{product.brand}</p>
                    <h3 className="text-sm font-semibold text-ink mt-1 group-hover:text-brand-600 transition-colors line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-lg font-bold text-ink">{formatPrice(product.price)}</p>
                    </div>
                    <div className="mt-2">
                      <span className={`text-[10px] uppercase tracking-wider font-medium ${
                        product.availability === 'in_stock' ? 'text-status-in-stock' :
                        product.availability === 'low_stock' ? 'text-status-low-stock' : 'text-status-out'
                      }`}>
                        {getAvailabilityLabel(product.availability)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-ink-muted text-sm">No products match your filters.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
