import React from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { Sparkles, Heart, MessageCircle, ArrowRight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/store/useSettingsStore';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';
import { getSiteImage } from '@/lib/siteImages';
import { Marquee } from '@/components/common/Marquee';
import { SectionHeader } from '@/components/common/SectionHeader';

export const AboutPage: React.FC = () => {
  const { settings } = useSettingsStore();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Top reading progress indicator
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Soft parallax on Hero visual (disabled if reduced motion requested)
  const heroParallax = useTransform(
    scrollYProgress,
    [0, 0.35],
    [0, shouldReduceMotion ? 0 : -40]
  );

  const pillars = [
    {
      num: '01',
      title: 'Terre Cuite',
      desc: 'Le retour aux racines. Des ingrédients non dénaturés issus directement des coopératives agricoles féminines béninoises.',
      tag: 'Origines & Terroir',
      accentColor: 'text-terracotta',
      borderAccent: 'border-t-terracotta',
    },
    {
      num: '02',
      title: "L'Éclat d'Or",
      desc: 'Le raffinement cosmétique. Des textures fondantes sans résidu blanc, des parfums subtils et des flacons élégants.',
      tag: 'Excellence & Sensoriel',
      accentColor: 'text-or',
      borderAccent: 'border-t-or',
    },
    {
      num: '03',
      title: 'La Feuille Pure',
      desc: 'La santé capillaire durable. Aucun test sur les animaux, zéro parabène, zéro sulfate décapant, respect total du cuir chevelu.',
      tag: 'Botanique & Respect',
      accentColor: 'text-feuille',
      borderAccent: 'border-t-feuille',
    },
  ];

  return (
    <div className="bg-creme min-h-screen relative selection:bg-terracotta selection:text-white">
      {/* 0. Golden Reading Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cuivre via-or to-terracotta origin-left z-50 pointer-events-none shadow-sm"
      />

      {/* =========================================================================
          1. HERO ÉDITORIAL (≈ 70 vh)
      ========================================================================= */}
      <section className="relative min-h-[65vh] lg:min-h-[72vh] flex items-center overflow-hidden pt-12 pb-16 lg:py-20 bg-gradient-to-b from-creme via-sable/20 to-creme border-b border-cuivre/20">
        {/* Giant subtle watermark "DELAAFRO" behind */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-serif font-black text-brun-nuit/[0.035] tracking-widest uppercase select-none pointer-events-none whitespace-nowrap z-0"
        >
          DELAAFRO
        </div>

        <div className="site-container relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
            {/* Left Column (7 cols): Editorial Titles */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="lg:col-span-7 space-y-4 sm:space-y-6 text-left"
            >
              {/* Overline Badge */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sable/60 border border-cuivre/30 text-xs uppercase font-semibold tracking-[0.3em] text-terracotta"
              >
                <Sparkles className="w-3.5 h-3.5 text-or" />
                <span>Notre Histoire</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
                className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-brun-nuit tracking-tight leading-[1.05]"
              >
                L'Âme de DELAAFRO
              </motion.h1>

              {/* Gold Signature Underline */}
              <motion.div
                variants={{
                  hidden: { scaleX: 0, opacity: 0 },
                  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
                }}
                className="w-24 sm:w-32 h-1 bg-gradient-cuivre-or origin-left rounded-full"
              />

              {/* Golden Italic Signature */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-gradient-gold font-normal pt-2"
              >
                « La noblesse du naturel, l'excellence du soin. »
              </motion.p>

              {/* Animated Scroll Down Indicator */}
              <motion.a
                href="#histoire"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { delay: 0.6, duration: 0.5 } },
                }}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-brun-nuit/60 hover:text-terracotta font-medium pt-4 lg:pt-8 group transition-colors"
              >
                <span>Découvrir l'histoire</span>
                <ArrowDown className="w-4 h-4 animate-bounce text-terracotta" />
              </motion.a>
            </motion.div>

            {/* Right Column (5 cols): Portrait with Offset Luxury Frame */}
            <motion.div
              style={{ y: heroParallax }}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative mt-6 lg:mt-0"
            >
              <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                {/* Offset Decorative Copper Frame (16px offset) */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-4 -right-4 inset-0 rounded-3xl border-2 border-cuivre/50 bg-sable/20 -z-10 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4"
                />

                {/* Main Visual Container */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-or/40 aspect-[4/5] bg-brun-nuit/10 relative group">
                  <img
                    src={getSiteImage(settings, 'aboutHero')}
                    alt="L'excellence des soins capillaires naturels DELAAFRO"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle inner shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brun-nuit/50 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-4 left-4 right-4 bg-brun-nuit/85 backdrop-blur-md text-creme-light text-xs font-medium py-2.5 px-4 rounded-xl border border-or/30 shadow-md flex items-center justify-between">
                    <span className="font-serif italic text-or">Maison DELAAFRO</span>
                    <span className="text-[11px] text-sable/80 uppercase tracking-wider">Cotonou, Bénin</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. HISTOIRE EN DEUX COLONNES « STICKY »
      ========================================================================= */}
      <section id="histoire" className="py-20 lg:py-28 relative">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
            {/* Left Column (5 cols): Sticky Visual */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border border-or/40 aspect-[4/5] bg-brun-nuit/5 group"
              >
                <img
                  src={getSiteImage(settings, 'aboutCraft')}
                  alt="Application du soin précieux DELAAFRO Bénin"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Permanent legible bottom banner */}
                <div className="absolute bottom-0 inset-x-0 bg-brun-nuit/90 backdrop-blur-md text-creme-light py-3 px-5 border-t border-or/30 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-creme-light flex items-center gap-2">
                    <span>🇧🇯</span>
                    <span>Fait avec fierté au Bénin</span>
                  </span>
                  <span className="text-[10px] text-or uppercase tracking-widest font-bold">
                    Botanique Pure
                  </span>
                </div>
              </motion.div>
              <p className="text-center text-xs text-brun-nuit/60 mt-3 font-medium">
                Valorisation du savoir-faire botanique ancestral béninois
              </p>
            </div>

            {/* Right Column (7 cols): Editorial Narrative with Drop-Cap */}
            <div className="lg:col-span-7 space-y-8">
              {/* Narrative Title */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
                className="space-y-3"
              >
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-cuivre block">
                  Notre Manifeste Fondateur
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brun-nuit leading-tight">
                  Une déclaration d'amour à la couronne afro
                </h2>
                <div className="w-16 h-0.5 bg-gradient-cuivre-or rounded-full" />
              </motion.div>

              {/* Story Paragraphs */}
              <div className="space-y-6 text-base sm:text-lg lg:text-xl text-brun-nuit/85 leading-relaxed max-w-2xl">
                {/* Paragraph 1: Drop Cap */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6 }}
                  className="first-letter:float-left first-letter:text-5xl sm:first-letter:text-6xl lg:first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:text-terracotta first-letter:mr-3 sm:first-letter:mr-4 first-letter:leading-none"
                >
                  DELAAFRO est née à Cotonou d'un constat sans équivoque : pendant trop longtemps, les femmes aux cheveux crépus (types 4A, 4B, 4C) ont dû composer avec des produits importés inadaptés à notre climat, remplis de dérivés de pétrole, ou agressifs pour la fibre.
                </motion.p>

                {/* Paragraph 2 */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Nous avons choisi de puiser dans la richesse exceptionnelle de la terre béninoise : le karité brut du Nord aux vertus nourrissantes légendaires, l'huile de ricin pure, l'aloe vera vivifiant et la fleur d'hibiscus.
                </motion.p>

                {/* Prominent Quote Block */}
                <motion.blockquote
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-brun-nuit border-l-4 border-or pl-6 my-8 py-3 bg-sable/20 rounded-r-2xl"
                >
                  « La noblesse du naturel, l'excellence du soin. »
                </motion.blockquote>

                {/* Paragraph 3 */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Notre engagement : offrir des rituels de prestige, sensoriels et profondément efficaces, pour que chaque femme porte sa chevelure comme la couronne royale qu'elle est.
                </motion.p>
              </div>

              {/* Artisan Badge with Heart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="pt-2"
              >
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-terracotta text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:bg-terracotta-deep transition-colors">
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>100% Artisanal & Bienveillant</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CONCEPT « OR & TERRE » EN BANDE HORIZONTALE PLEINE LARGEUR
      ========================================================================= */}
      <section className="w-full bg-gradient-nuit text-creme-light py-14 lg:py-20 relative overflow-hidden border-y border-or/25">
        <div className="site-container relative z-10">
          {/* Header row: Left Title + Right Subtitle */}
          <SectionHeader
            eyebrow="Philosophie & Alchimie"
            title="Le Concept « Or & Terre »"
            subtitle="L'alliance harmonieuse entre la terre nourricière africaine et la préciosité de l'or."
            tone="dark"
          />

          {/* 3 Horizontal Grand Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-cuivre/20 border-b border-cuivre/20 lg:border-b-0">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group relative p-8 sm:p-10 lg:p-12 transition-all duration-500 hover:bg-terracotta/15 cursor-default flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top indicator line on hover */}
                <div
                  className={`absolute top-0 inset-x-8 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${pillar.borderAccent}`}
                />

                {/* Botanical fine line icon */}
                <div className="flex items-center justify-between pb-6">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-or/90">
                    {pillar.tag}
                  </span>
                  <svg
                    className="w-7 h-7 text-or/30 group-hover:text-or/80 transition-colors duration-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>

                {/* Giant Outlined Number */}
                <div className="py-2">
                  <span
                    className="font-serif text-7xl sm:text-8xl font-black text-transparent [-webkit-text-stroke:1.5px_#E8B77E] opacity-70 group-hover:opacity-100 group-hover:text-or/20 group-hover:-translate-y-2 transition-all duration-500 select-none block"
                  >
                    {pillar.num}
                  </span>
                  <h4 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-4 group-hover:text-or transition-colors duration-300">
                    {pillar.title}
                  </h4>
                  <p className="text-sm sm:text-base text-sable/80 leading-relaxed mt-3">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. BANDE DE VALEURS CONTINUE (Légère, gauche vers droite)
      ========================================================================= */}
      <div className="py-4 bg-creme-dark/30 border-b border-sable/40 select-none overflow-hidden [&_.animate-marquee]:!animate-marquee-reverse">
        <Marquee
          items={[
            'Fait avec fierté au Bénin 🇧🇯',
            '100% naturel',
            'Sans sulfates ni silicones',
            'Pour cheveux crépus 4A-4C',
          ]}
          className="border-none bg-transparent py-0"
        />
      </div>

      {/* =========================================================================
          5. APPEL À L'ACTION FINAL (Pleine largeur dans conteneur)
      ========================================================================= */}
      <section className="py-20 lg:py-28 relative">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="relative bg-gradient-to-r from-terracotta via-terracotta-deep to-brun-nuit text-white p-8 sm:p-12 lg:p-16 rounded-3xl border border-or/30 shadow-2xl overflow-hidden"
          >
            {/* Subtle luxury ambient glows */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-or/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-terracotta/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Heading & Description */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-or inline-block">
                  Conseil Personnalisé
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  Une question sur nos méthodes de formulation ?
                </h3>
                <p className="text-sm sm:text-base text-creme-light/90 max-w-xl leading-relaxed">
                  Nous répondons avec joie à toutes vos questions capillaires sur WhatsApp.
                </p>
              </div>

              {/* Right Column: Actions */}
              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-4">
                <a
                  href={buildWhatsAppInquiryUrl('Histoire & ingrédients DELAAFRO', settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-14 px-8 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all w-full sm:w-auto"
                >
                  <MessageCircle className="w-5 h-5 fill-white/20" />
                  <span>Échanger sur WhatsApp</span>
                </a>

                <Link
                  to="/nos-gammes"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-creme-light hover:text-or uppercase tracking-wider transition-colors pt-1 group"
                >
                  <span>Découvrir toutes nos gammes</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
