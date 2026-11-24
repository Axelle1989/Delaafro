import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Star, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { Testimonial } from '@/types';
import { parseVideoUrl } from '@/lib/videoUtils';

interface VideoStoryCardProps {
  testimonial: Testimonial;
  onClick: () => void;
  index?: number;
}

export const VideoStoryCard: React.FC<VideoStoryCardProps> = ({
  testimonial,
  onClick,
  index = 0,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const videoInfo = parseVideoUrl(testimonial.videoUrl || '');
  const poster =
    testimonial.videoPosterUrl ||
    videoInfo.posterUrl ||
    testimonial.photoUrl ||
    '/products/lifestyle/gamme-complete-portrait-afro.jpg';

  const isDirectFile = videoInfo.isDirectFile;

  const handleMouseEnter = () => {
    // Only attempt video preview for direct MP4/WebM files and if motion is not reduced
    if (isDirectFile && !shouldReduceMotion && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlayingPreview(true))
          .catch(() => {
            // Autoplay policy or unsupported format
            setIsPlayingPreview(false);
          });
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDirectFile && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlayingPreview(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.02 }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative shrink-0 snap-start w-[160px] sm:w-[200px] md:w-[220px] aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer shadow-luxury hover:shadow-2xl border-2 border-or/40 hover:border-or transition-all duration-300 select-none bg-brun-nuit"
    >
      {/* Poster Image */}
      <img
        src={poster}
        alt={`Témoignage vidéo de ${testimonial.clientName}`}
        loading="lazy"
        className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 ${
          isPlayingPreview ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Direct Video preview on hover (desktop only) */}
      {isDirectFile && testimonial.videoUrl && (
        <video
          ref={videoRef}
          src={testimonial.videoUrl}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isPlayingPreview ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

      {/* Top Bar: Duration Pill & Verified Badge */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-1 z-20">
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brun-nuit/85 text-creme-light backdrop-blur-md border border-or/30 shadow-sm">
          <CheckCircle2 className="w-3 h-3 text-feuille" />
          <span>Vidéo</span>
        </span>

        {testimonial.videoDuration && (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-brun-nuit/85 text-or backdrop-blur-md border border-or/30 shadow-sm">
            <Clock className="w-2.5 h-2.5 text-or" />
            <span>{testimonial.videoDuration}</span>
          </span>
        )}
      </div>

      {/* Center Play Button with Soft Glow */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brun-nuit/75 backdrop-blur-md border-2 border-or text-or flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-terracotta group-hover:border-white group-hover:text-white ${
            shouldReduceMotion ? '' : 'animate-pulse-subtle'
          }`}
        >
          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
        </div>
      </div>

      {/* Bottom Gradient Overlay & Client Info */}
      <div className="absolute inset-x-0 bottom-0 pt-16 pb-3 sm:pb-4 px-3 sm:px-4 bg-gradient-to-t from-brun-nuit via-brun-nuit/80 to-transparent z-20 flex flex-col justify-end text-left">
        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-1 text-or">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < testimonial.rating ? 'fill-current' : 'text-white/30 fill-white/10'
              }`}
            />
          ))}
        </div>

        {/* Client Name */}
        <h4 className="font-serif font-bold text-sm sm:text-base text-white truncate drop-shadow-sm group-hover:text-or transition-colors">
          {testimonial.clientName || 'Cliente Vérifiée'}
        </h4>

        {/* City & Product */}
        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-creme/80 mt-0.5">
          <MapPin className="w-3 h-3 text-or shrink-0" />
          <span className="truncate">{testimonial.city}</span>
        </div>

        {testimonial.productName && (
          <span className="text-[10px] sm:text-[11px] text-sable/80 truncate mt-0.5 font-medium">
            {testimonial.productName}
          </span>
        )}
      </div>
    </motion.div>
  );
};
