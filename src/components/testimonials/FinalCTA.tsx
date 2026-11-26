import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, MessageSquarePlus } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

interface FinalCTAProps {
  onOpenReviewModal: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenReviewModal }) => {
  const prefersReducedMotion = useReducedMotion();
  const { t } = useI18n();

  return (
    <section
      aria-labelledby="final-cta-title"
      className="relative pt-10 pb-20 sm:pt-12 sm:pb-24 bg-gradient-to-b from-[var(--bg)] via-[var(--surface)]/55 to-[#2A1409]/20 theme-surface"
    >
      <div className="site-container">
        <motion.div
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.25 },
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
              })}
          className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#C4622D] via-[#7E391B] to-[#3A2418] px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 text-center shadow-[0_30px_70px_-24px_rgba(26,17,11,0.55)]"
        >
          {/* Motif africain géométrique très discret en filigrane (~7%) */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="delaafro-geo-motif"
                width="64"
                height="64"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M32 4 L60 32 L32 60 L4 32 Z"
                  fill="none"
                  stroke="#FBF5EC"
                  strokeWidth="1.2"
                />
                <path
                  d="M32 16 L48 32 L32 48 L16 32 Z"
                  fill="none"
                  stroke="#D9A441"
                  strokeWidth="1"
                />
                <circle cx="32" cy="32" r="3" fill="#FBF5EC" />
                <path
                  d="M0 0 L12 12 M64 0 L52 12 M0 64 L12 52 M64 64 L52 52"
                  stroke="#FBF5EC"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#delaafro-geo-motif)" />
          </svg>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-[#D9A441]/20 blur-3xl"
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#F5D08A]">
              {t('cta.eyebrow')}
            </span>

            <h2
              id="final-cta-title"
              className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold leading-[1.12] tracking-tight text-[#FBF5EC] text-balance"
            >
              {t('cta.titleStart')}{' '}
              <span className="italic font-semibold text-[#F5D08A]">
                {t('cta.titleAccent')}
              </span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-[#F1E4D3]/90 leading-relaxed max-w-xl mx-auto">
              {t('cta.subtitle')}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/nos-gammes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#D9A441] hover:bg-[#E5B454] text-[#2A1409] font-bold text-xs sm:text-sm uppercase tracking-[0.12em] shadow-[0_14px_30px_-10px_rgba(217,164,65,0.45)] transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF5EC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3A2418]"
              >
                <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t('cta.discoverRanges')}</span>
              </Link>

              <button
                type="button"
                onClick={onOpenReviewModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[#FBF5EC]/55 text-[#FBF5EC] hover:bg-[#FBF5EC]/12 font-semibold text-xs sm:text-sm uppercase tracking-[0.12em] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF5EC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3A2418]"
              >
                <MessageSquarePlus className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t('cta.shareExperience')}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
