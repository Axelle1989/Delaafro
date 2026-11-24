export type ProductCategory = 'gamme' | 'soin' | 'accessoire';
export type HairPorosity = 'forte' | 'moyenne' | 'faible' | 'toutes';

export interface ProductVariant {
  name: string;
  colorName?: string;
  colorHex?: string;
  image?: string;
  inStock?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryLabel?: string;
  subtitle?: string;
  shortDescription: string;
  longDescription: string;
  composition?: string[];
  benefits: string[];
  usageInstructions?: string;
  price: number; // in FCFA
  originalPrice?: number; // for strike-through promo
  images: string[];
  variants?: ProductVariant[];
  badge?: 'Nouveau' | 'Best-seller' | 'Promo' | 'Coup de Cœur' | 'Idéal cheveux à forte porosité';
  porosity?: HairPorosity;
  needsStudioPhoto?: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  inStock: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface CartItem {
  id: string; // product id + selected variant
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Testimonial {
  id: string;
  clientName: string;
  city: string;
  rating: number; // 1 to 5
  content: string;
  productName?: string;
  productId?: string;
  avatarUrl?: string;
  authorImage?: string;
  photoUrl?: string; // Photo du résultat / chevelure à l'appui
  hairType?: string; // Type de cheveu (ex: '4C – Forte porosité')
  usageDuration?: string; // Durée d'utilisation (ex: 'Après 3 semaines')
  videoUrl?: string;
  videoPosterUrl?: string;
  videoSource?: 'upload' | 'youtube' | 'url' | 'file';
  videoDuration?: string;
  isVisible: boolean;
  status?: 'pending' | 'approved' | 'hidden';
  isDemo?: boolean;
  createdAt: string;
}

export interface SiteSettings {
  whatsappNumber: string; // e.g. "22945483473"
  whatsappDisplayNumber: string; // "+229 45 48 34 73"
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  instagramUrl: string;
  facebookUrl: string;
  snapchatUrl: string;
  pinterestUrl: string;
  tiktokUrl?: string;
  deliveryNotice: string;
  openingHours: string;
  giftWrapPrice?: number;
  giftWrapEnabled?: boolean;
}

