import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCategory } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';

export const ShopPage: React.FC = () => {
  const { products } = useSettingsStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategoryParam = (searchParams.get('category') as ProductCategory | 'all' | 'lockses') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories: { key: 'all' | ProductCategory | 'lockses'; label: string }[] = [
    { key: 'all', label: 'Tous les Soins' },
    { key: 'gamme', label: 'Gammes Complètes' },
    { key: 'lockses', label: '🌿 Espace Locksés' },
    { key: 'soin', label: 'Soins Individuels' },
    { key: 'accessoire', label: 'Accessoires & Satin' },
  ];

  const handleCategoryChange = (cat: 'all' | ProductCategory | 'lockses') => {
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isPublished)
      .filter((p) => {
        if (activeCategoryParam === 'lockses') {
          return p.slug === 'gamme-lockses' || ['shampoing-doux', 'spray-hydratant', 'serum-capillaire'].includes(p.slug);
        }
        if (activeCategoryParam !== 'all' && p.category !== activeCategoryParam) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(query);
          const matchDesc = p.shortDescription.toLowerCase().includes(query);
          const matchBenefits = p.benefits.some((b) => b.toLowerCase().includes(query));
          return matchName || matchDesc || matchBenefits;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        // 'featured'
        return a.displayOrder - b.displayOrder;
      });
  }, [products, activeCategoryParam, searchQuery, sortBy]);

  return (
    <div className="py-12 bg-creme min-h-screen">
      <div className="site-container">
        {/* Page Header */}
        <SectionHeader
          level="h1"
          eyebrow="Catalogue Officiel"
          title="La Boutique DELAAFRO"
          subtitle="Tous nos soins capillaires naturels et accessoires conçus pour exalter vos cheveux crépus au quotidien."
        />

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-luxury border border-sable/60 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-brun-nuit/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un baume, un sérum, une brosse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-full border border-sable bg-creme/20 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <SlidersHorizontal className="w-4 h-4 text-brun-nuit/60 shrink-0" />
              <span className="text-xs text-brun-nuit/60 whitespace-nowrap">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Trier par"
                className="text-xs font-medium px-3 py-2 rounded-xl border border-sable bg-white text-brun-nuit focus:outline-none focus:border-terracotta"
              >
                <option value="featured">Recommandés & Populaires</option>
                <option value="price-asc">Prix : croissant</option>
                <option value="price-desc">Prix : décroissant</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-sable/30 pt-4 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategoryParam === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all uppercase tracking-wider ${
                    isActive
                      ? 'bg-terracotta text-white shadow-sm'
                      : 'bg-sable/30 text-brun-nuit/80 hover:bg-sable/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-brun-nuit/60 mb-6">
          <span>{filteredProducts.length} produit(s) trouvé(s)</span>
          {activeCategoryParam !== 'all' && (
            <button
              onClick={() => handleCategoryChange('all')}
              className="text-terracotta hover:underline font-medium"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm border border-sable/60">
            <p className="font-serif text-lg font-bold text-brun-nuit mb-2">
              Aucun soin ne correspond à votre recherche.
            </p>
            <p className="text-xs text-brun-nuit/70 mb-4">
              Essayez un autre mot-clé ou réinitialisez les filtres pour découvrir toute notre gamme.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleCategoryChange('all');
              }}
              className="text-xs font-bold uppercase tracking-wider text-terracotta underline"
            >
              Voir tout le catalogue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-5 xl:gap-6 2xl:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

