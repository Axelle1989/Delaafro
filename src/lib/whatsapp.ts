import { CartItem } from '@/types';
import { formatFCFA } from './formatters';

export const DEFAULT_WHATSAPP_NUMBER = '22945483473';

/**
 * Creates the encoded WhatsApp URL for an entire shopping cart order
 */
export function buildWhatsAppCartUrl(
  items: CartItem[],
  total: number,
  whatsappNumber: string = DEFAULT_WHATSAPP_NUMBER,
  customerNotes?: { name?: string; location?: string; giftWrap?: boolean; giftWrapPrice?: number }
): string {
  const cleanNumber = whatsappNumber.replace(/\D/g, '');

  const itemsList = items
    .map((item) => {
      const variantText = item.selectedVariant
        ? ` (${item.selectedVariant.name || item.selectedVariant.colorName})`
        : '';
      const lineTotal = item.product.price * item.quantity;
      return `• ${item.product.name}${variantText} x${item.quantity} — ${formatFCFA(lineTotal)}`;
    })
    .join('\n');

  const giftWrapLine = customerNotes?.giftWrap
    ? `🎁 Emballage cadeau signature DELAAFRO : Oui (${formatFCFA(customerNotes.giftWrapPrice || 0)})`
    : '';

  const nameLine = customerNotes?.name ? `Nom : ${customerNotes.name}` : 'Nom : ';
  const locationLine = customerNotes?.location
    ? `Pays / ville / quartier de livraison : ${customerNotes.location}`
    : 'Pays / ville / quartier de livraison : ';

  const messageLines = [
    'Bonjour DELAAFRO 👋',
    'Je souhaite commander :',
    itemsList,
  ];

  if (giftWrapLine) {
    messageLines.push('', giftWrapLine);
  }

  messageLines.push(
    '',
    `Total de la commande : ${formatFCFA(total)}`,
    '',
    nameLine,
    locationLine,
    '',
    'Merci de me confirmer la prise en charge et le délai de livraison !'
  );

  const message = messageLines.join('\n');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates a direct WhatsApp checkout link for a single product/variant
 */
export function buildWhatsAppDirectProductUrl(
  productName: string,
  price: number,
  variantName?: string,
  whatsappNumber: string = DEFAULT_WHATSAPP_NUMBER
): string {
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const variantText = variantName ? ` (Variante : ${variantName})` : '';

  const message = [
    'Bonjour DELAAFRO 👋',
    `Je souhaite commander le produit suivant :`,
    `• ${productName}${variantText} — ${formatFCFA(price)}`,
    '',
    'Nom :',
    'Pays / ville / quartier de livraison :',
    '',
    'Pourriez-vous me confirmer la disponibilité et le délai de livraison ? Merci !',
  ].join('\n');

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates a generic WhatsApp chat link for questions / advice
 */
export function buildWhatsAppInquiryUrl(
  context?: string,
  whatsappNumber: string = DEFAULT_WHATSAPP_NUMBER
): string {
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const intro = context
    ? `Bonjour DELAAFRO 👋 J'aimerais avoir un conseil concernant : ${context}.`
    : `Bonjour DELAAFRO 👋 J'aimerais avoir des conseils personnalisés pour ma routine capillaire.`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(intro)}`;
}

