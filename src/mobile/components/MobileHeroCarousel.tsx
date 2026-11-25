import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/store/useSettingsStore';

interface MobileSlide {
  id: string;
  image: string;
  image800: string;
  imageAlt: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  objectPosition: string;
}

const MOBILE_SLIDES: MobileSlide[] = [
  {
    id: 'slide-naturel',
    image: '/products/lifestyle/hero-modele-produits.jpg',
    image800: '/products/lifestyle/hero-modele-produits-800.jpg',
    imageAlt: 'Modèle aux cheveux afro naturels avec les soins DELAAFRO',
    badge: 'Rituels Capillaires Naturels',
    title: 'La noblesse du naturel, l’excellence du soin.',
    subtitle: 'Shampoing, sérum et baume 100% naturels pensés pour les cheveux crépus 4A-4C et locksés.',
    ctaText: 'Découvrir nos gammes',
    ctaHref: '/nos-gammes',
    objectPosition: 'center 25%',
  },
  {
    id: 'slide-racines',
    image: '/products/lifestyle/hero-diaspora-deux-filles.jpg',
    image800: '/products/lifestyle/hero-diaspora-deux-filles-800.jpg',
    imageAlt: 'Deux jeunes femmes afro devant une boutique de wax',
    badge: 'Héritage & Authenticité',
    title: 'Nos racines, notre fierté.',
    subtitle: 'Du Bénin à la diaspora, prenez soin de vos cheveux naturels avec des rituels authentiques.',
    ctaText: 'Voir la routine',
    ctaHref: '/ma-routine',
    objectPosition: 'center 30%',
  },
  {
    id: 'slide-resultats',
    image: '/products/lifestyle/hero-diaspora-vitrine-wax.jpg',
    image800: '/products/lifestyle/hero-diaspora-vitrine-wax-800.jpg',
    imageAlt: 'Portrait devant un étal wax traditionnel',
    badge: 'Résultats & Avis Vérifiés',
    title: 'Des cheveux nourris, des résultats visibles.',
    subtitle: 'Découvrez les retours et photos de résultats réels de nos clientes.',
    ctaText: 'Voir les avis',
    ctaHref: '/elles-ont-sublime-leur-afro',
    objectPosition: 'center 20%',
  },
];

export const MobileHeroCarousel: React.FC = () => {
  const { settings } = useSettingsStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTouched, setIsTouched] = useState(false);

  // Auto-advance every 5 seconds, paused while touched
  useEffect(() => {
    if (isTouched) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % MOBILE_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, isTouched]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsTouched(false);
    if (info.offset.x < -40) {
      setCurrentSlide((prev) => (prev + 1) % MOBILE_SLIDES.length);
    } else if (info.offset.x > 40) {
      setCurrentSlide((prev) => (prev - 1 + MOBILE_SLIDES.length) % MOBILE_SLIDES.length);
    }
  };

  const baseSlide = MOBILE_SLIDES[currentSlide];
  const heroKeys = ['heroSlide1', 'heroSlide2', 'heroSlide3'] as const;
  const customHeroUrl = settings.siteImages?.[heroKeys[currentSlide]];
  const slide = customHeroUrl
    ? { ...baseSlide, image: customHeroUrl, image800: customHeroUrl }
    : baseSlide;

  return (
    <section
      aria-label="Carrousel mobile DELAAFRO"
      className="relative w-full h-[62vh] min-h-[460px] max-h-[580px] overflow-hidden select-none bg-brun-nuit"
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setIsTouched(false)}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={slide.id}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image with slight zoom animation */}
          <motion.img
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            src={slide.image800}
            srcSet={`${slide.image800} 800w, ${slide.image} 1200w`}
            sizes="100vw"
            alt={slide.imageAlt}
            loading={currentSlide === 0 ? 'eager' : 'lazy'}
            fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
            className="w-full h-full object-cover"
            style={{ objectPosition: slide.objectPosition }}
          />

          {/* Dark Bottom Gradient for Maximum Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-brun-nuit/95 via-brun-nuit/40 to-transparent pointer-events-none" />

          {/* Overlaid Bottom Content */}
          <div className="absolute bottom-12 left-0 right-0 px-5 space-y-2.5 z-10 text-left">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-white border border-white/30">
              <Sparkles className="w-3 h-3 text-or" />
              <span>{slide.badge}</span>
            </span>

            {/* Serif Title */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              {slide.title}
            </h1>

            {/* Short Subtitle */}
            <p className="text-xs sm:text-sm text-creme-light/90 line-clamp-2 max-w-sm leading-relaxed">
              {slide.subtitle}
            </p>

            {/* Pill CTA Button */}
            <div className="pt-1.5">
              <Link
                to={slide.ctaHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-cuivre-or text-brun-nuit font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-transform"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Centered Pagination Dots (Gold active) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 pointer-events-none">
        {MOBILE_SLIDES.map((s, idx) => (
          <div
            key={s.id}
            className={`transition-all duration-300 rounded-full h-1.5 ${
              currentSlide === idx
                ? 'w-6 bg-or shadow-xs'
                : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
