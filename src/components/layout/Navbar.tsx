import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, MessageCircle, Sparkles } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { ThemeLangControls } from '@/components/layout/ThemeLangControls';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useI18n } from '@/context/I18nContext';
import { useTheme } from '@/context/ThemeContext';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { toggleCart, getTotalCount } = useCartStore();
  const { settings } = useSettingsStore();
  const { t } = useI18n();
  const { theme } = useTheme();
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
    { key: 'nav.home', path: '/' },
    { key: 'nav.about', path: '/a-propos' },
    { key: 'nav.ranges', path: '/nos-gammes' },
    { key: 'nav.accessories', path: '/accessoires' },
    { key: 'nav.routine', path: '/ma-routine' },
    { key: 'nav.reviews', path: '/elles-ont-sublime-leur-afro' },
    { key: 'nav.contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 theme-surface transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-md shadow-sm py-3 border-b border-[var(--border)]'
            : 'bg-transparent py-4 sm:py-5'
        }`}
        style={isScrolled ? { backgroundColor: 'var(--header-bg)' } : undefined}
      >
        <div className="site-container">
          <div className="flex items-center justify-between gap-3">
            {/* Brand Logo */}
            <div className="shrink-0 mr-4 xl:mr-8 2xl:mr-12">
              <Logo size="md" variant={theme === 'dark' ? 'light' : 'gold'} />
            </div>

            {/* Desktop Navigation */}
            <nav
              aria-label={t('nav.navigationLabel')}
              className="hidden xl:flex items-center gap-4 2xl:gap-7"
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `relative text-xs xl:text-[13px] tracking-wide font-semibold uppercase transition-colors py-1 whitespace-nowrap rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      isActive
                        ? 'text-[var(--accent-text)]'
                        : 'text-[var(--text)]/80 hover:text-[var(--accent-text)]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{t(link.key)}</span>
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

            {/* Action Buttons: Lang, Theme, WhatsApp & Cart */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Contrôles FR|EN + Clair/Sombre */}
              <ThemeLangControls className="hidden sm:inline-flex" />

              {/* WhatsApp direct consultation button */}
              <a
                href={buildWhatsAppInquiryUrl(undefined, settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 p-2.5 2xl:px-4 2xl:py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#6EE7B7] transition-all border border-[#25D366]/35 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={theme === 'dark' ? { color: '#7AE8A8' } : undefined}
                aria-label={t('nav.whatsappCta')}
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]/20 shrink-0" aria-hidden="true" />
                <span className="hidden 2xl:inline whitespace-nowrap">{t('nav.whatsappCta')}</span>
              </a>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={toggleCart}
                className="relative p-2.5 rounded-full text-[var(--text)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] shrink-0"
                aria-label={t('nav.cartLabel', { count: cartCount })}
              >
                <ShoppingBag className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[#FBF5EC] shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2.5 rounded-full text-[var(--text)] hover:bg-[var(--surface)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
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
            className="fixed inset-0 z-30 bg-[var(--bg)]/98 backdrop-blur-xl pt-24 px-6 pb-8 flex flex-col justify-between xl:hidden overflow-y-auto"
          >
            <div className="flex flex-col space-y-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent-text)]">
                  {t('nav.navigationLabel')}
                </span>
                <ThemeLangControls compact />
              </div>

              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-2xl font-bold text-[var(--text)] hover:text-[var(--accent-text)] transition-colors flex items-center justify-between border-b border-[var(--border)] pb-3"
                >
                  <span>{t(link.key)}</span>
                  <Sparkles className="w-4 h-4 text-[var(--gold)] opacity-70" aria-hidden="true" />
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
                {t('nav.whatsappOrder')}
              </Button>

              <div className="text-center pt-2">
                <p className="text-xs text-[var(--text-secondary)]">
                  {t('nav.customerService', { phone: settings.whatsappDisplayNumber })}
                </p>
                <p className="text-[11px] text-[var(--text-secondary)]/80 mt-1">
                  {t('footer.openingHours')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
