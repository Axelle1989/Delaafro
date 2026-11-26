import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, MessageCircle, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useI18n } from '@/context/I18nContext';
import { ThemeLangControls } from '@/components/layout/ThemeLangControls';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

interface MobileDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawerMenu: React.FC<MobileDrawerMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { settings } = useSettingsStore();
  const { t } = useI18n();

  const navLinks = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.about', path: '/a-propos' },
    { key: 'nav.ranges', path: '/nos-gammes' },
    { key: 'nav.accessories', path: '/accessoires' },
    { key: 'nav.routine', path: '/ma-routine' },
    { key: 'nav.reviews', path: '/elles-ont-sublime-leur-afro' },
    { key: 'nav.delivery', path: '/contact' },
    { key: 'nav.contact', path: '/contact' },
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-[85%] max-w-[340px] bg-[var(--bg)] text-[var(--text)] h-full shadow-2xl flex flex-col justify-between z-10 pt-[env(safe-area-inset-top,16px)] pb-[env(safe-area-inset-bottom,20px)] border-r border-[var(--border)] overflow-hidden theme-surface"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-[var(--surface)]/50">
                <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
                  <img
                    src="/brand/logo-symbol.png"
                    alt="DELAAFRO"
                    className="w-9 h-9 object-contain"
                  />
                  <div>
                    <span className="font-serif font-extrabold text-lg text-[var(--text)] tracking-wider block leading-none">
                      DELAAFRO
                    </span>
                    <span className="text-[9px] font-semibold tracking-[0.2em] text-[var(--accent-text)] uppercase block mt-0.5">
                      {t('nav.subtitleBrand')}
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t('nav.closeMenu')}
                  className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Langue & Mode Sombre dans le menu burger */}
              <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between gap-2 bg-[var(--surface)]/30">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  {t('common.languageLabel')} & {t('common.themeLabel')}
                </span>
                <ThemeLangControls compact />
              </div>

              {/* Navigation Links List */}
              <nav
                aria-label={t('nav.navigationLabel')}
                className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-300px)]"
              >
                {navLinks.map((link, idx) => {
                  const isActive = location.pathname === link.path && link.key !== 'nav.delivery';
                  return (
                    <Link
                      key={`${link.key}-${idx}`}
                      to={link.path}
                      onClick={onClose}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                        isActive
                          ? 'bg-[var(--accent)] text-[#FBF5EC] shadow-sm'
                          : 'text-[var(--text)] hover:bg-[var(--surface)]'
                      }`}
                    >
                      <span className="tracking-wide">{t(link.key)}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-[#FBF5EC] translate-x-0.5' : 'text-[var(--text-secondary)]/50'
                        }`}
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions & Reassurance */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]/40 space-y-3">
              {/* WhatsApp CTA */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" aria-hidden="true" />
                <span>{t('nav.whatsappMobileCta')}</span>
              </a>

              {/* Quick Info */}
              <div className="text-[11px] text-[var(--text-secondary)] space-y-1 pt-1 text-center">
                <p className="flex items-center justify-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" aria-hidden="true" />
                  <span>{t('nav.shippingShort')}</span>
                </p>
                <p className="text-[10px] text-[var(--text-secondary)]/80">
                  © {new Date().getFullYear()} DELAAFRO — {t('footer.bottomLocation')}
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
