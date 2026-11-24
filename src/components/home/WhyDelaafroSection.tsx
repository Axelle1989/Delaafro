import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Leaf, Award, Sparkles, Truck, LucideIcon } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';

interface ReasonItem {
  id: string;
  icon: LucideIcon;
  shortTitle: string;
  description: string;
}

export const WhyDelaafroSection: React.FC = () => {
  const { settings } = useSettingsStore();
  const shouldReduceMotion = useReducedMotion();

  const reasons: ReasonItem[] = [
    {
      id: 'naturel',
      icon: Leaf,
      shortTitle: '100% Naturel & Béninois',
      description:
        'Karité brut du nord du Bénin et huiles précieuses pressées à froid, sans silicone ni compromis toxique.',
    },
    {
      id: 'texture',
      icon: Award,
      shortTitle: 'Expertise Crépus & Locks',
      description:
        'Formulé pour respecter la cuticule afro et préserver une hydratation durable face à l’humidité.',
    },
    {
      id: 'resultats',
      icon: Sparkles,
      shortTitle: 'Efficacité dès 2 Semaines',
      description:
        'Diminution nette de la casse au coiffage, brillance satinée retrouvée et pointes durablement scellées.',
    },
    {
      id: 'livraison',
      icon: Truck,
      shortTitle: 'Expédition Mondiale',
      description:
        settings?.deliveryNotice ||
        'Livraison soignée au Bénin et partout dans le monde. Délais et suivi confirmés sur WhatsApp.',
    },
  ];

  return (
    <section
      id="pourquoi-choisir-delaafro"
      className="bg-[#2B1A12] border-y border-[#FAF3EA]/10 py-16 md:py-20 relative overflow-hidden"
    >
      <div className="site-container">
        {/* En-tête sobre et raffiné */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16 space-y-2.5">
          <div className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C9A66B]">
            <span className="w-6 h-[1px] bg-[#C9A66B]/40" aria-hidden="true" />
            <span>Nos Engagements</span>
            <span className="w-6 h-[1px] bg-[#C9A66B]/40" aria-hidden="true" />
          </div>
          <h2 className="font-serif font-normal text-2xl sm:text-3xl lg:text-4xl text-[#FAF3EA] tracking-wide">
            Pourquoi Choisir DELAAFRO ?
          </h2>
        </div>

        {/* Grille de 4 colonnes alignées avec séparateurs discrets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{
                  duration: 0.45,
                  delay: shouldReduceMotion ? 0 : index * 0.08,
                  ease: 'easeOut',
                }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 lg:px-8 first:lg:pl-0 last:lg:pr-0 lg:border-r border-[#FAF3EA]/10 last:border-r-0"
              >
                {/* Petite icône fine dorée (stroke 1.5) */}
                <div className="w-10 h-10 rounded-full bg-[#FAF3EA]/5 border border-[#FAF3EA]/10 flex items-center justify-center shrink-0 text-[#C9A66B]">
                  <Icon className="w-5 h-5 text-[#C9A66B]" strokeWidth={1.5} />
                </div>

                {/* Titre court en capitales espacées */}
                <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#FAF3EA]">
                  {item.shortTitle}
                </h3>

                {/* Texte descriptif en 2-3 lignes max */}
                <p className="text-xs md:text-sm text-[#FAF3EA]/70 leading-relaxed font-sans max-w-xs">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
