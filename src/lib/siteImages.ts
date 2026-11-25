import { SiteImages, SiteSettings } from '@/types';

export const DEFAULT_SITE_IMAGES: SiteImages = {
  heroSlide1: '/products/lifestyle/hero-modele-produits.jpg',
  heroSlide2: '/products/lifestyle/hero-diaspora-deux-filles.jpg',
  heroSlide3: '/products/lifestyle/hero-diaspora-vitrine-wax.jpg',
  careInAction1: '/products/lifestyle/application-serum-sur-tresses.jpg',
  careInAction2: '/products/lifestyle/gamme-complete-portrait-afro.jpg',
  careInAction3: '/products/soins/serum-forte-porosite/serum-application-nattes-vue-dessus.jpg',
  rangesBanner: '/products/gammes/gammes-affiche-4-gammes.jpg',
  aboutHero: '/products/lifestyle/gamme-complete-portrait-afro.jpg',
  aboutCraft: '/products/lifestyle/application-serum-sur-tresses.jpg',
  routineStep1: '/products/soins/shampoing-doux/shampoing-doux-principale.jpg',
  routineStep2: '/products/soins/spray-hydratant/spray-hydratant-principale.jpg',
  routineStep3: '/products/soins/serum-forte-porosite/serum-capillaire-principale.jpg',
  routineStep4: '/products/accessoires/scrunchies-et-pinces/scrunchies-satin-assortis.jpg',
  giftWrapPhoto: '/products/packaging/sachet-cadeau-delaafro.jpg',
  chatbotAvatar: '/products/lifestyle/gamme-complete-portrait-afro.jpg',
};

export interface SiteImageSlot {
  key: keyof SiteImages;
  label: string;
  location: string;
}

export interface SiteImageSection {
  title: string;
  description: string;
  slots: SiteImageSlot[];
}

export const SITE_IMAGE_SECTIONS: SiteImageSection[] = [
  {
    title: 'Page d’Accueil — Bannière Hero (PC & Mobile)',
    description: 'Les 3 grandes photos du carrousel principal en haut de la page d’accueil.',
    slots: [
      { key: 'heroSlide1', label: 'Slide 1 — Rituels naturels', location: 'Accueil · Diapositive 1' },
      { key: 'heroSlide2', label: 'Slide 2 — Nos racines, notre fierté', location: 'Accueil · Diapositive 2' },
      { key: 'heroSlide3', label: 'Slide 3 — Résultats & Avis', location: 'Accueil · Diapositive 3' },
    ],
  },
  {
    title: 'Page d’Accueil — Les Soins en Action',
    description: 'Les 3 photos de la galerie lifestyle sur la page d’accueil.',
    slots: [
      { key: 'careInAction1', label: 'Photo 1 — Nutrition en profondeur', location: 'Accueil · Galerie 1' },
      { key: 'careInAction2', label: 'Photo 2 — Gamme Complète portrait', location: 'Accueil · Galerie 2' },
      { key: 'careInAction3', label: 'Photo 3 — Sérum Forte Porosité', location: 'Accueil · Galerie 3' },
    ],
  },
  {
    title: 'Page « Nos Gammes »',
    description: 'L’affiche principale qui présente les 4 gammes DELAAFRO.',
    slots: [
      { key: 'rangesBanner', label: 'Affiche des 4 Gammes', location: '/nos-gammes · Bannière principale' },
    ],
  },
  {
    title: 'Page « À Propos »',
    description: 'Les 2 visuels éditoriaux de l’histoire de la marque.',
    slots: [
      { key: 'aboutHero', label: 'Photo principale Maison DELAAFRO', location: '/a-propos · Haut de page' },
      { key: 'aboutCraft', label: 'Photo Savoir-faire Bénin', location: '/a-propos · Colonne histoire' },
    ],
  },
  {
    title: 'Page « Ma Routine » (4 Étapes)',
    description: 'Les 4 photos qui illustrent chaque étape du protocole capillaire.',
    slots: [
      { key: 'routineStep1', label: 'Étape 01 — Nettoyer', location: '/ma-routine · Étape 1' },
      { key: 'routineStep2', label: 'Étape 02 — Hydrater', location: '/ma-routine · Étape 2' },
      { key: 'routineStep3', label: 'Étape 03 — Nourrir & Sceller', location: '/ma-routine · Étape 3' },
      { key: 'routineStep4', label: 'Étape 04 — Protéger la nuit', location: '/ma-routine · Étape 4' },
    ],
  },
  {
    title: 'Panier & Conseillère Chatbot Dela',
    description: 'Visuel du sachet cadeau dans le panier et photo de profil du chatbot.',
    slots: [
      { key: 'giftWrapPhoto', label: 'Sachet cadeau prestige', location: 'Panier · Option cadeau' },
      { key: 'chatbotAvatar', label: 'Avatar de Dela (Chatbot)', location: 'Bulle & fenêtre de chat' },
    ],
  },
];

export function getSiteImage(settings: SiteSettings | undefined, key: keyof SiteImages): string {
  const custom = settings?.siteImages?.[key];
  if (custom && custom.trim() !== '') {
    return custom;
  }
  return DEFAULT_SITE_IMAGES[key];
}
