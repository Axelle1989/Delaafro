import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { buildWhatsAppInquiryUrl } from '@/lib/whatsapp';
import { getSiteImage } from '@/lib/siteImages';

interface RangePriceItem {
  name: string;
  price: string;
  icon: string;
  targetId: string;
}

const RANGES_PRICES: RangePriceItem[] = [
  {
    name: 'Gamme Essentielle',
    price: '12 000 FCFA',
    icon: '✨',
    targetId: 'gamme-essentielle',
  },
  {
    name: 'Gamme Hydratation',
    price: '15 000 FCFA',
    icon: '💧',
    targetId: 'gamme-hydratation',
  },
  {
    name: 'Gamme Complète',
    price: '18 000 FCFA',
    icon: '👑',
    targetId: 'gamme-complete',
  },
  {
    name: 'Gamme Locksés',
    price: '12 000 FCFA',
    icon: '🌿',
    targetId: 'espace-lockses',
  },
];

export const LivingPosterBanner: React.FC = () => {
  const { settings } = useSettingsStore();
  const bannerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(bannerRef, { margin: '150px 0px 150px 0px' });
  const prefersReducedMotion = useReducedMotion();

  // Desktop detection
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Periodic ~8s image re-reveal sweep
  const [revealKey, setRevealKey] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || !isInView) return;
    const interval = setInterval(() => {
      setRevealKey((k) => k + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, isInView]);

  // Desktop Mouse Parallax
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 180, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const hoverRotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const hoverRotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !isDesktop) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    if (isDesktop && !prefersReducedMotion) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const scrollToRange = (targetId: string) => {
    const el =
      document.getElementById(targetId) ||
      (targetId === 'espace-lockses' ? document.getElementById('gamme-lockses') : null);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleViewAllGammes = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('gammes') || document.getElementById('gamme-complete');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const whatsappUrl = buildWhatsAppInquiryUrl('Commande Gammes DELAAFRO', settings.whatsappNumber);

  return (
    <div
      ref={bannerRef}
      className="relative rounded-[36px] overflow-hidden bg-gradient-to-br from-brun-nuit via-brun-nuit to-terracotta-deep text-creme-light shadow-luxury border border-cuivre/20 p-8 sm:p-10 lg:p-16"
    >
      {/* Halo radial doré très doux derrière l'affiche */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/6 w-[450px] sm:w-[550px] h-[450px] sm:h-[550px] rounded-full bg-or/15 blur-3xl pointer-events-none"
      />

      {/* Reflet lumineux diagonal en boucle (traverse lentement de gauche à droite) */}
      {!prefersReducedMotion && isInView && (
        <motion.div
          aria-hidden="true"
          className="absolute -top-[60%] -bottom-[60%] w-[260px] sm:w-[320px] pointer-events-none rotate-[20deg]"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.12) 40%, rgba(232, 183, 126, 0.12) 60%, transparent 100%)',
            mixBlendMode: 'soft-light',
          }}
          animate={{
            x: ['-220%', '480%'],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Main 12-Column Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Poster Column : au-dessus sur mobile (<1024px), à droite sur desktop */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center items-center">
          {/* Card Entrance Container */}
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: 80, rotate: 8 }
            }
            whileInView={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, x: 0, rotate: 0 }
            }
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px]"
            style={{ perspective: 1200 }}
          >
            {/* Living 3D Card with Oscillation and Mouse Parallax */}
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative bg-[#F8EBDD] rounded-[28px] p-2.5 sm:p-3 border border-or/20 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] select-none"
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                rotateX: isHovered && !prefersReducedMotion ? hoverRotateX : 0,
                rotateY: isHovered && !prefersReducedMotion ? hoverRotateY : undefined,
              }}
              animate={
                prefersReducedMotion
                  ? { rotateZ: -3, y: 0 }
                  : isHovered
                  ? { rotateZ: -2, y: -4 }
                  : isInView
                  ? {
                      rotateZ: [-3, -1, -3],
                      rotateY: isDesktop ? [-6, 6, -6] : [-3, 3, -3],
                      y: isDesktop ? [0, -10, 0] : [0, -6, 0],
                    }
                  : { rotateZ: -3, y: 0 }
              }
              transition={
                isHovered
                  ? { duration: 0.25, ease: 'easeOut' }
                  : {
                      duration: 6,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut',
                    }
              }
            >
              {/* Inner Square Photo Container */}
              <div className="relative aspect-square w-full rounded-[22px] overflow-hidden bg-[#F8EBDD]">
                <motion.img
                  key={revealKey}
                  src={getSiteImage(settings, 'rangesBanner')}
                  alt="Les quatre gammes DELAAFRO : Essentielle, Hydratation, Complète et Locksés"
                  initial={
                    prefersReducedMotion || revealKey === 0
                      ? false
                      : { clipPath: 'inset(0% 0% 100% 0%)' }
                  }
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  transition={{
                    duration: 0.9,
                    ease: [0.45, 0, 0.25, 1],
                  }}
                  className="w-full h-full object-cover object-center block pointer-events-none"
                  loading="eager"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Text Column : en dessous sur mobile, à gauche sur desktop */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
              },
            },
          }}
          className="order-2 lg:order-1 lg:col-span-7 space-y-6"
        >
          {/* Pastille */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: 'easeOut' },
              },
            }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-or/15 text-or text-xs font-semibold tracking-wider uppercase border border-or/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-or" />
              <span>La Collection Officielle DELAAFRO</span>
            </div>
          </motion.div>

          {/* Titre */}
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.15] tracking-tight"
          >
            « Quatre gammes,{' '}
            <span className="italic text-gradient-gold">une seule essence</span> : la
            beauté naturelle de vos cheveux »
          </motion.h2>

          {/* Paragraphe */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: 'easeOut' },
              },
            }}
            className="text-base sm:text-lg text-creme/80 max-w-xl leading-relaxed"
          >
            De l’entretien essentiel au rituel royal 5 étoiles, en passant par notre
            infusion hydratante et la nouvelle routine dédiée aux cheveux locksés,
            découvrez l’harmonie parfaite entre pureté végétale et efficacité prouvée.
          </motion.p>

          {/* Étiquettes de Prix */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: 'easeOut' },
              },
            }}
            className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3 pt-1"
          >
            {RANGES_PRICES.map((range) => (
              <button
                key={range.name}
                type="button"
                onClick={() => scrollToRange(range.targetId)}
                title={`Voir la ${range.name}`}
                className="group flex items-center justify-between sm:justify-start gap-2.5 px-4 py-2.5 rounded-xl bg-brun-nuit/60 border border-or/30 text-creme text-xs sm:text-sm font-medium backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-brun-nuit/85 hover:border-or/60 hover:text-white hover:shadow-md active:translate-y-0 text-left"
              >
                <span className="shrink-0 text-sm group-hover:scale-110 transition-transform">
                  {range.icon}
                </span>
                <span className="truncate">{range.name}</span>
                <span className="text-or font-semibold shrink-0">• {range.price}</span>
              </button>
            ))}
          </motion.div>

          {/* Boutons d'Action */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: 'easeOut' },
              },
            }}
            className="pt-3 flex flex-wrap items-center gap-3.5"
          >
            <a
              href="#gammes"
              onClick={handleViewAllGammes}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-terracotta hover:bg-terracotta-light text-white font-semibold text-sm shadow-md hover:shadow-xl transition-all duration-200 active:scale-95 group"
            >
              <span>Voir toutes les gammes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm shadow-md hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Commander sur WhatsApp</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
