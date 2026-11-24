import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/store/useSettingsStore';
import { formatFCFA } from '@/lib/formatters';
import { getProductImage } from '@/lib/productImage';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSearchModal: React.FC<MobileSearchModalProps> = ({ isOpen, onClose }) => {
  const { products } = useSettingsStore();
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => p.isPublished)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
          (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
          p.shortDescription.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [products, query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-creme flex flex-col pt-[env(safe-area-inset-top,12px)] pb-6 px-4"
        >
          {/* Header with Search Input */}
          <div className="flex items-center gap-2 pb-3 border-b border-sable/50">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brun-nuit/50" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un soin, une gamme, un accessoire..."
                autoFocus
                className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white border border-sable/60 text-sm text-brun-nuit placeholder:text-brun-nuit/40 focus:outline-none focus:ring-2 focus:ring-terracotta/40 shadow-inner"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Effacer la recherche"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brun-nuit/40 hover:text-brun-nuit"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-terracotta hover:text-terracotta-deep active:scale-95"
            >
              Fermer
            </button>
          </div>

          {/* Quick Suggestions or Results */}
          <div className="flex-1 overflow-y-auto pt-4 space-y-2">
            {!query ? (
              <div className="space-y-4 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-brun-nuit/50 px-2">
                  Suggestions populaires :
                </p>
                <div className="flex flex-wrap gap-2 px-2">
                  {['Gamme Locksés', 'Gamme Complète', 'Shampoing Doux', 'Sérum Capillaire', 'Baume', 'Brosse'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-sable text-xs font-medium text-brun-nuit hover:bg-sable/30 active:scale-95 transition-all shadow-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-brun-nuit/60 px-2 mb-2 font-medium">
                  {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''} :
                </p>
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/produit/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-sable/40 shadow-sm active:scale-[0.99] transition-all hover:border-terracotta/40"
                  >
                    <div className="w-14 h-14 rounded-xl bg-creme-light overflow-hidden shrink-0 border border-sable/30 flex items-center justify-center p-1">
                      <img
                        src={getProductImage(product, 0)}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta block truncate">
                        {product.categoryLabel || product.category}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-brun-nuit truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs font-extrabold text-terracotta mt-0.5">
                        {formatFCFA(product.price)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brun-nuit/30 shrink-0 pr-1" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 space-y-2">
                <Sparkles className="w-8 h-8 text-or/60 mx-auto" />
                <p className="text-sm font-semibold text-brun-nuit">
                  Aucun produit trouvé pour « {query} »
                </p>
                <p className="text-xs text-brun-nuit/60 max-w-xs mx-auto">
                  Vérifiez l'orthographe ou essayez un mot plus général (ex : shampoing, sérum, gamme).
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
