import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Link as LinkIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { productsAPI, imagesAPI } from '../services/api.js';
import ImageUpload from '../components/ImageUpload.jsx';
import PriceInput from '../components/PriceInput.jsx';
import toast from 'react-hot-toast';

const emptySpecs = { 'Case Material': '', 'Diameter': '', 'Movement': '', 'Water Resistance': '', 'Crystal': '', 'Strap': '' };

export default function AddProduct() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', brand: '', category: 'watches', price: '',
    description: '', short_description: '', availability: 'in_stock',
    stock_quantity: 0, is_featured: false, reference: '',
  });
  const [specs, setSpecs] = useState(emptySpecs);
  const [images, setImages] = useState([]); // Array of URLs (strings)
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleAddImage = (url) => {
    setImages(prev => [...prev, url]);
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (!urlInput.match(/^https?:\/\/.+/)) { toast.error('Please enter a valid URL'); return; }
    handleAddImage(urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
  };

  // Memoized so this array only gets recreated when `images` actually changes,
  // not on every keystroke elsewhere in the form (e.g. typing the description).
  const uploadImages = useMemo(
    () => images.map((url, i) => ({ id: i, image_url: url, is_primary: i === 0 ? 1 : 0 })),
    [images]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.price) { toast.error('Name, brand, and price are required'); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem('olaflex_token');
      if (!token) { toast.error('You are not logged in. Please log in first.'); navigate('/admin/login'); return; }
      const priceNum = parseInt(String(form.price).replace(/[^0-9]/g, ''), 10);
      if (isNaN(priceNum) || priceNum <= 0) { toast.error('Please enter a valid price'); setSaving(false); return; }
      const stockNum = parseInt(String(form.stock_quantity).replace(/[^0-9]/g, ''), 10);
      const product = await productsAPI.create({
        name: form.name,
        brand: form.brand,
        category: form.category,
        price: priceNum,
        description: form.description,
        short_description: form.short_description,
        availability: form.availability,
        stock_quantity: isNaN(stockNum) ? 0 : stockNum,
        is_featured: form.is_featured,
        specifications: specs,
        reference: form.reference,
        image_url: images[0] || undefined,
      });
      // Upload remaining images
      for (let i = 1; i < images.length; i++) {
        await imagesAPI.upload(product.id, { image_url: images[i] });
      }
      toast.success('Product created!');
      navigate('/admin/products');
    } catch (err) {
      console.error('Create product error:', err);
      toast.error(err.message || 'Failed to create product');
    } finally { setSaving(false); }
  };

  return (
    <>
      <Helmet><title>Add Product — OLAFLEX Admin</title></Helmet>
      <div className="max-w-3xl">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Add Product</h1>
          <p className="mt-1 text-sm text-ink-muted">Create a new product listing.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Images */}
          <div className="p-5 border border-border bg-surface-card">
            <label className="block text-[10px] uppercase tracking-wider text-brand-500 mb-3 font-medium">Product Images</label>
            <ImageUpload
              images={uploadImages}
              onAdd={handleAddImage}
              onRemove={handleRemoveImage}
              maxImages={10}
            />

            {/* URL input */}
            <div className="mt-3">
              {!showUrlInput ? (
                <button type="button" onClick={() => setShowUrlInput(true)} className="text-[11px] text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
                  <LinkIcon size={12} /> Or paste image URL
                </button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/watch.jpg"
                    className="input-luxury flex-1 text-xs"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
                  />
                  <button type="button" onClick={handleAddUrl} className="btn-gold text-xs py-2 px-3">Add</button>
                  <button type="button" onClick={() => { setShowUrlInput(false); setUrlInput(''); }} className="text-xs text-ink-muted hover:text-ink px-2">Cancel</button>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-5 border border-border bg-surface-card">
            <label className="block text-[10px] uppercase tracking-wider text-brand-500 mb-3 font-medium">Product Details</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs text-ink-muted mb-1">Name *</label><input value={form.name} onChange={e => set('name', e.target.value)} required className="input-luxury" /></div>
              <div><label className="block text-xs text-ink-muted mb-1">Brand *</label><input value={form.brand} onChange={e => set('brand', e.target.value)} required className="input-luxury" /></div>
              <div><label className="block text-xs text-ink-muted mb-1">Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className="select-luxury w-full">
                  <option value="watches">Watches</option><option value="luxury">Luxury</option><option value="sport">Sport</option><option value="casual">Casual</option>
                </select>
              </div>
              <div><label className="block text-xs text-ink-muted mb-1">Price (₦) *</label><PriceInput value={form.price} onChange={val => set('price', val)} required /></div>
              <div><label className="block text-xs text-ink-muted mb-1">Reference</label><input value={form.reference} onChange={e => set('reference', e.target.value)} className="input-luxury" /></div>
              <div><label className="block text-xs text-ink-muted mb-1">Availability</label>
                <select value={form.availability} onChange={e => set('availability', e.target.value)} className="select-luxury w-full">
                  <option value="in_stock">In Stock</option><option value="low_stock">Low Stock</option><option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              <div><label className="block text-xs text-ink-muted mb-1">Stock Quantity</label><input type="text" inputMode="numeric" value={form.stock_quantity} onChange={e => set('stock_quantity', e.target.value.replace(/[^0-9]/g, ''))} className="input-luxury [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" /></div>
              <div className="flex items-end"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="w-4 h-4 accent-brand-500" /><span className="text-sm text-ink-muted">Featured Product</span></label></div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="p-5 border border-border bg-surface-card">
            <label className="block text-[10px] uppercase tracking-wider text-brand-500 mb-3 font-medium">Descriptions</label>
            <div className="space-y-4">
              <div><label className="block text-xs text-ink-muted mb-1">Short Description</label><input value={form.short_description} onChange={e => set('short_description', e.target.value)} className="input-luxury" /></div>
              <div><label className="block text-xs text-ink-muted mb-1">Full Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} className="input-luxury resize-none" /></div>
            </div>
          </div>

          {/* Specs */}
          <div className="p-5 border border-border bg-surface-card">
            <label className="block text-[10px] uppercase tracking-wider text-brand-500 mb-3 font-medium">Specifications</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(specs).map(([key, val]) => (
                <div key={key}><label className="block text-xs text-ink-muted mb-1">{key}</label>
                  <input value={val} onChange={e => setSpecs(s => ({ ...s, [key]: e.target.value }))} className="input-luxury" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-gold disabled:opacity-50">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : 'Create Product'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}