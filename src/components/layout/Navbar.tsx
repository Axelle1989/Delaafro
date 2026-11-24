import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, MessageCircle, Sparkles } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { toggleCart, getTotalCount } = useCartStore();
  const { settings } = useSettingsStore();
  const cartCount = getTotalCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À Propos', path: '/a-propos' },
    { name: 'Nos Gammes', path: '/nos-gammes' },
    { name: 'Accessoires', path: '/accessoires' },
    { name: 'Ma Routine', path: '/ma-routine' },
    { name: 'Avis & Résultats', path: '/elles-ont-sublime-leur-afro' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-creme/95 backdrop-blur-md shadow-luxury py-3 border-b border-sable/30'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="site-container">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <div className="shrink-0 mr-6 xl:mr-10 2xl:mr-14">
              <Logo size="md" variant="gold" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-5 2xl:gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `relative text-xs xl:text-sm tracking-wide font-semibold uppercase transition-colors py-1 whitespace-nowrap ${
                      isActive
                        ? 'text-terracotta'
                        : 'text-brun-nuit/75 hover:text-terracotta'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.name}</span>
                      {isActive && (
                        <motion.span
                          layoutId="navbar-active-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-cuivre-or rounded-full"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Action Buttons: Cart & WhatsApp */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* WhatsApp direct consultation button */}
              <a
                href={buildWhatsAppInquiryUrl(undefined, settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 p-2.5 2xl:px-4 2xl:py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] transition-all border border-[#25D366]/30 shrink-0"
                aria-label="Conseil WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]/20 shrink-0" />
                <span className="hidden 2xl:inline whitespace-nowrap">Conseil WhatsApp</span>
              </a>

              {/* Cart Drawer Trigger */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-full text-brun-nuit bg-sable/40 hover:bg-sable/70 transition-colors focus:outline-none shrink-0"
                aria-label={`Panier d'achats (${cartCount} articles)`}
              >
                <ShoppingBag className="w-5 h-5 text-terracotta" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[10px] font-bold text-white shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2.5 rounded-full text-brun-nuit hover:bg-sable/30 transition-colors focus:outline-none"
                aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 bg-creme-light/98 backdrop-blur-xl pt-24 px-6 pb-8 flex flex-col justify-between xl:hidden overflow-y-auto"
          >
            <div className="flex flex-col space-y-5">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cuivre">
                Navigation
              </span>
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-2xl font-bold text-brun-nuit hover:text-terracotta transition-colors flex items-center justify-between border-b border-sable/40 pb-3"
                >
                  <span>{link.name}</span>
                  <Sparkles className="w-4 h-4 text-or opacity-60" />
                </NavLink>
              ))}
            </div>

            <div className="pt-8 flex flex-col gap-4">
              <Button
                variant="whatsapp"
                size="lg"
                as="a"
                href={buildWhatsAppInquiryUrl(undefined, settings.whatsappNumber)}
                leftIcon={<MessageCircle className="w-5 h-5 fill-white/20" />}
                className="w-full justify-center shadow-lg"
              >
                Commander sur WhatsApp
              </Button>

              <div className="text-center pt-2">
                <p className="text-xs text-brun-nuit/60">
                  Service client Bénin : {settings.whatsappDisplayNumber}
                </p>
                <p className="text-[11px] text-brun-nuit/40 mt-1">
                  {settings.openingHours}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

