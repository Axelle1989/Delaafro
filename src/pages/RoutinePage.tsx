import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Droplets,
  Feather,
  ShieldCheck,
  ShoppingBag,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  Lightbulb,
  Clock,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/common/Button';
import { formatFCFA } from '@/lib/formatters';
import { getProductImage } from '@/lib/productImage';
import { getSiteImage } from '@/lib/siteImages';
import { SectionHeader } from '@/components/common/SectionHeader';

export const RoutinePage: React.FC = () => {
  const { products, settings } = useSettingsStore();
  const { addItem } = useCartStore();
  const shouldReduceMotion = useReducedMotion();

  // Scroll-spy state for the 4 steps
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Quiz state: step 0 to 3 (questions) and 4 (results)
  const [quizStep, setQuizStep] = useState(0);
  const [hairType, setHairType] = useState<'crepus' | 'lockses' | 'transition'>('crepus');
  const [porosity, setPorosity] = useState<'faible' | 'moyenne' | 'forte' | null>(null);
  const [density, setDensity] = useState<'fine' | 'moyenne' | 'epaisse' | null>(null);
  const [goal, setGoal] = useState<'pousse' | 'hydratation' | 'anti-casse' | null>(null);

  // 4 Steps definition
  const routineSteps = [
    {
      id: 'etape-01',
      step: '01',
      shortLabel: 'Nettoyer',
      title: 'Nettoyer sans décaper',
      time: 'Wash Day (1 fois par semaine)',
      action: 'Shampoing Doux',
      description:
        'Lavez votre cuir chevelu du bout des doigts sans frotter agressivement les longueurs. La mousse qui s’écoule suffit à emporter les impuretés tout en préservant le sébum indispensable.',
      photo: getSiteImage(settings, 'routineStep1'),
      recommendedSlug: 'shampoing-doux',
      tip: 'Effectuez toujours votre lavage après avoir séparé vos cheveux en 4 sections pour éviter les nœuds.',
      icon: Droplets,
    },
    {
      id: 'etape-02',
      step: '02',
      shortLabel: 'Hydrater',
      title: 'Hydrater au cœur de la fibre',
      time: 'Quotidien ou tous les 2 jours',
      action: 'Spray Hydratant Tonique',
      description:
        'Le cheveu crépu a une soif continue. Vaporisez une brume d’eau pure enrichie en gel d’aloe vera pour ouvrir la fibre et redonner souplesse et ressort à vos boucles.',
      photo: getSiteImage(settings, 'routineStep2'),
      recommendedSlug: 'spray-hydratant',
      tip: 'Brumisez légèrement sans tremper vos cheveux avant chaque coiffage protecteur.',
      icon: Sparkles,
    },
    {
      id: 'etape-03',
      step: '03',
      shortLabel: 'Nourrir & sceller',
      title: 'Nourrir & Sceller l’hydratation',
      time: 'Après l’hydratation',
      action: 'Sérum Précieux & Baume',
      description:
        'Pour empêcher l’eau de s’évaporer, appliquez une noisette de baume sur les longueurs puis 3 à 5 gouttes de sérum sur le cuir chevelu et les pointes.',
      photo: getSiteImage(settings, 'routineStep3'),
      recommendedSlug: 'serum-capillaire',
      tip: 'Si vous avez une forte porosité, le sérum est indispensable pour refermer les cuticules et garder l’eau.',
      icon: Feather,
    },
    {
      id: 'etape-04',
      step: '04',
      shortLabel: 'Protéger',
      title: 'Protéger & Conserver',
      time: 'Chaque soir & lors du coiffage',
      action: 'Satin & Outils Doux',
      description:
        'Remplacez le coton par du satin qui n’absorbe pas vos huiles. Utilisez des brosses ajourées souples qui cèdent devant les nœuds sans casser la fibre.',
      photo: getSiteImage(settings, 'routineStep4'),
      recommendedSlug: 'kit-accessoires-complet',
      tip: 'Attachez vos cheveux en « ananas » haut avec un chouchou satin sans serrer avant de dormir.',
      icon: ShieldCheck,
    },
  ];

  // Scroll spy with IntersectionObserver
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = routineSteps.findIndex((s) => s.id === entry.target.id);
          if (index !== -1) {
            setActiveStepIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0,
    });

    routineSteps.forEach((step) => {
      const el = document.getElementById(step.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToStep = (index: number) => {
    setActiveStepIndex(index);
    const targetId = routineSteps[index].id;
    const el = document.getElementById(targetId);
    if (el) {
      const yOffset = -130;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Quiz Recommendation Logic
  const getRecommendation = () => {
    if (hairType === 'lockses') {
      const locksesGamme = products.find((p) => p.slug === 'gamme-lockses');
      return {
        gamme: locksesGamme || products[0],
        serum: null,
      };
    }

    let recommendedGamme = products.find((p) => p.slug === 'gamme-hydratation');
    const needsSerum = porosity === 'forte';

    if (goal === 'pousse' || goal === 'anti-casse' || density === 'epaisse') {
      recommendedGamme = products.find((p) => p.slug === 'gamme-complete');
    }

    const serumProduct = products.find((p) => p.slug === 'serum-capillaire');

    return {
      gamme: recommendedGamme || products[0],
      serum: needsSerum ? serumProduct : null,
    };
  };

  const recommendation = getRecommendation();

  const handleSendQuizWhatsApp = () => {
    const rec = getRecommendation();
    const hairTypeLabel =
      hairType === 'lockses'
        ? 'Cheveux locksés'
        : hairType === 'transition'
        ? 'En transition / défrisés'
        : 'Cheveux crépus naturels (4A-4C)';
    const message = `Bonjour DELAAFRO ! J'ai réalisé le Diagnostic Capillaire sur votre site :\n\n- Nature : ${hairTypeLabel}\n- Porosité : ${porosity || 'Non précisée'}\n- Densité : ${density || 'Non précisée'}\n- Objectif prioritaire : ${goal || 'Hydratation'}\n\nMon rituel recommandé : ${rec.gamme.name}${rec.serum ? ` + ${rec.serum.name} (Forte Porosité)` : ''}.\n\nPouvez-vous me conseiller pour finaliser ma commande ?`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encoded}`, '_blank');
  };

  const handleResetQuiz = () => {
    setQuizStep(0);
    setHairType('crepus');
    setPorosity(null);
    setDensity(null);
    setGoal(null);
  };

  // Quiz questions definition
  const questions = [
    {
      num: 1,
      title: 'Quelle est la nature de vos cheveux ?',
      options: [
        {
          id: 'crepus',
          label: 'Cheveux crépus naturels (4A à 4C)',
          desc: 'Texture afro naturelle, boucles serrées ou frisottis denses',
        },
        {
          id: 'lockses',
          label: 'Cheveux Locksés (Dreadlocks / Microlocks)',
          desc: 'Locks matures, départs ou microlocks entretenus',
        },
        {
          id: 'transition',
          label: 'En transition ou défrisés',
          desc: 'Repousses naturelles associées à des pointes traitées',
        },
      ],
      currentValue: hairType,
      setValue: (val: string) => setHairType(val as any),
    },
    {
      num: 2,
      title: "Comment réagissent vos cheveux à l'eau ? (Porosité)",
      options: [
        {
          id: 'faible',
          label: 'L’eau glisse et met du temps à pénétrer (Faible porosité)',
          desc: 'Les écailles sont serrées, l’hydratation a du mal à entrer',
        },
        {
          id: 'moyenne',
          label: 'L’eau pénètre normalement et sèche raisonnablement (Porosité normale)',
          desc: 'Équilibre idéal entre absorption et rétention d’eau',
        },
        {
          id: 'forte',
          label: 'L’eau est bue instantanément mais le cheveu redevient sec très vite (Forte porosité)',
          desc: 'Écailles ouvertes : l’hydratation s’évapore trop rapidement',
        },
      ],
      currentValue: porosity,
      setValue: (val: string) => setPorosity(val as any),
    },
    {
      num: 3,
      title: 'Quelle est la densité de votre chevelure ?',
      options: [
        {
          id: 'fine',
          label: 'Fine (mon cuir chevelu se voit facilement)',
          desc: 'Nécessite des soins légers sans effet alourdissant',
        },
        {
          id: 'moyenne',
          label: 'Moyenne (volume régulier)',
          desc: 'Densité classique avec bonne élasticité',
        },
        {
          id: 'epaisse',
          label: 'Très épaisse & fournie (volume dense)',
          desc: 'Grande masse nécessitant une richesse nutritive maximale',
        },
      ],
      currentValue: density,
      setValue: (val: string) => setDensity(val as any),
    },
    {
      num: 4,
      title: 'Quel est votre objectif prioritaire ?',
      options: [
        {
          id: 'hydratation',
          label: 'Stopper la sécheresse & adoucir',
          desc: 'Retrouver souplesse, malléabilité et douceur au toucher',
        },
        {
          id: 'pousse',
          label: 'Booster la pousse & garnir les tempes',
          desc: 'Stimuler la microcirculation et maximiser la rétention de longueur',
        },
        {
          id: 'anti-casse',
          label: 'Stopper la casse & les pointes fourchues',
          desc: 'Renforcer la tige capillaire et sceller l’hydratation',
        },
      ],
      currentValue: goal,
      setValue: (val: string) => setGoal(val as any),
    },
  ];

  const handleSelectOption = (value: string) => {
    questions[quizStep].setValue(value);
    setTimeout(() => {
      setQuizStep((prev) => Math.min(prev + 1, 4));
    }, 240);
  };

  return (
    <div className="bg-creme min-h-screen selection:bg-terracotta selection:text-white">
      {/* ══════════════════════════════════════════════════
          PART A: LE PROTOCOLE EN 4 TEMPS
      ══════════════════════════════════════════════════ */}
      <section className="pt-10 sm:pt-14 pb-16 lg:pb-24">
        <div className="site-container">
          {/* 1. En-tête éditorial compact */}
          <SectionHeader
            level="h1"
            eyebrow="Le Guide Ultime Afro"
            title="Le Protocole en 4 Temps"
            subtitle="Une routine simple pour des cheveux souples, longs et vigoureux."
          />

          {/* 2. Bande de 4 pastilles-étapes (sticky) */}
          <div className="sticky top-16 sm:top-20 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 mb-10 sm:mb-16 bg-creme/95 backdrop-blur-md border-y border-sable/60 shadow-sm transition-all">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
              {routineSteps.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                const StepIcon = step.icon;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => scrollToStep(idx)}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={step.id}
                    className={`group relative flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-terracotta text-white shadow-luxury scale-[1.02]'
                        : 'bg-white/80 hover:bg-white text-brun-nuit/80 border border-sable/70 hover:border-or/60 hover:text-brun-nuit'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-serif text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-white text-terracotta'
                          : 'bg-sable-light text-cuivre group-hover:bg-or/20'
                      }`}
                    >
                      {step.step}
                    </span>
                    <StepIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-80" />
                    <span>{step.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Mise en page PC (2 colonnes) & Mobile (chronologie continue) */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-14 items-start">
            {/* ── COLONNE GAUCHE (5/12) STICKY SUR PC ── */}
            <div className="hidden lg:block lg:col-span-5 sticky top-36">
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-luxury border border-sable/60 bg-sable-light/40">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeStepIndex}
                    src={routineSteps[activeStepIndex].photo}
                    alt={routineSteps[activeStepIndex].title}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="w-full h-full object-cover object-center"
                  />
                </AnimatePresence>

                {/* Grand numéro doré translucide */}
                <div
                  aria-hidden="true"
                  className="absolute top-2 left-4 select-none pointer-events-none font-serif text-8xl font-black text-white/90 drop-shadow-md tracking-tight"
                >
                  {routineSteps[activeStepIndex].step}
                </div>

                {/* Badge d'étape actif au bas de la photo */}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-brun-nuit/90 via-brun-nuit/40 to-transparent text-white">
                  <div className="flex items-center justify-between text-xs font-medium text-creme-light/90 mb-2">
                    <span className="font-serif tracking-wider uppercase text-or">
                      Étape {activeStepIndex + 1} sur 4
                    </span>
                    <span className="truncate max-w-[180px]">{routineSteps[activeStepIndex].action}</span>
                  </div>
                  {/* Fine barre de progression */}
                  <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cuivre to-or rounded-full"
                      animate={{ width: `${((activeStepIndex + 1) / 4) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── COLONNE DROITE (7/12) : LES 4 ÉTAPES ── */}
            <div className="lg:col-span-7 space-y-16 sm:space-y-24">
              {routineSteps.map((step, idx) => {
                const product = products.find((p) => p.slug === step.recommendedSlug);
                const StepIcon = step.icon;

                return (
                  <motion.div
                    key={step.id}
                    id={step.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.6 }}
                    className="scroll-mt-36 relative"
                  >
                    {/* Visual pour mobile (< 1024px) */}
                    <div className="lg:hidden mb-6">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-luxury border border-sable/60 bg-sable-light/40">
                        <img
                          src={step.photo}
                          alt={step.title}
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-gradient-cuivre-or text-white flex items-center justify-center font-serif font-bold text-base shadow-md border border-white">
                          {step.step}
                        </div>
                      </div>
                    </div>

                    {/* Étiquette temporelle */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sable-light border border-sable/70 text-xs font-semibold uppercase tracking-wider text-terracotta mb-4">
                      <Clock className="w-3.5 h-3.5 text-terracotta" />
                      <span>{step.time}</span>
                    </div>

                    {/* Titre serif */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brun-nuit leading-tight mb-5">
                      Étape {step.step} : {step.title}
                    </h2>

                    {/* Description fluide et aérée (sans troncature) */}
                    <p className="text-lg text-brun-nuit/85 leading-relaxed font-sans mb-6">
                      {step.description}
                    </p>

                    {/* Encadré « Astuce DELAAFRO » */}
                    <div className="p-5 rounded-2xl bg-sable-light/70 border-l-4 border-or flex items-start gap-3.5 text-base text-brun-nuit/90 mb-6 shadow-sm">
                      <Lightbulb className="w-5 h-5 text-or shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold text-brun-nuit">Astuce DELAAFRO : </span>
                        {step.tip}
                      </div>
                    </div>

                    {/* Mini-carte « Soin recommandé » */}
                    {product && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sable/80 shadow-luxury flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={step.photo}
                            alt={product.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-sable/50"
                          />
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-cuivre block mb-0.5">
                              Soin recommandé
                            </span>
                            <h3 className="font-serif font-bold text-base sm:text-lg text-brun-nuit leading-snug">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="font-serif text-base sm:text-lg font-bold text-terracotta">
                                {formatFCFA(product.price)}
                              </span>
                              <Link
                                to={`/produit/${product.slug}`}
                                className="text-xs text-brun-nuit/70 hover:text-terracotta underline font-medium inline-flex items-center gap-0.5 transition-colors"
                              >
                                <span>Voir le soin</span>
                                <ChevronRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="terracotta"
                          size="sm"
                          onClick={() => addItem(product, 1)}
                          leftIcon={<ShoppingBag className="w-4 h-4" />}
                          className="shrink-0 w-full sm:w-auto"
                        >
                          Ajouter au panier
                        </Button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 4. Bandeau récapitulatif simple « Votre routine en un coup d'œil » */}
          <div className="mt-20 lg:mt-28 p-8 sm:p-12 rounded-[32px] bg-white border border-sable shadow-luxury text-center max-w-4xl mx-auto">
            <span className="eyebrow mx-auto justify-center mb-2">
              <Sparkles className="w-4 h-4 text-or" />
              <span>Synthèse du rituel</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brun-nuit mb-3">
              Votre routine en un coup d'œil
            </h3>
            <p className="section-lead mx-auto mb-8 text-base sm:text-lg">
              Quatre étapes simples et synergiques pour révéler la pleine puissance et la beauté de votre afro.
            </p>

            {/* 4 icônes en ligne */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {[
                { num: '01', label: 'Nettoyer', sub: 'Shampoing Doux', icon: Droplets },
                { num: '02', label: 'Hydrater', sub: 'Spray Tonique', icon: Sparkles },
                { num: '03', label: 'Nourrir & sceller', sub: 'Baume & Sérum', icon: Feather },
                { num: '04', label: 'Protéger', sub: 'Satin & Brosses', icon: ShieldCheck },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.num}
                    className="p-4 rounded-2xl bg-sable-light/60 border border-sable/50 text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta mx-auto flex items-center justify-center mb-2">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-cuivre uppercase tracking-wider block">
                      Étape {item.num}
                    </span>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-brun-nuit">
                      {item.label}
                    </h4>
                    <p className="text-xs text-brun-nuit/70 mt-0.5">{item.sub}</p>
                  </div>
                );
              })}
            </div>

            <Link to="/produit/gamme-complete">
              <Button
                variant="terracotta"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Découvrir la Gamme Complète
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PART B: LE DIAGNOSTIC CAPILLAIRE INTERACTIF
      ══════════════════════════════════════════════════ */}
      <section
        id="quiz"
        className="relative py-20 lg:py-28 bg-brun-nuit text-creme-light overflow-hidden border-t border-sable/20"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, rgba(197, 122, 89, 0.16) 0%, transparent 60%), #1F1610',
        }}
      >
        <div className="site-container relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-14 items-center">
            {/* ── COLONNE GAUCHE (5/12) : PRÉSENTATION & RÉASSURANCES ── */}
            <div className="lg:col-span-5 space-y-6 mb-12 lg:mb-0">
              <div className="eyebrow text-or">
                <HelpCircle className="w-4 h-4 text-or" />
                <span>Diagnostic Capillaire Interactif</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-creme-light leading-tight">
                Trouvez votre routine sur-mesure
              </h2>
              <div className="gold-underline" />
              <p className="text-lg text-sable/90 leading-relaxed font-sans">
                Répondez à 4 questions ciblées pour déterminer avec précision le rituel adapté à la nature, à la porosité et aux besoins spécifiques de votre couronne.
              </p>

              {/* 3 points de réassurance */}
              <div className="space-y-4 pt-4 border-t border-sable/20">
                <div className="flex items-center gap-3.5 text-creme-light">
                  <div className="w-9 h-9 rounded-full bg-or/15 text-or flex items-center justify-center shrink-0 border border-or/30">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm sm:text-base block">4 questions rapides</span>
                    <span className="text-xs text-sable/75">Nature, porosité, densité et objectif</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-creme-light">
                  <div className="w-9 h-9 rounded-full bg-or/15 text-or flex items-center justify-center shrink-0 border border-or/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm sm:text-base block">Moins d’une minute</span>
                    <span className="text-xs text-sable/75">Simple, fluide et intuitif</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-creme-light">
                  <div className="w-9 h-9 rounded-full bg-or/15 text-or flex items-center justify-center shrink-0 border border-or/30">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm sm:text-base block">Recommandation 100 % personnalisée</span>
                    <span className="text-xs text-sable/75">Gamme idéale & conseils d’application</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── COLONNE DROITE (7/12) : LA CARTE DU QUIZ (1 QUESTION À LA FOIS) ── */}
            <div className="lg:col-span-7">
              <div className="bg-creme-light text-brun-nuit rounded-[32px] p-6 sm:p-10 shadow-2xl border border-sable/40 relative">
                {quizStep < 4 ? (
                  <div>
                    {/* En-tête de la question : progression & bouton retour */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                        Question {quizStep + 1} sur 4
                      </span>
                      {quizStep > 0 && (
                        <button
                          type="button"
                          onClick={() => setQuizStep((s) => s - 1)}
                          className="text-xs text-brun-nuit/60 hover:text-terracotta inline-flex items-center gap-1 font-semibold transition-colors"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Question précédente</span>
                        </button>
                      )}
                    </div>

                    {/* Barre de progression fine */}
                    <div className="h-1.5 w-full bg-sable/40 rounded-full overflow-hidden mb-6 sm:mb-8">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cuivre to-or rounded-full"
                        animate={{ width: `${((quizStep + 1) / 4) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {/* Contenu animé de la question courante */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={quizStep}
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        role="radiogroup"
                        aria-live="polite"
                        aria-label={questions[quizStep].title}
                      >
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brun-nuit leading-snug mb-6">
                          {questions[quizStep].title}
                        </h3>

                        {/* Choix en grandes cartes cliquables */}
                        <div className="space-y-3.5">
                          {questions[quizStep].options.map((opt) => {
                            const isSelected = questions[quizStep].currentValue === opt.id;

                            return (
                              <button
                                key={opt.id}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => handleSelectOption(opt.id)}
                                className={`group w-full p-4 sm:p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between gap-4 ${
                                  isSelected
                                    ? 'border-terracotta bg-white shadow-luxury ring-2 ring-terracotta/20'
                                    : 'border-sable/70 bg-white/70 hover:bg-white hover:border-or/60 hover:shadow-sm'
                                }`}
                              >
                                <div className="space-y-1 pr-2">
                                  <div
                                    className={`text-base sm:text-lg font-bold transition-colors ${
                                      isSelected
                                        ? 'text-terracotta'
                                        : 'text-brun-nuit group-hover:text-terracotta'
                                    }`}
                                  >
                                    {opt.label}
                                  </div>
                                  <div className="text-xs sm:text-sm text-brun-nuit/70 leading-relaxed">
                                    {opt.desc}
                                  </div>
                                </div>

                                <div
                                  className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'bg-terracotta text-white shadow-sm'
                                      : 'border-2 border-sable/80 group-hover:border-or text-transparent'
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ) : (
                  /* ── ÉCRAN RÉSULTAT (4 questions répondues) ── */
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {/* Célébration subtile */}
                    <div className="text-center space-y-2">
                      <div className="w-14 h-14 rounded-full bg-gradient-cuivre-or text-white mx-auto flex items-center justify-center shadow-gold-glow">
                        <Crown className="w-7 h-7" />
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brun-nuit">
                        Votre Rituel Sur-Mesure
                      </h3>
                      <p className="text-sm text-brun-nuit/75 max-w-md mx-auto">
                        Prescription personnalisée établie pour une texture{' '}
                        <span className="font-semibold text-terracotta">{density || 'moyenne'}</span>{' '}
                        et une porosité{' '}
                        <span className="font-semibold text-terracotta">{porosity || 'normale'}</span>.
                      </p>
                    </div>

                    {/* Carte de la gamme recommandée */}
                    <div className="p-5 rounded-2xl bg-white border border-sable shadow-luxury flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      <img
                        src={getProductImage(recommendation.gamme, 0)}
                        alt={recommendation.gamme.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-sable/50"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta block mb-1">
                          Gamme Recommandée
                        </span>
                        <h4 className="font-serif font-bold text-lg sm:text-xl text-brun-nuit mb-1">
                          {recommendation.gamme.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-brun-nuit/70 line-clamp-2 mb-2">
                          {recommendation.gamme.shortDescription ||
                            recommendation.gamme.subtitle ||
                            'Le rituel complet conçu pour nourrir et sublimer vos cheveux crépus.'}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-lg font-bold text-terracotta">
                            {formatFCFA(recommendation.gamme.price)}
                          </span>
                          <Link
                            to={`/produit/${recommendation.gamme.slug}`}
                            className="text-xs text-cuivre hover:underline font-semibold"
                          >
                            Voir les détails →
                          </Link>
                        </div>
                      </div>
                      <Button
                        variant="terracotta"
                        size="sm"
                        onClick={() => addItem(recommendation.gamme, 1)}
                        leftIcon={<ShoppingBag className="w-4 h-4" />}
                        className="shrink-0 w-full sm:w-auto"
                      >
                        Ajouter au panier
                      </Button>
                    </div>

                    {/* Carte Sérum si Forte Porosité */}
                    {recommendation.serum && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-or/15 via-white to-creme-light border-2 border-or/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img
                          src={getProductImage(recommendation.serum, 0)}
                          alt={recommendation.serum.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-or/30"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-or block mb-0.5">
                            Spécial Forte Porosité · Recommandé pour sceller l’hydratation
                          </span>
                          <h4 className="font-serif font-bold text-base text-brun-nuit">
                            {recommendation.serum.name}
                          </h4>
                          <span className="font-serif text-base font-bold text-terracotta block mt-0.5">
                            {formatFCFA(recommendation.serum.price)}
                          </span>
                        </div>
                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => addItem(recommendation.serum!, 1)}
                          leftIcon={<ShoppingBag className="w-4 h-4" />}
                          className="shrink-0 w-full sm:w-auto"
                        >
                          Ajouter le sérum
                        </Button>
                      </div>
                    )}

                    {/* Actions de validation & contact WhatsApp */}
                    <div className="space-y-3 pt-2">
                      <Button
                        variant="whatsapp"
                        size="lg"
                        className="w-full text-base"
                        onClick={handleSendQuizWhatsApp}
                        leftIcon={<MessageCircle className="w-5 h-5" />}
                      >
                        Commander ce rituel sur WhatsApp
                      </Button>

                      <button
                        type="button"
                        onClick={handleResetQuiz}
                        className="w-full text-center text-sm text-brun-nuit/60 hover:text-brun-nuit flex items-center justify-center gap-2 pt-2 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Refaire le diagnostic</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
