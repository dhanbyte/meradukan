'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  qty: number;
  price: number;
  name: string;
  image: string;
};

type CartState = {
  items: Record<string, Record<string, CartItem>>;
  add: (userId: string, item: CartItem) => void;
  remove: (userId: string, itemId: string) => void;
  clear: (userId: string) => void;
  updateQty: (userId: string, itemId: string, qty: number) => void;
  getTotal: (userId: string) => { subtotal: number; tax: number; total: number };
  getItems: (userId: string) => CartItem[];
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},

      add: (userId, item) =>
        set((state) => {
          const userCart = state.items[userId] || {};
          return {
            items: {
              ...state.items,
              [userId]: {
                ...userCart,
                [item.id]: {
                  ...item,
                  qty: (userCart[item.id]?.qty || 0) + item.qty,
                },
              },
            },
          };
        }),

      remove: (userId, itemId) =>
        set((state) => {
          const userCart = { ...state.items[userId] };
          delete userCart[itemId];
          return {
            items: {
              ...state.items,
              [userId]: userCart,
            },
          };
        }),

      clear: (userId) =>
        set((state) => ({
          items: {
            ...state.items,
            [userId]: {},
          },
        })),

      updateQty: (userId, itemId, qty) =>
        set((state) => {
          const userCart = state.items[userId] || {};
          const item = userCart[itemId];
          if (!item) return state;

          return {
            items: {
              ...state.items,
              [userId]: {
                ...userCart,
                [itemId]: {
                  ...item,
                  qty,
                },
              },
            },
          };
        }),

      getTotal: (userId) => {
        const userCart = get().items[userId] || {};
        const items = Object.values(userCart);

        const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
        const tax = subtotal * 0.18; // 18% GST
        const total = subtotal + tax;

        return { subtotal, tax, total };
      },

      getItems: (userId) => {
        const userCart = get().items[userId] || {};
        return Object.values(userCart);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);