import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, Play, Sparkles } from 'lucide-react';
import { Testimonial } from '@/types';
import { parseVideoUrl } from '@/lib/videoUtils';

interface VideoVerticalTileProps {
  testimonial: Testimonial;
  onClick: () => void;
  index?: number;
}

export const VideoVerticalTile: React.FC<VideoVerticalTileProps> = ({
  testimonial,
  onClick,
  index = 0,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);

  const videoInfo = parseVideoUrl(testimonial.videoUrl || '');
  const isDirectFile = videoInfo.isDirectFile;
  const poster =
    testimonial.videoPosterUrl ||
    videoInfo.posterUrl ||
    testimonial.photoUrl ||
    '/products/lifestyle/gamme-complete-portrait-afro.jpg';

  // IntersectionObserver: play when >= 50% visible, pause when leaving viewport
  useEffect(() => {
    if (!isDirectFile || shouldReduceMotion) return;

    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (!video) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => setIsPlaying(true))
                .catch(() => {
                  setIsPlaying(false);
                });
            }
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(currentContainer);

    return () => {
      observer.disconnect();
    };
  }, [isDirectFile, shouldReduceMotion]);

  return (
    <motion.div
      ref={containerRef}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.45,
        delay: shouldReduceMotion ? 0 : index * 0.08,
        ease: 'easeOut',
      }}
      onClick={onClick}
      className="group flex flex-col space-y-3 shrink-0 snap-start w-[200px] sm:w-[220px] lg:w-full cursor-pointer select-none"
    >
      {/* 1. Carte vidéo au format vertical 9:16 (type Reels) */}
      <div className="relative aspect-[9/16] w-full rounded-[18px] overflow-hidden bg-[#2B1A12] border border-[#2B1A12]/10 shadow-sm transition-all duration-300 group-hover:shadow-md">
        {/* Miniature avec filtre uniforme doux (sepia léger + désaturation 15%) */}
        {!imgError ? (
          <img
            src={poster}
            alt={`Témoignage vidéo de ${testimonial.clientName}`}
            onError={() => setImgError(true)}
            loading="lazy"
            className={`w-full h-full object-cover object-center filter sepia-[0.10] saturate-[0.85] transition-all duration-500 group-hover:scale-[1.03] ${
              isPlaying ? 'opacity-0' : 'opacity-100'
            }`}
          />
        ) : (
          /* Placeholder élégant (fond crème + motif discret) */
          <div className="w-full h-full bg-[#FAF3EA] border border-[#2B1A12]/10 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-[#C9A66B]/15 text-[#C9A66B] flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <span className="font-serif text-xs text-[#2B1A12]/70 font-medium">
              DELAAFRO
            </span>
          </div>
        )}

        {/* Vidéo MP4 directe en sourdine */}
        {isDirectFile && testimonial.videoUrl && (
          <video
            ref={videoRef}
            src={testimonial.videoUrl}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Léger overlay dégradé noir (0 -> 35%) en bas */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Bouton lecture : cercle translucide (blur) crème avec icône fine, petit au centre */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-[#FAF3EA]/80 backdrop-blur-md border border-white/50 text-[#2B1A12] flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Play className="w-4 h-4 fill-current translate-x-0.5 text-[#2B1A12]" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* 2. Sous chaque carte : prénom + ville, soin utilisé, 5 petites étoiles dorées */}
      <div className="space-y-1 text-left px-0.5">
        <div className="flex items-baseline justify-between gap-1.5">
          <span className="text-xs font-semibold text-[#2B1A12] truncate">
            {testimonial.clientName || 'Cliente Vérifiée'}
          </span>
          {testimonial.city && (
            <span className="text-[11px] text-[#2B1A12]/55 truncate shrink-0">
              {testimonial.city.replace(/\(.*?\)/g, '').trim()}
            </span>
          )}
        </div>

        {/* Ligne du soin utilisé */}
        <p className="text-[11px] text-[#8B4A2B] font-medium truncate">
          {testimonial.productName || testimonial.hairType || 'Routine Capillaire'}
        </p>

        {/* 5 petites étoiles dorées */}
        <div className="flex items-center gap-0.5 text-[#C9A66B] pt-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < (testimonial.rating || 5)
                  ? 'fill-current text-[#C9A66B]'
                  : 'text-[#C9A66B]/25 fill-transparent'
              }`}
              strokeWidth={1}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
