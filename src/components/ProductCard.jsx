import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Eye, MessageCircle, ArrowUpRight } from 'lucide-react';
import { formatPrice, getAvailabilityLabel, getImageUrl } from '../utils/helpers.js';
import { getWhatsAppUrl } from '../services/api.js';

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const availability = getAvailabilityLabel(product.availability);
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative bg-white border border-border transition-all duration-500 group-hover:border-brand-200 group-hover:shadow-[0_20px_60px_-15px_rgba(16,42,67,0.15)]"
      >
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Image area */}
        <div
          onClick={() => navigate(`/product/${product.id}`)}
          className="block relative aspect-square overflow-hidden bg-surface-alt cursor-pointer"
        >
          <motion.img
            src={getImageUrl(product.primary_image)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.08 : 1,
              filter: isHovered ? 'brightness(1.05)' : 'brightness(1)',
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Cursor spotlight */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 200px at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, rgba(98,125,152,0.12) 0%, transparent 70%)`,
            }}
          />

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Action buttons */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
              className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-ink shadow-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: isHovered ? 0 : 20,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ delay: 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye size={18} />
            </motion.button>
            <motion.a
              href={getWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: isHovered ? 0 : 20,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={18} />
            </motion.a>
          </motion.div>

          {/* Featured badge */}
          {product.is_featured === 1 && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute top-4 left-4 px-3 py-1.5 bg-brand-500 text-white text-[10px] font-semibold uppercase tracking-wider shadow-lg"
            >
              Featured
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-500 font-semibold">
              {product.brand}
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${
                product.availability === 'in_stock' ? 'bg-status-in-stock' :
                product.availability === 'low_stock' ? 'bg-status-low-stock' : 'bg-status-out'
              }`} />
              <span className={`text-[10px] uppercase tracking-wider font-medium ${
                product.availability === 'in_stock' ? 'text-status-in-stock' :
                product.availability === 'low_stock' ? 'text-status-low-stock' : 'text-status-out'
              }`}>
                {availability}
              </span>
            </div>
          </div>

          <h3 className="mt-2.5 text-sm sm:text-base font-medium text-ink group-hover:text-brand-600 transition-colors duration-300 leading-snug">
            {product.name}
          </h3>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="text-xl font-display font-bold text-ink">
                {formatPrice(product.price)}
              </span>
              {product.reference && (
                <span className="block text-[10px] text-ink-faint tracking-wider mt-0.5">{product.reference}</span>
              )}
            </div>

            <motion.div
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-ink-muted group-hover:border-brand-400 group-hover:text-brand-500 group-hover:bg-brand-50 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowUpRight size={14} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
