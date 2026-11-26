import React, { useEffect, useMemo, useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useI18n } from '@/context/I18nContext';
import { HeroAvis } from '@/components/testimonials/HeroAvis';
import { VideoCarousel } from '@/components/testimonials/VideoCarousel';
import { FeaturedQuote } from '@/components/testimonials/FeaturedQuote';
import { PhotoGallery } from '@/components/testimonials/PhotoGallery';
import { FinalCTA } from '@/components/testimonials/FinalCTA';
import { TestimonialDetailModal } from '@/components/testimonials/TestimonialDetailModal';
import { VideoTestimonialModal } from '@/components/testimonials/VideoTestimonialModal';
import { ReviewModal } from '@/components/testimonials/ReviewModal';
import { DEFAULT_VIDEO_TESTIMONIALS } from '@/lib/demoData';
import { Testimonial } from '@/types';

export const TestimonialsPage: React.FC = () => {
  const { testimonials } = useSettingsStore();
  const { t, language } = useI18n();

  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Met à jour <title> à chaque changement de langue sans recharger la page
  useEffect(() => {
    document.title = t('common.pageTitleReviews');
    return () => {
      document.title = t('common.pageTitleDefault');
    };
  }, [language, t]);

  // 1. Filtrer les vidéos approuvées et visibles
  const activeVideos: Testimonial[] = useMemo(() => {
    const realVideos = testimonials.filter(
      (item) =>
        Boolean(item.videoUrl) &&
        item.isVisible &&
        item.status !== 'pending' &&
        item.status !== 'hidden'
    );
    return realVideos.length > 0 ? realVideos : DEFAULT_VIDEO_TESTIMONIALS;
  }, [testimonials]);

  // 2. Filtrer les témoignages photos approuvés et visibles
  const photoTestimonials: Testimonial[] = useMemo(
    () =>
      testimonials.filter(
        (item) =>
          !item.videoUrl &&
          item.isVisible &&
          !item.isDemo &&
          item.status !== 'pending' &&
          item.status !== 'hidden'
      ),
    [testimonials]
  );

  // 3. Sélectionner une citation mise en avant
  const featuredTestimonial = useMemo(() => {
    const candidates = photoTestimonials.length > 0 ? photoTestimonials : activeVideos;
    return (
      candidates.find((item) => item.rating === 5 && (item.content || '').length >= 80) ||
      candidates[0]
    );
  }, [photoTestimonials, activeVideos]);

  const totalReviewsCount = photoTestimonials.length + activeVideos.length;

  const handleSelectPhotoTestimonial = (selected: Testimonial) => {
    const idx = photoTestimonials.findIndex((item) => item.id === selected.id);
    setActivePhotoIndex(idx !== -1 ? idx : 0);
  };

  return (
    <div
      className="min-h-screen bg-[var(--bg)] text-[var(--text)] theme-surface"
      style={{ fontFamily: 'var(--font-editorial-sans)' }}
    >
      {/* 1. HERO ÉDITORIAL */}
      <HeroAvis
        totalReviewsCount={totalReviewsCount}
        collageTestimonials={photoTestimonials}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
      />

      {/* 2. TÉMOIGNAGES VIDÉO (Carrousel 9:16 scroll-snap) */}
      <VideoCarousel
        videos={activeVideos}
        onOpenVideo={(idx) => setActiveVideoIndex(idx)}
      />

      {/* 3. CITATION MISE EN AVANT (Bande pleine largeur fond surface) */}
      <FeaturedQuote testimonial={featuredTestimonial} />

      {/* 4. RÉSULTATS EN PHOTOS (Filtres pastilles + Grille masonry épurée) */}
      <PhotoGallery
        testimonials={photoTestimonials}
        onSelectTestimonial={handleSelectPhotoTestimonial}
      />

      {/* 5. CTA FINAL (Dégradé chaud + motif géométrique + transition douce vers footer) */}
      <FinalCTA onOpenReviewModal={() => setIsReviewModalOpen(true)} />

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
