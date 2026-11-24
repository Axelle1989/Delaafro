import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { formatFCFA } from '@/lib/formatters';
import { getProductImage } from '@/lib/productImage';
import { buildWhatsAppDirectProductUrl } from '@/lib/whatsapp';

interface ProductCardInChatProps {
  slug: string;
  onLinkClick?: () => void;
}

export const ProductCardInChat: React.FC<ProductCardInChatProps> = ({
  slug,
  onLinkClick,
}) => {
  const { products, settings } = useSettingsStore();
  const product = products.find(
    (p) => p.slug === slug || p.id === slug
  );

  if (!product) return null;

  const image = getProductImage(product, 0);
  const whatsAppUrl = buildWhatsAppDirectProductUrl(
    product.name,
    product.price,
    undefined,
    settings.whatsappNumber
  );

  return (
    <div className="mt-2.5 rounded-2xl bg-[#FAF3EA] border border-[#2B1A12]/15 p-2.5 sm:p-3 shadow-xs space-y-2.5 text-[#2B1A12]">
      <div className="flex items-center gap-3">
        {/* Miniature produit */}
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#2B1A12]/10 shrink-0">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>

        {/* Détails produit */}
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#2B1A12] leading-tight truncate">
            {product.name}
          </h4>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-sans font-bold text-xs sm:text-sm text-[#8B4A2B]">
              {formatFCFA(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-[#2B1A12]/40 line-through">
                {formatFCFA(product.originalPrice)}
              </span>
            )}
          </div>
          {product.badge && (
            <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-[#C9A66B]/20 text-[#2B1A12] border border-[#C9A66B]/30">
              {product.badge}
            </span>
          )}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#2B1A12]/10">
        <Link
          to={`/produit/${product.slug}`}
          onClick={onLinkClick}
          className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-full text-[11px] font-semibold bg-white border border-[#2B1A12]/15 text-[#2B1A12] hover:bg-[#FAF3EA] hover:border-[#8B4A2B]/40 transition-colors"
        >
          <span>Voir le soin</span>
          <ArrowRight className="w-3 h-3 text-[#8B4A2B]" strokeWidth={1.5} />
        </Link>

        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-full text-[11px] font-semibold bg-[#2F6B4F] text-[#FAF3EA] hover:bg-[#255840] transition-colors shadow-xs"
        >
          <MessageCircle className="w-3 h-3 text-[#FAF3EA]" strokeWidth={1.5} />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
