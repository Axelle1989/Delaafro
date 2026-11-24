/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#B5532B',
          deep: '#8A3A1A',
          light: '#CE6C44',
          subtle: '#FAF1EC',
        },
        'brun-nuit': {
          DEFAULT: '#2A1409',
          light: '#3D1E0E',
          deep: '#1A0C05',
        },
        creme: {
          DEFAULT: '#F8EBDD',
          light: '#FCF6EE',
          dark: '#F0DDC8',
        },
        sable: {
          DEFAULT: '#EBD3B8',
          light: '#F5E6D4',
          dark: '#DEC09E',
        },
        cuivre: {
          DEFAULT: '#D99A6C',
          light: '#E6B48D',
          dark: '#BD7E50',
        },
        or: {
          DEFAULT: '#E8B77E',
          light: '#F2D0A4',
          dark: '#D49D60',
        },
        feuille: {
          DEFAULT: '#5E7A4A',
          light: '#76975F',
          dark: '#455A36',
          subtle: '#EDF2EB',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          hover: '#20BA5A',
          dark: '#128C7E',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-or-terre': 'linear-gradient(135deg, #D99A6C 0%, #E8B77E 50%, #B5532B 100%)',
        'gradient-cuivre-or': 'linear-gradient(135deg, #D99A6C 0%, #E8B77E 100%)',
        'gradient-terracotta': 'linear-gradient(135deg, #B5532B 0%, #8A3A1A 100%)',
        'gradient-nuit': 'linear-gradient(180deg, #2A1409 0%, #1A0C05 100%)',
        'shimmer-gold': 'linear-gradient(90deg, transparent 0%, rgba(232, 183, 126, 0.4) 50%, transparent 100%)',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(42, 20, 9, 0.08)',
        'luxury-hover': '0 25px 50px -12px rgba(181, 83, 43, 0.18)',
        'gold-glow': '0 0 25px rgba(232, 183, 126, 0.35)',
        'terracotta-glow': '0 10px 30px -5px rgba(181, 83, 43, 0.35)',
      },
      keyframes: {
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        'pulse-subtle': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
      },
      animation: {
        'marquee': 'marquee 28s linear infinite',
        'marquee-slow': 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
        'marquee-reverse-slow': 'marquee-reverse 50s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'float': 'float-slow 6s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

