import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Testimonial } from '@/types';
import { parseVideoUrl, isAllowedIframeUrl } from '@/lib/videoUtils';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCartStore } from '@/store/useCartStore';
import { useI18n } from '@/context/I18nContext';

interface VideoTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Testimonial[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
}

export const VideoTestimonialModal: React.FC<VideoTestimonialModalProps> = ({
  isOpen,
  onClose,
  videos,
  currentIndex,
  onSelectIndex,
}) => {
  const { products } = useSettingsStore();
  const { addItem } = useCartStore();
  const { t, formatNumber, translateProductName, translateTestimonialQuote } = useI18n();
  const videoElementRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videos[currentIndex];

  const handleNext = () => {
    if (videos.length === 0) return;
    onSelectIndex((currentIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    if (videos.length === 0) return;
    onSelectIndex((currentIndex - 1 + videos.length) % videos.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, videos.length]);

  useEffect(() => {
    return () => {
      if (videoElementRef.current) {
        videoElementRef.current.pause();
      }
    };
  }, [currentIndex, isOpen]);

  if (!isOpen || !currentVideo) return null;

  const videoInfo = parseVideoUrl(currentVideo.videoUrl || '');
  const isEmbed = videoInfo.type === 'youtube' || videoInfo.type === 'vimeo';
  const embedUrl = videoInfo.embedUrl || '';
  const canRenderIframe = isEmbed && isAllowedIframeUrl(embedUrl);

  const linkedProduct = currentVideo.productId
    ? products.find((p) => p.id === currentVideo.productId || p.slug === currentVideo.productId)
    : undefined;

  const displayName =
    currentVideo.clientName === 'Cliente Vérifiée'
      ? t('modal.verifiedClient')
      : currentVideo.clientName || t('modal.verifiedClient');
  const quoteText = translateTestimonialQuote(currentVideo.id, currentVideo.content);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t('videos.playAria', { name: displayName, city: currentVideo.city })}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row items-center justify-center gap-6 my-auto"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t('videos.closeVideo')}
            className="absolute -top-3 right-0 md:-top-10 md:right-0 z-30 p-2.5 rounded-full bg-white/20 hover:bg-[var(--accent)] text-white backdrop-blur-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {videos.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label={t('videos.prev')}
              className="hidden md:flex p-3 rounded-full bg-white/15 hover:bg-[var(--accent)] text-white backdrop-blur-md transition-all shrink-0 -ml-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>
          )}

          {/* Central Vertical Player */}
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] rounded-[24px] overflow-hidden shadow-2xl border border-[var(--border)] bg-black shrink-0">
            {canRenderIframe ? (
              <iframe
                key={embedUrl}
                src={embedUrl}
                title={displayName}
                sandbox="allow-scripts allow-same-origin allow-presentation"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : videoInfo.type === 'file' ? (
              <video
                key={currentVideo.videoUrl}
                ref={videoElementRef}
                src={currentVideo.videoUrl}
                controls
                autoPlay
                playsInline
                poster={currentVideo.videoPosterUrl}
                className="w-full h-full object-cover editorial-media"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center p-6 text-[#FBF5EC]">
                <p className="text-sm">{t('videos.unsupportedFormat')}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="w-full max-w-sm rounded-[24px] bg-[var(--card)] text-[var(--text)] p-6 shadow-2xl border border-[var(--border)] space-y-4 max-h-[85vh] overflow-y-auto theme-surface">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent-text)]">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" aria-hidden="true" />
                  <span>{t('videos.modalBadge')}</span>
                </div>
                <span className="text-xs font-bold text-[var(--accent-text)] bg-[var(--accent)]/12 px-2.5 py-0.5 rounded-full">
                  {currentIndex + 1} / {videos.length}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-xl font-bold text-[var(--text)]">
                      {displayName}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-feuille shrink-0" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" aria-hidden="true" />
                    <span>{currentVideo.city}</span>
                  </div>
                </div>

                <div
                  className="flex items-center gap-0.5 text-[var(--gold)]"
                  aria-label={t('quote.ratingAria', { rating: currentVideo.rating })}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < currentVideo.rating ? 'fill-current' : 'opacity-25'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            </div>

            {quoteText && (
              <div className="border-l-2 border-[var(--gold)] pl-3 py-1">
                <p className="font-serif italic text-sm text-[var(--text)]/90 leading-relaxed">
                  « {quoteText} »
                </p>
              </div>
            )}

            {linkedProduct && (
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent-text)]">
                  {t('videos.productUsed')}
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={linkedProduct.images[0]}
                    alt={translateProductName(linkedProduct.name)}
                    className="w-12 h-12 rounded-xl object-cover border border-[var(--border)] shrink-0 editorial-media"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="font-serif font-bold text-xs text-[var(--text)] truncate">
                      {translateProductName(linkedProduct.name)}
                    </h5>
                    <p className="font-serif font-bold text-xs text-[var(--accent-text)] mt-0.5">
                      {formatNumber(linkedProduct.price)} FCFA
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => addItem(linkedProduct, 1)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[#FBF5EC] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('videos.addToCart')}</span>
                </button>
              </div>
            )}

            {videos.length > 1 && (
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span>{t('videos.prevShort')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <span>{t('videos.nextShort')}</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {videos.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label={t('videos.next')}
              className="hidden md:flex p-3 rounded-full bg-white/15 hover:bg-[var(--accent)] text-white backdrop-blur-md transition-all shrink-0 -mr-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            >
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
