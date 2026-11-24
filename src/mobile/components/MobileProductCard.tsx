import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { formatFCFA } from '@/lib/formatters';
import { getProductImage } from '@/lib/productImage';
import { useCartStore } from '@/store/useCartStore';
import { useMobileAddedSheetStore } from '../store/useMobileAddedSheetStore';

interface MobileProductCardProps {
  product: Product;
}

export const MobileProductCard: React.FC<MobileProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const openSheet = useMobileAddedSheetStore((state) => state.openSheet);
  const [isFavorite, setIsFavorite] = useState(false);

  // Sync favorites with localStorage (with safe try/catch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('delaafro-favorites');
      if (stored) {
        const favs: string[] = JSON.parse(stored);
        setIsFavorite(favs.includes(product.id));
      }
    } catch (e) {
      // safe fallback
    }
  }, [product.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('delaafro-favorites');
      let favs: string[] = stored ? JSON.parse(stored) : [];
      if (favs.includes(product.id)) {
        favs = favs.filter((id) => id !== product.id);
        setIsFavorite(false);
      } else {
        favs.push(product.id);
        setIsFavorite(true);
      }
      localStorage.setItem('delaafro-favorites', JSON.stringify(favs));
    } catch (e) {
      setIsFavorite(!isFavorite);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Haptic feedback if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch (err) {}
    }

    // Add to cart store
    addItem(product, 1);

    // Trigger bottom confirmation sheet
    openSheet(product, 1);
  };

  return (
    <Link
      to={`/produit/${product.slug}`}
      className="group flex flex-col justify-between bg-white rounded-2xl border border-sable/50 shadow-xs hover:shadow-md transition-all active:scale-[0.98] overflow-hidden select-none"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-creme-light/50 p-3 flex items-center justify-center overflow-hidden">
        {/* Favorite Heart Button */}
        <button
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center shadow-xs active:scale-90 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? 'fill-terracotta text-terracotta'
                : 'text-brun-nuit/40 hover:text-terracotta'
            }`}
          />
        </button>

        {/* Badge if present */}
        {product.badge && (
          <span className="absolute top-2 left-2 z-10 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brun-nuit/85 text-creme-light backdrop-blur-xs">
            {product.badge}
          </span>
        )}

        <img
          src={getProductImage(product, 0)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Details & Actions */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-cuivre block truncate">
            {product.categoryLabel || product.category}
          </span>
          <h3 className="font-serif font-bold text-xs sm:text-sm text-brun-nuit line-clamp-2 mt-0.5 leading-snug">
            {product.name}
          </h3>
          {product.subtitle && (
            <p className="text-[10px] text-brun-nuit/60 line-clamp-1 mt-0.5">
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-sable/30">
          <div>
            <span className="font-serif font-extrabold text-sm text-terracotta block">
              {formatFCFA(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-brun-nuit/40 line-through block -mt-0.5">
                {formatFCFA(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            aria-label={`Ajouter ${product.name} au panier`}
            className="w-9 h-9 rounded-xl bg-terracotta hover:bg-terracotta-deep text-white flex items-center justify-center shadow-xs active:scale-90 transition-all shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};
