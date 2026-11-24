import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  giftWrap: boolean;
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setGiftWrap: (enabled: boolean) => void;
  getTotalCount: () => number;
  getTotalPrice: (giftWrapPrice?: number) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      giftWrap: false,

      addItem: (product: Product, quantity = 1, variant) => {
        set((state) => {
          const variantKey = variant ? `-${variant.name}` : '';
          const itemId = `${product.id}${variantKey}`;

          const existingIndex = state.items.findIndex((item) => item.id === itemId);

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems, isOpen: true };
          }

          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            product,
            quantity,
            selectedVariant: variant,
          };

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== itemId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setGiftWrap: (giftWrap: boolean) => set({ giftWrap }),

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: (giftWrapPrice = 0) => {
        const itemsTotal = get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
        return itemsTotal + (get().giftWrap ? giftWrapPrice : 0);
      },
    }),
    {
      name: 'delaafro-cart-storage',
      partialize: (state) => ({ items: state.items, giftWrap: state.giftWrap }),
    }
  )
);

