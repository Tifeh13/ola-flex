import { Link } from 'react-router-dom';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { FaSnapchat } from 'react-icons/fa6';
import { getWhatsAppGeneralUrl } from '../services/api.js';

export default function Footer() {
  return (
    <footer className="relative bg-brand-900 text-white overflow-hidden">
      {/* Top accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <img src="/olaflex-logo.png" alt="OLAFLEX" className="h-16 w-auto" />
            <p className="text-sm text-white/50 mt-4 leading-relaxed max-w-xs">
              Time Beyond Ordinary. Premium luxury watches curated for those who define their own standard.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href={getWhatsAppGeneralUrl()} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-brand-300 hover:text-brand-300 transition-all duration-300">
                <MessageCircle size={16} />
              </a>
              <a href="https://www.snapchat.com/add/olaflexx_9?share_id=sCINqrXrRUipQwMK0eXuBQ&locale=en_NG@calendar=japanese" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-yellow-400 hover:bg-yellow-400/10 text-white/60 hover:text-yellow-400 transition-all duration-300"
                title="Follow us on Snapchat">
                <FaSnapchat size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-brand-300 mb-6 font-semibold">Navigate</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Collection' },
                { to: '/about', label: 'About' },
                { to: '/how-to-order', label: 'How to Order' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="group flex items-center gap-2 text-sm text-white/50 hover:text-brand-300 transition-colors duration-300">
                    <span className="w-0 group-hover:w-3 h-[1px] bg-brand-300 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-brand-300 mb-6 font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li>
                <span className="text-[10px] uppercase tracking-wider text-white/30 block mb-1">WhatsApp</span>
                09054318483
              </li>
              <li>
                <span className="text-[10px] uppercase tracking-wider text-white/30 block mb-1">Location</span>
                Lagos, Nigeria
              </li>
            </ul>
            <a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm text-brand-300 hover:text-brand-200 transition-colors font-medium group"
            >
              <MessageCircle size={14} />
              Chat on WhatsApp
              <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Payment */}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-brand-300 mb-6 font-semibold">Payment</h4>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase tracking-wider text-brand-300 mb-2">Bank</div>
                <div className="text-sm text-white/80 font-medium">Moniepoint</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase tracking-wider text-brand-300 mb-2">Account Name</div>
                <div className="text-sm text-white/80 font-medium">FAJENYO MUJEEB OLANREWAJU</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase tracking-wider text-brand-300 mb-2">Account Number</div>
                <div className="text-sm text-white/80 font-medium tracking-wider">6021955946</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} OLAFLEX. All rights reserved.
          </p>
          <p className="text-xs text-white/20 italic font-display tracking-wider">
            Time Beyond Ordinary
          </p>
        </div>
      </div>
    </footer>
  );
}
