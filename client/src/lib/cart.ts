import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@shared/schema';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(i => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map(i => 
                i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
              )
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(i => i.product.id !== productId)
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map(i => 
            i.product.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i
          )
        }));
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
      }
    }),
    { name: 'nairobi-apparel-cart' }
  )
);
