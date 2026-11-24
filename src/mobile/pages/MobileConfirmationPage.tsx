import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, MessageCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';

export const MobileConfirmationPage: React.FC = () => {
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear cart upon reaching confirmation
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-creme flex flex-col justify-between p-6 pt-[env(safe-area-inset-top,24px)] pb-[env(safe-area-inset-bottom,32px)] text-center max-w-md mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* Animated Green Check Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg border-2 border-emerald-300"
        >
          <Check className="w-10 h-10 stroke-[3]" />
        </motion.div>

        {/* Text */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-feuille">
            Étape finale réussie
          </span>
          <h1 className="font-serif text-3xl font-bold text-brun-nuit">
            Commande envoyée !
          </h1>
          <p className="text-sm text-brun-nuit/75 leading-relaxed max-w-xs mx-auto">
            Votre commande a bien été transmise. Notre équipe DELAAFRO vous confirme la disponibilité et le créneau de livraison très vite sur WhatsApp.
          </p>
        </div>

        {/* Reassurance Card */}
        <div className="w-full bg-white rounded-2xl p-4 border border-sable/50 shadow-xs text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 text-terracotta font-bold">
            <MessageCircle className="w-4 h-4" />
            <span>Suivi sur WhatsApp</span>
          </div>
          <p className="text-brun-nuit/70 leading-relaxed text-[11px]">
            Gardez votre discussion WhatsApp ouverte. Vous recevrez le récapitulatif avec le montant exact et les modalités de paiement (MoMo, Moov ou à la livraison).
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-6 w-full">
        <Link
          to="/"
          className="w-full h-12 rounded-full bg-brun-nuit hover:bg-brun-nuit-light text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>

        <Link
          to="/contact"
          className="inline-block text-xs font-semibold text-brun-nuit/70 hover:text-terracotta"
        >
          Une question ? Nous contacter
        </Link>
      </div>
    </div>
  );
};

export default MobileConfirmationPage;
