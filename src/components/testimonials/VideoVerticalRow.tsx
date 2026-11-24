import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Testimonial } from '@/types';
import { useSettingsStore } from '@/store/useSettingsStore';
import { VideoVerticalTile } from './VideoVerticalTile';

interface VideoVerticalRowProps {
  videos: Testimonial[];
  onOpenVideo: (index: number) => void;
  showHeader?: boolean;
  showAllTestimonialsButton?: boolean;
  className?: string;
}

export const VideoVerticalRow: React.FC<VideoVerticalRowProps> = ({
  videos,
  onOpenVideo,
  showHeader = true,
  showAllTestimonialsButton = true,
  className = '',
}) => {
  const { settings } = useSettingsStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const tiktokOrInstaUrl =
    settings?.tiktokUrl && settings.tiktokUrl.trim() !== ''
      ? settings.tiktokUrl
      : settings?.instagramUrl || 'https://tiktok.com/@delaafro';

  const updateScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [videos]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distance = 260 * 2;
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  if (!videos || videos.length === 0) return null;

  const isScrollable = videos.length > 4;

  return (
    <div className={`space-y-6 sm:space-y-8 ${className}`}>
      {/* En-tête centré épuré */}
      {showHeader && (
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8B4A2B]">
            <span className="w-5 h-[1px] bg-[#8B4A2B]/40" aria-hidden="true" />
            <span>Témoignages Vidéo</span>
            <span className="w-5 h-[1px] bg-[#8B4A2B]/40" aria-hidden="true" />
          </div>
          <h3 className="font-serif font-normal text-2xl sm:text-3xl text-[#2B1A12] tracking-tight">
            Elles en parlent en vidéo
          </h3>
          <p className="text-xs sm:text-sm text-[#2B1A12]/70 leading-relaxed font-sans max-w-md mx-auto">
            Découvrez leurs routines capillaires, applications et résultats au naturel.
          </p>
        </div>
      )}

      {/* Conteneur : Grille 4 colonnes sur desktop (>= 1024px) / Carrousel avec scroll-snap sur mobile */}
      <div className="relative group/carousel">
        {/* Flèche gauche discrète si scrollable */}
        {isScrollable && canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Vidéos précédentes"
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 w-9 h-9 rounded-full bg-[#FAF3EA] text-[#2B1A12] shadow-sm border border-[#2B1A12]/15 items-center justify-center hover:bg-white hover:text-[#8B4A2B] transition-all duration-200 focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}

        {/* Grille desktop 4 colonnes / Défilement scroll-snap mobile */}
        <div
          ref={scrollContainerRef}
          className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 overflow-x-auto lg:overflow-visible pb-4 pt-1 px-4 sm:px-0 snap-x snap-mandatory scrollbar-none"
        >
          {videos.slice(0, 4).map((video, idx) => (
            <VideoVerticalTile
              key={video.id || `video-${idx}`}
              testimonial={video}
              index={idx}
              onClick={() => onOpenVideo(idx)}
            />
          ))}
        </div>

        {/* Flèche droite discrète si scrollable */}
        {isScrollable && canScrollRight && (
          <button
            onClick={() => scroll('right')}
            aria-label="Vidéos suivantes"
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 w-9 h-9 rounded-full bg-[#FAF3EA] text-[#2B1A12] shadow-sm border border-[#2B1A12]/15 items-center justify-center hover:bg-white hover:text-[#8B4A2B] transition-all duration-200 focus:outline-none"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Actions sous la rangée de vidéos */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pt-2">
        {/* Lien discret TikTok / Instagram */}
        <a
          href={tiktokOrInstaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#2B1A12]/75 hover:text-[#8B4A2B] transition-colors duration-200 group"
        >
          <span>Voir plus sur TikTok</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 text-[#8B4A2B]" strokeWidth={1.5} />
        </a>

        {/* Bouton "Voir tous les témoignages" : compact, terracotta plein, flèche fine */}
        {showAllTestimonialsButton && (
          <Link
            to="/elles-ont-sublime-leur-afro"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] bg-[#8B4A2B] hover:bg-[#723C22] text-[#FAF3EA] shadow-xs hover:shadow transition-all duration-200"
          >
            <span>Voir tous les témoignages</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FAF3EA]" strokeWidth={1.5} />
          </Link>
        )}
      </div>
    </div>
  );
};
