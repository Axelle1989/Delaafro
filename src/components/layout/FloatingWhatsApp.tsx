import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useSettingsStore();
  const [showTooltip, setShowTooltip] = useState(false);

  // Apparition douce après 8s si non mémorisée comme fermée
  useEffect(() => {
    const isDismissed = localStorage.getItem('delaafro_help_bubble_dismissed') === 'true';
    if (isDismissed) return;

    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTooltip(false);
    localStorage.setItem('delaafro_help_bubble_dismissed', 'true');
  };

  return (
    <aside
      aria-label="Bouton WhatsApp"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none"
    >
      {/* Bulle d'aide discrète (fond crème, bordure fine, texte petit) */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mb-2 max-w-[220px] sm:max-w-[240px] rounded-2xl bg-[#FAF3EA] p-3 shadow-md border border-[#2B1A12]/15 text-[#2B1A12] text-[11px] relative pointer-events-auto"
          >
            <button
              onClick={handleDismiss}
              className="absolute top-1.5 right-1.5 text-[#2B1A12]/40 hover:text-[#2B1A12] p-1 transition-colors"
              aria-label="Fermer le message d'aide"
            >
              <X className="w-3 h-3" strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B4F]" />
              <p className="font-semibold text-[#8B4A2B] text-[11px]">Besoin d’un conseil ?</p>
            </div>
            <p className="text-[#2B1A12]/75 text-[10px] sm:text-[11px] leading-relaxed font-sans">
              Échangez directement avec notre conseillère capillaire béninoise.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton WhatsApp sobre : 52px, vert sauge/forêt (#2F6B4F), ombre légère */}
      <motion.a
        href={buildWhatsAppInquiryUrl(undefined, settings.whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="group relative flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#2F6B4F] hover:bg-[#255840] text-[#FAF3EA] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/40 transition-colors pointer-events-auto"
        aria-label="Discuter sur WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-[#FAF3EA]" strokeWidth={1.5} />
      </motion.a>
    </aside>
  );
};
