import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, MessageCircle, Sparkles, MapPin, Phone, Instagram, Facebook } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSettingsStore } from '@/store/useSettingsStore';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

interface MobileDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawerMenu: React.FC<MobileDrawerMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { settings } = useSettingsStore();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À Propos', path: '/a-propos' },
    { name: 'Nos Gammes', path: '/nos-gammes' },
    { name: 'Accessoires', path: '/accessoires' },
    { name: 'Ma Routine', path: '/ma-routine' },
    { name: 'Avis & Résultats', path: '/elles-ont-sublime-leur-afro' },
    { name: 'Livraison', path: '/contact' },
    { name: 'Contact', path: '/contact' },
  ];

  const whatsAppUrl = buildWhatsAppInquiryUrl(undefined, settings.whatsappNumber);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-brun-nuit/60 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-[85%] max-w-[340px] bg-creme h-full shadow-2xl flex flex-col justify-between z-10 pt-[env(safe-area-inset-top,16px)] pb-[env(safe-area-inset-bottom,20px)] border-r border-sable/50 overflow-hidden"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between p-5 border-b border-sable/40 bg-creme-light/50">
                <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
                  <img
                    src="/brand/logo-symbol.png"
                    alt="DELAAFRO"
                    className="w-9 h-9 object-contain"
                  />
                  <div>
                    <span className="font-serif font-extrabold text-lg text-brun-nuit tracking-wider block leading-none">
                      DELAAFRO
                    </span>
                    <span className="text-[9px] font-semibold tracking-[0.2em] text-terracotta uppercase block mt-0.5">
                      Soins Naturels • Bénin 🇧🇯
                    </span>
                  </div>
                </Link>

                <button
                  onClick={onClose}
                  aria-label="Fermer le menu"
                  className="p-2 rounded-full text-brun-nuit/70 hover:text-brun-nuit hover:bg-sable/30 active:scale-95 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links List */}
              <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
                {navLinks.map((link, idx) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={`${link.name}-${idx}`}
                      to={link.path}
                      onClick={onClose}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                        isActive
                          ? 'bg-terracotta text-white shadow-sm'
                          : 'text-brun-nuit hover:bg-sable/30 active:bg-sable/40'
                      }`}
                    >
                      <span className="tracking-wide">{link.name}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-white translate-x-0.5' : 'text-brun-nuit/30'
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions & Reassurance */}
            <div className="p-4 border-t border-sable/40 bg-creme-light/40 space-y-3">
              {/* WhatsApp CTA */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Conseil & Commande WhatsApp</span>
              </a>

              {/* Quick Info */}
              <div className="text-[11px] text-brun-nuit/70 space-y-1 pt-1 text-center">
                <p className="flex items-center justify-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  <span>Livraison partout, même hors du Bénin</span>
                </p>
                <p className="text-[10px] text-brun-nuit/50">
                  © {new Date().getFullYear()} DELAAFRO — Cotonou, Bénin
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
