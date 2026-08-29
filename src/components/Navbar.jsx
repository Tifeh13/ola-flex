import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppGeneralUrl } from '../services/api.js';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/shop', label: 'Shop' },
    { to: '/how-to-order', label: 'How to Order' },
  ];

  return (
    <>
      <motion.nav
        initial={false}
        animate={{ height: scrolled ? 56 : 68 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.06)]' : 'bg-white/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <img src="/olaflex-logo.png" alt="OLAFLEX" className="h-10 sm:h-11 w-auto" />
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-[13px] tracking-[0.05em] font-medium transition-colors duration-300 ${
                  location.pathname === link.to ? 'text-brand-800' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-brand-800 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <motion.a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 bg-brand-800 text-white font-semibold tracking-wider text-[11px] uppercase hover:bg-brand-900 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle size={13} />
              Order Now
            </motion.a>
          </div>

          {/* Redesigned mobile menu toggle — three bars that morph smoothly into an X,
              rather than swapping between two separate icon components. */}
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-ink-secondary hover:text-ink transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <span className="relative w-5 h-4 flex flex-col justify-between">
              <motion.span
                className="block h-[1.5px] w-full bg-current rounded-full origin-center"
                animate={mobileOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="block h-[1.5px] w-full bg-current rounded-full"
                animate={mobileOpen ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
              <motion.span
                className="block h-[1.5px] w-full bg-current rounded-full origin-center"
                animate={mobileOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-72 max-w-[80vw] bg-white z-50 md:hidden shadow-[-10px_0_40px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center justify-between p-5 border-b border-border-light">
                <img src="/olaflex-logo.png" alt="OLAFLEX" className="h-9 w-auto" />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="relative w-8 h-8 flex items-center justify-center text-ink-muted hover:text-ink rounded-full hover:bg-surface-alt transition-colors"
                >
                  <span className="relative w-4 h-4">
                    <span className="absolute top-1/2 left-1/2 w-4 h-[1.5px] bg-current rounded-full -translate-x-1/2 -translate-y-1/2 rotate-45" />
                    <span className="absolute top-1/2 left-1/2 w-4 h-[1.5px] bg-current rounded-full -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                  </span>
                </button>
              </div>
              <div className="p-5 space-y-1">
                {links.map((link, i) => (
                  <motion.div key={link.to} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 + 0.1 }}>
                    <Link
                      to={link.to}
                      className={`block px-4 py-3 text-[13px] tracking-[0.06em] font-medium rounded-xl transition-all duration-200 ${
                        location.pathname === link.to ? 'bg-brand-50 text-brand-800' : 'text-ink-secondary hover:text-ink hover:bg-surface-alt'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-border-light">
                <a
                  href={getWhatsAppGeneralUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-brand-800 text-white font-semibold tracking-wider text-[11px] uppercase hover:bg-brand-900 transition-all duration-300"
                >
                  <MessageCircle size={13} />
                  Order on WhatsApp
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}