import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionHeader } from '@/components/common/SectionHeader';

type AccessoireSubFilter =
  | 'tous'
  | 'kits'
  | 'brosses-peignes'
  | 'brumisateurs'
  | 'flacons'
  | 'scrunchies';

export const AccessoriesPage: React.FC = () => {
  const { products } = useSettingsStore();
  const [activeFilter, setActiveFilter] = useState<AccessoireSubFilter>('tous');

  const accessories = products.filter(
    (p) => p.category === 'accessoire' && p.isPublished
  );

  const filteredAccessories = accessories.filter((item) => {
    if (activeFilter === 'tous') return true;
    if (activeFilter === 'kits') return item.slug.includes('kit-accessoires');
    if (activeFilter === 'brosses-peignes')
      return item.slug.includes('brosse') || item.slug.includes('peigne');
    if (activeFilter === 'brumisateurs') return item.slug.includes('brumisateur');
    if (activeFilter === 'flacons') return item.slug.includes('flacon');
    if (activeFilter === 'scrunchies') return item.slug.includes('scrunchie') || item.slug.includes('satin');
    return true;
  });

  const filterTabs: { id: AccessoireSubFilter; label: string }[] = [
    { id: 'tous', label: 'Tous les accessoires' },
    { id: 'kits', label: 'Kits Complets' },
    { id: 'brosses-peignes', label: 'Brosses & Peignes' },
    { id: 'brumisateurs', label: 'Brumisateurs' },
    { id: 'flacons', label: 'Flacons Applicateurs' },
    { id: 'scrunchies', label: 'Scrunchies & Satin' },
  ];

  return (
    <div className="py-12 bg-creme min-h-screen">
      <div className="site-container">
        {/* Header */}
        <SectionHeader
          level="h1"
          title="Accessoires Spécial Crépus"
          subtitle="Démêler sans casser, brumiser sans tremper et protéger la fibre de jour comme de nuit."
        />

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-terracotta text-white shadow-terracotta-glow scale-105'
                    : 'bg-white text-brun-nuit/75 hover:bg-sable/30 border border-sable/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Accessories Grid */}
        {filteredAccessories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAccessories.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-sable/50 max-w-md mx-auto p-8">
            <SlidersHorizontal className="w-8 h-8 text-cuivre mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-brun-nuit">
              Aucun accessoire dans cette sélection
            </h3>
            <p className="text-xs text-brun-nuit/70 mt-1">
              Essayez de réinitialiser vos filtres pour voir toute la collection.
            </p>
            <button
              onClick={() => setActiveFilter('tous')}
              className="mt-4 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-terracotta text-white"
            >
              Voir tous les accessoires
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

