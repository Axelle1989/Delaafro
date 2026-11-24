import React, { useState } from 'react';
import { Sparkles, Leaf, Truck, MessageCircle, ChevronRight, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/store/useSettingsStore';
import { MobileHeroCarousel } from '../components/MobileHeroCarousel';
import { MobileProductCard } from '../components/MobileProductCard';
import { RangesSection } from '@/components/home/RangesSection';
import { WhyDelaafroSection } from '@/components/home/WhyDelaafroSection';
import { formatFCFA } from '@/lib/formatters';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';
import { getProductImage } from '@/lib/productImage';
import { SectionHeader } from '@/components/common/SectionHeader';

type CategoryFilter = 'all' | 'gamme' | 'soin' | 'accessoire' | 'lockses';

export const MobileHomePage: React.FC = () => {
  const { products, testimonials, settings } = useSettingsStore();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const publishedProducts = products.filter((p) => p.isPublished);

  // Filter products for the 2-col catalogue grid
  const filteredProducts = publishedProducts.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'lockses') {
      return p.slug === 'gamme-lockses' || ['shampoing-doux', 'spray-hydratant', 'serum-capillaire'].includes(p.slug);
    }
    return p.category === activeFilter;
  });

  // Gammes for the horizontal scroll section
  const allGammes = publishedProducts.filter((p) => p.category === 'gamme');
  const approvedTestimonials = testimonials.filter((t) => t.isVisible && (t.status === 'approved' || !t.status)).slice(0, 4);

  const whatsAppUrl = buildWhatsAppInquiryUrl(undefined, settings.whatsappNumber);

  return (
    <div className="space-y-6">
      {/* 1. Immersive Full-Width Mobile Hero */}
      <MobileHeroCarousel />

      {/* 2. Reassurance Compact Strip */}
      <div className="bg-[#FAF2E9] border-y border-sable/50 py-3 px-4">
        <div className="flex items-center justify-between text-[11px] font-semibold text-brun-nuit tracking-tight overflow-x-auto gap-3 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <Leaf className="w-3.5 h-3.5 text-feuille shrink-0" />
            <span>100% Naturel</span>
          </div>
          <span className="text-or/50">•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-terracotta shrink-0" />
            <span>Crépus & Locks</span>
          </div>
          <span className="text-or/50">•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <Truck className="w-3.5 h-3.5 text-cuivre shrink-0" />
            <span>Livraison Partout</span>
          </div>
        </div>
      </div>

      {/* 3. Nos Gammes pour Cheveux Crépus (Sélecteur + Vitrine) */}
      <RangesSection />

      {/* 4. Catalogue Section with Filter Chips & 2-Col Grid */}
      <section className="space-y-4 pt-2">
        <div className="px-4">
          <SectionHeader
            eyebrow="Boutique Mobile"
            title="Notre Catalogue"
            subtitle="Soins et accessoires formulés pour cheveux crépus et locksés."
            className="!mb-4"
          />
        </div>

        {/* Horizontal Scrollable Filter Chips */}
        <div className="flex gap-2 px-4 overflow-x-auto pb-1 scrollbar-none snap-x">
          {[
            { id: 'all', label: 'Tous les soins' },
            { id: 'gamme', label: 'Nos Gammes' },
            { id: 'soin', label: 'Soins Individuels' },
            { id: 'accessoire', label: 'Accessoires' },
            { id: 'lockses', label: 'Gamme Locksés' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id as CategoryFilter)}
              className={`snap-start shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all active:scale-95 border ${
                activeFilter === chip.id
                  ? 'bg-terracotta text-white border-terracotta shadow-xs'
                  : 'bg-white text-brun-nuit/75 border-sable/60 hover:bg-sable/20'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* 2-Column Product Grid */}
        <div className="grid grid-cols-2 gap-3 px-4">
          {filteredProducts.map((product) => (
            <MobileProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Avis & Résultats Réels (Carrousel compact de témoignages) */}
      {approvedTestimonials.length > 0 && (
        <section className="space-y-3 pt-4 bg-creme-light/40 py-5 border-y border-sable/40">
          <div className="px-4">
            <SectionHeader
              eyebrow="Résultats Vérifiés 🇧🇯"
              title="Elles ont Sublimé leur Afro"
              subtitle="Les retours authentiques de nos clientes au Bénin."
              action={{
                label: 'Galerie',
                to: '/elles-ont-sublime-leur-afro',
              }}
              className="!mb-4"
            />
          </div>

          <div className="flex gap-3 px-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-none">
            {approvedTestimonials.map((t) => (
              <div
                key={t.id}
                className="snap-start shrink-0 w-[260px] bg-white rounded-2xl border border-sable/50 p-3 shadow-xs space-y-2 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-brun-nuit/5">
                  <img
                    src={t.photoUrl || t.avatarUrl || '/products/lifestyle/gamme-complete-portrait-afro.jpg'}
                    alt="Avis cliente"
                    className="w-full h-full object-cover"
                  />
                  {t.hairType && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-brun-nuit/85 text-creme-light">
                      Type {t.hairType}
                    </span>
                  )}
                  <span className="absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-feuille text-white flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Testé</span>
                  </span>
                </div>

                <div>
                  <div className="flex text-or text-xs mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-brun-nuit/85 line-clamp-3 italic leading-relaxed">
                    « {t.content} »
                  </p>
                  <div className="mt-2 text-[10px] text-brun-nuit/60 flex items-center justify-between border-t border-sable/30 pt-1.5">
                    <span className="font-bold text-brun-nuit">Cliente Vérifiée</span>
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5bis. Pourquoi Choisir DELAAFRO ? */}
      <WhyDelaafroSection />

      {/* 6. Comment Commander en 3 étapes */}
      <section className="px-4 py-4 space-y-3">
        <SectionHeader
          eyebrow="Simplicité & Rapidité"
          title="Comment commander ?"
          subtitle="Choisissez vos soins et finalisez directement sur WhatsApp."
          align="center"
          className="!mb-3"
        />

        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div className="bg-white p-3 rounded-2xl border border-sable/40 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-full bg-terracotta/10 text-terracotta font-serif font-bold text-sm flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-bold text-xs text-brun-nuit">Choisissez</h3>
            <p className="text-[10px] text-brun-nuit/60 leading-tight">
              Sélectionnez vos soins ou gammes
            </p>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-sable/40 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-full bg-terracotta/10 text-terracotta font-serif font-bold text-sm flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-bold text-xs text-brun-nuit">Validez</h3>
            <p className="text-[10px] text-brun-nuit/60 leading-tight">
              Confirmez sur WhatsApp
            </p>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-sable/40 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-full bg-terracotta/10 text-terracotta font-serif font-bold text-sm flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-bold text-xs text-brun-nuit">Recevez</h3>
            <p className="text-[10px] text-brun-nuit/60 leading-tight">
              Livraison rapide chez vous
            </p>
          </div>
        </div>
      </section>

      {/* 7. WhatsApp Final Banner */}
      <section className="px-4 pb-4">
        <div className="bg-[#2B1A12] text-[#FAF3EA] rounded-3xl p-5 text-center space-y-3 shadow-md border border-[#FAF3EA]/10">
          <div className="w-10 h-10 rounded-full bg-[#2F6B4F]/20 text-[#2F6B4F] flex items-center justify-center mx-auto">
            <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-white">
              Besoin d'un conseil personnalisé ?
            </h3>
            <p className="text-xs text-[#FAF3EA]/75 mt-1 max-w-xs mx-auto">
              Nos conseillères expertes vous guident pour composer la routine parfaite.
            </p>
          </div>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-[#2F6B4F] hover:bg-[#255840] text-[#FAF3EA] font-semibold text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#FAF3EA]" strokeWidth={1.5} />
            <span>Discuter sur WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default MobileHomePage;
