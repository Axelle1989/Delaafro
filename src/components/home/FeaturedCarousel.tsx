import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SectionHeader } from '@/components/common/SectionHeader';

export const FeaturedCarousel: React.FC = () => {
  const { products } = useSettingsStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Lister exclusivement les soins individuels (shampoing, huile/sérum, pommade/baume, spray, leave-in)
  // Les gros produits (gammes et coffrets en groupe) sont placés dans la section Gammes
  const careProducts = products.filter(
    (p) => p.isPublished && p.category === 'soin'
  );

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calcul de l'index actif sur mobile
    const cardWidth = 270; // largeur carte + gap
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), careProducts.length - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [careProducts.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 280;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (careProducts.length === 0) return null;

  return (
    <section className="py-14 lg:py-20 bg-creme relative overflow-hidden">
      <div className="site-container">
        {/* Section Header */}
        <SectionHeader
          eyebrow="Soins Individuels"
          title="Nos Soins Plébiscités"
          subtitle="Shampoing, huile, baume, spray et leave-in : des soins artisanaux pour cheveux crépus."
          action={{
            label: 'Tous les soins',
            to: '/boutique?category=soin',
          }}
          actionExtra={
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Soins précédents"
                className={`p-2 rounded-full border transition-all ${
                  canScrollLeft
                    ? 'border-cuivre/40 text-brun-nuit hover:bg-terracotta hover:text-white hover:border-terracotta bg-white/80 shadow-sm'
                    : 'border-sable/30 text-brun-nuit/30 cursor-not-allowed bg-transparent'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Soins suivants"
                className={`p-2 rounded-full border transition-all ${
                  canScrollRight
                    ? 'border-cuivre/40 text-brun-nuit hover:bg-terracotta hover:text-white hover:border-terracotta bg-white/80 shadow-sm'
                    : 'border-sable/30 text-brun-nuit/30 cursor-not-allowed bg-transparent'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          }
        />

        {/* Mobile Swipe Notice */}
        <div className="sm:hidden flex items-center justify-between text-xs text-brun-nuit/70 mb-3 px-1">
          <span>👈 Glissez pour découvrir</span>
          <span className="font-semibold text-terracotta">{activeIndex + 1} / {careProducts.length}</span>
        </div>

        {/* Products Container: Horizontal Swipe on Mobile (< 640px), 5-col Grid on Large Screens */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 sm:gap-4 md:gap-5 xl:gap-6 2xl:gap-8 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 sm:overflow-visible scrollbar-none touch-pan-x"
        >
          {careProducts.map((product) => (
            <div
              key={product.id}
              className="w-[260px] xs:w-[280px] sm:w-auto shrink-0 snap-center sm:snap-align-none flex flex-col"
            >
              <ProductCard product={product} className="h-full" />
            </div>
          ))}
        </div>

        {/* Mobile Dot Indicators */}
        <div className="flex sm:hidden justify-center items-center gap-1.5 pt-3">
          {careProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!scrollRef.current) return;
                scrollRef.current.scrollTo({
                  left: idx * 270,
                  behavior: 'smooth',
                });
              }}
              aria-label={`Aller au soin ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-6 bg-terracotta'
                  : 'w-1.5 bg-sable/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
