export const PRODUCT_PLACEHOLDER = '/products/placeholder-produit.svg';

export interface HasImages {
  images?: string[];
}

/**
 * Returns the product image at given index, or falls back to the official DELAAFRO placeholder.
 * Works seamlessly with Product objects, partials, image arrays, or undefined/null.
 */
export function getProductImage(
  productOrImages?: HasImages | string[] | null,
  index: number = 0
): string {
  if (!productOrImages) {
    return PRODUCT_PLACEHOLDER;
  }

  if (Array.isArray(productOrImages)) {
    const src = productOrImages[index];
    return src && typeof src === 'string' && src.trim() !== '' ? src : PRODUCT_PLACEHOLDER;
  }

  if (Array.isArray(productOrImages.images)) {
    const src = productOrImages.images[index];
    return src && typeof src === 'string' && src.trim() !== '' ? src : PRODUCT_PLACEHOLDER;
  }

  return PRODUCT_PLACEHOLDER;
}
