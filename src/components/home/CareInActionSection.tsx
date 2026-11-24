import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  description: string;
  tag: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    src: '/products/lifestyle/application-serum-sur-tresses.jpg',
    title: 'Nutrition en profondeur',
    description: 'Application ciblée du sérum fortifiant sur nattes et tresses protectrices.',
    tag: 'Rituel Quotidien'
  },
  {
    id: '2',
    src: '/products/lifestyle/gamme-complete-portrait-afro.jpg',
    title: 'La Gamme Complète DELAAFRO',
    description: 'L’élégance d’une routine naturelle conçue pour sublimer la texture crépue.',
    tag: 'Gamme Royale'
  },
  {
    id: '3',
    src: '/products/soins/serum-forte-porosite/serum-application-nattes-vue-dessus.jpg',
    title: 'Sérum Forte Porosité',
    description: 'Comble les cuticules ouvertes et scelle l’hydratation au cœur du cheveu.',
    tag: 'Soin Ciblé'
  }
];

export const CareInActionSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => ((prev! + 1) % GALLERY_ITEMS.length));
  }, [activeIndex]);

  const handlePrev = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev! - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
  }, [activeIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handleNext, handlePrev]);

  return (
    <section className="py-14 lg:py-20 bg-creme-dark/40 relative overflow-hidden">
      <div className="site-container">
        {/* Section Header */}
        <SectionHeader
          eyebrow="Galerie Visuelle"
          title="Nos Soins en Action"
          subtitle="Des textures généreuses et des résultats visibles sur cheveux naturels crépus."
        />

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveIndex(index)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white border border-or/20 shadow-luxury hover:shadow-luxury-hover flex flex-col justify-between sm:last:col-span-2 lg:last:col-span-1"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brun-nuit/5">
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-brun-nuit flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-terracotta/10 text-terracotta mb-2">
                    {item.tag}
                  </span>
                  <h3 className="card-title text-lg sm:text-xl group-hover:text-terracotta transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="card-text text-sm sm:text-base mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brun-nuit/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActiveIndex(null)}
          >
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              aria-label="Fermer la vue agrandie"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content Container */}
            <div
              className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_ITEMS[activeIndex].src}
                alt={GALLERY_ITEMS[activeIndex].title}
                className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-or/30"
              />
              <div className="mt-4 text-center text-white max-w-xl px-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-widest text-or font-bold">
                    {GALLERY_ITEMS[activeIndex].tag}
                  </span>
                  <span className="text-xs text-sable/40">•</span>
                  <span className="text-xs text-sable/70 font-medium">
                    {activeIndex + 1} / {GALLERY_ITEMS.length}
                  </span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold mt-1">
                  {GALLERY_ITEMS[activeIndex].title}
                </h4>
                <p className="text-sm text-sable/80 mt-1">
                  {GALLERY_ITEMS[activeIndex].description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

