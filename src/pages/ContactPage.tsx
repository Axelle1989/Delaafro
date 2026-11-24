import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  MapPin,
  Clock,
  Truck,
  Phone,
  ChevronDown,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useSettingsStore } from '@/store/useSettingsStore';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';
import { SectionHeader } from '@/components/common/SectionHeader';

export const ContactPage: React.FC = () => {
  const { settings } = useSettingsStore();

  const faqs = [
    {
      q: 'Comment passer une commande ?',
      a: 'Il vous suffit de sélectionner vos produits et de cliquer sur "Commander sur WhatsApp". Un message pré-rempli s’ouvre directement avec la liste de vos soins et votre total en FCFA. Notre équipe confirme immédiatement votre commande.',
    },
    {
      q: 'Quels sont les délais et zones de livraison ?',
      a: 'Livraison partout, même hors du Bénin. Frais et délais confirmés avec vous sur WhatsApp selon votre destination.',
    },
    {
      q: 'Comment s’effectue le paiement ?',
      a: 'Au Bénin, vous réglez en toute sérénité à la réception de votre colis (en espèces ou par Mobile Money / MTN MoMo / Moov Money). Pour toute livraison hors du Bénin, le mode de paiement sécurisé est convenu avec vous directement sur WhatsApp.',
    },
    {
      q: 'Mes cheveux sont très secs et cassants (type 4C), quelle gamme choisir ?',
      a: 'La Gamme Hydratation (15 000 FCFA) ou la Gamme Complète (18 000 FCFA) est idéale. L’alliance spray hydratant à l’aloe vera + baume au karité béninois permet de réhydrater et sceller la fibre sans casse.',
    },
    {
      q: 'Peut-on utiliser les produits sur des enfants ?',
      a: 'Absolument ! Nos soins sont formulés avec des ingrédients 100% naturels, sans sulfates, sans silicones et sans huiles minérales. Ils conviennent parfaitement aux cheveux fragiles des enfants dès 3 ans.',
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="py-12 bg-creme min-h-screen">
      <div className="site-container space-y-12">
        {/* Header */}
        <SectionHeader
          level="h1"
          eyebrow="À Votre Écoute"
          title="Contact & Service Client"
          subtitle="Une conseillère capillaire béninoise est disponible pour vous orienter et répondre à vos questions."
        />

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: WhatsApp */}
          <div className="bg-white rounded-3xl p-8 shadow-luxury border border-sable/60 flex flex-col justify-between text-center items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#25D366]/20 flex items-center justify-center text-[#25D366] mb-4">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="eyebrow text-xs text-cuivre-dark">
                Canal Privilégié
              </span>
              <h3 className="card-title text-xl font-bold text-brun-nuit mt-1 mb-2">
                WhatsApp Direct
              </h3>
              <p className="card-text text-sm sm:text-base text-brun-nuit/75 mb-4">
                Commandes rapides & conseils capillaires sur-mesure.
              </p>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-lg sm:text-xl font-bold text-terracotta hover:underline block mb-4"
              >
                {settings.whatsappDisplayNumber}
              </a>
            </div>
            <Button
              variant="whatsapp"
              size="sm"
              as="a"
              href={buildWhatsAppInquiryUrl(undefined, settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full justify-center"
            >
              Ouvrir WhatsApp
            </Button>
          </div>

          {/* Card 2: Delivery */}
          <div className="bg-white rounded-3xl p-8 shadow-luxury border border-sable/60 flex flex-col justify-between text-center items-center">
            <div className="w-14 h-14 rounded-2xl bg-terracotta/20 flex items-center justify-center text-terracotta mb-4">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <span className="eyebrow text-xs text-cuivre-dark">
                Expédition Partout
              </span>
              <h3 className="card-title text-xl font-bold text-brun-nuit mt-1 mb-2">
                Livraison Sans Frontière
              </h3>
              <p className="card-text text-sm sm:text-base text-brun-nuit/75 leading-relaxed mb-4">
                {settings.deliveryNotice}
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta bg-sable/30 px-3 py-1.5 rounded-full border border-sable">
              🌍 Partout, même hors du Bénin
            </span>
          </div>

          {/* Card 3: Hours */}
          <div className="bg-white rounded-3xl p-8 shadow-luxury border border-sable/60 flex flex-col justify-between text-center items-center">
            <div className="w-14 h-14 rounded-2xl bg-or/20 flex items-center justify-center text-or-dark mb-4">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <span className="eyebrow text-xs text-cuivre-dark">
                Disponibilité
              </span>
              <h3 className="card-title text-xl font-bold text-brun-nuit mt-1 mb-2">
                Horaires d'Échange
              </h3>
              <p className="card-text text-sm sm:text-base text-brun-nuit/75 mb-2">
                {settings.openingHours}
              </p>
              <p className="text-xs sm:text-sm text-brun-nuit/60">
                Les commandes WhatsApp du dimanche sont préparées le lundi matin dès l'ouverture.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-feuille bg-feuille/10 px-3 py-1.5 rounded-full border border-feuille/30">
              ● Actuellement disponible
            </span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-luxury border border-sable/60">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-terracotta" />
            <h2 className="section-title text-2xl sm:text-3xl font-bold text-brun-nuit">
              Foire Aux Questions Fréquentes
            </h2>
          </div>

          <div className="divide-y divide-sable/40">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 font-serif text-lg sm:text-xl font-bold text-brun-nuit hover:text-terracotta transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-cuivre shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-3 prose-body text-base text-brun-nuit/80 leading-relaxed"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

