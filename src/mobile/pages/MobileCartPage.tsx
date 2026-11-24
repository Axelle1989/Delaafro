import React from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ShieldCheck, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { formatFCFA } from '@/lib/formatters';
import { buildWhatsAppCartUrl } from '@/lib/whatsapp';
import { getProductImage } from '@/lib/productImage';

export const MobileCartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const { settings } = useSettingsStore();

  const total = getTotalPrice();
  const isEmpty = items.length === 0;

  const handleCheckoutWhatsApp = () => {
    const url = buildWhatsAppCartUrl(items, total, settings.whatsappNumber);
    window.open(url, '_blank');
    navigate('/confirmation-commande');
  };

  return (
    <div className="flex flex-col min-h-screen bg-creme">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-creme-light/95 backdrop-blur-md border-b border-sable/40 shadow-xs pt-[env(safe-area-inset-top,0px)]">
        <div className="h-14 px-3 flex items-center justify-between gap-3 max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            aria-label="Retour"
            className="w-10 h-10 rounded-full flex items-center justify-center text-brun-nuit hover:bg-sable/30 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="font-serif font-bold text-base text-brun-nuit">
            Mon Panier {items.length > 0 && `(${items.length})`}
          </h1>

          <div className="w-10" />
        </div>
      </header>

      {/* Cart Content */}
      <div className="flex-1 px-4 py-4 max-w-lg mx-auto w-full pb-48">
        {isEmpty ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4 py-12">
            <div className="w-16 h-16 rounded-full bg-sable/40 flex items-center justify-center text-terracotta">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="font-serif font-bold text-lg text-brun-nuit">
                Votre panier est vide
              </h2>
              <p className="text-xs text-brun-nuit/60 max-w-xs mx-auto">
                Prenez soin de votre couronne afro avec nos rituels 100% naturels formulés au Bénin.
              </p>
            </div>
            <Link
              to="/nos-gammes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-terracotta text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-transform"
            >
              <span>Découvrir nos gammes</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const lineTotal = item.product.price * item.quantity;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-sable/50 shadow-xs"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-creme-light overflow-hidden shrink-0 border border-sable/30 flex items-center justify-center p-1">
                    <img
                      src={getProductImage(item.product, 0)}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-serif font-bold text-xs sm:text-sm text-brun-nuit truncate">
                      {item.product.name}
                    </h3>
                    {item.selectedVariant && (
                      <p className="text-[10px] text-brun-nuit/60">
                        {item.selectedVariant.name}
                      </p>
                    )}
                    <span className="font-serif font-extrabold text-xs text-terracotta block">
                      {formatFCFA(lineTotal)}
                    </span>
                  </div>

                  {/* Stepper & Trash */}
                  <div className="flex flex-col items-end justify-between h-16 shrink-0">
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Supprimer cet article"
                      className="p-1 text-brun-nuit/40 hover:text-red-500 active:scale-90 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5 bg-sable/30 rounded-full px-2 py-0.5 border border-sable/50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Diminuer"
                        className="p-0.5 text-brun-nuit active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-brun-nuit min-w-[14px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Augmenter"
                        className="p-0.5 text-brun-nuit active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear cart action */}
            <div className="pt-2 text-right">
              <button
                onClick={clearCart}
                className="text-xs text-brun-nuit/60 hover:text-red-600 underline font-medium"
              >
                Vider le panier
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Checkout Bar (when items present) */}
      {!isEmpty && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-sable/50 shadow-[0_-4px_20px_rgba(42,20,9,0.08)] p-4 pb-[env(safe-area-inset-bottom,16px)]">
          <div className="max-w-lg mx-auto space-y-3">
            {/* Price breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-brun-nuit/70">
                <span>Sous-total</span>
                <span>{formatFCFA(total)}</span>
              </div>
              <div className="flex justify-between text-brun-nuit/70">
                <span>Livraison</span>
                <span className="text-terracotta font-medium">Confirmée sur WhatsApp</span>
              </div>
              <div className="flex justify-between text-base font-serif font-extrabold text-brun-nuit pt-1 border-t border-sable/30">
                <span>Total</span>
                <span className="text-terracotta">{formatFCFA(total)}</span>
              </div>
            </div>

            {/* Big WhatsApp CTA Button */}
            <button
              onClick={handleCheckoutWhatsApp}
              className="w-full h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              <span>Commander sur WhatsApp</span>
            </button>

            {/* Payment & Reassurance Note */}
            <div className="text-[10px] text-brun-nuit/60 text-center leading-tight">
              Paiement à la livraison ou via MTN MoMo / Moov Money après validation de votre commande sur WhatsApp.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileCartPage;
