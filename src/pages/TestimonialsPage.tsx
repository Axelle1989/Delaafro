import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Star,
  MessageSquarePlus,
  ShieldCheck,
  Video,
  Camera,
} from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { TestimonialCardFrame } from '@/components/testimonials/TestimonialCardFrame';
import { TestimonialDetailModal } from '@/components/testimonials/TestimonialDetailModal';
import { VideoVerticalRow } from '@/components/testimonials/VideoVerticalRow';
import { VideoTestimonialModal } from '@/components/testimonials/VideoTestimonialModal';
import { ReviewModal } from '@/components/testimonials/ReviewModal';
import { Button } from '@/components/common/Button';
import { DEFAULT_VIDEO_TESTIMONIALS } from '@/lib/demoData';
import { Testimonial } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';

export const TestimonialsPage: React.FC = () => {
  const { testimonials } = useSettingsStore();

  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // 1. Filtrer les vidéos approuvées et visibles
  const realVideos = testimonials.filter(
    (t) => Boolean(t.videoUrl) && t.isVisible && t.status !== 'pending' && t.status !== 'hidden'
  );

  const activeVideos: Testimonial[] =
    realVideos.length > 0
      ? realVideos
      : DEFAULT_VIDEO_TESTIMONIALS;

  // 2. Filtrer les témoignages photos approuvés et visibles
  const photoTestimonials = testimonials.filter(
    (t) =>
      !t.videoUrl &&
      t.isVisible &&
      !t.isDemo &&
      t.status !== 'pending' &&
      t.status !== 'hidden'
  );

  return (
    <div className="min-h-screen bg-creme pt-8 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-10 sm:py-14 bg-gradient-to-b from-sable/30 via-creme to-creme border-b border-cuivre/20">
        <div className="site-container">
          <SectionHeader
            level="h1"
            eyebrow="Galerie de Témoignages Réels"
            title="Elles ont Sublimé leur Afro"
            subtitle="Les retours authentiques de nos clientes au Bénin."
            actionExtra={
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-deep text-white px-4 py-2 rounded-full font-semibold text-xs tracking-wider uppercase shadow-sm transition-all"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Donner mon avis</span>
              </button>
            }
          />

          {/* Trust stats pill */}
          <div className="pt-1 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-brun-nuit/75 font-medium">
            <div className="flex items-center gap-1.5 bg-white/80 px-3.5 py-1.5 rounded-full border border-sable shadow-sm">
              <div className="flex text-or">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-brun-nuit">4.9 / 5</span>
              <span>satisfaction</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/80 px-3.5 py-1.5 rounded-full border border-sable shadow-sm">
              <ShieldCheck className="w-4 h-4 text-feuille" />
              <span>100% Retours Réels Bénin 🇧🇯</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="site-container pt-12 sm:pt-16 space-y-16 sm:space-y-20">
        {/* =========================================================================
            SECTION 1 : TÉMOIGNAGES VIDÉO (Rangée TikTok / Reels)
            Affichée uniquement si des vidéos existent (ou en mode dev démo)
        ========================================================================= */}
        {activeVideos.length > 0 && (
          <VideoVerticalRow
            videos={activeVideos}
            onOpenVideo={(idx) => setActiveVideoIndex(idx)}
            showHeader={true}
            showAllTestimonialsButton={false}
          />
        )}

        {/* =========================================================================
            SECTION 2 : LEURS RÉSULTATS EN PHOTOS (Grille compacte 5 colonnes)
        ========================================================================= */}
        <section className="space-y-6">
          {/* Header section photos */}
          <div className="space-y-2">
            <div className="eyebrow flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-terracotta" />
              <span>Résultats Clientes</span>
            </div>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">
              Leurs Résultats en Photos
            </h2>
            <div className="gold-underline" />
            <p className="section-lead max-w-2xl text-sm sm:text-base">
              Chevelures crépues nourries, assouplies et fortifiées. Cliquez sur une photo pour lire le détail de son retour.
            </p>
          </div>

          {/* Compact Photo Grid : 2 cols (mobile) -> 3 (md) -> 4 (lg) -> 5 (xl) */}
          {photoTestimonials.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
              {photoTestimonials.map((item, idx) => (
                <TestimonialCardFrame
                  key={item.id}
                  testimonial={item}
                  index={idx}
                  onClick={() => {
                    const realIndex = photoTestimonials.findIndex((t) => t.id === item.id);
                    setActivePhotoIndex(realIndex !== -1 ? realIndex : 0);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl p-8 border border-sable shadow-luxury max-w-md mx-auto space-y-3">
              <Sparkles className="w-8 h-8 text-terracotta mx-auto" />
              <h3 className="card-title text-lg font-bold text-brun-nuit">
                Bientôt les premières photos
              </h3>
              <p className="card-text text-xs sm:text-sm text-brun-nuit/70">
                Soyez la première à partager votre couronne naturelle avec nos soins !
              </p>
            </div>
          )}
        </section>

        {/* Bottom Call to action card */}
        <div className="rounded-3xl bg-gradient-to-r from-brun-nuit via-brun-nuit-light to-brun-nuit p-8 sm:p-12 text-creme-light text-center border-2 border-or/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-or/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="eyebrow text-or">
              Communauté DELAAFRO
            </span>
            <h2 className="section-title text-creme-light text-2xl sm:text-3xl md:text-4xl">
              Vous aussi, sublimez votre chevelure crépue
            </h2>
            <p className="prose-body text-sable/90 leading-relaxed max-w-2xl mx-auto">
              Vos cheveux méritent la noblesse de soins 100% naturels formulés avec le meilleur karité brut du Bénin et des huiles botaniques pressées à froid.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="gold"
                size="md"
                as="a"
                href="/nos-gammes"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Découvrir nos Gammes
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => setIsReviewModalOpen(true)}
                className="border-or/60 text-creme-light hover:bg-white/10"
                leftIcon={<MessageSquarePlus className="w-4 h-4" />}
              >
                Partager mon expérience
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Fullscreen Player Modal */}
      <VideoTestimonialModal
        isOpen={activeVideoIndex !== null}
        onClose={() => setActiveVideoIndex(null)}
        videos={activeVideos}
        currentIndex={activeVideoIndex ?? 0}
        onSelectIndex={(newIdx) => setActiveVideoIndex(newIdx)}
      />

      {/* Photo Detail Modal */}
      <TestimonialDetailModal
        isOpen={activePhotoIndex !== null}
        onClose={() => setActivePhotoIndex(null)}
        testimonials={photoTestimonials}
        currentIndex={activePhotoIndex ?? 0}
        onSelectIndex={(newIdx) => setActivePhotoIndex(newIdx)}
      />

      {/* Submit Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
};
