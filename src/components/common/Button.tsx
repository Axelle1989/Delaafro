import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'terracotta' | 'outline' | 'whatsapp' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'terracotta',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  as = 'button',
  href,
  target,
  rel,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-or focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 gap-1.5 font-semibold tracking-wider uppercase',
    md: 'text-sm px-6 py-3 gap-2 font-medium tracking-wide',
    lg: 'text-base px-8 py-4 gap-3 font-semibold tracking-wide',
  };

  const variantStyles = {
    gold: 'bg-gradient-cuivre-or text-brun-nuit font-semibold shadow-md hover:shadow-gold-glow hover:brightness-105 border border-or/40',
    terracotta:
      'bg-terracotta text-white shadow-terracotta-glow hover:bg-terracotta-deep hover:shadow-luxury-hover border border-terracotta/20',
    outline:
      'border border-cuivre/60 text-brun-nuit hover:border-terracotta hover:bg-terracotta/5 hover:text-terracotta',
    whatsapp:
      'bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold shadow-md hover:shadow-lg hover:shadow-[#25D366]/30',
    ghost: 'text-brun-nuit hover:bg-sable/30 hover:text-terracotta',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (as === 'a' && href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
        className={combinedClasses}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
        <span>{children}</span>
        {rightIcon}
      </a>
    );
  }

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
};

