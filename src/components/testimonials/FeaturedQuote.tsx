import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Testimonial } from '@/types';
import { useI18n } from '@/context/I18nContext';

interface FeaturedQuoteProps {
  testimonial: Testimonial | undefined;
}

export const FeaturedQuote: React.FC<FeaturedQuoteProps> = ({ testimonial }) => {
  const prefersReducedMotion = useReducedMotion();
  const { t, translateProductName, translateTestimonialQuote } = useI18n();

  if (!testimonial) return null;

  const displayName =
    testimonial.clientName === 'Cliente Vérifiée'
      ? t('modal.verifiedClient')
      : testimonial.clientName || t('modal.verifiedClient');
  const quoteText = translateTestimonialQuote(testimonial.id, testimonial.content);

  return (
    <section
      aria-label={t('quote.sectionAria')}
      className="w-full bg-[var(--surface)] border-y border-[var(--border)] py-16 sm:py-22 lg:py-28 relative overflow-hidden theme-surface"
    >
      {/* Guillemet décoratif géant en filigrane */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none font-serif text-[180px] sm:text-[260px] leading-none text-[var(--accent)]/12 absolute -top-6 left-4 sm:left-12"
      >
        “
      </span>

      <motion.div
        {...(prefersReducedMotion
          ? {}
          : {
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.3 },
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
            })}
        className="site-container relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8"
      >
        {/* Étoiles dorées */}
        <div
          className="inline-flex items-center justify-center gap-1.5 text-[var(--gold)]"
          aria-label={t('quote.ratingAria', { rating: testimonial.rating })}
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < testimonial.rating ? 'fill-current' : 'opacity-30'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Citation éditoriale en Playfair italique très grand */}
        <blockquote className="font-serif italic text-2xl sm:text-3xl lg:text-[40px] leading-[1.32] text-[var(--text)] text-balance">
          « {quoteText} »
        </blockquote>

        {/* Signature : nom et ville */}
        <figcaption className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-sm text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text)]">
            {displayName}
          </span>
          <span className="hidden sm:inline text-[var(--accent)]" aria-hidden="true">
            •
          </span>
          <span className="text-[var(--accent-text)] font-medium">
            {testimonial.city}
          </span>
          {testimonial.productName && (
            <>
              <span className="hidden sm:inline text-[var(--text-secondary)]/50" aria-hidden="true">
                —
              </span>
              <span className="text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                {translateProductName(testimonial.productName)}
              </span>
            </>
          )}
        </figcaption>
      </motion.div>
    </section>
  );
};
