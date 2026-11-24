import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    to: string;
  };
  actionExtra?: React.ReactNode;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  level?: 'h1' | 'h2';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  action,
  actionExtra,
  tone = 'light',
  align = 'left',
  level = 'h2',
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isDark = tone === 'dark';
  const isCenter = align === 'center';
  const HeadingTag = level;

  // Sizing: Section titles (h2) use text-3xl md:text-4xl xl:text-5xl (clamp),
  // Main page titles (h1) use text-4xl md:text-5xl xl:text-6xl
  const titleClasses =
    level === 'h1'
      ? 'font-serif font-bold text-4xl md:text-5xl xl:text-6xl leading-[1.1] tracking-tight'
      : 'font-serif font-bold text-3xl md:text-4xl xl:text-5xl leading-tight tracking-tight';

  const titleColor = isDark ? 'text-creme-light' : 'text-brun-nuit';
  const eyebrowColor = isDark ? 'text-or' : 'text-terracotta';
  const subtitleColor = isDark ? 'text-creme-light/85' : 'text-brun-nuit/70';
  const dividerBorder = isDark ? 'border-sable/20' : 'border-sable/70';

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`w-full mb-8 lg:mb-10 ${className}`}
    >
      {/* 1. LIGNE DU HAUT : Surtitre avec filet doré de 32 px (optionnel) */}
      {eyebrow && (
        <div
          className={`flex items-center gap-2.5 mb-2.5 ${
            isCenter ? 'justify-center' : 'justify-start'
          }`}
        >
          <span className="w-8 h-[2px] bg-or rounded-full shrink-0" aria-hidden="true" />
          <span
            className={`text-xs font-semibold uppercase tracking-[0.2em] select-none ${eyebrowColor}`}
          >
            {eyebrow}
          </span>
          {isCenter && (
            <span className="w-8 h-[2px] bg-or rounded-full shrink-0" aria-hidden="true" />
          )}
        </div>
      )}

      {/* 2. LIGNE DU TITRE & ACTION DISCRÈTE */}
      {isCenter ? (
        <div className="text-center">
          <HeadingTag className={`${titleClasses} ${titleColor} text-balance`}>
            {title}
          </HeadingTag>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-2 lg:gap-6">
          <HeadingTag
            className={`${titleClasses} ${titleColor} text-balance max-w-4xl text-left`}
          >
            {title}
          </HeadingTag>

          {/* Action & actionExtra (Desktop: alignés sur la base du titre) */}
          {(action || actionExtra) && (
            <div className="hidden lg:flex items-center gap-5 shrink-0 select-none">
              {action && (
                <Link
                  to={action.to}
                  className={`text-sm font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 ${
                    isDark
                      ? 'text-or hover:text-white'
                      : 'text-terracotta hover:text-terracotta-deep'
                  }`}
                >
                  <span>{action.label}</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              )}
              {actionExtra}
            </div>
          )}
        </div>
      )}

      {/* 3. SOUS-TITRE : UNE seule phrase courte (max 2 lignes, max-w-2xl) */}
      {subtitle && (
        <p
          className={`mt-2.5 text-base lg:text-lg leading-relaxed max-w-2xl ${subtitleColor} ${
            isCenter ? 'mx-auto text-center' : 'text-left'
          }`}
        >
          {subtitle}
        </p>
      )}

      {/* Action pour Mobile (affichée sous le titre/sous-titre sur petit écran) */}
      {!isCenter && (action || actionExtra) && (
        <div className="flex lg:hidden items-center justify-between gap-4 mt-3 pt-1 select-none">
          {action && (
            <Link
              to={action.to}
              className={`text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 ${
                isDark
                  ? 'text-or hover:text-white'
                  : 'text-terracotta hover:text-terracotta-deep'
              }`}
            >
              <span>{action.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          )}
          {actionExtra}
        </div>
      )}

      {/* 4. FILET : Fin trait horizontal pleine largeur avec segment doré de 64 px */}
      <div className={`relative mt-5 pt-0.5 border-b ${dividerBorder}`}>
        <div
          className={`absolute -top-[1px] h-[2px] w-16 bg-gradient-to-r from-cuivre to-or rounded-full ${
            isCenter ? 'left-1/2 -translate-x-1/2' : 'left-0'
          }`}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
};
