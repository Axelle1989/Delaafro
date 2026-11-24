import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/store/useSettingsStore';
import { formatFCFA } from '@/lib/formatters';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';
import { getProductImage } from '@/lib/productImage';
import { Product } from '@/types';

export const RangesSection: React.FC = () => {
  const { products, settings } = useSettingsStore();
  const shouldReduceMotion = useReducedMotion();

  // 1. Filtrer les 3 gammes cheveux crépus
  const afroRanges = products
    .filter((p) => p.category === 'gamme' && p.id !== 'gamme-lockses' && p.isPublished)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Gamme locksés optionnelle pour le renvoi
  const locksesRange = products.find((p) => p.id === 'gamme-lockses' && p.isPublished);

  const [activeRangeId, setActiveRangeId] = useState<string>(
    afroRanges[0]?.id || 'gamme-complete'
  );
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  // Détection mobile (< 1024 px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Détection visibilité viewport pour ne faire tourner l'auto-rotation que si visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Rotation automatique toutes les 7s (uniquement desktop, stoppée dès interaction utilisateur)
  useEffect(() => {
    if (
      shouldReduceMotion ||
      !isAutoRotate ||
      hasUserInteracted ||
      isPaused ||
      !isInView ||
      isMobile ||
      afroRanges.length === 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setActiveRangeId((currentId) => {
        const currentIndex = afroRanges.findIndex((r) => r.id === currentId);
        const nextIndex = (currentIndex + 1) % afroRanges.length;
        return afroRanges[nextIndex].id;
      });
    }, 7000);

    return () => clearInterval(timer);
  }, [
    shouldReduceMotion,
    isAutoRotate,
    hasUserInteracted,
    isPaused,
    isInView,
    isMobile,
    afroRanges,
  ]);

  const stopAutoRotate = () => {
    setHasUserInteracted(true);
    setIsAutoRotate(false);
  };

  const handleSelectRange = (rangeId: string) => {
    stopAutoRotate();
    setActiveRangeId(rangeId);
  };

  // Navigation clavier ↑ / ↓ et ← / →
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      stopAutoRotate();
      const nextIdx = (index + 1) % afroRanges.length;
      setActiveRangeId(afroRanges[nextIdx].id);
      setTimeout(() => tabRefs.current[nextIdx]?.focus(), 20);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      stopAutoRotate();
      const prevIdx = (index - 1 + afroRanges.length) % afroRanges.length;
      setActiveRangeId(afroRanges[prevIdx].id);
      setTimeout(() => tabRefs.current[prevIdx]?.focus(), 20);
    } else if (e.key === 'Home') {
      e.preventDefault();
      stopAutoRotate();
      setActiveRangeId(afroRanges[0].id);
      setTimeout(() => tabRefs.current[0]?.focus(), 20);
    } else if (e.key === 'End') {
      e.preventDefault();
      stopAutoRotate();
      const lastIdx = afroRanges.length - 1;
      setActiveRangeId(afroRanges[lastIdx].id);
      setTimeout(() => tabRefs.current[lastIdx]?.focus(), 20);
    }
  };

  const activeRange =
    afroRanges.find((r) => r.id === activeRangeId) || afroRanges[0];

  if (!activeRange) return null;

  // Helper noms courts, nombre de soins et libellés majuscules
  const getShortInfo = (range: Product) => {
    if (range.id === 'gamme-complete') {
      return {
        count: '5 soins',
        shortName: 'Complète',
        fullName: 'GAMME COMPLÈTE',
      };
    }
    if (range.id === 'gamme-hydratation') {
      return {
        count: '4 soins',
        shortName: 'Hydratation',
        fullName: 'GAMME HYDRATATION',
      };
    }
    return {
      count: '3 soins',
      shortName: 'Essentielle',
      fullName: 'GAMME ESSENTIELLE',
    };
  };

  // Récupérer les vrais produits inclus dans la gamme active pour les miniatures
  const getIncludedProducts = (range: Product) => {
    if (range.id === 'gamme-complete') {
      return ['shampoing-doux', 'spray-hydratant', 'baume-nourrissant', 'leave-in-demelant', 'serum-capillaire']
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p));
    }
    if (range.id === 'gamme-hydratation') {
      return ['shampoing-doux', 'spray-hydratant', 'baume-nourrissant', 'serum-capillaire']
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p));
    }
    if (range.id === 'gamme-essentielle') {
      return ['shampoing-doux', 'baume-nourrissant', 'serum-capillaire']
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p));
    }
    return [];
  };

  const includedProducts = getIncludedProducts(activeRange);
  const rangeImage = getProductImage(activeRange, 0);

  return (
    <section
      id="gammes"
      ref={sectionRef}
      onMouseEnter={() => !hasUserInteracted && setIsPaused(true)}
      onMouseLeave={() => !hasUserInteracted && setIsPaused(false)}
      className="py-12 md:py-16 bg-sable/20 relative overflow-hidden"
    >
      {/* Accessibilité & SEO : Titre masqué visuellement mais présent dans le DOM */}
      <h2 className="sr-only">Nos gammes pour cheveux crépus</h2>

      {/* Conteneur pleine largeur avec marges horizontales généreuses */}
      <div className="w-full max-w-none px-4 md:px-8 xl:px-12">
        {/* Grand bloc arrondi 36px fond crème-light dégradé sable-light */}
        <div className="rounded-[28px] md:rounded-[36px] bg-gradient-to-br from-creme-light to-sable-light border border-sable/60 shadow-luxury overflow-hidden p-5 sm:p-7 lg:p-8 xl:p-10">
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-stretch">
            {/* =========================================================================
                A) COLONNE GAUCHE (≈ 38 %) : Liste verticale des 3 sélections (PC)
            ========================================================================= */}
            <div className="hidden lg:flex lg:w-[38%] shrink-0 flex-col justify-between space-y-6">
              <div
                role="tablist"
                aria-orientation="vertical"
                aria-label="Sélection des gammes pour cheveux crépus"
                className="flex flex-col divide-y divide-sable/50"
              >
                {afroRanges.map((range, idx) => {
                  const isSelected = range.id === activeRangeId;
                  const shortInfo = getShortInfo(range);
                  const num = `0${idx + 1}`;

                  return (
                    <button
                      key={range.id}
                      ref={(el) => (tabRefs.current[idx] = el)}
                      role="tab"
                      id={`tab-${range.id}`}
                      aria-controls={`panel-${range.id}`}
                      aria-selected={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => handleSelectRange(range.id)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className={`group relative p-4 xl:p-5 text-left transition-all duration-200 focus:outline-none cursor-pointer flex flex-col justify-center select-none ${
                        isSelected
                          ? 'bg-terracotta/[0.08] rounded-2xl shadow-xs'
                          : 'hover:bg-creme/60 hover:translate-x-1.5 rounded-2xl'
                      }`}
                    >
                      {/* Barre verticale terracotta 4px animée */}
                      {isSelected && (
                        <motion.div
                          layoutId="activeRangeBar"
                          className="absolute left-0 top-3 bottom-3 w-1 bg-terracotta rounded-r-full"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}

                      <div className="flex items-center gap-3.5 pl-2">
                        {/* Grand numéro serif « 01 / 02 / 03 » */}
                        <span
                          className={`font-serif font-extrabold text-4xl xl:text-5xl leading-none transition-colors select-none shrink-0 w-12 xl:w-14 ${
                            isSelected ? 'text-terracotta' : 'text-transparent'
                          }`}
                          style={{
                            WebkitTextStroke: isSelected
                              ? '0'
                              : '1.5px rgba(181, 83, 43, 0.35)',
                          }}
                        >
                          {num}
                        </span>

                        {/* Contenu textuel sans aucune coupure */}
                        <div className="flex-1 min-w-0">
                          {/* Ligne 1 : Nombre de soins + badge + prix aligné à droite */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-lg xl:text-xl text-brun-nuit whitespace-nowrap">
                                {shortInfo.count}
                              </span>
                              {range.badge && (
                                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-or/20 text-brun-nuit border border-or/40 shrink-0">
                                  {range.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-sans font-bold text-sm xl:text-base text-terracotta whitespace-nowrap">
                                {formatFCFA(range.price)}
                              </span>
                              {range.originalPrice && range.originalPrice > range.price && (
                                <span className="text-[11px] text-brun-nuit/40 line-through block leading-none">
                                  {formatFCFA(range.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Ligne 2 : Nom de la gamme en majuscules (non tronqué) + flèche */}
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-brun-nuit/80">
                              {shortInfo.fullName}
                            </span>
                            {isSelected ? (
                              <motion.div
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-terracotta shrink-0"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </motion.div>
                            ) : (
                              <ArrowRight className="w-4 h-4 text-brun-nuit/20 group-hover:text-brun-nuit/60 group-hover:translate-x-0.5 transition-all shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Fine barre de progression (7s) sous la ligne active */}
                      {isSelected && isAutoRotate && !isPaused && !shouldReduceMotion && (
                        <div className="w-full h-0.5 bg-terracotta/20 rounded-full mt-3 overflow-hidden">
                          <motion.div
                            key={`progress-${range.id}`}
                            className="h-full bg-terracotta"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 7, ease: 'linear' }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Liens discrets vers le catalogue complet et les locksés */}
              <div className="pt-4 border-t border-sable/50 space-y-2">
                <Link
                  to="/nos-gammes"
                  className="inline-flex items-center justify-between w-full text-xs xl:text-sm font-bold uppercase tracking-wider text-terracotta hover:text-terracotta-deep transition-colors group"
                >
                  <span>Explorer toutes nos gammes</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                {locksesRange && (
                  <Link
                    to={`/produit/${locksesRange.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-brun-nuit/75 hover:text-terracotta transition-colors"
                  >
                    <span>Cheveux locksés ? Découvrir la Gamme Locksés (3 soins)</span>
                    <ArrowRight className="w-3 h-3 text-terracotta/70" />
                  </Link>
                )}
              </div>
            </div>

            {/* =========================================================================
                B) SCÈNE DROITE (≈ 62 %) : Grande « vitrine » hauteur ≈ 560 px
            ========================================================================= */}
            <div className="lg:w-[62%] flex-1 flex flex-col space-y-4">
              <div
                role="tabpanel"
                id={`panel-${activeRange.id}`}
                aria-labelledby={`tab-${activeRange.id}`}
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  if (touchStartX.current === null) return;
                  const diff = e.changedTouches[0].clientX - touchStartX.current;
                  if (Math.abs(diff) > 40) {
                    stopAutoRotate();
                    const currentIndex = afroRanges.findIndex((r) => r.id === activeRangeId);
                    if (diff < 0) {
                      const nextIdx = (currentIndex + 1) % afroRanges.length;
                      setActiveRangeId(afroRanges[nextIdx].id);
                    } else {
                      const prevIdx = (currentIndex - 1 + afroRanges.length) % afroRanges.length;
                      setActiveRangeId(afroRanges[prevIdx].id);
                    }
                  }
                  touchStartX.current = null;
                }}
                className="relative h-[420px] sm:h-[460px] lg:h-[560px] w-full rounded-[24px] md:rounded-[28px] overflow-hidden shadow-xl select-none bg-brun-nuit"
              >
                {/* 1. Photo de la gamme active avec transition fondu croisé + zoom (scale 1.06 -> 1) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeRange.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {!imageErrors[activeRange.id] && rangeImage ? (
                      <motion.img
                        src={rangeImage}
                        alt={activeRange.name}
                        onError={() =>
                          setImageErrors((prev) => ({ ...prev, [activeRange.id]: true }))
                        }
                        initial={{ scale: shouldReduceMotion ? 1 : 1.06 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.7,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      /* Fallback élégant cuivre/terracotta si image manquante */
                      <div className="w-full h-full bg-gradient-to-br from-terracotta via-cuivre to-brun-nuit flex flex-col items-center justify-center text-white p-8">
                        <Sparkles className="w-12 h-12 text-or mb-3 animate-pulse" />
                        <h4 className="font-serif font-bold text-2xl text-creme-light">
                          {activeRange.name}
                        </h4>
                        <p className="text-sm text-creme-light/80 mt-1">
                          {activeRange.subtitle}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* 2. Dégradé de lisibilité en bas (55% de la hauteur, haut net) */}
                <div
                  className="absolute inset-x-0 bottom-0 h-[58%] lg:h-[50%] bg-gradient-to-t from-brun-nuit via-brun-nuit/75 via-45% to-transparent pointer-events-none z-10"
                  aria-hidden="true"
                />

                {/* 3. Badge en haut à gauche */}
                {activeRange.badge && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-brun-nuit/85 text-or border border-or/40 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                      {activeRange.badge}
                    </span>
                  </div>
                )}

                {/* 4. Miniatures rondes « Dans cette gamme » en haut à droite */}
                {includedProducts.length > 0 && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-brun-nuit/70 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-creme-light hidden md:inline">
                      Dans cette gamme :
                    </span>
                    <div className="flex items-center">
                      {includedProducts.map((prod) => (
                        <Link
                          key={prod.id}
                          to={`/produit/${prod.slug}`}
                          title={prod.name}
                          className="relative group -ml-2 sm:-ml-2.5 first:ml-0 transition-transform hover:scale-125 hover:z-30 focus:outline-none focus:scale-125 focus:z-30"
                        >
                          <img
                            src={getProductImage(prod, 0)}
                            alt={prod.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover bg-creme shadow-sm"
                          />
                          <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-brun-nuit px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus:opacity-100 z-40">
                            {prod.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Contenu superposé en bas (Texte + Bloc Verre Dépoli sur desktop) */}
                <div className="absolute bottom-5 sm:bottom-6 inset-x-5 sm:inset-x-6 z-20 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
                  {/* Textes : surtitre, titre serif, description complète sans coupure */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`content-${activeRange.id}`}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-1 sm:space-y-1.5 text-left w-full lg:max-w-[calc(100%-290px)]"
                    >
                      <motion.span
                        variants={{
                          hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.45, delay: 0 },
                          },
                          exit: {
                            opacity: 0,
                            y: shouldReduceMotion ? 0 : -8,
                            transition: { duration: 0.2 },
                          },
                        }}
                        className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-or block drop-shadow-sm"
                      >
                        {activeRange.categoryLabel?.toUpperCase() || 'RITUEL SOIN CHEVEUX CRÉPUS'}
                      </motion.span>

                      <motion.h3
                        variants={{
                          hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.45, delay: 0.08 },
                          },
                          exit: {
                            opacity: 0,
                            y: shouldReduceMotion ? 0 : -8,
                            transition: { duration: 0.2 },
                          },
                        }}
                        className="font-serif font-bold text-2xl sm:text-3xl xl:text-4xl text-white leading-tight drop-shadow-md"
                      >
                        {activeRange.name}
                      </motion.h3>

                      <motion.p
                        variants={{
                          hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.45, delay: 0.16 },
                          },
                          exit: {
                            opacity: 0,
                            y: shouldReduceMotion ? 0 : -8,
                            transition: { duration: 0.2 },
                          },
                        }}
                        className="text-xs sm:text-sm text-creme-light/95 leading-relaxed font-sans drop-shadow-sm"
                      >
                        {activeRange.longDescription || activeRange.shortDescription}
                      </motion.p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Bloc verre dépoli (affiché en bas à droite sur desktop >= 1024px) */}
                  <div className="hidden lg:flex flex-col gap-2.5 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-4 xl:p-5 text-white shadow-xl w-[270px] shrink-0">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-serif font-extrabold text-2xl xl:text-3xl text-white whitespace-nowrap">
                        {formatFCFA(activeRange.price)}
                      </span>
                      {activeRange.originalPrice && activeRange.originalPrice > activeRange.price && (
                        <span className="font-serif text-sm text-white/60 line-through whitespace-nowrap">
                          {formatFCFA(activeRange.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Link
                        to={`/produit/${activeRange.slug}`}
                        className="w-full text-center py-2.5 px-4 rounded-full font-bold text-sm bg-terracotta hover:bg-terracotta-deep text-white shadow-md hover:shadow-lg transition-all active:scale-95"
                      >
                        Découvrir cette gamme
                      </Link>
                      <a
                        href={buildWhatsAppInquiryUrl(
                          `la ${activeRange.name}`,
                          settings.whatsappNumber
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-xs transition-all active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                        <span>Commander sur WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  3. MOBILE (< 1024 px) : Bloc Prix/CTA sous la photo en pleine largeur
              ========================================================================= */}
              <div className="flex lg:hidden flex-col gap-3 bg-white border border-sable/60 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brun-nuit/70 shrink-0">
                    Rituel complet
                  </span>
                  <div className="flex items-baseline gap-2 shrink-0">
                    <span className="font-serif font-extrabold text-2xl text-terracotta whitespace-nowrap">
                      {formatFCFA(activeRange.price)}
                    </span>
                    {activeRange.originalPrice && activeRange.originalPrice > activeRange.price && (
                      <span className="font-serif text-xs text-brun-nuit/40 line-through whitespace-nowrap">
                        {formatFCFA(activeRange.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <Link
                    to={`/produit/${activeRange.slug}`}
                    className="w-full text-center py-3 px-5 rounded-full font-bold text-sm bg-terracotta hover:bg-terracotta-deep text-white shadow-md active:scale-95 transition-all flex items-center justify-center"
                  >
                    Découvrir cette gamme
                  </Link>
                  <a
                    href={buildWhatsAppInquiryUrl(
                      `la ${activeRange.name}`,
                      settings.whatsappNumber
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full text-sm font-semibold bg-sable/30 hover:bg-sable/50 text-brun-nuit border border-sable/80 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-feuille" />
                    <span>Commander sur WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* =========================================================================
                  4. MOBILE (< 1024 px) : Onglets horizontaux scrollables sous la scène
              ========================================================================= */}
              <div
                role="tablist"
                aria-label="Sélection des gammes"
                className="flex lg:hidden gap-3 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory scrollbar-none"
              >
                {afroRanges.map((range, idx) => {
                  const isSelected = range.id === activeRangeId;
                  const shortInfo = getShortInfo(range);
                  const num = `0${idx + 1}`;

                  return (
                    <button
                      key={range.id}
                      role="tab"
                      id={`mobile-tab-${range.id}`}
                      aria-controls={`panel-${range.id}`}
                      aria-selected={isSelected}
                      onClick={() => handleSelectRange(range.id)}
                      className={`snap-center shrink-0 min-w-[220px] p-3 rounded-2xl text-left border transition-all duration-200 min-h-[56px] flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-white border-terracotta shadow-md ring-2 ring-terracotta/20'
                          : 'bg-white/80 border-sable/60 text-brun-nuit/80 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`font-serif font-extrabold text-2xl leading-none ${
                            isSelected ? 'text-terracotta' : 'text-brun-nuit/30'
                          }`}
                        >
                          {num}
                        </span>
                        <div>
                          <span className="font-serif font-bold text-sm block text-brun-nuit">
                            {shortInfo.count}
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-brun-nuit/70 block">
                            {shortInfo.shortName}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-sans font-bold text-xs sm:text-sm text-terracotta block">
                          {formatFCFA(range.price)}
                        </span>
                        {range.badge && (
                          <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-or/20 text-brun-nuit border border-or/40">
                            {range.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Mobile : Liens additionnels */}
              <div className="flex lg:hidden flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                <Link
                  to="/nos-gammes"
                  className="font-bold uppercase tracking-wider text-terracotta hover:underline inline-flex items-center gap-1"
                >
                  <span>Voir toutes les gammes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {locksesRange && (
                  <Link
                    to={`/produit/${locksesRange.slug}`}
                    className="text-brun-nuit/70 hover:text-terracotta"
                  >
                    Gamme Locksés (3 soins) →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
