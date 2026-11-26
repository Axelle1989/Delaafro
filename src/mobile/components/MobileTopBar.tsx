import React, { useState } from 'react';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useI18n } from '@/context/I18nContext';
import { MobileDrawerMenu } from './MobileDrawerMenu';
import { MobileSearchModal } from './MobileSearchModal';

export const MobileTopBar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const totalCount = useCartStore((state) => state.getTotalCount());
  const { t } = useI18n();

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-[var(--border)] shadow-sm pt-[env(safe-area-inset-top,0px)] theme-surface"
        style={{ backgroundColor: 'var(--header-bg)' }}
      >
        <div className="h-14 px-3 flex items-center justify-between gap-2 max-w-lg mx-auto">
          {/* Left: Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label={t('nav.openMenu')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface)] active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Center: Brand Logo */}
          <Link
            to="/"
            className="flex flex-col items-center justify-center text-center -space-y-0.5 group"
          >
            <div className="flex items-center gap-1.5">
              <img
                src="/brand/logo-symbol.png"
                alt="DELAAFRO"
                className="w-6 h-6 object-contain"
              />
              <span className="font-serif font-extrabold text-lg tracking-wider text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                DELAAFRO
              </span>
            </div>
            <span className="text-[8px] font-bold tracking-[0.2em] text-[var(--accent-text)] uppercase">
              {t('nav.subtitleBrand')}
            </span>
          </Link>

          {/* Right: Search, Cart, Profile */}
          <div className="flex items-center gap-0.5">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label={t('nav.searchProduct')}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text)]/80 hover:bg-[var(--surface)] active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Cart Button */}
            <Link
              to="/panier"
              aria-label={t('nav.cartLabel', { count: totalCount })}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface)] active:scale-95 transition-all relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <ShoppingBag className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[var(--accent)] text-[#FBF5EC] text-[9px] font-extrabold flex items-center justify-center shadow-sm animate-pulse-subtle">
                  {totalCount > 99 ? '99+' : totalCount}
                </span>
              )}
            </Link>

            {/* Contact / Profile Link */}
            <Link
              to="/contact"
              aria-label={t('nav.profileContact')}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text)]/80 hover:bg-[var(--surface)] active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <User className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      {/* Lateral Menu Drawer */}
      <MobileDrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Live Search Modal */}
      <MobileSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
