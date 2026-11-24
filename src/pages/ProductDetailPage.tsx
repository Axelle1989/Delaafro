import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  MessageCircle,
  Check,
  ChevronRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCartStore } from '@/store/useCartStore';
import { formatFCFA } from '@/lib/formatters';
import { buildWhatsAppDirectProductUrl } from '@/lib/whatsapp';
import { getProductImage } from '@/lib/productImage';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductVariant } from '@/types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, settings } = useSettingsStore();
  const { addItem } = useCartStore();

  const product = products.find((p) => p.slug === slug);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-brun-nuit mb-4">
          Produit introuvable
        </h2>
        <p className="text-sm text-brun-nuit/70 mb-8">
          Ce soin n'est plus disponible ou l'adresse est incorrecte.
        </p>
        <Button variant="terracotta" onClick={() => navigate('/boutique')}>
          Retourner à la boutique
        </Button>
      </div>
    );
  }

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category && p.isPublished)
    .slice(0, 3);

  const activeImage = selectedVariant?.image || getProductImage(product, selectedImageIndex);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDirectWhatsApp = () => {
    const url = buildWhatsAppDirectProductUrl(
      product.name,
      product.price,
      selectedVariant?.name,
      settings.whatsappNumber
    );
    window.open(url, '_blank');
  };

  return (
    <div className="py-10 bg-creme min-h-screen">
      <div className="site-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-brun-nuit/60 mb-8 uppercase tracking-wider">
          <Link to="/" className="hover:text-terracotta">
            Accueil
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/boutique" className="hover:text-terracotta">
            Boutique
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brun-nuit font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white shadow-luxury border border-sable/50">
              <img
                src={activeImage}
                alt={`${product.name} DELAAFRO`}
                className="w-full h-full object-cover object-center"
              />

              {product.badge && (
                <div className="absolute top-4 left-4">
                  <Badge
                    variant={
                      product.badge === 'Best-seller' || product.badge === 'Idéal cheveux à forte porosité'
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
            </div>

            {/* Thumbnail selector if multiple images */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      if (selectedVariant?.image) {
                        setSelectedVariant({ ...selectedVariant, image: undefined });
                      }
                    }}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-terracotta scale-105 shadow-md'
                        : 'border-sable opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Order Panel */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="eyebrow">
                {product.categoryLabel || product.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brun-nuit mt-2 leading-tight">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="font-serif italic text-lg sm:text-xl text-terracotta mt-1.5">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-sable/40">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-terracotta">
                {formatFCFA(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-brun-nuit/40 line-through">
                  {formatFCFA(product.originalPrice)}
                </span>
              )}
              <span className="ml-auto text-xs font-semibold text-feuille bg-feuille/10 px-3 py-1 rounded-full">
                {product.inStock ? '✓ En stock au Bénin' : 'Rupture temporaire'}
              </span>
            </div>

            {/* Short Description */}
            <p className="prose-body text-base text-brun-nuit/85 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Variants / Color Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brun-nuit block">
                  Choisir une teinte :{' '}
                  <span className="font-semibold text-terracotta">
                    {selectedVariant?.name || selectedVariant?.colorName}
                  </span>
                </label>
                <div className="flex items-center gap-3">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.name === v.name;
                    return (
                      <button
                        key={v.name}
                        onClick={() => setSelectedVariant(v)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-terracotta bg-terracotta/10 text-terracotta ring-1 ring-terracotta'
                            : 'border-sable hover:border-terracotta bg-white text-brun-nuit'
                        }`}
                      >
                        {v.colorHex && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: v.colorHex }}
                          />
                        )}
                        <span>{v.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brun-nuit">
                  Quantité :
                </span>
                <div className="flex items-center border border-sable rounded-full bg-white px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-brun-nuit/60 hover:text-brun-nuit text-sm font-bold px-1"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold px-3 text-brun-nuit">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-brun-nuit/60 hover:text-brun-nuit text-sm font-bold px-1"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Order Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  variant="terracotta"
                  size="lg"
                  onClick={handleAddToCart}
                  leftIcon={
                    isAdded ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <ShoppingBag className="w-5 h-5" />
                    )
                  }
                  className="w-full justify-center shadow-terracotta-glow"
                >
                  {isAdded ? 'Ajouté au Panier !' : 'Ajouter au Panier'}
                </Button>

                <Button
                  variant="whatsapp"
                  size="lg"
                  onClick={handleDirectWhatsApp}
                  leftIcon={<MessageCircle className="w-5 h-5 fill-white/20" />}
                  className="w-full justify-center shadow-md"
                >
                  Commander sur WhatsApp
                </Button>
              </div>
            </div>

            {/* Reassurance points */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-sable/40 text-xs text-brun-nuit/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cuivre shrink-0" />
                <span>Livraison partout, même hors du Bénin</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-feuille shrink-0" />
                <span>Formulation 100% naturelle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Details Tabs / Sections */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 shadow-luxury border border-sable/60 space-y-10">
          {/* Detailed Description */}
          <div>
            <h3 className="card-title text-2xl font-bold text-brun-nuit mb-4">
              Description Détaillée
            </h3>
            <p className="prose-body text-base sm:text-lg leading-relaxed max-w-4xl">
              {product.longDescription}
            </p>
          </div>

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="border-t border-sable/30 pt-8">
              <h3 className="card-title text-2xl font-bold text-brun-nuit mb-4">
                Bénéfices pour vos Cheveux
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-sable/20">
                    <Check className="w-5 h-5 text-feuille shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-brun-nuit font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Composition & Usage */}
          {(product.composition || product.usageInstructions) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-sable/30 pt-8">
              {product.composition && (
                <div>
                  <h4 className="font-serif text-xl font-bold text-brun-nuit mb-3">
                    Composition & Actifs
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-brun-nuit/80">
                    {product.composition.map((comp, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-or shrink-0" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.usageInstructions && (
                <div>
                  <h4 className="font-serif text-xl font-bold text-brun-nuit mb-3">
                    Conseils d'Utilisation
                  </h4>
                  <p className="text-xs sm:text-sm text-brun-nuit/80 leading-relaxed bg-creme/40 p-4 rounded-2xl border border-sable/40">
                    {product.usageInstructions}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brun-nuit mb-8">
              Vous Aimerez Aussi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

