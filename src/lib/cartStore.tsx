
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
  
  // Separate items by category
  const ayurvedicItems = items.filter(item => {
    const product = products.find(p => p.id === item.id)
    return product?.category === 'Ayurvedic'
  })
  const homeTechItems = items.filter(item => {
    const product = products.find(p => p.id === item.id)
    return product?.category === 'Home' || product?.category === 'Tech' || product?.category === 'New Arrivals'
  })
  
  let totalShipping = 0;
  
  // Calculate shipping for Ayurvedic products (keep existing logic)
  if (ayurvedicItems.length > 0) {
    const ayurvedicQty = ayurvedicItems.reduce((acc, item) => acc + item.qty, 0)
    
    if (ayurvedicQty <= 2) {
      totalShipping += 45
    } else if (ayurvedicQty <= 8) {
      totalShipping += 65
    } else {
      totalShipping += 100
      const remainingItems = ayurvedicQty - 8
      totalShipping += Math.ceil(remainingItems / 5) * 35
    }
  }
  
  // Calculate shipping for Home & Tech products (New Arrivals included)
  if (homeTechItems.length > 0) {
    const homeTechQty = homeTechItems.reduce((acc, item) => acc + item.qty, 0)
    
    if (ayurvedicItems.length > 0) {
      // Mixed cart: only ₹22 for Home & Tech
      totalShipping += 22
    } else {
      // Only Home & Tech: ₹49 for first product, ₹2 for each additional after 5 products
      if (homeTechQty === 1) {
        totalShipping += 49
      } else if (homeTechQty <= 5) {
        totalShipping += 49
      } else {
        totalShipping += 49 + ((homeTechQty - 5) * 2)
      }
    }
  }

  // Platform fee instead of tax (max ₹15)
  const platformFee = Math.min(15, subtotal * 0.02) // 2% platform fee, capped at ₹15

  const total = (subtotal - totalDiscount) + totalShipping + platformFee
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
