import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageSquarePlus, ShieldCheck, Star, Users } from 'lucide-react';
import { Testimonial } from '@/types';
import { useI18n } from '@/context/I18nContext';

interface HeroAvisProps {
  totalReviewsCount: number;
  collageTestimonials: Testimonial[];
  onOpenReviewModal: () => void;
}

export const HeroAvis: React.FC<HeroAvisProps> = ({
  totalReviewsCount,
  collageTestimonials,
  onOpenReviewModal,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { t, formatNumber } = useI18n();

  const fallbackPortraits = [
    {
      src: '/products/temoignages/evolution-afro-2024-2025.jpg',
      alt: t('hero.fallbackAlt1'),
    },
    {
      src: '/products/temoignages/duo-afro-naturel-sourire.jpg',
      alt: t('hero.fallbackAlt2'),
    },
    {
      src: '/products/temoignages/duo-amies-afro-cotonou.jpg',
      alt: t('hero.fallbackAlt3'),
    },
  ];

  // Déduplique les portraits pour le collage de droite (3 portraits distincts)
  const seenUrls = new Set<string>();
  const portraits: { src: string; alt: string }[] = [];

  for (const item of collageTestimonials) {
    const src = item.photoUrl || item.avatarUrl;
    if (src && !seenUrls.has(src)) {
      seenUrls.add(src);
      const displayName =
        item.clientName === 'Cliente Vérifiée'
          ? t('modal.verifiedClient')
          : item.clientName || t('modal.verifiedClient');
      portraits.push({
        src,
        alt: t('hero.portraitAlt', { name: displayName, city: item.city }),
      });
    }
    if (portraits.length === 3) break;
  }

  for (const fallback of fallbackPortraits) {
    if (portraits.length >= 3) break;
    if (!seenUrls.has(fallback.src)) {
      seenUrls.add(fallback.src);
      portraits.push(fallback);
    }
  }

  const fadeUp = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      aria-labelledby="hero-avis-title"
      className="relative overflow-hidden bg-[var(--bg)] theme-surface pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24"
    >
      {/* Halos lumineux très doux en arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-[var(--surface)]/75 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 h-[340px] w-[340px] rounded-full bg-[var(--gold)]/10 blur-3xl"
      />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Colonne gauche : Titre éditorial, sous-titre, CTA & 3 chiffres clés */}
          <motion.div {...fadeUp} className="lg:col-span-7 space-y-7 sm:space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-text)]">
                <span className="h-[1.5px] w-7 bg-[var(--accent)]/60" aria-hidden="true" />
                <span>{t('hero.eyebrow')}</span>
              </div>

              <h1
                id="hero-avis-title"
                className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-[66px] font-bold tracking-tight leading-[1.06] text-[var(--text)] text-balance"
              >
                {t('hero.titleStart')}{' '}
                <span className="italic font-semibold text-[var(--accent)]">
                  {t('hero.titleAccent')}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* CTA principal mis en avant */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenReviewModal}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[#FBF5EC] font-semibold text-sm tracking-wide shadow-[0_14px_30px_-10px_rgba(196,98,45,0.45)] hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
              >
                <MessageSquarePlus className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t('hero.giveReview')}</span>
              </button>

              <a
                href="#resultats-photos"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-[var(--text)]/85 hover:text-[var(--accent-text)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
              >
                <span>{t('hero.exploreGallery')}</span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            {/* 3 chiffres clés dans des cartes translucides / bordées en mode sombre */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-2"
              aria-label={t('hero.statsAria')}
            >
              <div
                className="rounded-[20px] bg-[var(--card)]/80 backdrop-blur-md border border-[var(--border)] px-5 py-4 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 theme-surface"
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                <div className="flex items-center gap-1 text-[var(--gold)]" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <div className="text-right sm:text-left">
                  <p className="font-serif text-2xl font-bold text-[var(--text)] leading-none">
                    {formatNumber(4.9)}
                    <span className="text-base font-normal text-[var(--text-secondary)]">/5</span>
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {t('hero.satisfactionLabel')}
                  </p>
                </div>
              </div>

              <div
                className="rounded-[20px] bg-[var(--card)]/80 backdrop-blur-md border border-[var(--border)] px-5 py-4 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 theme-surface"
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                <Users className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                <div className="text-right sm:text-left">
                  <p className="font-serif text-2xl font-bold text-[var(--text)] leading-none">
                    {formatNumber(totalReviewsCount)}
                    <span className="text-[var(--accent)]">+</span>
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {t('hero.verifiedReviews', { count: totalReviewsCount })}
                  </p>
                </div>
              </div>

              <div
                className="rounded-[20px] bg-[var(--card)]/80 backdrop-blur-md border border-[var(--border)] px-5 py-4 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 theme-surface"
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                <ShieldCheck className="w-4 h-4 text-feuille" aria-hidden="true" />
                <div className="text-right sm:text-left">
                  <p className="font-serif text-2xl font-bold text-[var(--text)] leading-none">
                    {formatNumber(100)} %
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {t('hero.realFeedbackLabel')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Colonne droite (Desktop) : Collage éditorial de 3 portraits arrondis */}
          <motion.div
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 24 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const },
                })}
            className="hidden lg:block lg:col-span-5"
          >
            <div className="relative mx-auto max-w-[460px] h-[460px] xl:h-[500px]">
              {portraits[0] && (
                <div className="absolute left-0 top-6 w-[56%] aspect-[3/4] rounded-[24px] overflow-hidden ring-4 ring-[var(--bg)] border border-[var(--border)] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.28)] -rotate-3 transition-transform duration-500 hover:rotate-0 hover:z-30">
                  <img
                    src={portraits[0].src}
                    alt={portraits[0].alt}
                    loading="eager"
                    className="w-full h-full object-cover object-center editorial-media"
                  />
                </div>
              )}

              {portraits[1] && (
                <div className="absolute right-0 top-0 w-[56%] aspect-[3/4] rounded-[24px] overflow-hidden ring-4 ring-[var(--bg)] border border-[var(--border)] shadow-[0_28px_55px_-20px_rgba(0,0,0,0.32)] rotate-2 z-10 transition-transform duration-500 hover:rotate-0 hover:z-30">
                  <img
                    src={portraits[1].src}
                    alt={portraits[1].alt}
                    loading="eager"
                    className="w-full h-full object-cover object-center editorial-media"
                  />
                </div>
              )}

              {portraits[2] && (
                <div className="absolute left-[22%] bottom-0 w-[52%] aspect-[4/3] rounded-[22px] overflow-hidden ring-4 ring-[var(--bg)] border border-[var(--border)] shadow-[0_28px_55px_-18px_rgba(0,0,0,0.35)] -rotate-1 z-20 transition-transform duration-500 hover:rotate-0 hover:z-30">
                  <img
                    src={portraits[2].src}
                    alt={portraits[2].alt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center editorial-media"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
