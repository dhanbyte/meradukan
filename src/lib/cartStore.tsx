
'use client'
import { create } from 'zustand'
import type { Product } from './types'
import { useProductStore } from './productStore'

export type CartItem = Pick<Product, 'id' | 'name' | 'image'> & {
  qty: number
  price: number // This is the discounted price
}

type CartState = {
  items: CartItem[]
  subtotal: number
  totalDiscount: number
  totalShipping: number
  totalTax: number
  total: number
  init: (userId: string) => void
  add: (userId: string, item: CartItem) => void
  remove: (userId: string, id: string) => void
  setQty: (userId: string, id: string, qty: number) => void
  clear: () => void
  clearCartFromDB: (userId: string) => void
}

const calculateTotals = (items: CartItem[]) => {
  const products = useProductStore.getState().products;

  const totalDiscount = items.reduce((acc, cartItem) => {
    const product = products.find(p => p.id === cartItem.id)
    const originalPrice = product?.price.original || cartItem.price;
    const itemDiscount = (originalPrice - cartItem.price) * cartItem.qty;
    return acc + itemDiscount;
  }, 0)

  const subtotal = items.reduce((s, i) => {
     const product = products.find(p => p.id === i.id)
     const originalPrice = product?.price.original || i.price;
     return s + (i.qty * originalPrice)
  }, 0)
  
  // Calculate total weight and shipping
  const totalWeight = items.reduce((weight, item) => {
    const product = products.find(p => p.id === item.id)
    const itemWeight = product?.weight || 500 // Default 500g per item
    return weight + (itemWeight * item.qty)
  }, 0)
  
  // Shipping charges based on weight
  let totalShipping = 0
  if (totalWeight > 0) {
    if (totalWeight <= 500) {
      totalShipping = 49
    } else if (totalWeight <= 1000) {
      totalShipping = 99
    } else {
      // For every additional 500g after 1kg, add ₹49
      const extraWeight = totalWeight - 1000
      const extraCharges = Math.ceil(extraWeight / 500) * 49
      totalShipping = 99 + extraCharges
    }
  }
  
  // Platform fee 1.8% of subtotal after discount
  const itemTotal = subtotal - totalDiscount
  const platformFee = Math.round(itemTotal * 0.018)

  const total = itemTotal + totalShipping + platformFee
  return { subtotal, totalDiscount, totalShipping, totalTax: platformFee, total }
}



export const useCart = create<CartState>()((set, get) => ({
  items: [],
  subtotal: 0,
  totalDiscount: 0,
  totalShipping: 0,
  totalTax: 0,
  total: 0,
  init: async (userId: string) => {
    try {
      const response = await fetch(`/api/user-data?userId=${encodeURIComponent(userId)}&type=cart`);
      if (response.ok) {
        const serverCart = await response.json();
        if (serverCart && Array.isArray(serverCart)) {
          set({ items: serverCart, ...calculateTotals(serverCart) });
          return;
        }
      }
    } catch (error) {
      console.warn('Cart sync failed, starting with empty cart:', error);
    }
    
    set({ items: [], ...calculateTotals([]) });
  },
  add: async (userId: string, item: CartItem) => {
    const currentItems = get().items;
    const existing = currentItems.find((p) => p.id === item.id)
    
    let newItems;
    if (existing) {
      newItems = currentItems.map((p) =>
        p.id === item.id ? { ...p, qty: Math.min(99, p.qty + item.qty) } : p
      )
    } else {
      newItems = [...currentItems, { ...item, qty: Math.max(1, item.qty) }]
    }
    
    set({ items: newItems, ...calculateTotals(newItems) });
    
    try {
      await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type: 'cart', data: newItems })
      });
    } catch (error) {
      console.warn('Cart save failed:', error);
    }
  },
  remove: async (userId: string, id: string) => {
    const currentItems = get().items;
    const newItems = currentItems.filter((p) => p.id !== id);
    
    set({ items: newItems, ...calculateTotals(newItems) });
    
    try {
      await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type: 'cart', data: newItems })
      });
    } catch (error) {
      console.warn('Cart save failed:', error);
    }
  },
  setQty: async (userId: string, id: string, qty: number) => {
    const currentItems = get().items;
    const newItems = currentItems.map((p) =>
      p.id === id ? { ...p, qty: Math.max(1, Math.min(99, qty)) } : p
    );
    
    set({ items: newItems, ...calculateTotals(newItems) });
    
    try {
      await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type: 'cart', data: newItems })
      });
    } catch (error) {
      console.warn('Cart save failed:', error);
    }
  },
  clear: () => {
    set({ items: [], subtotal: 0, totalDiscount: 0, totalShipping: 0, totalTax: 0, total: 0 })
  },
  clearCartFromDB: async (userId: string) => {
    set({ items: [], subtotal: 0, totalDiscount: 0, totalShipping: 0, totalTax: 0, total: 0 });
    
    try {
      await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type: 'cart', data: [] })
      });
    } catch (error) {
      console.warn('Cart clear failed:', error);
    }
  }
}))
