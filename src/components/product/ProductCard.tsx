import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Check, MessageCircle } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { formatFCFA } from '@/lib/formatters';
import { Badge } from '@/components/common/Badge';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { buildWhatsAppDirectProductUrl } from '@/lib/whatsapp';
import { getProductImage } from '@/lib/productImage';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addItem } = useCartStore();
  const { settings } = useSettingsStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [isAdded, setIsAdded] = useState(false);

  // Active image based on variant or default
  const activeImage = selectedVariant?.image || getProductImage(product, 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleDirectWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = buildWhatsAppDirectProductUrl(
      product.name,
      product.price,
      selectedVariant?.name,
      settings.whatsappNumber
    );
    window.open(url, '_blank');
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-4 shadow-luxury hover:shadow-luxury-hover border border-sable/50 transition-all duration-300 shimmer-card ${className}`}
    >
      {/* Top Media & Badges */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-creme-dark/30">
        <Link to={`/produit/${product.slug}`}>
          <img
            src={activeImage}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badge Pill */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
            <Badge
              variant={
                product.badge === 'Best-seller'
                  ? 'gold'
                  : product.badge === 'Promo'
                  ? 'terracotta'
                  : 'neutral'
              }
            >
              {product.badge}
            </Badge>
          </div>
        )}

        {/* Quick View Button Overlay */}
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/produit/${product.slug}`}
            className="p-2 sm:p-2.5 rounded-full bg-white/90 text-brun-nuit backdrop-blur-sm shadow-md hover:bg-terracotta hover:text-white transition-colors"
            aria-label={`Détails de ${product.name}`}
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 pt-3 sm:pt-4 pb-2">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-terracotta line-clamp-1 leading-tight">
          {product.categoryLabel || product.category}
        </span>

        <Link to={`/produit/${product.slug}`} className="mt-1">
          <h3 className="card-title text-base sm:text-lg hover:text-terracotta transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 text-sm text-brun-nuit/75 line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Color Swatches (if variants exist) */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-2.5 sm:mt-3 flex items-center gap-2">
            <span className="text-xs text-brun-nuit/70 font-medium">Teinte :</span>
            <div className="flex items-center gap-1.5">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant?.name === variant.name;
                return (
                  <button
                    key={variant.name}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedVariant(variant);
                    }}
                    title={variant.name}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-transform border ${
                      isSelected
                        ? 'ring-2 ring-terracotta scale-110 border-white'
                        : 'border-black/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: variant.colorHex || '#ccc' }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Price Row */}
        <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
          <span className="font-serif text-lg sm:text-xl font-bold text-terracotta">
            {formatFCFA(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-brun-nuit/40 line-through">
              {formatFCFA(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons: Add to Cart & Direct WhatsApp (Height: 48px / h-12) */}
      <div className="mt-2 grid grid-cols-5 gap-2 pt-2 border-t border-sable/30">
        <button
          onClick={handleAddToCart}
          className={`col-span-4 h-12 flex items-center justify-center gap-2 px-3 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 ${
            isAdded
              ? 'bg-feuille text-white'
              : 'bg-terracotta text-white hover:bg-terracotta-deep shadow-sm hover:shadow-terracotta-glow'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 shrink-0" />
              <span>Ajouté !</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Ajouter</span>
            </>
          )}
        </button>

        <button
          onClick={handleDirectWhatsApp}
          title="Commander directement sur WhatsApp"
          className="col-span-1 h-12 flex items-center justify-center rounded-full bg-whatsapp/15 hover:bg-whatsapp text-whatsapp-dark hover:text-white transition-colors border border-whatsapp/30 active:scale-95"
          aria-label="Commander ce produit sur WhatsApp"
        >
          <MessageCircle className="w-4 h-4 fill-current/20" />
        </button>
      </div>
    </motion.div>
  );
};

