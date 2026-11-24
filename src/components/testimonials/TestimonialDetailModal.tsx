import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ShoppingBag,
  MessageCircle,
  Quote,
} from 'lucide-react';
import { Testimonial, Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { buildWhatsAppDirectProductUrl } from '@/lib/whatsapp';
import { formatFCFA } from '@/lib/formatters';
import { getProductImage } from '@/lib/productImage';

interface TestimonialDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonials: Testimonial[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
}

export const TestimonialDetailModal: React.FC<TestimonialDetailModalProps> = ({
  isOpen,
  onClose,
  testimonials,
  currentIndex,
  onSelectIndex,
}) => {
  const { products, settings } = useSettingsStore();
  const { addItem } = useCartStore();

  const currentTestimonial = testimonials[currentIndex];

  // Trouve le produit associé s'il existe
  const linkedProduct: Product | undefined = currentTestimonial
    ? products.find(
        (p) =>
          p.id === currentTestimonial.productId ||
          p.slug === currentTestimonial.productId ||
          p.name.toLowerCase().includes((currentTestimonial.productName || '').toLowerCase().slice(0, 8))
      )
    : undefined;

  const handleNext = () => {
    if (testimonials.length === 0) return;
    onSelectIndex((currentIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    onSelectIndex((currentIndex - 1 + testimonials.length) % testimonials.length);
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
  }, [isOpen, currentIndex, testimonials.length]);

  if (!isOpen || !currentTestimonial) return null;

  const photo =
    currentTestimonial.photoUrl ||
    currentTestimonial.avatarUrl ||
    '/products/lifestyle/gamme-complete-portrait-afro.jpg';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brun-nuit/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-creme rounded-3xl shadow-2xl border-2 border-or/40 overflow-hidden z-10 my-auto flex flex-col md:flex-row max-h-[92vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2.5 rounded-full bg-brun-nuit/80 text-creme-light hover:bg-terracotta hover:text-white transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Big Photo with Luxury Frame (Clean, no dark veil or overlay) */}
          <div className="relative md:w-1/2 bg-brun-nuit shrink-0 flex items-center justify-center min-h-[260px] sm:min-h-[340px] md:min-h-full overflow-hidden">
            <img
              src={photo}
              alt={`Témoignage photo de ${currentTestimonial.clientName}`}
              className="w-full h-full object-cover object-center max-h-[420px] md:max-h-none"
            />

            {/* Floating Navigation Arrows on Photo (Mobile) */}
            <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none md:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="pointer-events-auto p-2 rounded-full bg-brun-nuit/70 text-white hover:bg-terracotta transition-colors backdrop-blur-sm"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="pointer-events-auto p-2 rounded-full bg-brun-nuit/70 text-white hover:bg-terracotta transition-colors backdrop-blur-sm"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column: Full Details, Testimonial Text & Product Action */}
          <div className="md:w-1/2 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4 sm:space-y-5">
              {/* Header: Client identity & Stars */}
              <div className="border-b border-sable/40 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cuivre">
                    <Sparkles className="w-3.5 h-3.5 text-or" />
                    <span>Retour d'Expérience Réel</span>
                  </div>

                  {/* Testimonial Counter */}
                  <span className="text-xs font-bold text-terracotta bg-terracotta/10 px-2.5 py-0.5 rounded-full">
                    {currentIndex + 1} / {testimonials.length}
                  </span>
                </div>

                <div className="mt-2 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-brun-nuit">
                        Cliente Vérifiée
                      </h3>
                      <CheckCircle2 className="w-4 h-4 text-feuille shrink-0" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-brun-nuit/70 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                      <span>{currentTestimonial.city}</span>
                      {currentTestimonial.usageDuration && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-terracotta">
                            {currentTestimonial.usageDuration}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Hair type and verified result badges */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-feuille/15 text-feuille border border-feuille/30">
                        <CheckCircle2 className="w-3 h-3 text-feuille" />
                        <span>Résultat Vérifié</span>
                      </span>
                      {currentTestimonial.hairType && (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brun-nuit/10 text-brun-nuit border border-sable/60">
                          {currentTestimonial.hairType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 shrink-0 pt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < currentTestimonial.rating
                            ? 'text-or fill-or'
                            : 'text-sable fill-sable/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Testimonial Quote */}
              <div className="relative pl-6 sm:pl-7 border-l-2 border-or/60 py-1">
                <Quote className="absolute top-0 left-0 w-5 h-5 text-or/60 -translate-x-3.5 bg-creme" />
                <p className="font-serif italic text-base sm:text-lg text-brun-nuit leading-relaxed">
                  « {currentTestimonial.content} »
                </p>
              </div>

              {/* Tested Product Box (if linked) */}
              {linkedProduct ? (
                <div className="rounded-2xl bg-white p-3.5 sm:p-4 border border-sable/50 shadow-sm space-y-3">
                  <div className="eyebrow text-xs text-cuivre">
                    Soin testé et recommandé :
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={getProductImage(linkedProduct, 0)}
                      alt={linkedProduct.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-sable/30 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="card-title text-sm sm:text-base font-bold text-brun-nuit truncate">
                        {linkedProduct.name}
                      </h5>
                      <p className="card-text text-xs sm:text-sm text-brun-nuit/70 line-clamp-1 mt-0.5">
                        {linkedProduct.subtitle || linkedProduct.shortDescription}
                      </p>
                      <div className="product-price text-base font-bold text-terracotta mt-1">
                        {formatFCFA(linkedProduct.price)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => addItem(linkedProduct, 1)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-terracotta hover:bg-terracotta-deep text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Au Panier</span>
                    </button>

                    <a
                      href={buildWhatsAppDirectProductUrl(
                        linkedProduct.name,
                        linkedProduct.price,
                        undefined,
                        settings.whatsappNumber
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white text-xs font-semibold uppercase tracking-wider border border-[#25D366]/30 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : currentTestimonial.productName ? (
                <div className="rounded-xl bg-white/80 p-3 border border-sable/40 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-terracotta shrink-0" />
                  <div className="text-xs text-brun-nuit">
                    <span className="font-bold">Soin utilisé : </span>
                    <span className="text-terracotta font-semibold">
                      {currentTestimonial.productName}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Bottom Nav Controls (Desktop & Mobile) */}
            <div className="mt-6 pt-4 border-t border-sable/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cuivre/30 text-xs font-semibold text-brun-nuit hover:bg-terracotta hover:text-white hover:border-terracotta transition-all bg-white shadow-sm"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Précédent</span>
                </button>
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cuivre/30 text-xs font-semibold text-brun-nuit hover:bg-terracotta hover:text-white hover:border-terracotta transition-all bg-white shadow-sm"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-[11px] text-brun-nuit/50 hidden sm:inline">
                Astuce : Flèches ◄ ► au clavier
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

