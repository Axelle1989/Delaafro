import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'terracotta' | 'feuille' | 'outline' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  className = '',
}) => {
  const variantStyles = {
    gold: 'bg-gradient-cuivre-or text-brun-nuit font-bold shadow-sm',
    terracotta: 'bg-terracotta text-white font-semibold shadow-sm',
    feuille: 'bg-feuille text-white font-semibold',
    outline: 'border border-cuivre text-cuivre-dark font-medium',
    neutral: 'bg-sable/50 text-brun-nuit font-medium',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.18em] ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

