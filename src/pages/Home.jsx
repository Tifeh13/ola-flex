import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Truck, Award, Headphones } from 'lucide-react'
import Hero from '../components/Hero'
import { productsAPI } from '../services/api.js'
import { formatPrice, getImageUrl } from '../utils/helpers.js'

const features = [
  { icon: Shield, title: 'Authenticity Guaranteed', description: 'Every piece certified and verified through our rigorous authentication process' },
  { icon: Truck, title: 'Global Express Delivery', description: 'Complimentary worldwide shipping on all orders above $500' },
  { icon: Award, title: 'Curated Excellence', description: 'Hand-selected timepieces from the world\'s most prestigious watchmakers' },
  { icon: Headphones, title: 'Private Concierge', description: 'Dedicated luxury advisors available 24/7 for our distinguished clientele' },
]

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    productsAPI.getAll({}).then(setProducts).catch(() => setProducts([]))
  }, [])

  return (
    <div className="bg-white">
      <Hero />

      {/* ===== BRAND MARQUEE ===== */}
      <div className="py-4 border-y border-border overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-xs tracking-[0.3em] text-ink-faint mx-8 font-light uppercase">
              OLAFLEX &mdash; Precision Luxury &mdash; Since 2024 &mdash;
            </span>
          ))}
        </div>
      </div>

      {/* ===== BESTSELLER PRODUCTS ===== */}
      <section className="py-24 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-4xl sm:text-5xl font-bold text-ink"
              >
                Bestseller <span className="italic text-brand-700">Products</span>
              </motion.h2>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 border border-ink/20 text-ink font-semibold tracking-wider text-xs uppercase hover:bg-ink hover:text-white transition-all duration-300">
              View All
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {products.slice(0, 5).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                >
                  <Link to={`/product/${product.id}`} className="group block">
                    <div className="aspect-square bg-surface-alt rounded-2xl overflow-hidden mb-4">
                      <img src={getImageUrl(product.primary_image)} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    </div>
                    <p className="text-xs text-ink-muted">{product.brand}</p>
                    <h3 className="text-sm font-semibold text-ink mt-1 group-hover:text-brand-700 transition-colors line-clamp-2">{product.name}</h3>
                    <p className="text-lg font-bold text-ink mt-2">{formatPrice(product.price)}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-ink-muted text-sm">Products coming soon.</div>
          )}
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-24 bg-brand-900 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight"
            >
              Why <span className="italic text-brand-300">Choose</span> Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-white/50 leading-relaxed max-w-md"
            >
              Discover trusted watches designed for performance, durability, and everyday convenience.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="mt-8">
              <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold text-sm uppercase tracking-wider hover:bg-white hover:text-brand-900 transition-all duration-300">
                View All
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.05] border border-white/[0.08] p-6 rounded-2xl hover:border-brand-400/30 transition-all duration-500 group"
              >
                <div className="w-10 h-10 bg-brand-400/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-400/20 transition-colors">
                  <feature.icon size={18} className="text-brand-300" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-brand-800 rounded-3xl p-10 sm:p-16 flex flex-col sm:flex-row items-center justify-between gap-8"
          >
            <div className="text-center sm:text-left">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Luxury <span className="italic text-brand-300">Redefined</span>
              </h2>
              <p className="text-white/50 mt-3 max-w-md">
                Join the exclusive circle of watch enthusiasts who appreciate the finest craftsmanship
              </p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-brand-800 font-bold tracking-wider text-sm uppercase hover:bg-brand-50 transition-all duration-300 hover:shadow-xl flex-shrink-0">
              Explore Collection <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
