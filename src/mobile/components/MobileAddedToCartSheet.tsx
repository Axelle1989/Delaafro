import React, { useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMobileAddedSheetStore } from '../store/useMobileAddedSheetStore';
import { formatFCFA } from '@/lib/formatters';
import { getProductImage } from '@/lib/productImage';

export const MobileAddedToCartSheet: React.FC = () => {
  const { isOpen, product, quantity, closeSheet } = useMobileAddedSheetStore();
  const navigate = useNavigate();

  // Auto-close after 4s
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      closeSheet();
    }, 4000);
    return () => clearTimeout(timer);
  }, [isOpen, closeSheet]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 60 || info.velocity.y > 500) {
      closeSheet();
    }
  };

  const handleGoToCart = () => {
    closeSheet();
    navigate('/panier');
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSheet}
            className="fixed inset-0 bg-brun-nuit/60 backdrop-blur-xs"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="relative w-full max-w-md bg-creme-light rounded-t-3xl shadow-2xl p-5 pb-[env(safe-area-inset-bottom,24px)] z-10 border-t border-sable/50 select-none"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 rounded-full bg-sable/80 mx-auto mb-4" />

            {/* Success Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-brun-nuit leading-tight">
                  Article ajouté au panier !
                </h3>
                <p className="text-xs text-brun-nuit/60">
                  Votre sélection a bien été enregistrée
                </p>
              </div>
            </div>

            {/* Product Snapshot */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-sable/50 mb-5 shadow-xs">
              <div className="w-14 h-14 rounded-xl bg-creme overflow-hidden shrink-0 border border-sable/30 flex items-center justify-center p-1">
                <img
                  src={getProductImage(product, 0)}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-sm text-brun-nuit truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-brun-nuit/60 mt-0.5">
                  Quantité : <span className="font-bold text-brun-nuit">{quantity}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="font-serif font-extrabold text-sm text-terracotta">
                  {formatFCFA(product.price * quantity)}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleGoToCart}
                className="w-full h-12 rounded-full bg-terracotta hover:bg-terracotta-deep text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Voir le panier</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={closeSheet}
                className="w-full py-2.5 text-center text-xs font-semibold text-brun-nuit/70 hover:text-brun-nuit active:scale-95 transition-all"
              >
                Continuer les achats
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
