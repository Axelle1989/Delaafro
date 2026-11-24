import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Heart, Check, Plus, Minus, ChevronDown, ChevronUp, MessageCircle, Sparkles, ShieldCheck, Truck, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCartStore } from '@/store/useCartStore';
import { useMobileAddedSheetStore } from '../store/useMobileAddedSheetStore';
import { formatFCFA } from '@/lib/formatters';
import { buildWhatsAppDirectProductUrl } from '@/lib/whatsapp';
import { getProductImage } from '@/lib/productImage';
import { ProductVariant } from '@/types';

export const MobileProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, settings } = useSettingsStore();
  const addItem = useCartStore((state) => state.addItem);
  const totalCount = useCartStore((state) => state.getTotalCount());
  const openSheet = useMobileAddedSheetStore((state) => state.openSheet);

  const product = products.find((p) => p.slug === slug);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Accordions state
  const [openAccordion, setOpenAccordion] = useState<'benefits' | 'ingredients' | 'usage' | null>('benefits');

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // Sync favorites
  useEffect(() => {
    if (!product) return;
    try {
      const stored = localStorage.getItem('delaafro-favorites');
      if (stored) {
        const favs: string[] = JSON.parse(stored);
        setIsFavorite(favs.includes(product.id));
      }
    } catch (e) {}
  }, [product]);

  const toggleFavorite = () => {
    if (!product) return;
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

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="font-serif text-xl font-bold text-brun-nuit">Produit non trouvé</h2>
        <p className="text-xs text-brun-nuit/60">Ce soin n'est plus disponible ou l'adresse est incorrecte.</p>
        <Link
          to="/nos-gammes"
          className="px-6 py-2.5 rounded-full bg-terracotta text-white font-bold text-xs uppercase"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  const effectivePrice = product.price;

  const handleAddToCart = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch (err) {}
    }
    addItem(product, quantity, selectedVariant);
    openSheet(product, quantity);
  };

  const whatsAppDirectUrl = buildWhatsAppDirectProductUrl(
    product.name,
    effectivePrice * quantity,
    selectedVariant?.name,
    settings.whatsappNumber
  );

  return (
    <div className="flex flex-col min-h-screen bg-creme">
      {/* 1. Header Bar: Return + Short Title + Cart */}
      <header className="sticky top-0 z-40 bg-creme-light/95 backdrop-blur-md border-b border-sable/40 shadow-xs pt-[env(safe-area-inset-top,0px)]">
        <div className="h-14 px-3 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Retour"
            className="w-10 h-10 rounded-full flex items-center justify-center text-brun-nuit hover:bg-sable/30 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="font-serif font-bold text-sm text-brun-nuit truncate max-w-[200px] text-center">
            {product.name}
          </h2>

          <Link
            to="/panier"
            aria-label={`Panier (${totalCount} articles)`}
            className="w-10 h-10 rounded-full flex items-center justify-center text-brun-nuit hover:bg-sable/30 active:scale-95 transition-all relative"
          >
            <ShoppingBag className="w-5 h-5 text-terracotta" />
            {totalCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-terracotta text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                {totalCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* 2. Scrollable Product Body */}
      <div className="flex-1 pb-36 space-y-5">
        {/* Gallery / Image Carousel */}
        <div className="relative aspect-square w-full bg-white border-b border-sable/40 overflow-hidden flex items-center justify-center">
          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-terracotta text-terracotta' : 'text-brun-nuit/40'
              }`}
            />
          </button>

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brun-nuit text-creme-light shadow-xs">
              {product.badge}
            </span>
          )}

          <img
            src={getProductImage(product, currentImageIndex)}
            alt={`${product.name} DELAAFRO`}
            className="w-full h-full object-cover object-center"
          />

          {/* Dots Pagination if multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`rounded-full h-1.5 transition-all ${
                    currentImageIndex === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                  aria-label={`Afficher la photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Selector if > 1 image */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 px-4 overflow-x-auto pb-1 scrollbar-none">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-14 h-14 rounded-xl overflow-hidden bg-white border shrink-0 transition-all p-1 ${
                  currentImageIndex === idx
                    ? 'border-terracotta ring-2 ring-terracotta/30 shadow-xs'
                    : 'border-sable/50 opacity-70'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}

        {/* Product Details Section */}
        <div className="px-4 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cuivre block">
            {product.categoryLabel || product.category}
          </span>

          <h1 className="font-serif text-2xl font-bold text-brun-nuit leading-tight">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3">
            <span className="font-serif font-extrabold text-2xl text-terracotta">
              {formatFCFA(effectivePrice)}
            </span>
            {product.originalPrice && product.originalPrice > effectivePrice && (
              <span className="text-sm text-brun-nuit/40 line-through">
                {formatFCFA(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-xs text-brun-nuit/75 leading-relaxed pt-1">
            {product.shortDescription || product.subtitle}
          </p>

          {/* Variant Selector if available */}
          {product.variants && product.variants.length > 0 && (
            <div className="pt-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit/70 block">
                Format / Contenance :
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      selectedVariant?.name === v.name
                        ? 'bg-brun-nuit text-white border-brun-nuit shadow-xs'
                        : 'bg-white text-brun-nuit border-sable hover:border-brun-nuit/40'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Accordions */}
        <div className="px-4 space-y-2 pt-2">
          {/* Bienfaits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="rounded-2xl bg-white border border-sable/50 overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'benefits' ? null : 'benefits')}
                className="w-full flex items-center justify-between p-4 text-left font-serif font-bold text-sm text-brun-nuit"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-or" />
                  <span>Bienfaits & Actions</span>
                </span>
                {openAccordion === 'benefits' ? (
                  <ChevronUp className="w-4 h-4 text-brun-nuit/50" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-brun-nuit/50" />
                )}
              </button>
              {openAccordion === 'benefits' && (
                <div className="px-4 pb-4 pt-1 border-t border-sable/30 space-y-2 text-xs text-brun-nuit/80">
                  {product.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-feuille shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ingrédients / Composition */}
          {product.composition && product.composition.length > 0 && (
            <div className="rounded-2xl bg-white border border-sable/50 overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'ingredients' ? null : 'ingredients')}
                className="w-full flex items-center justify-between p-4 text-left font-serif font-bold text-sm text-brun-nuit"
              >
                <span className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-feuille" />
                  <span>Composition & Actifs Naturels</span>
                </span>
                {openAccordion === 'ingredients' ? (
                  <ChevronUp className="w-4 h-4 text-brun-nuit/50" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-brun-nuit/50" />
                )}
              </button>
              {openAccordion === 'ingredients' && (
                <div className="px-4 pb-4 pt-1 border-t border-sable/30 space-y-1.5 text-xs text-brun-nuit/80">
                  {product.composition.map((c, i) => (
                    <p key={i} className="leading-relaxed">• {c}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mode d'emploi */}
          {product.usageInstructions && (
            <div className="rounded-2xl bg-white border border-sable/50 overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'usage' ? null : 'usage')}
                className="w-full flex items-center justify-between p-4 text-left font-serif font-bold text-sm text-brun-nuit"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cuivre" />
                  <span>Conseils d'Utilisation</span>
                </span>
                {openAccordion === 'usage' ? (
                  <ChevronUp className="w-4 h-4 text-brun-nuit/50" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-brun-nuit/50" />
                )}
              </button>
              {openAccordion === 'usage' && (
                <div className="px-4 pb-4 pt-1 border-t border-sable/30 text-xs text-brun-nuit/80 leading-relaxed">
                  <p>{product.usageInstructions}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Sticky Bottom Action Bar (Fixed, 0 scroll obstruction) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sable/50 shadow-[0_-4px_20px_rgba(42,20,9,0.08)] p-3 pb-[env(safe-area-inset-bottom,16px)]">
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center rounded-full bg-sable/30 border border-sable p-1 h-12 shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Diminuer la quantité"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-brun-nuit active:scale-90 transition-transform shadow-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-9 text-center font-bold text-xs text-brun-nuit">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Augmenter la quantité"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-brun-nuit active:scale-90 transition-transform shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Big Terracotta Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 rounded-full bg-terracotta hover:bg-terracotta-deep text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ajouter au panier</span>
              <span className="text-white/80 font-normal">|</span>
              <span className="font-extrabold">{formatFCFA(effectivePrice * quantity)}</span>
            </button>
          </div>

          {/* Secondary Direct WhatsApp Checkout Link */}
          <div className="text-center pt-0.5">
            <a
              href={whatsAppDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#128C7E] hover:underline active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]/20" />
              <span>Ou commander directement sur WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProductPage;
