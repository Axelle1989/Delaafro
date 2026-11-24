import React, { useState } from 'react';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { MobileDrawerMenu } from './MobileDrawerMenu';
import { MobileSearchModal } from './MobileSearchModal';

export const MobileTopBar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const totalCount = useCartStore((state) => state.getTotalCount());
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-creme-light/95 backdrop-blur-md border-b border-sable/40 shadow-sm pt-[env(safe-area-inset-top,0px)]">
        <div className="h-14 px-3 flex items-center justify-between gap-2 max-w-lg mx-auto">
          {/* Left: Hamburger Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Ouvrir le menu de navigation"
            className="w-10 h-10 rounded-full flex items-center justify-center text-brun-nuit hover:bg-sable/30 active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5" />
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
              <span className="font-serif font-extrabold text-lg tracking-wider text-brun-nuit group-hover:text-terracotta transition-colors">
                DELAAFRO
              </span>
            </div>
            <span className="text-[8px] font-bold tracking-[0.2em] text-terracotta uppercase">
              Bénin • Soins Naturels
            </span>
          </Link>

          {/* Right: Search, Cart, Profile */}
          <div className="flex items-center gap-0.5">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Rechercher un produit"
              className="w-9 h-9 rounded-full flex items-center justify-center text-brun-nuit/80 hover:bg-sable/30 active:scale-95 transition-all"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Button */}
            <Link
              to="/panier"
              aria-label={`Panier d'achats avec ${totalCount} articles`}
              className="w-9 h-9 rounded-full flex items-center justify-center text-brun-nuit hover:bg-sable/30 active:scale-95 transition-all relative"
            >
              <ShoppingBag className="w-4 h-4 text-terracotta" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-terracotta text-white text-[9px] font-extrabold flex items-center justify-center shadow-sm animate-pulse-subtle">
                  {totalCount > 99 ? '99+' : totalCount}
                </span>
              )}
            </Link>

            {/* Contact / Profile Link */}
            <Link
              to="/contact"
              aria-label="Mon profil et contact"
              className="w-9 h-9 rounded-full flex items-center justify-center text-brun-nuit/80 hover:bg-sable/30 active:scale-95 transition-all"
            >
              <User className="w-4 h-4" />
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
