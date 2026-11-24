import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { Marquee } from '@/components/common/Marquee';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { RangesSection } from '@/components/home/RangesSection';
import { AccessoriesSection } from '@/components/home/AccessoriesSection';
import { RoutineSection } from '@/components/home/RoutineSection';
import { WhyDelaafroSection } from '@/components/home/WhyDelaafroSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CareInActionSection } from '@/components/home/CareInActionSection';
import { FinalCTASection } from '@/components/home/FinalCTASection';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Marquee banner */}
      <Marquee />

      {/* 3. Featured Products Slider/Grid */}
      <FeaturedCarousel />

      {/* 4. Immersive Gammes (Essentielle, Hydratation, Complète) */}
      <RangesSection />

      {/* 5. Accessories with color selector */}
      <AccessoriesSection />

      {/* 6. Routine Timeline 4 steps (Nettoyer, Hydrater, Nourrir, Protéger) */}
      <RoutineSection />

      {/* 7. Nos soins en action (Lifestyle & Photoshoot Gallery) */}
      <CareInActionSection />

      {/* 8. Why DELAAFRO Arguments */}
      <WhyDelaafroSection />

      {/* 9. Testimonials */}
      <TestimonialsSection />

      {/* 11. Final CTA with huge WhatsApp button */}
      <FinalCTASection />
    </div>
  );
};

