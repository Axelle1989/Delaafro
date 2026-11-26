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
import { useI18n } from '@/context/I18nContext';
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
  const { t, translateProductName, translateDuration, translateTestimonialQuote } = useI18n();

  const currentTestimonial = testimonials[currentIndex];

  const linkedProduct: Product | undefined = currentTestimonial
    ? products.find(
        (p) =>
          p.id === currentTestimonial.productId ||
          p.slug === currentTestimonial.productId ||
          p.name
            .toLowerCase()
            .includes((currentTestimonial.productName || '').toLowerCase().slice(0, 8))
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

  const displayName =
    currentTestimonial.clientName === 'Cliente Vérifiée'
      ? t('modal.verifiedClient')
      : currentTestimonial.clientName || t('modal.verifiedClient');
  const quoteText = translateTestimonialQuote(currentTestimonial.id, currentTestimonial.content);
  const translatedDuration = translateDuration(currentTestimonial.usageDuration);
  const translatedProduct = translateProductName(linkedProduct?.name || currentTestimonial.productName);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t('modal.detailDialogAria', { name: displayName })}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[var(--card)] text-[var(--text)] border border-[var(--border)] rounded-[24px] shadow-2xl overflow-hidden z-10 my-auto flex flex-col md:flex-row max-h-[92vh] theme-surface"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('modal.close')}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2.5 rounded-full bg-[#1A110B]/80 text-[#FBF5EC] hover:bg-[var(--accent)] hover:text-white transition-colors backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Left Column: Big Photo */}
          <div className="relative md:w-1/2 bg-[#1A110B] shrink-0 flex items-center justify-center min-h-[260px] sm:min-h-[340px] md:min-h-full overflow-hidden">
            <img
              src={photo}
              alt={t('modal.detailPhotoAlt', { name: displayName })}
              className="w-full h-full object-cover object-center max-h-[420px] md:max-h-none editorial-media"
            />

            {/* Floating Navigation Arrows on Photo (Mobile) */}
            <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none md:hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="pointer-events-auto p-2 rounded-full bg-[#1A110B]/75 text-white hover:bg-[var(--accent)] transition-colors backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                aria-label={t('modal.prevTestimonial')}
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="pointer-events-auto p-2 rounded-full bg-[#1A110B]/75 text-white hover:bg-[var(--accent)] transition-colors backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                aria-label={t('modal.nextTestimonial')}
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right Column: Full Details */}
          <div className="md:w-1/2 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4 sm:space-y-5">
              {/* Header */}
              <div className="border-b border-[var(--border)] pb-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-text)]">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" aria-hidden="true" />
                    <span>{t('modal.eyebrow')}</span>
                  </div>

                  <span className="text-xs font-bold text-[var(--accent-text)] bg-[var(--accent)]/12 px-2.5 py-0.5 rounded-full">
                    {currentIndex + 1} / {testimonials.length}
                  </span>
                </div>

                <div className="mt-2 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--text)]">
                        {displayName}
                      </h3>
                      <CheckCircle2 className="w-4 h-4 text-feuille shrink-0" aria-hidden="true" />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-secondary)] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" aria-hidden="true" />
                      <span>{currentTestimonial.city}</span>
                      {translatedDuration && (
                        <>
                          <span aria-hidden="true">•</span>
                          <span className="font-medium text-[var(--accent-text)]">
                            {translatedDuration}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[var(--border)]"
                        style={{
                          backgroundColor: 'var(--badge-verified-bg)',
                          color: 'var(--badge-verified-text)',
                        }}
                      >
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                        <span>{t('modal.verifiedResult')}</span>
                      </span>
                      {currentTestimonial.hairType && (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
                          {currentTestimonial.hairType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 5 Stars */}
                  <div
                    className="flex items-center gap-1 shrink-0 pt-1 text-[var(--gold)]"
                    aria-label={t('quote.ratingAria', { rating: currentTestimonial.rating })}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < currentTestimonial.rating ? 'fill-current' : 'opacity-25'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Quote */}
              <div className="relative pl-6 sm:pl-7 border-l-2 border-[var(--gold)]/70 py-1">
                <Quote
                  className="absolute top-0 left-0 w-5 h-5 text-[var(--gold)]/70 -translate-x-3.5 bg-[var(--card)]"
                  aria-hidden="true"
                />
                <p className="font-serif italic text-base sm:text-lg text-[var(--text)] leading-relaxed">
                  « {quoteText} »
                </p>
              </div>

              {/* Tested Product Box */}
              {linkedProduct ? (
                <div className="rounded-2xl bg-[var(--surface)] p-3.5 sm:p-4 border border-[var(--border)] space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-text)]">
                    {t('modal.testedProduct')}
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={getProductImage(linkedProduct, 0)}
                      alt={translatedProduct}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[var(--border)] shrink-0 editorial-media"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="font-serif text-sm sm:text-base font-bold text-[var(--text)] truncate">
                        {translatedProduct}
                      </h5>
                      <div className="font-serif text-base font-bold text-[var(--accent-text)] mt-1">
                        {formatFCFA(linkedProduct.price)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => addItem(linkedProduct, 1)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[#FBF5EC] text-xs font-semibold uppercase tracking-wider shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{t('modal.addToCart')}</span>
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
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white text-xs font-semibold uppercase tracking-wider border border-[#25D366]/35 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{t('modal.whatsapp')}</span>
                    </a>
                  </div>
                </div>
              ) : translatedProduct ? (
                <div className="rounded-xl bg-[var(--surface)] p-3 border border-[var(--border)] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
                  <div className="text-xs text-[var(--text)]">
                    <span className="font-bold">{t('modal.productUsed')} </span>
                    <span className="text-[var(--accent-text)] font-semibold">
                      {translatedProduct}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Bottom Nav Controls */}
            <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--accent)] hover:text-[#FBF5EC] hover:border-[var(--accent)] transition-all bg-[var(--surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('modal.prev')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--accent)] hover:text-[#FBF5EC] hover:border-[var(--accent)] transition-all bg-[var(--surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <span>{t('modal.next')}</span>
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <span className="text-[11px] text-[var(--text-secondary)] hidden sm:inline">
                {t('modal.keyboardTip')}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
