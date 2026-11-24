import React from 'react';
import { Sparkles } from 'lucide-react';

interface MarqueeProps {
  items?: string[];
  className?: string;
  speed?: 'normal' | 'slow';
}

export const Marquee: React.FC<MarqueeProps> = ({
  items = [
    '100% Ingrédients Naturels',
    'Hydratation 72h',
    'Douceur & Souplesse',
    'Éclat des Boucles',
    'Fait avec Fierté au Bénin 🇧🇯',
    'Formulé pour Cheveux Crépus',
    'Sans Sulfates ni Silicones',
  ],
  className = '',
  speed = 'normal',
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden border-y border-sable/40 bg-creme-dark/40 py-3.5 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Subtle edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-creme to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-creme to-transparent" />

      <div
        className={`flex w-fit items-center whitespace-nowrap animate-marquee hover:[animation-play-state:paused]`}
      >
        {/* Render twice for continuous loop */}
        {[...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-6 px-4">
            <span className="font-serif text-sm tracking-[0.2em] font-medium uppercase text-brun-nuit/85">
              {text}
            </span>
            <Sparkles className="h-3 w-3 text-or fill-or/40" />
          </div>
        ))}
      </div>
    </div>
  );
};

