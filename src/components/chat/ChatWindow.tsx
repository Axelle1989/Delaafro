import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  RotateCcw,
  Send,
  MessageCircle,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { useSettingsStore } from '@/store/useSettingsStore';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';
import { getSiteImage } from '@/lib/siteImages';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SUGGESTIONS = [
  'Quelle routine pour mes cheveux ?',
  'Découvrir les gammes',
  'Livraison et paiement',
  'Parler à un humain',
];

export const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const shouldReduceMotion = useReducedMotion();
  const { settings } = useSettingsStore();
  const { messages, isLoading, error, sendMessage, retryLastMessage, clearMessages } = useChat();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const whatsAppUrl = buildWhatsAppInquiryUrl(undefined, settings.whatsappNumber);

  // Auto-scroll en bas lors de nouveaux messages ou de streaming
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : behavior,
      block: 'end',
    });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('auto');
      // Focus sur le champ de saisie
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isLoading]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    if (suggestion === 'Parler à un humain') {
      sendMessage("J'aimerais échanger directement avec une conseillère humaine sur WhatsApp.");
    } else {
      sendMessage(suggestion);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Discussion avec Dela, conseillère DELAAFRO"
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[380px] h-full sm:h-[560px] rounded-none sm:rounded-[20px] bg-[#FAF3EA] border border-[#2B1A12]/15 shadow-2xl flex flex-col overflow-hidden select-none"
      >
        {/* =========================================================================
            1. EN-TÊTE TERRACOTTA ÉLÉGANT
        ========================================================================= */}
        <div className="bg-[#8B4A2B] text-[#FAF3EA] px-4 py-3 sm:py-3.5 flex items-center justify-between shrink-0 shadow-xs border-b border-[#FAF3EA]/10">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar rond de Dela avec pastille en ligne */}
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#C9A66B]/50 shrink-0 bg-[#2B1A12]">
              <img
                src={getSiteImage(settings, 'chatbotAvatar')}
                alt="Dela, conseillère DELAAFRO"
                className="w-full h-full object-cover object-top"
              />
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#2F6B4F] border-2 border-[#8B4A2B]"
                title="En ligne"
                aria-label="En ligne"
              />
            </div>

            {/* Nom & Sous-titre */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-sm tracking-wide text-white leading-none">
                  Dela
                </h3>
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-[#C9A66B]/20 text-[#C9A66B] border border-[#C9A66B]/30">
                  IA
                </span>
              </div>
              <p className="text-[11px] text-[#FAF3EA]/80 truncate mt-0.5 font-sans">
                Conseillère capillaire DELAAFRO
              </p>
            </div>
          </div>

          {/* Actions : WhatsApp direct, Effacer, Fermer */}
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Parler sur WhatsApp"
              title="Parler directement sur WhatsApp"
              className="p-1.5 rounded-full text-[#FAF3EA]/90 hover:text-white hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#C9A66B]" strokeWidth={1.5} />
            </a>

            <button
              onClick={clearMessages}
              aria-label="Effacer la conversation"
              title="Effacer la conversation"
              className="p-1.5 rounded-full text-[#FAF3EA]/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

            <button
              onClick={onClose}
              aria-label="Fermer le chat"
              className="p-1.5 rounded-full text-[#FAF3EA]/80 hover:text-white hover:bg-white/10 transition-colors ml-0.5"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. ZONE DES MESSAGES
        ========================================================================= */}
        <div
          role="log"
          aria-live="polite"
          className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 scrollbar-thin select-text"
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onLinkClick={onClose} />
          ))}

          {/* Indicateur de chargement / Dela écrit */}
          {isLoading && (
            <div className="flex items-center gap-1.5 bg-white border border-[#2B1A12]/10 rounded-2xl rounded-tl-xs px-3.5 py-2.5 max-w-[100px] shadow-xs">
              <span className="text-[11px] text-[#2B1A12]/60 font-sans mr-1">Dela</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B4A2B] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B4A2B] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B4A2B] animate-bounce" />
              </div>
            </div>
          )}

          {/* État d'erreur avec bouton Réessayer */}
          {error && (
            <div className="rounded-xl bg-[#8B4A2B]/10 border border-[#8B4A2B]/20 p-2.5 text-xs text-[#8B4A2B] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#8B4A2B]" />
              <div className="flex-1 min-w-0">
                <p className="leading-snug">{error}</p>
                <button
                  onClick={retryLastMessage}
                  className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#8B4A2B] underline hover:text-[#723C22]"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Réessayer</span>
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* =========================================================================
            3. SUGGESTIONS RAPIDES (CHIPS) AU DÉMARRAGE
        ========================================================================= */}
        {messages.length <= 2 && (
          <div className="px-3 py-1.5 border-t border-[#2B1A12]/5 bg-[#FAF3EA]/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none snap-x">
            {QUICK_SUGGESTIONS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(chip)}
                disabled={isLoading}
                className="snap-start shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white text-[#2B1A12]/80 border border-[#2B1A12]/15 hover:border-[#8B4A2B]/50 hover:text-[#8B4A2B] hover:bg-white transition-colors duration-150 disabled:opacity-50 whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* =========================================================================
            4. CHAMP DE SAISIE DE MESSAGE
        ========================================================================= */}
        <div className="p-2.5 sm:p-3 bg-white border-t border-[#2B1A12]/10 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 min-w-0 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question à Dela..."
                rows={1}
                maxLength={500}
                className="w-full resize-none rounded-xl bg-[#FAF3EA]/60 border border-[#2B1A12]/15 px-3 py-2 text-xs sm:text-sm text-[#2B1A12] placeholder-[#2B1A12]/45 focus:outline-none focus:ring-1 focus:ring-[#8B4A2B] focus:border-[#8B4A2B] transition-all max-h-24 overflow-y-auto font-sans"
              />
              {/* Compteur de caractères si > 300 */}
              {input.length > 300 && (
                <span className="absolute bottom-1 right-2 text-[10px] text-[#2B1A12]/50">
                  {input.length}/500
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Envoyer le message"
              className="w-9 h-9 rounded-full bg-[#8B4A2B] hover:bg-[#723C22] disabled:opacity-40 disabled:cursor-not-allowed text-[#FAF3EA] flex items-center justify-center shrink-0 shadow-xs transition-colors duration-200"
            >
              <Send className="w-4 h-4 translate-x-0.5" strokeWidth={1.5} />
            </button>
          </form>

          {/* Mention de réassurance discrète */}
          <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-[#2B1A12]/50">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#C9A66B]" />
              Conseils naturels personnalisés
            </span>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8B4A2B] transition-colors"
            >
              Équipe WhatsApp →
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
