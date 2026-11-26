import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useI18n } from '@/context/I18nContext';
import {
  MessageCircle,
  MapPin,
  Clock,
  Heart,
} from 'lucide-react';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

export const Footer: React.FC = () => {
  const { settings } = useSettingsStore();
  const { t } = useI18n();

  return (
    <footer className="relative bg-gradient-nuit text-creme-light pt-14 lg:pt-16 pb-12 border-t border-cuivre/30 overflow-hidden">
      {/* Decorative Golden Ambient Blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-or/10 rounded-full blur-3xl pointer-events-none" />

      <div className="site-container relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16">
          {/* Brand Presentation */}
          <div className="lg:col-span-2 space-y-5">
            <Logo size="lg" variant="light" />
            <p className="font-serif italic text-lg text-or/90">
              {t('footer.tagline')}
            </p>
            <p className="text-sm text-sable/75 leading-relaxed max-w-md">
              {t('footer.description')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-sable/10 hover:bg-[#E1306C] hover:text-white transition-all text-sable shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-or"
                aria-label="Instagram DELAAFRO (@delaafro_)"
                title="Instagram : @delaafro_"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-sable/10 hover:bg-[#1877F2] hover:text-white transition-all text-sable shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-or"
                aria-label="Facebook DELAAFRO"
                title="Facebook : dela.afro"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href={settings.pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-sable/10 hover:bg-[#E60023] hover:text-white transition-all text-sable shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-or"
                aria-label="Pinterest DELAAFRO"
                title="Pinterest : DelaAfro"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.224-.174.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>

              {/* Snapchat */}
              <a
                href={settings.snapchatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-sable/10 hover:bg-[#FFFC00] hover:text-black transition-all text-sable shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-or"
                aria-label="Snapchat DELAAFRO (@delaeliiiiii)"
                title="Snapchat : @delaeliiiiii"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M12.001 2c-3.87 0-6.19 2.5-6.19 5.86 0 1.25.39 2.45.89 3.23-.29.21-.67.44-1.12.56-.47.12-.9.08-1.29-.12-.2-.1-.4-.06-.52.12-.13.2-.06.44.15.58.53.35 1.13.51 1.76.47.26 1.05.97 1.95 2.16 2.37-.17.39-.5.64-.97.74-.35.07-.72.04-1.11-.1-.2-.07-.42-.01-.52.16-.1.17-.05.4.12.53.46.33 1 .49 1.59.48.51 0 .97-.13 1.39-.37.37.52.88.93 1.54 1.18-.32.32-.78.53-1.37.64-.32.06-.65.05-1.01-.04-.21-.05-.42.03-.5.22-.09.19-.01.41.17.52.48.3 1.02.44 1.62.43 1.08-.02 2-.44 2.76-1.17.65.65 1.48 1.04 2.48 1.09.6.01 1.14-.13 1.62-.43.18-.11.26-.33.17-.52-.08-.19-.29-.27-.5-.22-.36.09-.69.1-1.01.04-.59-.11-1.05-.32-1.37-.64.66-.25 1.17-.66 1.54-1.18.42.24.88.37 1.39.37.59.01 1.13-.15 1.59-.48.17-.13.22-.36.12-.53-.1-.17-.32-.23-.52-.16-.39.14-.76.17-1.11.1-.47-.1-.8-.35-.97-.74 1.19-.42 1.9-1.32 2.16-2.37.63.04 1.23-.12 1.76-.47.21-.14.28-.38.15-.58-.12-.18-.32-.22-.52-.12-.39.2-.82.24-1.29.12-.45-.12-.83-.35-1.12-.56.5-.78.89-1.98.89-3.23 0-3.36-2.32-5.86-6.19-5.86z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={buildWhatsAppInquiryUrl(undefined, settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-or"
                aria-label="WhatsApp DELAAFRO"
                title={`WhatsApp : ${settings.whatsappDisplayNumber}`}
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-or tracking-wider uppercase">
              {t('footer.ritualsTitle')}
            </h4>
            <ul className="space-y-2.5 text-sm text-sable/80">
              <li>
                <Link to="/nos-gammes" className="hover:text-or transition-colors">
                  {t('footer.rangeComplete')}
                </Link>
              </li>
              <li>
                <Link to="/nos-gammes" className="hover:text-or transition-colors">
                  {t('footer.rangeHydration')}
                </Link>
              </li>
              <li>
                <Link to="/nos-gammes" className="hover:text-or transition-colors">
                  {t('footer.rangeEssential')}
                </Link>
              </li>
              <li>
                <Link to="/nos-gammes" className="hover:text-or transition-colors">
                  {t('footer.rangeLocs')}
                </Link>
              </li>
              <li>
                <Link to="/boutique?category=soin" className="hover:text-or transition-colors">
                  {t('footer.individualCare')}
                </Link>
              </li>
              <li>
                <Link to="/accessoires" className="hover:text-or transition-colors">
                  {t('footer.accessories')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Practical Info */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-or tracking-wider uppercase">
              {t('footer.infoTitle')}
            </h4>
            <ul className="space-y-2.5 text-sm text-sable/80">
              <li>
                <Link to="/a-propos" className="hover:text-or transition-colors">
                  {t('footer.aboutLink')}
                </Link>
              </li>
              <li>
                <Link to="/ma-routine" className="hover:text-or transition-colors">
                  {t('footer.routineLink')}
                </Link>
              </li>
              <li>
                <Link to="/elles-ont-sublime-leur-afro" className="hover:text-or transition-colors">
                  {t('footer.reviewsLink')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-or transition-colors">
                  {t('footer.contactLink')}
                </Link>
              </li>
              <li>
                <Link to="/boutique" className="hover:text-or transition-colors">
                  {t('footer.shopLink')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-or tracking-wider uppercase">
              {t('footer.contactTitle')}
            </h4>
            <div className="space-y-3 text-sm text-sable/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cuivre shrink-0 mt-0.5" aria-hidden="true" />
                <span>{t('footer.location')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" aria-hidden="true" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline font-semibold text-or"
                >
                  {settings.whatsappDisplayNumber}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-cuivre shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-xs">{t('footer.openingHours')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar without public admin link */}
        <div className="border-t border-cuivre/20 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sable/60 gap-4">
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <span>{t('footer.copyrightBefore', { year: new Date().getFullYear() })}</span>
            <Heart className="w-3.5 h-3.5 text-terracotta inline fill-terracotta" aria-hidden="true" />
            <span>{t('footer.copyrightAfter')}</span>
          </div>

          <div className="flex items-center gap-4 text-sable/50">
            <span>{t('footer.bottomTagline')}</span>
            <span>•</span>
            <span>{t('footer.bottomLocation')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
