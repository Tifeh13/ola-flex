import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Minus, Plus, Star, Truck, MessageCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { productsAPI, getWhatsAppUrl } from '../services/api.js';
import { formatPrice, getAvailabilityLabel, getImageUrl } from '../utils/helpers.js';
import ImageLightbox from '../components/ImageLightbox.jsx';

const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-semibold text-ink">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-ink-muted" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm text-ink-muted leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setShowAllImages(false);
    productsAPI.getOne(id)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-white">
        <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-white">
        <div className="text-center">
          <p className="text-ink-muted mb-4">Product not found</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-900 text-white text-sm font-semibold rounded-full hover:bg-brand-800 transition-colors">
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? product.images.map(img => getImageUrl(img.image_url))
    : ['/placeholder-watch.svg'];

  const specs = product.specifications ? JSON.parse(product.specifications) : {};
  const related = product.related || [];
  const availability = getAvailabilityLabel(product.availability);

  const visibleImages = showAllImages ? images : images.slice(0, 6);

  return (
    <>
      <Helmet>
        <title>{product.name} — OLAFLEX</title>
        <meta name="description" content={product.short_description || product.description?.slice(0, 160)} />
      </Helmet>

      <div className="pt-24 sm:pt-28 pb-16 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-ink-muted mb-8"
          >
            <Link to="/" className="hover:text-ink transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="hover:text-ink transition-colors">Collection</Link>
            <ChevronRight size={14} />
            <span className="text-ink font-medium">{product.name}</span>
          </motion.div>

          {/* Product layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Left — Image grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main image — clickable to open lightbox */}
              <div
                className="relative aspect-square bg-surface-alt rounded-2xl overflow-hidden mb-4 cursor-zoom-in group"
                onClick={() => { setLightboxIndex(activeImage); setLightboxOpen(true); }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={images[activeImage]}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </AnimatePresence>
                {/* Zoom hint */}
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to expand
                </div>
              </div>

              {/* Thumbnail grid */}
              <div className="grid grid-cols-3 gap-3">
                {visibleImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImage(i); setLightboxIndex(i); setLightboxOpen(true); }}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === i
                        ? 'border-brand-800 shadow-md'
                        : 'border-transparent hover:border-brand-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Show more button */}
              {images.length > 6 && !showAllImages && (
                <button
                  onClick={() => setShowAllImages(true)}
                  className="mt-4 w-full py-3 border border-border rounded-xl text-sm font-medium text-ink-muted hover:text-ink hover:border-ink/20 transition-all"
                >
                  Show More ({images.length - 6} more)
                </button>
              )}
            </motion.div>

            {/* Right — Product info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col"
            >
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-600 font-semibold">{product.brand}</span>

              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-ink leading-tight" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-ink">{formatPrice(product.price)}</span>
              </div>

              {/* Payment info */}
              <p className="mt-2 text-xs text-ink-muted">
                Contact us for payment options • Bank transfer available
              </p>

              {/* Rating + availability */}
              <div className="mt-4 flex items-center gap-4 text-sm text-ink-muted">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-ink/80 text-ink/80" />
                  <span className="font-medium text-ink">4.9</span>
                  <span>(Verified Buyer)</span>
                </div>
                <span className="text-border">|</span>
                <div className="flex items-center gap-1">
                  <Truck size={14} />
                  <span>Dispatched within 2–4 days</span>
                </div>
              </div>

              {/* Availability badge */}
              <div className="mt-4">
                <span className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium px-3 py-1.5 rounded-full ${
                  product.availability === 'in_stock' ? 'bg-emerald-50 text-emerald-700' :
                  product.availability === 'low_stock' ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    product.availability === 'in_stock' ? 'bg-emerald-500' :
                    product.availability === 'low_stock' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  {availability}
                </span>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex gap-3">
                <a
                  href={getWhatsAppUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-brand-900 text-white text-sm font-semibold rounded-full hover:bg-brand-800 transition-all duration-300 hover:shadow-lg hover:shadow-brand-900/20"
                >
                  <MessageCircle size={16} />
                  Order on WhatsApp
                </a>
                <a
                  href={getWhatsAppUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 border border-border text-ink text-sm font-semibold rounded-full hover:border-ink/30 transition-all"
                >
                  <ShoppingCart size={16} />
                </a>
              </div>

              {/* Description + Specs Accordion */}
              <div className="mt-8 border-t border-border">
                <AccordionItem title="Product Description" defaultOpen={true}>
                  <p>{product.description || 'No description available for this product.'}</p>
                </AccordionItem>

                {Object.keys(specs).length > 0 && (
                  <AccordionItem title="Specifications">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(specs).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider text-ink-faint">{key}</span>
                          <span className="text-sm text-ink mt-0.5">{value}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionItem>
                )}

                <AccordionItem title="Warranty & Packaging">
                  <p>Every OLAFLEX timepiece comes with our signature luxury packaging, certificate of authenticity, and a comprehensive warranty card. Contact us on WhatsApp for full warranty details.</p>
                </AccordionItem>

                <AccordionItem title="Shipping & Returns">
                  <p>We offer secure nationwide delivery across Nigeria. International shipping available. Returns accepted within 14 days for unworn items in original packaging. Contact us for more details.</p>
                </AccordionItem>
              </div>
            </motion.div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-20 sm:mt-28">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-ink">You May Also Like</h2>
                <Link to="/shop" className="text-sm text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1 transition-colors">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                {related.map((item) => (
                  <Link key={item.id} to={`/product/${item.id}`} className="group block">
                    <div className="aspect-square bg-surface-alt rounded-2xl overflow-hidden mb-3">
                      <img
                        src={getImageUrl(item.primary_image)}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-brand-600 font-semibold">{item.brand}</span>
                    <h3 className="mt-1 text-sm font-medium text-ink group-hover:text-brand-700 transition-colors line-clamp-1">{item.name}</h3>
                    <p className="mt-1.5 text-sm font-bold text-ink">{formatPrice(item.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <ImageLightbox
            images={images}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
