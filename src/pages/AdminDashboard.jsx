import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, AlertTriangle, Star, Plus, Store, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { statsAPI, productsAPI } from '../services/api.js';
import { formatPrice, getAvailabilityLabel, getImageUrl } from '../utils/helpers.js';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchStats = () => statsAPI.get().then(setStats).catch(console.error).finally(() => setLoading(false));

  useEffect(() => { fetchStats(); }, []);

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      await productsAPI.deleteAll();
      toast.success('All products deleted');
      setShowDeleteAll(false);
      fetchStats();
    } catch (err) {
      toast.error(err.message || 'Failed to delete products');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" /></div>;

  const statCards = [
    { label: 'Total Products', value: stats?.total || 0, icon: Package, color: 'text-brand-500', bg: 'bg-brand-50' },
    { label: 'In Stock', value: stats?.inStock || 0, icon: ShoppingCart, color: 'text-status-in-stock', bg: 'bg-green-50' },
    { label: 'Low Stock', value: stats?.lowStock || 0, icon: AlertTriangle, color: 'text-status-low-stock', bg: 'bg-amber-50' },
    { label: 'Featured', value: stats?.featured || 0, icon: Star, color: 'text-brand-500', bg: 'bg-brand-50' },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard — OLAFLEX</title></Helmet>
      <div className="max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-muted">Welcome back to OLAFLEX Admin.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {statCards.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}
              className="p-5 border border-border bg-surface-card">
              <div className={`w-8 h-8 ${stat.bg} rounded flex items-center justify-center mb-3`}>
                <stat.icon size={16} className={stat.color} />
              </div>
              <div className="text-2xl font-bold text-ink">{stat.value}</div>
              <div className="text-xs text-ink-muted mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          <Link to="/admin/products/new" className="btn-gold text-xs py-2.5 px-5"><Plus size={14} /> Add Product</Link>
          <Link to="/admin/products" className="btn-outline text-xs py-2.5 px-5"><Package size={14} /> Manage Products</Link>
          <a href="/" target="_blank" className="btn-outline text-xs py-2.5 px-5"><Store size={14} /> View Store</a>
          {stats?.total > 0 && (
            <button onClick={() => setShowDeleteAll(true)} className="text-xs py-2.5 px-5 border border-red-200 text-status-out hover:bg-red-50 transition-colors flex items-center gap-2 font-medium">
              <Trash2 size={14} /> Delete All Products
            </button>
          )}
        </div>

        {stats?.recent?.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Recent Products</h2>
            <div className="border border-border overflow-hidden bg-surface-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface-alt">
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-medium">Product</th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-medium hidden sm:table-cell">Brand</th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-medium">Price</th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-medium hidden md:table-cell">Status</th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent.map((product) => (
                      <tr key={product.id} className="border-b border-border-light hover:bg-surface-alt/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-surface-alt border border-border flex-shrink-0 overflow-hidden">
                              <img src={getImageUrl(product.primary_image)} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-sm text-ink font-medium">{product.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-ink-muted hidden sm:table-cell">{product.brand}</td>
                        <td className="px-4 py-3 text-sm text-ink font-medium">{formatPrice(product.price)}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-xs ${product.availability === 'in_stock' ? 'text-status-in-stock' : product.availability === 'low_stock' ? 'text-status-low-stock' : 'text-status-out'}`}>
                            {getAvailabilityLabel(product.availability)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link to={`/admin/products/${product.id}/edit`} className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">Edit</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {stats?.brands?.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Brands</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {stats.brands.map((brand) => (
                <div key={brand.brand} className="p-4 border border-border bg-surface-card">
                  <div className="text-sm text-ink font-medium">{brand.brand}</div>
                  <div className="text-xs text-ink-muted mt-1">{brand.count} product{brand.count !== 1 ? 's' : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete All Confirmation Modal */}
      {showDeleteAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteAll(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-card border border-border p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-status-out" />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink">Delete All Products?</h3>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              This will permanently remove all {stats?.total || 0} products from your store. This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDeleteAll(false)} disabled={deleting}
                className="flex-1 py-2.5 border border-border text-sm text-ink-secondary hover:text-ink hover:border-ink/30 transition-colors font-medium disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleDeleteAll} disabled={deleting}
                className="flex-1 py-2.5 bg-status-out text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
                {deleting ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
