import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, MapPin, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '@/types';

interface TestimonialCardFrameProps {
  testimonial: Testimonial;
  onClick: () => void;
  index?: number;
  lineClamp?: 2 | 3;
}

export const TestimonialCardFrame: React.FC<TestimonialCardFrameProps> = ({
  testimonial,
  onClick,
  index = 0,
  lineClamp = 3,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const photo =
    testimonial.photoUrl ||
    testimonial.avatarUrl ||
    '/products/lifestyle/gamme-complete-portrait-afro.jpg';

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.45,
        delay: shouldReduceMotion ? 0 : (index % 10) * 0.08,
        ease: 'easeOut',
      }}
      whileHover={shouldReduceMotion ? {} : { y: -3 }}
      onClick={onClick}
      className="group relative cursor-pointer rounded-[20px] bg-white p-3.5 shadow-xs hover:shadow-md border border-[#2B1A12]/10 hover:border-[#8B4A2B]/40 transition-all duration-200 flex flex-col justify-between overflow-hidden"
    >
      {/* Photo (Aspect 4/5, coins arrondis 16px) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] bg-[#2B1A12]/5">
        <img
          src={photo}
          alt={`Résultat de ${testimonial.clientName}`}
          loading="lazy"
          className="h-full w-full object-cover object-center filter sepia-[0.08] saturate-[0.92] transition-transform duration-500 ease-out group-hover:scale-103"
        />

        {/* Badge type de cheveu sobre */}
        {testimonial.hairType && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2B1A12]/80 text-[#FAF3EA] backdrop-blur-sm border border-white/20">
              {testimonial.hairType.split('–')[0].trim()}
            </span>
          </div>
        )}

        {/* Badge vérifié sobre */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAF3EA]/90 text-[#2B1A12] backdrop-blur-sm border border-[#2B1A12]/10 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-[#5E7A4A]" />
            <span>Vérifié</span>
          </span>
        </div>
      </div>

      {/* Zone de texte */}
      <div className="pt-3 px-1 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0 flex-1">
              <span className="font-serif font-bold text-sm text-[#2B1A12] truncate block group-hover:text-[#8B4A2B] transition-colors duration-200">
                {testimonial.clientName || 'Avis vérifié'}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-[#2B1A12]/60 mt-0.5">
                <MapPin className="w-3 h-3 text-[#8B4A2B] shrink-0" strokeWidth={1.5} />
                <span className="truncate">{testimonial.city}</span>
              </div>
            </div>

            {/* 5 Étoiles or doux */}
            <div className="flex items-center gap-0.5 shrink-0 pt-0.5 text-[#C9A66B]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < testimonial.rating
                      ? 'fill-current text-[#C9A66B]'
                      : 'text-[#C9A66B]/25 fill-transparent'
                  }`}
                  strokeWidth={1}
                />
              ))}
            </div>
          </div>

          {/* Extrait d'avis */}
          <p
            className={`mt-2.5 text-xs sm:text-sm text-[#2B1A12]/80 italic leading-relaxed font-sans ${
              lineClamp === 2 ? 'line-clamp-2' : 'line-clamp-3'
            }`}
          >
            « {testimonial.content} »
          </p>
        </div>

        {/* Ligne produit discret */}
        {testimonial.productName && (
          <div className="mt-3 pt-2.5 border-t border-[#2B1A12]/5 flex items-center justify-between text-[11px] text-[#8B4A2B] font-medium">
            <span className="truncate">{testimonial.productName}</span>
            <span className="text-[10px] text-[#2B1A12]/40 shrink-0 uppercase tracking-wider ml-1">
              {testimonial.usageDuration || 'Résultat'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
