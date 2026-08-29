import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Wrench, Leaf, Heart } from 'lucide-react'

const milestones = [
  { year: '2024', title: 'The Vision', description: 'OLAFLEX founded with a mission to redefine accessible luxury in timepieces' },
  { year: '2024', title: 'First Collection', description: 'Launch of our debut collection featuring Swiss-inspired movements' },
  { year: '2024', title: 'Global Expansion', description: 'Reaching watch enthusiasts across continents with premium service' },
  { year: '2025', title: 'The Future', description: 'Continuing to push boundaries in design and craftsmanship' },
]

const values = [
  { icon: Shield, title: 'Uncompromising Quality', description: 'Every component is sourced from trusted suppliers and tested rigorously' },
  { icon: Wrench, title: 'Artisan Craftsmanship', description: 'Each timepiece is assembled by skilled artisans with decades of experience' },
  { icon: Leaf, title: 'Sustainable Luxury', description: 'Committed to ethical sourcing and environmentally conscious practices' },
  { icon: Heart, title: 'Passion for Excellence', description: 'Driven by an unwavering commitment to perfection in every detail' },
]

export default function About() {
  return (
    <div className="min-h-screen pt-24 bg-white">
      {/* Hero */}
      <section className="relative py-32 sm:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-white" />
        <div className="relative max-w-5xl mx-auto text-center px-5 sm:px-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="h-[1px] bg-brand-400 mx-auto mb-8"
          />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-brand-500 tracking-[0.3em] text-xs uppercase font-medium block mb-4"
          >
            Our Story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-ink"
          >
            The Art of <span className="italic text-brand-500">Time</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 text-ink-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            OLAFLEX represents the perfect fusion of traditional watchmaking excellence
            and contemporary design innovation
          </motion.p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight">
                Where Tradition Meets <span className="italic text-brand-500">Innovation</span>
              </h2>
              <div className="w-16 h-[1px] bg-brand-500 mt-6 mb-8" />
              <div className="space-y-4 text-ink-secondary leading-relaxed">
                <p>At OLAFLEX, we believe that true luxury lies in the details. Every curve, every finish, every movement is crafted with obsessive attention to perfection.</p>
                <p>Our timepieces are not merely accessories — they are statements of taste, markers of achievement, and heirlooms that transcend generations.</p>
                <p>Drawing inspiration from the world's finest horological traditions while embracing modern technology, we create watches that honor the past while defining the future.</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="aspect-square bg-surface-alt rounded-3xl overflow-hidden flex items-center justify-center p-12 relative">
                <div className="absolute top-6 left-6 w-10 h-10 border-l-2 border-t-2 border-brand-300/40" />
                <div className="absolute bottom-6 right-6 w-10 h-10 border-r-2 border-b-2 border-brand-300/40" />
                <div className="text-center">
                  <div className="text-7xl font-display font-bold gold-gradient-text mb-2">OF</div>
                  <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-brand-400 to-transparent mx-auto mb-3" />
                  <div className="text-brand-500 text-sm tracking-[0.3em] uppercase">Since 2024</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-brand-900 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="font-display text-4xl sm:text-5xl font-bold text-white"
            >
              What We <span className="italic text-brand-400">Stand For</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white/[0.04] border border-white/[0.08] p-8 rounded-2xl hover:border-white/20 transition-all duration-500 group"
              >
                <div className="w-12 h-12 bg-white/[0.06] rounded-xl flex items-center justify-center mb-5 group-hover:bg-white/[0.1] transition-colors">
                  <value.icon size={22} className="text-white/70" />
                </div>
                <h3 className="text-white font-semibold text-base mb-3">{value.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl sm:text-5xl font-bold text-ink"
            >
              Our <span className="italic text-brand-500">Milestones</span>
            </motion.h2>
          </div>
          <div className="relative pl-10 md:pl-0">
            <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-300/50 via-brand-300/20 to-transparent" />
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`relative mb-14 last:mb-0 ${index % 2 === 0 ? 'md:flex md:items-center md:flex-row' : 'md:flex md:items-center md:flex-row-reverse'}`}
              >
                <div className="absolute left-[-10px] md:left-1/2 w-[10px] h-[10px] rounded-full bg-brand-400 transform md:-translate-x-1/2 shadow-[0_0_12px_rgba(98,125,152,0.5)] top-1 md:top-1/2 md:-translate-y-1/2" />
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-14 md:text-right' : 'md:pl-14 md:text-left'}`}>
                  <span className="text-brand-500 text-xs tracking-[0.25em] font-semibold uppercase">{milestone.year}</span>
                  <h3 className="text-lg font-semibold text-ink mt-1.5 mb-1.5">{milestone.title}</h3>
                  <p className="text-ink-secondary text-sm leading-relaxed">{milestone.description}</p>
                </div>
                <div className="hidden md:block w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
