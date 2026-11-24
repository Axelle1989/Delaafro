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

  // Keyboard navigation & Esc listener
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

  // Pause native video immediately on unmount or index change
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

  // Associated product if exists
  const linkedProduct = currentVideo.productId
    ? products.find((p) => p.id === currentVideo.productId || p.slug === currentVideo.productId)
    : undefined;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brun-nuit/95 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row items-center justify-center gap-6 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Fermer la vidéo"
            className="absolute -top-3 right-0 md:-top-10 md:right-0 z-30 p-2.5 rounded-full bg-white/20 hover:bg-terracotta text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left / Prev Arrow (Desktop) */}
          {videos.length > 1 && (
            <button
              onClick={handlePrev}
              aria-label="Vidéo précédente"
              className="hidden md:flex p-3 rounded-full bg-white/15 hover:bg-terracotta text-white backdrop-blur-md transition-all shrink-0 -ml-4"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Central Vertical Player (9/16 Ratio, max 85vh) */}
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-2 border-or/40 bg-black shrink-0">
            {canRenderIframe ? (
              <iframe
                key={embedUrl}
                src={embedUrl}
                title={currentVideo.clientName || 'Témoignage vidéo'}
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
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center p-6 text-creme-light">
                <p className="text-sm">Format vidéo non pris en charge.</p>
              </div>
            )}
          </div>

          {/* Right Column / Bottom Sheet: Testimonial details */}
          <div className="w-full max-w-sm rounded-3xl bg-creme-light p-6 shadow-2xl border border-or/30 space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cuivre">
                  <Sparkles className="w-3.5 h-3.5 text-or" />
                  <span>Témoignage Vidéo</span>
                </div>
                <span className="text-xs font-bold text-terracotta bg-terracotta/10 px-2.5 py-0.5 rounded-full">
                  {currentIndex + 1} / {videos.length}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-xl font-bold text-brun-nuit">
                      {currentVideo.clientName || 'Cliente Vérifiée'}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-feuille shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-brun-nuit/70 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                    <span>{currentVideo.city}</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-or">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < currentVideo.rating ? 'fill-current' : 'text-sable fill-sable/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonial text quote if present */}
            {currentVideo.content && (
              <div className="border-l-2 border-or pl-3 py-1">
                <p className="font-serif italic text-sm text-brun-nuit/85 leading-relaxed">
                  « {currentVideo.content} »
                </p>
              </div>
            )}

            {/* Linked Product Card if present */}
            {linkedProduct && (
              <div className="p-3.5 rounded-2xl bg-white border border-sable/50 shadow-sm space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-cuivre">
                  Soin utilisé dans la vidéo :
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={linkedProduct.images[0]}
                    alt={linkedProduct.name}
                    className="w-12 h-12 rounded-xl object-cover border border-sable/40 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="font-serif font-bold text-xs text-brun-nuit truncate">
                      {linkedProduct.name}
                    </h5>
                    <p className="font-serif font-bold text-xs text-terracotta mt-0.5">
                      {linkedProduct.price.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => addItem(linkedProduct, 1)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-full bg-terracotta hover:bg-terracotta-deep text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Ajouter au panier</span>
                </button>
              </div>
            )}

            {/* Mobile Navigation controls */}
            {videos.length > 1 && (
              <div className="pt-2 border-t border-sable/40 flex items-center justify-between">
                <button
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-sable text-xs font-semibold text-brun-nuit hover:bg-sable/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédente</span>
                </button>
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-sable text-xs font-semibold text-brun-nuit hover:bg-sable/20"
                >
                  <span>Suivante</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right / Next Arrow (Desktop) */}
          {videos.length > 1 && (
            <button
              onClick={handleNext}
              aria-label="Vidéo suivante"
              className="hidden md:flex p-3 rounded-full bg-white/15 hover:bg-terracotta text-white backdrop-blur-md transition-all shrink-0 -mr-4"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
