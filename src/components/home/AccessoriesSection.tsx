import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionHeader } from '@/components/common/SectionHeader';

export const AccessoriesSection: React.FC = () => {
  const { products } = useSettingsStore();

  const accessories = products
    .filter((p) => p.category === 'accessoire' && p.isPublished)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (accessories.length === 0) return null;

  // Limit to exactly 3 products on the home page
  const displayedAccessories = accessories.slice(0, 3);

  return (
    <section id="accessoires" className="py-14 lg:py-20 bg-creme relative">
      <div className="site-container">
        {/* Header */}
        <SectionHeader
          title="Accessoires & Protection"
          subtitle="Brosses anti-casse, brumisateurs et satins de nuit pour protéger vos cheveux."
          action={{
            label: 'Tous les accessoires',
            to: '/accessoires',
          }}
        />

        {/* Accessories Cards Grid: Exactly 3 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {displayedAccessories.map((accessory) => (
            <ProductCard
              key={accessory.id}
              product={accessory}
              className="sm:last:col-span-2 lg:last:col-span-1"
            />
          ))}
        </div>

        {/* Mobile Centered Link to all accessories */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/accessoires"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-wider bg-terracotta/10 text-terracotta hover:bg-terracotta hover:text-white border border-terracotta/30 transition-all shadow-xs active:scale-95"
          >
            <span>Voir tous les accessoires</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
