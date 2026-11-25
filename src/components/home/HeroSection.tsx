import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, MessageCircle, Leaf, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/store/useSettingsStore';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

interface HeroSlide {
  id: string;
  bgClass: string;
  fadeColor: string;
  theme: 'terracotta' | 'cuivre' | 'nuit';
  image: string;
  imageMobile: string;
  imageAlt: string;
  objectPosition: string;
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    isWhatsApp?: boolean;
    href?: string;
  };
}

const heroSlides: HeroSlide[] = [
  {
    id: 'rituel-naturel',
    bgClass: 'bg-gradient-to-r from-terracotta via-terracotta to-terracotta-deep',
    fadeColor: '#8A3A1A',
    theme: 'terracotta',
    image: '/products/lifestyle/hero-modele-produits.jpg',
    imageMobile: '/products/lifestyle/hero-modele-produits-800.jpg',
    imageAlt: 'Modèle aux cheveux afro naturels entourée des soins essentiels DELAAFRO',
    objectPosition: '85% center',
    badge: 'Rituels capillaires naturels',
    title: 'La noblesse du naturel, l’excellence du soin.',
    subtitle: 'Shampoing, sérum et baume 100% naturels, pensés pour sublimer les cheveux crépus 4A-4C et locksés.',
    primaryCta: {
      label: 'DÉCOUVRIR NOS GAMMES',
      href: '/nos-gammes',
    },
    secondaryCta: {
      label: 'COMMANDER SUR WHATSAPP',
      isWhatsApp: true,
    },
  },
  {
    id: 'racines-fierte',
    bgClass: 'bg-gradient-to-r from-cuivre-dark via-cuivre-dark to-terracotta',
    fadeColor: '#BD7E50',
    theme: 'cuivre',
    image: '/products/lifestyle/hero-diaspora-deux-filles.jpg',
    imageMobile: '/products/lifestyle/hero-diaspora-deux-filles-800.jpg',
    imageAlt: 'Deux jeunes femmes de la diaspora aux cheveux afro naturels devant une boutique de pagnes colorés',
    objectPosition: '85% center',
    badge: 'Héritage & Authenticité',
    title: 'Nos racines, notre fierté.',
    subtitle: 'Du Bénin à la diaspora, prenez soin de vos cheveux naturels avec des soins authentiques qui nous ressemblent.',
    primaryCta: {
      label: 'VOIR LA ROUTINE',
      href: '/ma-routine',
    },
  },
  {
    id: 'resultats-visibles',
    bgClass: 'bg-gradient-to-r from-brun-nuit via-brun-nuit to-brun-nuit-deep',
    fadeColor: '#1A0C05',
    theme: 'nuit',
    image: '/products/lifestyle/hero-diaspora-vitrine-wax.jpg',
    imageMobile: '/products/lifestyle/hero-diaspora-vitrine-wax-800.jpg',
    imageAlt: 'Portrait d’une jeune femme aux cheveux afro nourris devant une vitrine wax',
    objectPosition: '80% 25%',
    badge: 'Résultats & Avis Vérifiés',
    title: 'Des cheveux nourris, des résultats qui se voient.',
    subtitle: 'Découvrez les retours et photos de celles qui ont adopté le rituel DELAAFRO.',
    primaryCta: {
      label: 'VOIR LES AVIS',
      href: '/elles-ont-sublime-leur-afro',
    },
  },
];

export const HeroSection: React.FC = () => {
  const { settings } = useSettingsStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (idx: number) => {
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };

  // Auto-advance every 6s on PC (5s on mobile), pause on hover / focus / reduced motion
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const intervalTime = typeof window !== 'undefined' && window.innerWidth < 1024 ? 5000 : 6000;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [currentSlide, isPaused, prefersReducedMotion]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Drag / Swipe handler
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -40) {
      nextSlide();
    } else if (info.offset.x > 40) {
      prevSlide();
    }
  };

  const baseSlide = heroSlides[currentSlide];
  const heroKeys = ['heroSlide1', 'heroSlide2', 'heroSlide3'] as const;
  const customHeroUrl = settings.siteImages?.[heroKeys[currentSlide]];
  const slide = customHeroUrl
    ? { ...baseSlide, image: customHeroUrl, imageMobile: customHeroUrl }
    : baseSlide;
  const whatsAppUrl = buildWhatsAppInquiryUrl(undefined, settings.whatsappNumber);

  return (
    <>
      {/* Main Full-Width Hero Carousel */}
      <section
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        tabIndex={0}
        aria-label="Carrousel principal DELAAFRO"
        className="relative w-full h-[calc(100vh-64px)] min-h-[520px] max-h-[660px] lg:h-[calc(100vh-76px)] lg:min-h-[560px] lg:max-h-[780px] overflow-hidden focus:outline-none select-none"
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction * 40 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction * -40 }
            }
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`absolute inset-0 w-full h-full ${slide.bgClass} flex items-center`}
          >
            {/* =========================================================
                DESKTOP LAYOUT (≥ 1024 px)
                Photo touches top, right, bottom and spans ~60% width with long fade mask
                Text on left, indented with lg:pl-24 xl:pl-28 so it never touches arrows
            ========================================================= */}
            <div className="hidden lg:block w-full h-full relative">
              {/* Photo Column : spans 58% width, touches top, right, bottom with short 14% fade mask */}
              <div
                className="absolute top-0 right-0 bottom-0 w-[58%] h-full overflow-hidden hero-photo-fade pointer-events-none"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 6%, black 14%)',
                  maskImage:
                    'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 6%, black 14%)',
                }}
              >
                <motion.img
                  initial={prefersReducedMotion ? {} : { scale: 1.04 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  src={slide.image}
                  srcSet={`${slide.imageMobile} 800w, ${slide.image} 1400w`}
                  sizes="60vw"
                  alt={slide.imageAlt}
                  loading={currentSlide === 0 ? 'eager' : 'lazy'}
                  fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: slide.objectPosition }}
                />
              </div>

              {/* Text Column on Left : ~42% width, entirely on solid/gradient background */}
              <div className="site-container h-full flex flex-col justify-center relative z-10 pointer-events-none">
                <div className="w-full lg:w-[42%] xl:w-[42%] lg:pl-16 xl:pl-20 pointer-events-auto space-y-4 xl:space-y-6">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.35 }}
                  >
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-sm ${
                        slide.theme === 'nuit'
                          ? 'bg-or/20 text-or border border-or/40'
                          : 'bg-white/20 text-white border border-white/30 backdrop-blur-sm'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-or" />
                      <span>{slide.badge}</span>
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.45 }}
                    className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight text-white"
                  >
                    {slide.title}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.45 }}
                    className="text-base sm:text-lg xl:text-xl max-w-xl font-normal leading-relaxed text-creme-light/95"
                  >
                    {slide.subtitle}
                  </motion.p>

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.45 }}
                    className="pt-2 flex items-center gap-4 flex-wrap"
                  >
                    {/* Primary Button */}
                    <Link
                      to={slide.primaryCta.href}
                      className={`h-14 px-8 text-base font-semibold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center tracking-wide ${
                        slide.theme === 'nuit'
                          ? 'bg-or text-brun-nuit hover:bg-or-light'
                          : 'bg-white text-terracotta hover:bg-creme-light'
                      }`}
                    >
                      {slide.primaryCta.label}
                    </Link>

                    {/* Secondary WhatsApp Button (Slide 1 only) */}
                    {slide.secondaryCta && (
                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-14 px-8 text-base font-semibold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2.5 tracking-wide bg-whatsapp text-white hover:bg-whatsapp-hover"
                      >
                        <MessageCircle className="w-5 h-5 fill-white/20" />
                        <span>{slide.secondaryCta.label}</span>
                      </a>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* =========================================================
                MOBILE LAYOUT (< 1024 px) : Fullscreen vertical visual
                Text at bottom with dark gradient overlay
            ========================================================= */}
            <div className="lg:hidden w-full h-full relative overflow-hidden">
              {/* Photo Full Frame */}
              <img
                src={slide.imageMobile}
                srcSet={`${slide.imageMobile} 800w, ${slide.image} 1200w`}
                sizes="100vw"
                alt={slide.imageAlt}
                loading={currentSlide === 0 ? 'eager' : 'lazy'}
                fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
                className="w-full h-full object-cover"
                style={{ objectPosition: slide.objectPosition }}
              />

              {/* Dark Gradient Overlay for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-brun-nuit/95 via-brun-nuit/50 to-transparent pointer-events-none" />

              {/* Overlaid Bottom Text */}
              <div className="absolute bottom-12 left-0 right-0 px-6 sm:px-8 space-y-3 z-10 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-white border border-white/30">
                  <Sparkles className="w-3 h-3 text-or" />
                  <span>{slide.badge}</span>
                </span>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {slide.title}
                </h1>

                <p className="text-xs sm:text-sm text-creme-light/90 line-clamp-2 max-w-md">
                  {slide.subtitle}
                </p>

                <div className="pt-1 flex items-center gap-3">
                  <Link
                    to={slide.primaryCta.href}
                    className="inline-flex items-center gap-1.5 bg-gradient-cuivre-or text-brun-nuit font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full shadow-md active:scale-95"
                  >
                    <span>{slide.primaryCta.label}</span>
                  </Link>

                  {slide.secondaryCta && (
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-3 rounded-full bg-whatsapp hover:bg-whatsapp-hover text-white shadow-md active:scale-95"
                      aria-label="Commander sur WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 fill-white/20" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* =========================================================
            DESKTOP CONTROLS (≥ 1024 px)
            64px round white buttons pinned near screen borders
        ========================================================= */}
        <button
          onClick={prevSlide}
          aria-label="Slide précédent"
          className="hidden lg:flex absolute left-3 xl:left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-white text-brun-nuit shadow-2xl hover:scale-105 active:scale-95 items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-terracotta"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Slide suivant"
          className="hidden lg:flex absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-white text-brun-nuit shadow-2xl hover:scale-105 active:scale-95 items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-terracotta"
        >
          <ArrowRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* =========================================================
            PAGINATION PILL (Center Bottom)
            White pill with 3 dashes (active dash longer and black)
        ========================================================= */}
        <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 lg:px-4 lg:py-2.5 rounded-full shadow-md flex items-center gap-2 border border-sable/30">
          {heroSlides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => goToSlide(idx)}
              aria-label={`Aller au slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full h-1.5 focus:outline-none focus:ring-2 focus:ring-terracotta ${
                currentSlide === idx
                  ? 'w-7 lg:w-8 bg-brun-nuit'
                  : 'w-2 lg:w-2.5 bg-brun-nuit/30 hover:bg-brun-nuit/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* =========================================================
          REASSURANCE BANNER (Directly under the hero)
          Sand/peach background, 3 centered items with Lucide icons
      ========================================================= */}
      <section className="bg-sable-light border-y border-sable/50 py-3.5 sm:py-4 relative z-10">
        <div className="site-container flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-4 sm:gap-8 text-xs sm:text-sm text-brun-nuit font-medium tracking-wide">
          <div className="flex items-center gap-2.5">
            <Leaf className="w-4 h-4 text-feuille shrink-0" />
            <span>Formules 100% naturelles</span>
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-or/60" />
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-terracotta shrink-0" />
            <span>Cheveux crépus & locks</span>
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-or/60" />
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-cuivre shrink-0" />
            <span>Livraison partout, même hors du Bénin</span>
          </div>
        </div>
      </section>
    </>
  );
};
