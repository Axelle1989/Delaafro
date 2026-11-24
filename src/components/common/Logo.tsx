import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  type?: 'inline' | 'full';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'gold',
  size = 'md',
  showSubtitle = true,
  className = '',
  type = 'inline',
}) => {
  const sizeMap = {
    sm: {
      emblem: 'h-8 w-8',
      fullHeight: 'h-9',
      title: 'text-base tracking-[0.2em]',
      sub: 'text-[9px]',
    },
    md: {
      emblem: 'h-11 w-11',
      fullHeight: 'h-12',
      title: 'text-xl tracking-[0.25em]',
      sub: 'text-[9px] sm:text-[9.5px]',
    },
    lg: {
      emblem: 'h-14 w-14',
      fullHeight: 'h-16',
      title: 'text-2xl tracking-[0.28em]',
      sub: 'text-[11px]',
    },
    xl: {
      emblem: 'h-20 w-20',
      fullHeight: 'h-24',
      title: 'text-4xl tracking-[0.3em]',
      sub: 'text-xs',
    },
  };

  const currentSize = sizeMap[size];

  const textColor =
    variant === 'light'
      ? 'text-white'
      : variant === 'gold'
      ? 'text-brun-nuit'
      : 'text-brun-nuit';

  if (type === 'full') {
    return (
      <Link
        to="/"
        className={`group inline-block transition-transform duration-300 hover:scale-[1.02] focus:outline-none ${className}`}
        aria-label="DELAAFRO - Retour à l'accueil"
      >
        <img
          src="/brand/logo.png"
          alt="DELAAFRO - La noblesse du naturel, l'excellence du soin"
          className={`${currentSize.fullHeight} w-auto object-contain drop-shadow-md rounded-2xl`}
        />
      </Link>
    );
  }

  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02] focus:outline-none shrink-0 ${className}`}
      aria-label="DELAAFRO - Retour à l'accueil"
    >
      {/* Official DA Monogram Medallion (Silhouette + Leaves + Copper 3D) */}
      <div
        className={`relative flex items-center justify-center rounded-2xl p-0.5 shadow-md transition-shadow group-hover:shadow-gold-glow overflow-hidden shrink-0 ${currentSize.emblem}`}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cuivre via-or to-terracotta opacity-90 transition-opacity group-hover:opacity-100" />
        <div className="relative h-full w-full rounded-[14px] overflow-hidden bg-[#B85B39] border border-or/50 flex items-center justify-center">
          <img
            src="/brand/logo-symbol.png"
            alt="Logo DELAAFRO"
            className="w-full h-full object-cover scale-110 group-hover:scale-115 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Brand Typographic Wordmark */}
      <div className="flex flex-col shrink-0">
        <span
          className={`font-serif font-bold uppercase transition-colors whitespace-nowrap ${textColor} ${currentSize.title}`}
        >
          DELAAFRO
        </span>
        {showSubtitle && (
          <span
            className={`font-sans uppercase font-medium tracking-[0.18em] sm:tracking-[0.2em] whitespace-nowrap text-cuivre transition-colors group-hover:text-terracotta ${currentSize.sub}`}
          >
            Bénin • Soins Naturels
          </span>
        )}
      </div>
    </Link>
  );
};
