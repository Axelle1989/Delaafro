import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Shield, Wind, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '@/components/common/SectionHeader';

interface RoutineStep {
  number: string;
  title: string;
  action: string;
  icon: React.ReactNode;
  description: string;
  productName: string;
  productSlug: string;
  tip: string;
}

export const RoutineSection: React.FC = () => {
  const steps: RoutineStep[] = [
    {
      number: '01',
      title: 'Nettoyer',
      action: 'Purifier sans décaper',
      icon: <Wind className="w-6 h-6 text-terracotta" />,
      description:
        'Éliminez impuretés et excès de sébum sans agresser le film lipidique de vos boucles grâce à notre formule douce sans sulfates.',
      productName: 'Shampoing Doux au Karité',
      productSlug: 'shampoing-doux',
      tip: 'Massez uniquement le cuir chevelu en mouvements circulaires.',
    },
    {
      number: '02',
      title: 'Hydrater',
      action: 'Désaltérer au cœur de la fibre',
      icon: <Droplets className="w-6 h-6 text-cuivre" />,
      description:
        'L’eau est le premier aliment du cheveu crépu. Infusez vos mèches de notre brume enrichie en aloe vera frais et fleurs d’hibiscus.',
      productName: 'Spray Hydratant Tonique',
      productSlug: 'spray-hydratant',
      tip: 'Vaporisez sur cheveux tièdes pour ouvrir les écailles.',
    },
    {
      number: '03',
      title: 'Nourrir',
      action: 'Gainer & assouplir',
      icon: <Sparkles className="w-6 h-6 text-or" />,
      description:
        'Apportez les lipides essentiels avec notre baume riche en karité brut du Bénin et huile de ricin pressée à froid.',
      productName: 'Baume Nourrissant Intense',
      productSlug: 'baume-nourrissant',
      tip: 'Chauffez une noisette entre vos paumes avant étirement.',
    },
    {
      number: '04',
      title: 'Protéger',
      action: 'Sceller l’hydratation & dormir en satin',
      icon: <Shield className="w-6 h-6 text-feuille" />,
      description:
        'Quelques gouttes d’élixir aux 7 huiles pour sceller les pointes, puis glissez votre chevelure dans notre bonnet en satin protecteur.',
      productName: 'Sérum Capillaire & Satin',
      productSlug: 'serum-capillaire',
      tip: 'Indispensable le soir pour empêcher le coton de boire vos soins.',
    },
  ];

  return (
    <section id="routine" className="py-14 lg:py-20 bg-gradient-to-b from-brun-nuit via-brun-nuit-light to-brun-nuit text-creme-light relative overflow-hidden">
      {/* Decorative Ornaments */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-or/10 rounded-full blur-3xl pointer-events-none" />

      <div className="site-container relative z-10">
        {/* Header */}
        <SectionHeader
          eyebrow="Protocole Quotidien"
          title="Le Rituel DELAAFRO en 4 Temps"
          subtitle="Une routine simple pour des cheveux souples, longs et vigoureux."
          tone="dark"
          action={{
            label: 'Découvrir la routine',
            to: '/ma-routine',
          }}
        />

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative flex flex-col justify-between rounded-3xl bg-brun-nuit/80 border border-cuivre/25 p-6 hover:border-or/60 transition-all duration-300 hover:shadow-gold-glow group"
            >
              <div>
                {/* Step Counter & Icon */}
                <div className="flex items-center justify-between pb-6 border-b border-cuivre/15">
                  <span className="font-serif text-3xl font-bold text-gradient-gold">
                    {step.number}
                  </span>
                  <div className="p-3 rounded-2xl bg-sable/10 group-hover:bg-or/20 transition-colors">
                    {step.icon}
                  </div>
                </div>

                {/* Step Title & Action */}
                <div className="pt-6 space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-or block">
                    {step.action}
                  </span>
                  <h3 className="card-title text-white">
                    {step.title}
                  </h3>
                  <p className="card-text text-sm sm:text-base text-sable/85 leading-relaxed pt-2">
                    {step.description}
                  </p>
                </div>

                {/* Practical Advice Note */}
                <div className="mt-5 p-3 rounded-xl bg-sable/5 border border-cuivre/10 text-xs sm:text-sm text-or/90 italic">
                  💡 {step.tip}
                </div>
              </div>

              {/* Link to matching product */}
              <div className="mt-8 pt-4 border-t border-cuivre/15">
                <Link
                  to={`/produit/${step.productSlug}`}
                  className="inline-flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-sable group-hover:text-or transition-colors"
                >
                  <span>{step.productName}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

