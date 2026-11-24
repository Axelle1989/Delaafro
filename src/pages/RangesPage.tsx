import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, MessageCircle, Check, X as XIcon, ArrowRight, Eye } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCartStore } from '@/store/useCartStore';
import { formatFCFA } from '@/lib/formatters';
import { buildWhatsAppDirectProductUrl } from '@/lib/whatsapp';
import { getProductImage } from '@/lib/productImage';
import { Badge } from '@/components/common/Badge';
import { LivingPosterBanner } from '@/components/ranges/LivingPosterBanner';
import { SectionHeader } from '@/components/common/SectionHeader';

export const RangesPage: React.FC = () => {
  const { products, settings } = useSettingsStore();
  const { addItem } = useCartStore();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const gammes = products
    .filter((p) => p.category === 'gamme' && p.isPublished)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleWhatsApp = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    const url = buildWhatsAppDirectProductUrl(
      product.name,
      product.price,
      undefined,
      settings.whatsappNumber
    );
    window.open(url, '_blank');
  };

  // Products matrix for comparison
  const comparisonProducts = [
    { key: 'shampoing', label: 'Shampoing Doux', desc: 'Nettoie · Hydrate · Respecte le cuir chevelu' },
    { key: 'serum', label: 'Sérum Capillaire', desc: 'Forte porosité · Stimule la pousse' },
    { key: 'spray', label: 'Spray Hydratant', desc: 'Hydrate · Assouplit · Rafraîchit' },
    { key: 'baume', label: 'Baume Nourrissant', desc: 'Hydrate · Répare · Protège' },
    { key: 'leavein', label: 'Leave-in Démêlant', desc: 'Démêle · Hydrate · Protège de la casse' },
  ];

  const includesProduct = (gammeSlug: string, key: string) => {
    switch (gammeSlug) {
      case 'gamme-essentielle':
        return ['shampoing', 'serum', 'baume'].includes(key);
      case 'gamme-lockses':
        return ['shampoing', 'serum', 'spray'].includes(key);
      case 'gamme-hydratation':
        return ['shampoing', 'serum', 'spray', 'baume'].includes(key);
      case 'gamme-complete':
        return ['shampoing', 'serum', 'spray', 'baume', 'leavein'].includes(key);
      default:
        return false;
    }
  };

  return (
    <div className="py-12 bg-creme min-h-screen">
      <div className="site-container space-y-12 sm:space-y-16">
        {/* Header */}
        <SectionHeader
          level="h1"
          eyebrow="Rituels Complets & Synergie Botanique"
          title="Nos 4 Gammes d'Exception"
          subtitle="Conçues pour répondre avec précision à la physiologie des cheveux crépus et locksés."
        />

        {/* Living Poster Banner */}
        <LivingPosterBanner />

        {/* Section 1 : Les 3 Rituels pour Cheveux Crépus Naturels */}
        <div id="gammes" className="space-y-8 sm:space-y-12 scroll-mt-24">
          <SectionHeader
            eyebrow="Cheveux Crépus & Frisés (Types 3C à 4C)"
            title="Nos Rituels pour Cheveux Crépus"
            subtitle="Trois synergies globales formulées avec notre Baume signature pour sublimer vos boucles naturelles."
          />

          <div className="space-y-12 sm:space-y-16">
            {gammes
              .filter((g) => g.id !== 'gamme-lockses')
              .map((gamme, idx) => {
                const isReversed = idx % 2 === 1;
                const isAdded = !!addedIds[gamme.id];
                const badgeVariant =
                  gamme.badge === 'Nouveau'
                    ? 'feuille'
                    : gamme.badge === 'Coup de Cœur'
                    ? 'gold'
                    : 'terracotta';

                return (
                  <motion.div
                    key={gamme.id}
                    id={gamme.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="rounded-3xl bg-white p-6 sm:p-10 shadow-luxury border border-sable/60 hover:shadow-luxury-hover transition-all duration-300 scroll-mt-24"
                  >
                    <div
                      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                        isReversed ? 'lg:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Image Column */}
                      <div
                        className={`lg:col-span-5 relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-creme-dark/30 shadow-md ${
                          isReversed ? 'lg:order-2' : 'lg:order-1'
                        }`}
                      >
                        <Link to={`/produit/${gamme.slug}`} className="block h-full w-full">
                          <img
                            src={getProductImage(gamme, 0)}
                            alt={gamme.name}
                            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                          />
                        </Link>
                        {gamme.images && gamme.images.length > 1 && (
                          <div className="absolute bottom-3 right-3 bg-brun-nuit/85 text-creme-light text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border border-or/40 pointer-events-none">
                            +{gamme.images.length - 1} photos
                          </div>
                        )}
                        {gamme.badge && (
                          <div className="absolute top-4 left-4 z-10">
                            <Badge variant={badgeVariant}>
                              {gamme.badge}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Info Column */}
                      <div
                        className={`lg:col-span-7 space-y-5 ${
                          isReversed ? 'lg:order-1' : 'lg:order-2'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cuivre">
                            {gamme.categoryLabel || 'Rituel Capillaire'}
                          </span>
                          <Link to={`/produit/${gamme.slug}`}>
                            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brun-nuit hover:text-terracotta transition-colors mt-1">
                              {gamme.name}
                            </h3>
                          </Link>
                          {gamme.subtitle && (
                            <p className="font-serif italic text-sm text-terracotta mt-1">
                              {gamme.subtitle}
                            </p>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-brun-nuit/80 leading-relaxed">
                          {gamme.longDescription || gamme.shortDescription}
                        </p>

                        {/* Included Products List */}
                        {gamme.composition && gamme.composition.length > 0 && (
                          <div className="p-4 rounded-2xl bg-creme-light/70 border border-sable/50">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-brun-nuit mb-2.5">
                              Soins inclus dans ce rituel :
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brun-nuit/80">
                              {gamme.composition.map((comp, cIdx) => (
                                <li key={cIdx} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
                                  <span className="line-clamp-1">{comp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Benefits Preview */}
                        {gamme.benefits && gamme.benefits.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            {gamme.benefits.slice(0, 3).map((benefit, bIdx) => (
                              <div key={bIdx} className="flex items-start gap-2 text-xs text-brun-nuit/75">
                                <Check className="w-3.5 h-3.5 text-feuille shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Price & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-sable/40">
                          <div className="flex items-baseline gap-3">
                            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-terracotta">
                              {formatFCFA(gamme.price)}
                            </span>
                            {gamme.originalPrice && gamme.originalPrice > gamme.price && (
                              <span className="text-sm text-brun-nuit/40 line-through">
                                {formatFCFA(gamme.originalPrice)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                            <button
                              onClick={(e) => handleAddToCart(gamme, e)}
                              className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                isAdded
                                  ? 'bg-feuille text-white'
                                  : 'bg-terracotta text-white hover:bg-terracotta-deep shadow-sm hover:shadow-terracotta-glow'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Ajouté</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-4 h-4" />
                                  <span>Ajouter au Panier</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={(e) => handleWhatsApp(gamme, e)}
                              title="Commander sur WhatsApp"
                              className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white transition-colors border border-[#25D366]/30 text-xs font-bold uppercase tracking-wider"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </button>

                            <Link
                              to={`/produit/${gamme.slug}`}
                              className="p-3 rounded-full text-brun-nuit hover:text-terracotta hover:bg-creme transition-colors border border-sable/40"
                              title="Voir la fiche détaillée"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>

        {/* =========================================================================
            Section 2 : ESPACE DÉDIÉ — RITUEL CHEVEUX LOCKSÉS
        ========================================================================= */}
        {gammes.find((g) => g.id === 'gamme-lockses') && (() => {
          const lockses = gammes.find((g) => g.id === 'gamme-lockses')!;
          const isAdded = !!addedIds[lockses.id];

          return (
            <motion.div
              id="espace-lockses"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl bg-gradient-to-br from-brun-nuit via-[#33180C] to-brun-nuit text-creme-light p-6 sm:p-10 lg:p-12 shadow-2xl border-2 border-or/50 relative overflow-hidden space-y-8 scroll-mt-24"
            >
              {/* Luxury ambient light */}
              <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-or/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-terracotta/15 blur-3xl pointer-events-none" />

              {/* Header Espace Locksés */}
              <SectionHeader
                eyebrow="Espace Dédié • Cheveux Locksés & Microlocks"
                title="L'Espace Rituel Locksés"
                subtitle="Formulations légères sans résidu pour purifier et hydrater les locks en toute fluidité."
                tone="dark"
                align="center"
              />

              {/* Showcase Container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Photo Column : uniquement la photo officielle Locksés */}
                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-or/60 shadow-2xl bg-brun-nuit/60 group">
                    <Link to={`/produit/${lockses.slug}`} className="block h-full w-full">
                      <img
                        src={getProductImage(lockses, 0)}
                        alt="Gamme Locksés DELAAFRO (Shampoing, Sérum, Spray)"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>
                    <div className="absolute top-3 left-3 bg-feuille text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      🌿 Spécial Locksés • Zéro Résidu
                    </div>
                    <div className="absolute bottom-3 right-3 bg-brun-nuit/90 text-or text-[10px] font-semibold px-3 py-1 rounded-full backdrop-blur-sm border border-or/40">
                      Photo officielle Locksés
                    </div>
                  </div>
                </div>

                {/* Details Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-or block">
                      Rituel Spécifique Locks & Microlocks
                    </span>
                    <Link to={`/produit/${lockses.slug}`}>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white hover:text-or transition-colors mt-1">
                        {lockses.name}
                      </h3>
                    </Link>
                    <p className="font-serif italic text-sm text-or/90 mt-1">
                      {lockses.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-sable/90 leading-relaxed">
                    {lockses.longDescription}
                  </p>

                  {/* Why a separate range */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-or/25 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-or">
                      Pourquoi une gamme à part pour les locks ?
                    </h4>
                    <p className="text-xs text-sable/85 leading-relaxed">
                      Contrairement aux cheveux crépus libres qui ont besoin de beurres pour sceller, les locks emprisonnent les corps gras lourds, créant des dépôts blanchâtres au cœur de la fibre. La Gamme Locksés remplace le baume par le <strong>Spray Hydratant</strong> léger et le <strong>Sérum Capillaire</strong> stimulant pour un résultat impeccable, propre et vibrant de santé.
                    </p>
                  </div>

                  {/* Composition */}
                  <div className="p-4 rounded-2xl bg-brun-nuit/70 border border-or/25 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-or">
                      Les 3 soins inclus :
                    </h4>
                    <ul className="space-y-1.5 text-xs text-sable/90">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-or shrink-0" />
                        <span><strong>Shampoing Doux</strong> : Nettoie · Hydrate · Respecte le cuir chevelu</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-or shrink-0" />
                        <span><strong>Sérum Capillaire</strong> : Forte porosité · Stimule la pousse des départs de locks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-or shrink-0" />
                        <span><strong>Spray Hydratant</strong> : Hydrate au quotidien · Assouplit · Rafraîchit</span>
                      </li>
                    </ul>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-or/25">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-3xl font-extrabold text-or">
                        {formatFCFA(lockses.price)}
                      </span>
                      <span className="text-xs text-sable/70 uppercase">
                        Coffret 3 soins
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={(e) => handleAddToCart(lockses, e)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                          isAdded
                            ? 'bg-feuille text-white'
                            : 'bg-or text-brun-nuit hover:bg-or-light font-bold shadow-gold-glow'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Ajouté</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Ajouter au Panier</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => handleWhatsApp(lockses, e)}
                        title="Commander sur WhatsApp"
                        className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors text-xs font-bold uppercase tracking-wider shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4 fill-white/20" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>

                      <Link
                        to={`/produit/${lockses.slug}`}
                        className="p-3 rounded-full text-sable hover:text-white hover:bg-white/10 transition-colors border border-or/40"
                        title="Voir la fiche détaillée"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-white p-6 sm:p-10 shadow-luxury border border-sable/60 space-y-8"
        >
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="eyebrow">
              <span>Guide d'Achat</span>
            </div>
            <h3 className="section-title">
              Tableau Comparatif des 4 Rituels
            </h3>
            <div className="gold-underline-center" />
            <p className="section-lead mx-auto">
              Visualisez en un coup d'œil les soins formulés pour chaque rituel et choisissez la synergie adaptée à vos besoins.
            </p>
          </div>

          {/* Internal scrollable table wrapper */}
          <div className="overflow-x-auto pb-4 -mx-2 sm:mx-0">
            <table className="w-full min-w-[720px] text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-sable">
                  <th className="py-4 px-4 font-serif font-bold text-sm text-brun-nuit w-1/4">
                    Soins Inclus
                  </th>
                  {gammes.map((g) => (
                    <th key={g.id} className="py-4 px-4 text-center font-serif font-bold text-sm text-brun-nuit">
                      <span className="block text-terracotta">{g.name.replace(' DELAAFRO', '')}</span>
                      <span className="block text-xs font-normal text-brun-nuit/60 mt-0.5">{g.categoryLabel}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sable/40 text-xs">
                {comparisonProducts.map((p) => (
                  <tr key={p.key} className="hover:bg-creme/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-brun-nuit">
                      <span className="block font-semibold">{p.label}</span>
                      <span className="block text-[11px] text-brun-nuit/60 font-normal">{p.desc}</span>
                    </td>
                    {gammes.map((g) => {
                      const included = includesProduct(g.slug, p.key);
                      return (
                        <td key={g.id} className="py-3.5 px-4 text-center">
                          {included ? (
                            <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-feuille/15 text-feuille">
                              <Check className="w-4 h-4 font-bold" />
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sable/30 text-brun-nuit/30">
                              <span className="text-sm font-semibold">—</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Price Row */}
                <tr className="bg-creme-light/60 font-bold border-t-2 border-sable">
                  <td className="py-4 px-4 font-serif text-sm text-brun-nuit">
                    Prix de la Gamme
                  </td>
                  {gammes.map((g) => (
                    <td key={g.id} className="py-4 px-4 text-center">
                      <span className="font-serif text-lg text-terracotta font-extrabold block">
                        {formatFCFA(g.price)}
                      </span>
                      {g.originalPrice && g.originalPrice > g.price && (
                        <span className="text-[11px] line-through text-brun-nuit/40 block">
                          {formatFCFA(g.originalPrice)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Actions Row */}
                <tr>
                  <td className="py-4 px-4 font-serif text-xs text-brun-nuit/70">
                    Commander
                  </td>
                  {gammes.map((g) => {
                    const isAdded = !!addedIds[g.id];
                    return (
                      <td key={g.id} className="py-4 px-3 text-center">
                        <div className="flex flex-col gap-2 items-center justify-center">
                          <button
                            onClick={(e) => handleAddToCart(g, e)}
                            className={`w-full max-w-[150px] py-2 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 ${
                              isAdded
                                ? 'bg-feuille text-white'
                                : 'bg-terracotta text-white hover:bg-terracotta-deep shadow-sm'
                            }`}
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>{isAdded ? 'Ajouté' : 'Panier'}</span>
                          </button>

                          <button
                            onClick={(e) => handleWhatsApp(g, e)}
                            className="w-full max-w-[150px] py-2 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white transition-colors border border-[#25D366]/30 flex items-center justify-center gap-1.5"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
