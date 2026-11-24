/**
 * Formats a number to West African CFA Franc (FCFA)
 * Example: 15000 -> "15 000 FCFA"
 */
export function formatFCFA(amount: number): string {
  if (isNaN(amount)) return '0 FCFA';
  // Use non-breaking space for numbers
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} FCFA`;
}

/**
 * Generates URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

