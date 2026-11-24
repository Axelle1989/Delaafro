import { create } from 'zustand';
import { Product } from '@/types';

interface AddedSheetState {
  isOpen: boolean;
  product: Product | null;
  quantity: number;
  openSheet: (product: Product, quantity?: number) => void;
  closeSheet: () => void;
}

export const useMobileAddedSheetStore = create<AddedSheetState>((set) => ({
  isOpen: false,
  product: null,
  quantity: 1,
  openSheet: (product, quantity = 1) => set({ isOpen: true, product, quantity }),
  closeSheet: () => set({ isOpen: false, product: null }),
}));
