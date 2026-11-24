import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Sparkles,
  AlertTriangle,
  MessageSquare,
  PlusCircle,
  ExternalLink,
  MessageCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { formatFCFA } from '@/lib/formatters';
import { getProductImage } from '@/lib/productImage';
import { Button } from '@/components/common/Button';

export const AdminDashboardPage: React.FC = () => {
  const { products, testimonials, settings } = useSettingsStore();

  const totalProducts = products.length;
  const featuredProducts = products.filter((p) => p.isFeatured).length;
  const outOfStockProducts = products.filter((p) => !p.inStock).length;
  const totalTestimonials = testimonials.length;

  const recentProducts = [...products]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-cuivre">
            Aperçu Global
          </span>
          <h1 className="font-serif text-3xl font-bold text-brun-nuit mt-1">
            Tableau de Bord DELAAFRO
          </h1>
          <p className="text-xs sm:text-sm text-brun-nuit/70">
            Gérez vos gammes, disponibilités et paramètres de commande en direct.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/produits/nouveau">
            <Button
              variant="terracotta"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Nouveau Soin
            </Button>
          </Link>
          <a
            href="/"
            target="_blank"
            className="p-2.5 rounded-full bg-white border border-sable text-brun-nuit hover:text-terracotta shadow-sm transition-colors"
            title="Ouvrir le site public"
            aria-label="Ouvrir le site public"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-luxury border border-sable/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brun-nuit/60">
              Total Soins
            </span>
            <div className="p-2.5 rounded-2xl bg-sable/30 text-brun-nuit">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-brun-nuit">{totalProducts}</p>
          <p className="text-[11px] text-brun-nuit/60">Dans la boutique active</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-luxury border border-sable/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brun-nuit/60">
              En Vedette
            </span>
            <div className="p-2.5 rounded-2xl bg-or/20 text-or-dark">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-or-dark">{featuredProducts}</p>
          <p className="text-[11px] text-brun-nuit/60">Mis en avant sur l'accueil</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-luxury border border-sable/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brun-nuit/60">
              Ruptures Stock
            </span>
            <div className={`p-2.5 rounded-2xl ${outOfStockProducts > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className={`font-serif text-3xl font-bold ${outOfStockProducts > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {outOfStockProducts}
          </p>
          <p className="text-[11px] text-brun-nuit/60">
            {outOfStockProducts > 0 ? 'À réapprovisionner' : 'Tous disponibles'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-luxury border border-sable/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brun-nuit/60">
              Témoignages
            </span>
            <div className="p-2.5 rounded-2xl bg-feuille/20 text-feuille">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-brun-nuit">{totalTestimonials}</p>
          <p className="text-[11px] text-brun-nuit/60">Avis clientes enregistrés</p>
        </div>
      </div>

      {/* WhatsApp Active Setting Banner */}
      <div className="bg-gradient-to-r from-brun-nuit to-brun-nuit-light text-creme-light p-6 rounded-3xl shadow-luxury border border-cuivre/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#25D366]/20 text-[#25D366]">
            <MessageCircle className="w-7 h-7 fill-[#25D366]/20" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-or">
              Réception des commandes 100% WhatsApp
            </span>
            <h3 className="font-serif text-xl font-bold text-white">
              {settings.whatsappDisplayNumber}
            </h3>
            <p className="text-xs text-sable/75">
              Toutes les commandes du panier arrivent sur ce numéro béninois.
            </p>
          </div>
        </div>

        <Link to="/admin/reglages">
          <Button variant="outline" size="sm" className="text-white border-white/30 hover:border-white">
            Modifier le numéro
          </Button>
        </Link>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-sable/60 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-brun-nuit">
              Catalogue Récent
            </h3>
            <p className="text-xs text-brun-nuit/60">
              Derniers soins et gammes créés ou modifiés.
            </p>
          </div>
          <Link
            to="/admin/produits"
            className="text-xs font-bold uppercase tracking-wider text-terracotta hover:underline"
          >
            Gérer tous les soins ({totalProducts}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sable/40 text-[11px] font-bold uppercase tracking-wider text-brun-nuit/60">
                <th className="pb-3">Soin</th>
                <th className="pb-3">Catégorie</th>
                <th className="pb-3">Prix</th>
                <th className="pb-3">Disponibilité</th>
                <th className="pb-3">Mis en avant</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sable/30">
              {recentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-creme/30 transition-colors">
                  <td className="py-3 flex items-center gap-3">
                    <img
                      src={getProductImage(p, 0)}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover border border-sable"
                    />
                    <div>
                      <p className="font-bold text-brun-nuit">{p.name}</p>
                      <p className="text-[10px] text-brun-nuit/50">{p.slug}</p>
                    </div>
                  </td>
                  <td className="py-3 capitalize text-brun-nuit/80">{p.category}</td>
                  <td className="py-3 font-serif font-bold text-terracotta">
                    {formatFCFA(p.price)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.inStock
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.inStock ? 'En stock' : 'Rupture'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.isFeatured
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p.isFeatured ? '★ Vedette' : 'Normal'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to={`/admin/produits/${p.id}`}
                      className="text-xs font-semibold text-terracotta hover:underline"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

