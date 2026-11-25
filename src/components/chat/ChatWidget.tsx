import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { useSettingsStore } from '@/store/useSettingsStore';
import { getSiteImage } from '@/lib/siteImages';

export const ChatWidget: React.FC = () => {
  const { settings } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  return (
    <>
      {/* Fenêtre de chat */}
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Bouton flottant launcher (remplace l'ancien bouton isolé pour éviter 2 bulles) */}
      {!isOpen && (
        <aside
          aria-label="Conseillère capillaire virtuelle Dela"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none"
        >
          {/* Bulle d'invitation discrète au survol ou première visite */}
          <AnimatePresence>
            {!hasPrompted && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: 3 }}
                onAnimationComplete={() => {
                  // Fermer après 10s
                  setTimeout(() => setHasPrompted(true), 10000);
                }}
                className="mb-2.5 max-w-[210px] rounded-2xl bg-[#FAF3EA] border border-[#2B1A12]/15 p-2.5 shadow-md text-[#2B1A12] pointer-events-auto"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Sparkles className="w-3 h-3 text-[#C9A66B]" />
                  <span className="text-[11px] font-semibold text-[#8B4A2B]">Conseil capillaire</span>
                </div>
                <p className="text-[11px] text-[#2B1A12]/80 leading-snug">
                  Une question sur vos cheveux ou rituels ? Dela vous répond !
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton rond principal Dela */}
          <motion.button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setHasPrompted(true);
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.2 }}
            aria-label="Ouvrir le chat avec Dela, conseillère DELAAFRO"
            className="group relative flex items-center justify-center w-[54px] h-[54px] rounded-full bg-[#8B4A2B] hover:bg-[#723C22] text-[#FAF3EA] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#8B4A2B]/40 transition-colors pointer-events-auto border-2 border-[#FAF3EA]"
          >
            {/* Avatar miniature ou icône chat */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#C9A66B]/60">
              <img
                src={getSiteImage(settings, 'chatbotAvatar')}
                alt=""
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Pastille verte en ligne */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#2F6B4F] border-2 border-white shadow-xs" />

            {/* Petite icône message en superposition */}
            <span className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-[#2F6B4F] text-white flex items-center justify-center border border-white shadow-xs">
              <MessageCircle className="w-2.5 h-2.5" />
            </span>
          </motion.button>
        </aside>
      )}
    </>
  );
};
