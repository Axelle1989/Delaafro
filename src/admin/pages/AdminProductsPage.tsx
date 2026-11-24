import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { formatFCFA } from '@/lib/formatters';
import { getProductImage } from '@/lib/productImage';
import { Button } from '@/components/common/Button';
import { ProductCategory, Product } from '@/types';

export const AdminProductsPage: React.FC = () => {
  const { products, updateProduct, deleteProduct } = useSettingsStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProductCategory>('all');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Inline Toggles
  const togglePublished = async (p: Product) => {
    await updateProduct(p.id, { isPublished: !p.isPublished });
    showToast(`Produit ${!p.isPublished ? 'publié' : 'masqué'}`);
  };

  const toggleFeatured = async (p: Product) => {
    await updateProduct(p.id, { isFeatured: !p.isFeatured });
    showToast(`Produit ${!p.isFeatured ? 'mis en avant' : 'retiré des vedettes'}`);
  };

  const toggleInStock = async (p: Product) => {
    await updateProduct(p.id, { inStock: !p.inStock });
    showToast(`Disponibilité : ${!p.inStock ? 'En stock' : 'Rupture'}`);
  };

  const startEditPrice = (p: Product) => {
    setEditingPriceId(p.id);
    setTempPrice(p.price);
  };

  const saveEditPrice = async (id: string) => {
    if (tempPrice > 0) {
      await updateProduct(id, { price: tempPrice });
      showToast('Prix mis à jour avec succès');
    }
    setEditingPriceId(null);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      showToast(`Produit « ${productToDelete.name} » supprimé`);
      setProductToDelete(null);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= products.length) return;

    const reordered = [...products];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;

    // Save order
    const orderedIds = reordered.map((p) => p.id);
    const { reorderProducts } = useSettingsStore.getState();
    await reorderProducts(orderedIds);
    showToast('Ordre d’affichage mis à jour');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brun-nuit text-creme-light px-6 py-3 rounded-2xl shadow-2xl border border-or/40 flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-cuivre">
            Catalogue Produits
          </span>
          <h1 className="font-serif text-3xl font-bold text-brun-nuit mt-1">
            Gestion des Soins & Gammes
          </h1>
          <p className="text-xs sm:text-sm text-brun-nuit/70">
            Modifiez prix, visibilité, stocks et ordre d'affichage en direct.
          </p>
        </div>

        <Link to="/admin/produits/nouveau">
          <Button
            variant="terracotta"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Ajouter un produit
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-luxury border border-sable/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-brun-nuit/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl border border-sable bg-creme/20 focus:outline-none focus:border-terracotta"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
          {(['all', 'gamme', 'soin', 'accessoire'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold uppercase tracking-wider transition-colors ${
                categoryFilter === cat
                  ? 'bg-terracotta text-white'
                  : 'bg-sable/30 text-brun-nuit/80 hover:bg-sable/60'
              }`}
            >
              {cat === 'all'
                ? 'Tous'
                : cat === 'gamme'
                ? 'Gammes'
                : cat === 'soin'
                ? 'Soins'
                : 'Accessoires'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl shadow-luxury border border-sable/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-creme/40 border-b border-sable/40 text-[11px] font-bold uppercase tracking-wider text-brun-nuit/70">
                <th className="py-4 px-4 w-12 text-center">Ordre</th>
                <th className="py-4 px-4">Produit</th>
                <th className="py-4 px-4">Catégorie</th>
                <th className="py-4 px-4">Prix (FCFA)</th>
                <th className="py-4 px-4 text-center">Publié</th>
                <th className="py-4 px-4 text-center">En Vedette</th>
                <th className="py-4 px-4 text-center">En Stock</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sable/30">
              {filteredProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-creme/20 transition-colors">
                  {/* Reorder Buttons */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        onClick={() => moveOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="text-brun-nuit/40 hover:text-terracotta disabled:opacity-20 p-0.5"
                        title="Monter"
                        aria-label="Monter d'un rang"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveOrder(idx, 'down')}
                        disabled={idx === products.length - 1}
                        className="text-brun-nuit/40 hover:text-terracotta disabled:opacity-20 p-0.5"
                        title="Descendre"
                        aria-label="Descendre d'un rang"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Thumbnail and Title */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getProductImage(p, 0)}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-sable shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/admin/produits/${p.id}`}
                          className="font-serif font-bold text-sm text-brun-nuit hover:text-terracotta truncate block"
                        >
                          {p.name}
                        </Link>
                        <p className="text-[10px] text-brun-nuit/50 truncate">
                          /{p.slug}
                        </p>
                        {p.badge && (
                          <span className="text-[9px] uppercase font-bold text-terracotta bg-sable/30 px-1.5 py-0.2 rounded-md mr-1.5">
                            {p.badge}
                          </span>
                        )}
                        {p.needsStudioPhoto && (
                          <span className="text-[9px] uppercase font-bold text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded-md">
                            Photo à remplacer par studio
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 capitalize font-medium text-brun-nuit/80">
                    {p.category}
                  </td>

                  {/* Quick Price Edit in cell */}
                  <td className="py-4 px-4 font-serif font-bold text-terracotta">
                    {editingPriceId === p.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(Number(e.target.value))}
                          className="w-20 text-xs px-2 py-1 border border-terracotta rounded-lg focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditPrice(p.id);
                            if (e.key === 'Escape') setEditingPriceId(null);
                          }}
                        />
                        <button
                          onClick={() => saveEditPrice(p.id)}
                          className="text-[10px] bg-terracotta text-white px-2 py-1 rounded-md"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditPrice(p)}
                        className="hover:underline flex items-center gap-1 text-terracotta font-serif font-bold"
                        title="Cliquer pour modifier rapidement le prix"
                      >
                        <span>{formatFCFA(p.price)}</span>
                        <Edit className="w-3 h-3 text-brun-nuit/30 hover:text-terracotta" />
                      </button>
                    )}
                  </td>

                  {/* Toggle Published */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => togglePublished(p)}
                      className={`p-1.5 rounded-xl transition-colors ${
                        p.isPublished
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={p.isPublished ? 'Visible sur le site' : 'Masqué sur le site'}
                      aria-label={p.isPublished ? 'Visible sur le site' : 'Masqué sur le site'}
                    >
                      {p.isPublished ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* Toggle Featured */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => toggleFeatured(p)}
                      className={`p-1.5 rounded-xl transition-colors ${
                        p.isFeatured
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={p.isFeatured ? 'Mis en avant' : 'Non mis en avant'}
                      aria-label={p.isFeatured ? 'Mis en avant' : 'Non mis en avant'}
                    >
                      <Star
                        className={`w-4 h-4 ${p.isFeatured ? 'fill-amber-500' : ''}`}
                      />
                    </button>
                  </td>

                  {/* Toggle In Stock */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => toggleInStock(p)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        p.inStock
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      aria-label={`Changer disponibilité : ${p.inStock ? 'En stock' : 'Rupture'}`}
                    >
                      {p.inStock ? 'En stock' : 'Rupture'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/produits/${p.id}`}
                        className="p-1.5 rounded-xl text-brun-nuit/70 hover:text-terracotta hover:bg-sable/30 transition-colors"
                        title="Éditer le formulaire complet"
                        aria-label="Éditer le formulaire complet"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => setProductToDelete(p)}
                        className="p-1.5 rounded-xl text-brun-nuit/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Supprimer ce produit"
                        aria-label="Supprimer ce produit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-brun-nuit/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-sable/60 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-lg font-bold text-brun-nuit">
                Supprimer le produit ?
              </h3>
              <p className="text-xs text-brun-nuit/70 mt-1">
                Êtes-vous sûre de vouloir supprimer « {productToDelete.name} » ? Cette action est irréversible.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProductToDelete(null)}
              >
                Annuler
              </Button>
              <Button
                variant="terracotta"
                size="sm"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

