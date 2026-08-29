import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { productsAPI } from '../services/api.js';
import { formatPrice, getAvailabilityLabel, getImageUrl } from '../utils/helpers.js';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    productsAPI.getAll().then(setProducts).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted successfully');
      setDeleteId(null);
      setDeleteName('');
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  return (
    <>
      <Helmet><title>Products — OLAFLEX Admin</title></Helmet>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Products</h1>
            <p className="mt-1 text-sm text-ink-muted">{products.length} product{products.length !== 1 ? 's' : ''}</p>
          </motion.div>
          <Link to="/admin/products/new" className="btn-gold text-xs py-2.5 px-5"><Plus size={14} /> Add Product</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="mt-8 border border-border overflow-hidden bg-surface-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-alt">
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-medium">Product</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-medium hidden sm:table-cell">Brand</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-medium">Price</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-medium hidden md:table-cell">Status</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-medium hidden lg:table-cell">Featured</th>
                    <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-ink-muted font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
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
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {product.is_featured === 1 && <Star size={14} className="text-brand-500 fill-brand-500" />}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <a href={`/product/${product.id}`} target="_blank" className="p-2 text-ink-muted hover:text-ink transition-colors rounded hover:bg-surface-alt" title="View">
                            <Eye size={15} />
                          </a>
                          <Link to={`/admin/products/${product.id}/edit`} className="p-2 text-ink-muted hover:text-brand-500 transition-colors rounded hover:bg-brand-50" title="Edit">
                            <Pencil size={15} />
                          </Link>
                          <button onClick={() => confirmDelete(product.id, product.name)} className="p-2 text-ink-muted hover:text-status-out transition-colors rounded hover:bg-red-50" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm" onClick={() => !deleting && setDeleteId(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-card border border-border p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={18} className="text-status-out" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">Delete "{deleteName}"?</h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                This product will be permanently removed from your store. This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setDeleteId(null)} disabled={deleting}
                  className="flex-1 py-2.5 border border-border text-sm text-ink-secondary hover:text-ink hover:border-ink/30 transition-colors font-medium disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteId)} disabled={deleting}
                  className="flex-1 py-2.5 bg-status-out text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
                  {deleting ? 'Deleting...' : 'Delete Product'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
