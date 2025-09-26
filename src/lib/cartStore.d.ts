import { CartItem } from './cartStore';

declare module '@/lib/cartStore' {
  export const useCart: () => {
    items: Record<string, CartItem>;
    add: (userId: string, item: CartItem) => void;
    remove: (userId: string, itemId: string) => void;
    clear: (userId: string) => void;
    updateQty: (userId: string, itemId: string, qty: number) => void;
    getTotal: (userId: string) => { subtotal: number; tax: number; total: number };
    getItems: (userId: string) => CartItem[];
  };
}
