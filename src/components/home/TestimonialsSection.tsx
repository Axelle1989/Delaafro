import React, { useState } from 'react';
import { MessageSquarePlus, Camera, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/store/useSettingsStore';
import { TestimonialCardFrame } from '@/components/testimonials/TestimonialCardFrame';
import { TestimonialDetailModal } from '@/components/testimonials/TestimonialDetailModal';
import { VideoVerticalRow } from '@/components/testimonials/VideoVerticalRow';
import { VideoTestimonialModal } from '@/components/testimonials/VideoTestimonialModal';
import { ReviewModal } from '@/components/testimonials/ReviewModal';
import { DEFAULT_VIDEO_TESTIMONIALS } from '@/lib/demoData';
import { Testimonial } from '@/types';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useSettingsStore();
  const [activePhotoModalIndex, setActivePhotoModalIndex] = useState<number | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Vidéos approuvées et visibles
  const realVideos = testimonials.filter(
    (t) => Boolean(t.videoUrl) && t.isVisible && t.status !== 'pending' && t.status !== 'hidden'
  );
  const activeVideos: Testimonial[] =
    realVideos.length > 0
      ? realVideos
      : DEFAULT_VIDEO_TESTIMONIALS;

  // Témoignages photos approuvés et visibles
  const approvedPhotoTestimonials = testimonials.filter(
    (t) =>
      !t.videoUrl &&
      t.isVisible &&
      !t.isDemo &&
      t.status !== 'pending' &&
      t.status !== 'hidden'
  );

  return (
    <section className="py-16 lg:py-24 bg-[#FAF3EA] border-t border-[#2B1A12]/10 relative overflow-hidden">
      <div className="site-container relative z-10 space-y-14 lg:space-y-20">
        {/* 1. EN-TÊTE ÉDITORIAL HAUT DE GAMME */}
        <div className="w-full flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-[#2B1A12]/10 pb-8">
          <div className="space-y-3 max-w-3xl">
            {/* Surtitre fin */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B4A2B]">
              <span className="w-6 h-[1.5px] bg-[#C9A66B]" aria-hidden="true" />
              <span>Retours d’expérience en images</span>
            </div>

            {/* Titre Playfair Display épuré */}
            <h2 className="font-serif font-normal text-3xl sm:text-4xl lg:text-5xl text-[#2B1A12] tracking-tight leading-tight">
              Elles ont sublimé leur Afro
            </h2>

            {/* Sous-titre léger */}
            <p className="text-sm sm:text-base text-[#2B1A12]/70 leading-relaxed font-sans max-w-2xl">
              Les retours authentiques de nos clientes au Bénin et dans le monde, en vidéo et en photos.
            </p>
          </div>

          {/* Actions : "Donner mon avis" (outline fin) + "Tous les avis" */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-[0.14em] border border-[#8B4A2B] text-[#8B4A2B] hover:bg-[#8B4A2B] hover:text-[#FAF3EA] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B4A2B]/20"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Donner mon avis</span>
            </button>

            <Link
              to="/elles-ont-sublime-leur-afro"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2B1A12]/75 hover:text-[#8B4A2B] transition-colors duration-200"
            >
              <span>Tous les avis</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* 2. RANGÉE DE VIDÉOS VERTICALES (STYLE REELS / TIKTOK) */}
        {activeVideos.length > 0 && (
          <VideoVerticalRow
            videos={activeVideos}
            onOpenVideo={(idx) => setActiveVideoIndex(idx)}
            showHeader={true}
            showAllTestimonialsButton={false}
          />
        )}

        {/* 3. SÉLECTION DE 3 AVIS PHOTOS */}
        <div className="max-w-6xl mx-auto space-y-8 pt-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8B4A2B]">
              <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Leurs transformations en photos</span>
            </div>
            <h3 className="font-serif font-normal text-2xl sm:text-3xl text-[#2B1A12] tracking-tight">
              Résultats visibles au fil des semaines
            </h3>
          </div>

          {approvedPhotoTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedPhotoTestimonials.slice(0, 3).map((item, idx) => (
                <TestimonialCardFrame
                  key={item.id}
                  testimonial={item}
                  index={idx}
                  lineClamp={3}
                  onClick={() => setActivePhotoModalIndex(idx)}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto rounded-[20px] bg-white p-8 text-center shadow-xs border border-[#2B1A12]/10 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF3EA] text-[#8B4A2B] mx-auto flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#C9A66B]" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2B1A12]">
                Partagez votre transformation
              </h3>
              <p className="text-xs sm:text-sm text-[#2B1A12]/75 leading-relaxed font-sans">
                Vous utilisez les soins DELAAFRO ? Votre expérience inspire notre communauté.
              </p>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] bg-[#8B4A2B] hover:bg-[#723C22] text-[#FAF3EA] transition-all duration-200"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Laisser mon avis</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal if opened */}
      <VideoTestimonialModal
        isOpen={activeVideoIndex !== null}
        onClose={() => setActiveVideoIndex(null)}
        videos={activeVideos}
        currentIndex={activeVideoIndex ?? 0}
        onSelectIndex={(newIdx) => setActiveVideoIndex(newIdx)}
      />

      {/* Interactive Detail Lightbox/Modal for Photo */}
      <TestimonialDetailModal
        isOpen={activePhotoModalIndex !== null}
        onClose={() => setActivePhotoModalIndex(null)}
        testimonials={approvedPhotoTestimonials}
        currentIndex={activePhotoModalIndex ?? 0}
        onSelectIndex={(newIdx) => setActivePhotoModalIndex(newIdx)}
      />

      {/* Review Submission Form Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </section>
  );
};
