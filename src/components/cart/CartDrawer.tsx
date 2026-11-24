import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight, Sparkles, Gift } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { formatFCFA } from '@/lib/formatters';
import { buildWhatsAppCartUrl } from '@/lib/whatsapp';
import { getProductImage } from '@/lib/productImage';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
    clearCart,
    giftWrap,
    setGiftWrap,
  } = useCartStore();
  const { settings } = useSettingsStore();

  const [customerName, setCustomerName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');

  const giftWrapPrice = settings.giftWrapPrice || 0;
  const totalPrice = getTotalPrice(giftWrapPrice);

  const handleWhatsAppCheckout = () => {
    const url = buildWhatsAppCartUrl(items, totalPrice, settings.whatsappNumber, {
      name: customerName,
      location: deliveryLocation,
      giftWrap,
      giftWrapPrice,
    });
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-brun-nuit/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-creme shadow-2xl flex flex-col justify-between border-l border-sable/50"
          >
            {/* Header */}
            <div className="p-6 border-b border-sable/40 flex items-center justify-between bg-creme-light">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-terracotta" />
                <h3 className="card-title text-xl font-bold text-brun-nuit">
                  Mon Panier de Soins
                </h3>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full text-brun-nuit/60 hover:text-brun-nuit hover:bg-sable/30 transition-colors"
                aria-label="Fermer le panier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-sable/40 flex items-center justify-center mb-4 text-terracotta/60">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-brun-nuit mb-2">
                    Votre panier est vide
                  </h4>
                  <p className="text-sm text-brun-nuit/70 max-w-xs mb-6">
                    Offrez à votre chevelure crépue l'excellence des soins botaniques formulés au Bénin.
                  </p>
                  <Button
                    variant="terracotta"
                    onClick={closeCart}
                    as="a"
                    href="/#gammes"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Découvrir nos gammes
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-brun-nuit/60 pb-1">
                    <span>{items.length} soin(s) sélectionné(s)</span>
                    <button
                      onClick={clearCart}
                      className="text-terracotta hover:underline text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Vider le panier
                    </button>
                  </div>

                  <div className="divide-y divide-sable/40">
                    {items.map((item) => (
                      <div key={item.id} className="py-4 flex gap-4 items-center">
                        <img
                          src={getProductImage(item.product, 0)}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover border border-sable/60 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="card-title text-sm sm:text-base font-bold text-brun-nuit truncate">
                            {item.product.name}
                          </h5>
                          {item.selectedVariant && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {item.selectedVariant.colorHex && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                                  style={{ backgroundColor: item.selectedVariant.colorHex }}
                                />
                              )}
                              <span className="text-xs text-cuivre-dark font-medium">
                                {item.selectedVariant.name || item.selectedVariant.colorName}
                              </span>
                            </div>
                          )}
                          <p className="product-price text-sm font-bold text-terracotta mt-1">
                            {formatFCFA(item.product.price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center border border-sable rounded-full bg-creme-light px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-brun-nuit/60 hover:text-brun-nuit p-0.5"
                              aria-label="Diminuer la quantité"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-2 text-brun-nuit min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-brun-nuit/60 hover:text-brun-nuit p-0.5"
                              aria-label="Augmenter la quantité"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-brun-nuit/40 hover:text-red-600 transition-colors"
                            aria-label="Supprimer cet article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gift wrap option */}
                  <div className="bg-creme-light p-3.5 rounded-2xl border border-sable/60 mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src="/products/packaging/sachet-cadeau-delaafro.jpg"
                        alt="Sachet cadeau DELAAFRO"
                        className="w-12 h-12 rounded-xl object-cover border border-sable/50 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Gift className="w-3.5 h-3.5 text-terracotta" />
                          <span className="text-xs font-bold text-brun-nuit">
                            Emballage cadeau prestige
                          </span>
                        </div>
                        <p className="text-[10px] text-brun-nuit/70">
                          Sachet officiel DELAAFRO & ruban soyeux
                        </p>
                        <span className="text-xs font-bold text-terracotta">
                          {giftWrapPrice > 0 ? `+ ${formatFCFA(giftWrapPrice)}` : 'Inclus / Offert'}
                        </span>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="w-5 h-5 rounded text-terracotta focus:ring-terracotta border-sable cursor-pointer"
                      aria-label="Ajouter un emballage cadeau prestige"
                    />
                  </div>

                  {/* Delivery Location inputs for WhatsApp preparation */}
                  <div className="bg-sable/30 p-4 rounded-2xl space-y-3 mt-4 border border-sable/60">
                    <p className="text-xs font-semibold text-brun-nuit uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-or" />
                      Informations de livraison (optionnel)
                    </p>
                    <input
                      type="text"
                      placeholder="Votre nom complet"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-sable bg-white focus:outline-none focus:border-terracotta"
                    />
                    <input
                      type="text"
                      placeholder="Pays, ville, quartier (ex : Bénin, Cotonou, Cadjèhoun)"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-sable bg-white focus:outline-none focus:border-terracotta"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer Summary & WhatsApp Order CTA */}
            {items.length > 0 && (
              <div className="p-6 border-t border-sable/40 bg-creme-light space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base sm:text-lg font-bold text-brun-nuit">Total de la commande</span>
                  <span className="product-price text-2xl font-bold text-terracotta">
                    {formatFCFA(totalPrice)}
                  </span>
                </div>

                <p className="text-[11px] text-brun-nuit/70 leading-relaxed text-center">
                  🌍 Livraison partout, même hors du Bénin. Paiement à la livraison au Bénin ou convenu sur WhatsApp.
                </p>

                <Button
                  variant="whatsapp"
                  size="lg"
                  onClick={handleWhatsAppCheckout}
                  leftIcon={<MessageCircle className="w-5 h-5 fill-white/20" />}
                  className="w-full justify-center shadow-lg hover:shadow-xl"
                >
                  Envoyer ma commande sur WhatsApp
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

