import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Sparkles, Eye } from 'lucide-react';
import { Testimonial } from '@/types';
import { useI18n } from '@/context/I18nContext';

interface PhotoGalleryProps {
  testimonials: Testimonial[];
  onSelectTestimonial: (testimonial: Testimonial) => void;
}

const HAIR_FILTERS = ['ALL', '3C', '4A', '4B', '4C'] as const;
type HairFilter = (typeof HAIR_FILTERS)[number];

const MASONRY_ASPECTS = [
  'aspect-[4/5]',
  'aspect-[3/4]',
  'aspect-square',
  'aspect-[4/5]',
  'aspect-[3/4]',
];

function extractShortHairType(hairType?: string): string | null {
  if (!hairType) return null;
  const match = hairType.match(/(3C|4A|4B|4C)(\s*[/–-]\s*(3C|4A|4B|4C))?/i);
  if (match) return match[0].toUpperCase();
  const short = hairType.split('–')[0]?.trim();
  return short ? short.slice(0, 18) : null;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  testimonials,
  onSelectTestimonial,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState<HairFilter>('ALL');

  const filtered = useMemo(() => {
    if (activeFilter === 'ALL') return testimonials;
    return testimonials.filter((item) =>
      (item.hairType || '').toUpperCase().includes(activeFilter)
    );
  }, [testimonials, activeFilter]);

  return (
    <section
      id="resultats-photos"
      aria-labelledby="photo-gallery-title"
      className="py-16 sm:py-20 lg:py-24 bg-[var(--bg)] theme-surface"
    >
      <div className="site-container space-y-10">
        {/* En-tête + Filtres en pastilles */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-text)]">
              <span className="h-[1.5px] w-7 bg-[var(--accent)]/60" aria-hidden="true" />
              <span>{t('gallery.eyebrow')}</span>
            </div>
            <h2
              id="photo-gallery-title"
              className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.1] text-[var(--text)]"
            >
              {t('gallery.titleStart')}{' '}
              <span className="italic font-semibold text-[var(--accent)]">
                {t('gallery.titleAccent')}
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {t('gallery.subtitle')}
            </p>
          </div>

          {/* Pastilles de filtre par texture */}
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label={t('gallery.filterAria')}
          >
            {HAIR_FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              const label = filter === 'ALL' ? t('gallery.filterAll') : filter;
              return (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
                    isActive
                      ? 'bg-[var(--accent)] text-[#FBF5EC] border border-[var(--accent)]'
                      : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface)]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grille Masonry responsive : 1 col mobile, 2 tablette, 3 à 4 desktop */}
        {filtered.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 sm:gap-6 space-y-5 sm:space-y-6">
            {filtered.map((item, idx) => {
              const photo =
                item.photoUrl ||
                item.avatarUrl ||
                '/products/lifestyle/gamme-complete-portrait-afro.jpg';
              const shortHairType = extractShortHairType(item.hairType);
              const aspectClass = MASONRY_ASPECTS[idx % MASONRY_ASPECTS.length];
              const displayName =
                item.clientName === 'Cliente Vérifiée'
                  ? t('modal.verifiedClient')
                  : item.clientName || t('modal.verifiedClient');

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTestimonial(item)}
                  aria-label={t('gallery.cardAria', { name: displayName, city: item.city })}
                  {...(prefersReducedMotion
                    ? {}
                    : {
                        initial: { opacity: 0, y: 18 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true, amount: 0.15 },
                        transition: { duration: 0.45, delay: Math.min((idx % 4) * 0.06, 0.24) },
                      })}
                  className="group relative block w-full break-inside-avoid rounded-[22px] overflow-hidden bg-[var(--surface)] border border-[var(--border)] transition-all duration-300 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                  style={{ boxShadow: 'var(--card-shadow)' }}
                >
                  <div className={`relative w-full ${aspectClass} overflow-hidden`}>
                    <img
                      src={photo}
                      alt={t('gallery.photoAlt', {
                        hairType: shortHairType || 'afro',
                        name: displayName,
                        city: item.city,
                      })}
                      loading="lazy"
                      className="w-full h-full object-cover object-center editorial-media group-hover:scale-105"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#1A0E08]/60 via-transparent to-[#1A0E08]/15 transition-opacity duration-300 group-hover:from-[#1A0E08]/75"
                    />

                    {/* Badge Vérifié AA dans les deux thèmes */}
                    <span
                      className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md text-[11px] font-semibold border border-[var(--border)]"
                      style={{
                        backgroundColor: 'var(--badge-verified-bg)',
                        color: 'var(--badge-verified-text)',
                      }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{t('gallery.verified')}</span>
                    </span>

                    {/* Bas de carte : type de cheveux au repos + invitation discrète au survol */}
                    <div className="absolute inset-x-3.5 bottom-3.5 flex items-center justify-between gap-2">
                      {shortHairType ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#1A0E08]/80 backdrop-blur-md text-[11px] font-medium tracking-wide text-[#FBF5EC] whitespace-nowrap">
                          {shortHairType}
                        </span>
                      ) : (
                        <span />
                      )}

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)] text-[#FBF5EC] text-[11px] font-semibold whitespace-nowrap opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-200">
                        <Eye className="w-3 h-3 shrink-0" aria-hidden="true" />
                        <span>{t('gallery.readReview')}</span>
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div
            className="rounded-[24px] bg-[var(--card)] border border-[var(--border)] p-10 text-center max-w-md mx-auto space-y-3 theme-surface"
            style={{ boxShadow: 'var(--card-shadow)' }}
          >
            <Sparkles className="w-7 h-7 text-[var(--accent)] mx-auto" aria-hidden="true" />
            <h3 className="font-serif text-xl font-bold text-[var(--text)]">
              {activeFilter === 'ALL'
                ? t('gallery.emptyTitle')
                : t('gallery.emptyFilteredTitle', { filter: activeFilter })}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {activeFilter === 'ALL'
                ? t('gallery.emptySubtitle')
                : t('gallery.emptyFilteredSubtitle')}
            </p>
            {activeFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className="mt-2 inline-flex items-center px-5 py-2.5 rounded-full bg-[var(--accent)] text-[#FBF5EC] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--accent-hover)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {t('gallery.resetFilter')}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
