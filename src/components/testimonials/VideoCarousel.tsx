import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, ExternalLink, MapPin } from 'lucide-react';
import { Testimonial } from '@/types';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useI18n } from '@/context/I18nContext';

interface VideoCarouselProps {
  videos: Testimonial[];
  onOpenVideo: (videoIndex: number) => void;
}

const FALLBACK_POSTERS = [
  '/products/lifestyle/gamme-complete-portrait-afro.jpg',
  '/products/lifestyle/gamme-nature-feuillage.jpg',
  '/products/lifestyle/application-serum-sur-tresses.jpg',
  '/products/lifestyle/hero-cheveux-afro-produits.jpg',
];

export const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos, onOpenVideo }) => {
  const { settings } = useSettingsStore();
  const { t } = useI18n();
  const prefersReducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Déduplique les vidéos et garantit une vignette distincte par carte
  const uniqueVideos = useMemo(() => {
    const seenUrls = new Set<string>();
    const seenPosters = new Set<string>();
    const list: Array<{ video: Testimonial; originalIndex: number; poster: string }> = [];

    videos.forEach((video, originalIndex) => {
      const videoKey = (video.videoUrl || video.id).trim();
      if (seenUrls.has(videoKey)) return;
      seenUrls.add(videoKey);

      let candidatePoster =
        video.videoPosterUrl ||
        video.photoUrl ||
        FALLBACK_POSTERS[list.length % FALLBACK_POSTERS.length];

      if (seenPosters.has(candidatePoster)) {
        const unusedFallback = FALLBACK_POSTERS.find((p) => !seenPosters.has(p));
        if (unusedFallback) candidatePoster = unusedFallback;
      }
      seenPosters.add(candidatePoster);

      list.push({ video, originalIndex, poster: candidatePoster });
    });

    return list;
  }, [videos]);

  const tiktokUrl =
    settings?.tiktokUrl && settings.tiktokUrl.trim() !== ''
      ? settings.tiktokUrl
      : settings?.instagramUrl || 'https://tiktok.com/@delaafro';

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-video-card]'));
      if (cards.length === 0) return;

      const containerLeft = el.getBoundingClientRect().left;
      let closestIdx = 0;
      let minDist = Infinity;

      cards.forEach((card, idx) => {
        const dist = Math.abs(card.getBoundingClientRect().left - containerLeft);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = idx;
        }
      });

      setActiveIndex(closestIdx);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [uniqueVideos.length]);

  const scrollToIndex = (targetIdx: number) => {
    const el = scrollRef.current;
    if (!el || uniqueVideos.length === 0) return;
    const clamped = Math.max(0, Math.min(uniqueVideos.length - 1, targetIdx));
    const card = el.querySelectorAll<HTMLElement>('[data-video-card]')[clamped];
    if (card) {
      card.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        inline: 'start',
        block: 'nearest',
      });
    }
    setActiveIndex(clamped);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
  };

  if (uniqueVideos.length === 0) return null;

  return (
    <section
      aria-labelledby="video-carousel-title"
      className="py-16 sm:py-20 lg:py-24 bg-[var(--bg)] theme-surface"
    >
      <div className="site-container space-y-8 sm:space-y-10">
        {/* En-tête éditorial + Flèches */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-text)]">
              <span className="h-[1.5px] w-7 bg-[var(--accent)]/60" aria-hidden="true" />
              <span>{t('videos.eyebrow')}</span>
            </div>
            <h2
              id="video-carousel-title"
              className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.1] text-[var(--text)]"
            >
              {t('videos.titleStart')}{' '}
              <span className="italic font-semibold text-[var(--accent)]">
                {t('videos.titleAccent')}
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {t('videos.subtitle')}
            </p>
          </div>

          {uniqueVideos.length > 1 && (
            <div className="flex items-center gap-2.5 self-start sm:self-end">
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label={t('videos.prev')}
                className="w-11 h-11 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--text)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-[#FBF5EC] hover:border-[var(--accent)] disabled:opacity-35 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex + 1)}
                disabled={activeIndex >= uniqueVideos.length - 1}
                aria-label={t('videos.next')}
                className="w-11 h-11 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--text)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-[#FBF5EC] hover:border-[var(--accent)] disabled:opacity-35 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* Carrousel horizontal scroll-snap format 9:16 */}
        <div
          ref={scrollRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carrousel"
          aria-label={t('videos.carouselAria')}
          onKeyDown={handleKeyDown}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-[24px]"
        >
          {uniqueVideos.map(({ video, originalIndex, poster }, idx) => {
            const displayName =
              video.clientName === 'Cliente Vérifiée'
                ? t('modal.verifiedClient')
                : video.clientName || t('modal.verifiedClient');

            return (
              <motion.button
                key={video.id || `video-${idx}`}
                type="button"
                data-video-card
                onClick={() => onOpenVideo(originalIndex)}
                aria-label={t('videos.playAria', { name: displayName, city: video.city })}
                {...(prefersReducedMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 16 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, amount: 0.2 },
                      transition: { duration: 0.45, delay: Math.min(idx * 0.07, 0.28) },
                    })}
                className="group relative flex-none w-[74vw] max-w-[285px] sm:w-[260px] lg:w-[272px] xl:w-[290px] aspect-[9/16] rounded-[22px] overflow-hidden snap-start bg-[#1A110B] border border-[var(--border)] transition-all duration-300 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                <img
                  src={poster}
                  alt={t('videos.thumbAlt', { name: displayName, city: video.city })}
                  loading="lazy"
                  className="w-full h-full object-cover object-center editorial-media group-hover:scale-105"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#1A0E08]/92 via-[#1A0E08]/20 to-transparent"
                />

                {video.videoDuration && (
                  <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-[#1A0E08]/75 backdrop-blur-md text-[11px] font-medium text-[#FBF5EC] tracking-wide">
                    {video.videoDuration}
                  </span>
                )}

                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/25 backdrop-blur-md border border-white/45 flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--accent)]/90 group-hover:border-[var(--accent)]"
                >
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5 text-[#FBF5EC]">
                  <p className="font-serif text-lg font-semibold leading-tight">
                    {displayName}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#F1E4D3]/90">
                    <MapPin className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" aria-hidden="true" />
                    <span>{video.city}</span>
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Indicateurs de progression + Bouton secondaire TikTok */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-1">
          {uniqueVideos.length > 1 ? (
            <div className="flex items-center gap-2" role="tablist" aria-label={t('videos.progressAria')}>
              {uniqueVideos.map((_, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={t('videos.goToVideo', { index: idx + 1 })}
                    onClick={() => scrollToIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      isActive
                        ? 'w-8 bg-[var(--accent)]'
                        : 'w-2 bg-[var(--text)]/25 hover:bg-[var(--text)]/45'
                    }`}
                  />
                );
              })}
            </div>
          ) : (
            <div />
          )}

          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--accent)] text-[var(--text)] hover:text-[#FBF5EC] hover:border-[var(--accent)] text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <span>{t('videos.seeMoreTiktok')}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};
