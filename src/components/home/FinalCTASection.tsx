import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useSettingsStore } from '@/store/useSettingsStore';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';
import { SectionHeader } from '@/components/common/SectionHeader';

export const FinalCTASection: React.FC = () => {
  const { settings } = useSettingsStore();

  return (
    <section className="py-14 lg:py-20 relative overflow-hidden bg-gradient-terracotta text-white">
      {/* Decorative Golden Arches & Rings */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-2 border-or/20 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border-2 border-or/20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-or/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <SectionHeader
          eyebrow="Faites Rayonner Votre Beauté Naturelle"
          title="Prête à révéler la royauté de vos cheveux crépus et locksés ?"
          subtitle="Conseils bienveillants et commande personnalisée en direct sur WhatsApp."
          tone="dark"
          align="center"
        />

        {/* Reassuring Bullets */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-creme-light font-medium pt-2">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-or" />
            Réponse rapide sous 15 minutes
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-or" />
            Livraison partout, même hors du Bénin
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-or" />
            Paiement à la livraison au Bénin & convenu à l'international
          </span>
        </div>

        {/* Massive WhatsApp CTA Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="whatsapp"
            size="lg"
            as="a"
            href={buildWhatsAppInquiryUrl(undefined, settings.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<MessageCircle className="w-6 h-6 fill-white/20" />}
            className="w-full sm:w-auto text-base sm:text-lg px-8 py-4 shadow-2xl hover:scale-105 transition-transform"
          >
            Discuter sur WhatsApp ({settings.whatsappDisplayNumber})
          </Button>

          <Button
            variant="outline"
            size="lg"
            as="a"
            href="/boutique"
            className="w-full sm:w-auto text-white border-white/40 hover:bg-white/10 hover:border-white"
          >
            Parcourir le catalogue
          </Button>
        </div>
      </div>
    </section>
  );
};

