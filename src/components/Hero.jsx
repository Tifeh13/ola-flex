import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <motion.div style={{ opacity }} className="relative w-full">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">

            {/* Left side — Text + small card */}
            <motion.div style={{ y: textY }} className="text-left order-2 lg:order-1">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-ink"
                style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
              >
                Timeless Craft
                <br />
                Meets{' '}
                <span className="text-brand-800">Luxury</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-5 text-ink-muted text-base sm:text-lg max-w-md leading-relaxed"
              >
                Discover premium timepieces crafted with refined details, modern precision, and timeless sophistication for every occasion.
              </motion.p>

              {/* View All Products button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mt-8"
              >
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-ink text-white text-sm font-semibold rounded-full hover:bg-brand-900 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/20 group"
                >
                  View All Products
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                    <ArrowUpRight size={14} className="text-white" />
                  </span>
                </Link>
              </motion.div>

              {/* Small product card + rotating circle */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="mt-10 flex items-center gap-6"
              >
                {/* Small product thumbnail */}
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-alt flex-shrink-0">
                    <img
                      src="https://images.pexels.com/photos/10481016/pexels-photo-10481016.jpeg?auto=compress&cs=tinysrgb&w=200"
                      alt="OLAFLEX watch"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Apex Chronograph</p>
                    <p className="text-xs text-ink-muted mt-0.5">Precision. Style. Timeless design.</p>
                  </div>
                </div>

                {/* Rotating circular text */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  {/* Rotating SVG text */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                    className="absolute inset-0"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                      </defs>
                      <text className="fill-ink text-[9px] font-semibold tracking-[0.15em] uppercase">
                        <textPath href="#circlePath">
                          NEW ARRIVALS • SHOP NOW • PREMIUM •
                        </textPath>
                      </text>
                    </svg>
                  </motion.div>
                  {/* Center circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-brand-900 flex items-center justify-center cursor-pointer hover:bg-brand-800 transition-colors group">
                      <span className="text-white text-[9px] font-semibold uppercase tracking-wider">Shop<br/>now</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right side — Large product image */}
            <motion.div style={{ y: imageY }} className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-lg"
              >
                {/* Background shape */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-surface-alt rounded-[2rem] sm:rounded-[2.5rem] transform rotate-2 scale-105" />

                {/* Main image */}
                <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl shadow-brand-900/10">
                  <img
                    src="https://images.pexels.com/photos/10481016/pexels-photo-10481016.jpeg?auto=compress&cs=tinysrgb&w=900"
                    alt="OLAFLEX luxury timepiece"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating price tag */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-4 -left-4 sm:bottom-6 sm:-left-6 bg-white border border-border rounded-2xl px-5 py-3 shadow-xl z-10"
                >
                  <span className="text-[9px] uppercase tracking-[0.2em] text-brand-600 font-semibold block">Starting from</span>
                  <span className="text-lg font-bold text-ink">₦30,000</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Pagination dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
      >
        <div className="w-8 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-ink/15" />
        <div className="w-2 h-2 rounded-full bg-ink/15" />
        <div className="w-2 h-2 rounded-full bg-ink/15" />
      </motion.div>
    </section>
  );
}
