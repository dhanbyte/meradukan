
'use client'
import { create } from 'zustand'
import type { Product } from './types'
import { HOME_PRODUCTS } from './data/home'
import { TECH_PRODUCTS } from './data/tech'
import { NEWARRIVALS_PRODUCTS } from './data/newarrivals'



type ProductState = {
  products: Product[]
  isLoading: boolean
  initialized: boolean
  init: () => Promise<void>
  getProduct: (id: string) => Product | undefined
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>
  deleteProduct: (id: string) => Promise<boolean>
  searchProducts: (query: string) => Promise<Product[]>
  getProductsByCategory: (category: string) => Promise<Product[]>
  refetch: () => Promise<void>
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  isLoading: true,
  initialized: false,
  
  init: async () => {
    if (get().initialized) {
      console.log('ProductStore already initialized');
      return;
    }
    
    set({ isLoading: true });
    console.log('Initializing ProductStore...');
    
    try {
      // Always include JSON products
      const jsonProducts = [...TECH_PRODUCTS, ...HOME_PRODUCTS, ...NEWARRIVALS_PRODUCTS];
      console.log('JSON products loaded:', jsonProducts.length);
      
      // Try to fetch from API with proper error handling
      let apiProducts = [];
      
      try {
        console.log('Fetching from /api/products...');
        const productsResponse = await fetch('/api/products');
        console.log('API response status:', productsResponse.status);
        
        if (productsResponse.ok) {
          const generalData = await productsResponse.json();
          console.log('API response data:', generalData);
          const generalProducts = generalData.data || generalData;
          if (Array.isArray(generalProducts)) {
            // Filter out Ayurvedic products and related categories
            const filteredProducts = generalProducts.filter(product => {
              const excludedCategories = ['Ayurvedic', 'Food & Drinks', 'Healthy Juice', 'Dhoop', 'Pooja'];
              const excludedKeywords = ['ayurvedic', 'sharbat', 'juice', 'dhoop', 'pooja'];
              
              return !excludedCategories.includes(product.category) &&
                     !excludedCategories.includes(product.subcategory) &&
                     !excludedKeywords.some(keyword => product.name?.toLowerCase().includes(keyword));
            });
            const transformedProducts = filteredProducts.map(product => ({
              ...product,
              id: product.id || product._id,
              shortDescription: product.description?.substring(0, 100) + '...' || '',
              // Ensure required fields exist
              extraImages: product.extraImages || [],
              features: product.features || [],
              specifications: product.specifications || {},
              ratings: product.ratings || { average: 0, count: 0 }
            }));
            apiProducts = [...apiProducts, ...transformedProducts];
            console.log('Fetched', transformedProducts.length, 'general products from API (Ayurvedic filtered out)');
          }
        } else {
          console.warn('API /api/products failed with status:', productsResponse.status);
        }
      } catch (apiError) {
        console.error('Error fetching from /api/products:', apiError);
      }
      
      // Try to fetch tech products
      try {
        const techResponse = await fetch('/api/products/tech');
        if (techResponse.ok) {
          const techData = await techResponse.json();
          const techProducts = techData.data || techData;
          if (Array.isArray(techProducts)) {
            // Filter out Ayurvedic and related categories from tech API
            const filteredTechProducts = techProducts.filter(product => {
              const excludedCategories = ['Ayurvedic', 'Food & Drinks', 'Healthy Juice', 'Dhoop', 'Pooja'];
              const excludedKeywords = ['ayurvedic', 'sharbat', 'juice', 'dhoop', 'pooja'];
              
              return !excludedCategories.includes(product.category) &&
                     !excludedCategories.includes(product.subcategory) &&
                     !excludedKeywords.some(keyword => product.name?.toLowerCase().includes(keyword));
            });
            apiProducts = [...apiProducts, ...filteredTechProducts];
            console.log('Fetched', filteredTechProducts.length, 'tech products from API');
          }
        }
      } catch (techError) {
        console.error('Error fetching tech products:', techError);
      }
      
      // Try to fetch home products
      try {
        const homeResponse = await fetch('/api/products/home');
        if (homeResponse.ok) {
          const homeData = await homeResponse.json();
          const homeProducts = homeData.data || homeData;
          if (Array.isArray(homeProducts)) {
            // Filter out Ayurvedic and related categories from home API
            const filteredHomeProducts = homeProducts.filter(product => {
              const excludedCategories = ['Ayurvedic', 'Food & Drinks', 'Healthy Juice', 'Dhoop', 'Pooja'];
              const excludedKeywords = ['ayurvedic', 'sharbat', 'juice', 'dhoop', 'pooja'];
              
              return !excludedCategories.includes(product.category) &&
                     !excludedCategories.includes(product.subcategory) &&
                     !excludedKeywords.some(keyword => product.name?.toLowerCase().includes(keyword));
            });
            apiProducts = [...apiProducts, ...filteredHomeProducts];
            console.log('Fetched', filteredHomeProducts.length, 'home products from API');
          }
        }
      } catch (homeError) {
        console.error('Error fetching home products:', homeError);
      }

      
      // Combine API and JSON products
      const allProducts = [...apiProducts, ...jsonProducts];
      console.log('ProductStore initialized with', apiProducts.length, 'API products +', jsonProducts.length, 'JSON products =', allProducts.length, 'total products');
      set({ products: allProducts, isLoading: false, initialized: true });
      
    } catch (error) {
      console.error("Error loading products from API:", error);
      // Use only JSON products if API fails
      const jsonProducts = [...TECH_PRODUCTS, ...HOME_PRODUCTS, ...NEWARRIVALS_PRODUCTS];
      set({ products: jsonProducts, isLoading: false, initialized: true });
      console.log('ProductStore initialized with', jsonProducts.length, 'JSON products only (API failed)');
    }
  },

  getProduct: (id: string) => {
    return get().products.find(product => product.id === id);
  },

  addProduct: async (productData) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      
      // Transform the data to match the API expected format
      const apiProductData = {
        name: productData.name,
        slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: productData.description || '',
        price: {
          original: Number(productData.price_original) || 0,
          currency: productData.price_currency || '₹'
        },
        category: productData.category || 'Pooja',
        subcategory: productData.subcategory || 'Aasan and Mala',
        image: productData.extraImages?.[0] || '/images/placeholder.jpg',
        extraImages: productData.extraImages || [],
        features: productData.features || [],
        ratings: { 
          average: Number(productData.ratings_average) || 0, 
          count: Number(productData.ratings_count) || 0 
        },
        brand: productData.brand || '',
        quantity: Number(productData.quantity) || 0
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiProductData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add product');
      }

      const result = await response.json();
      const newProduct = result.data;
      
      if (newProduct) {
        // Update local state with the new product
        const currentProducts = get().products;
        const updatedProducts = [...currentProducts, newProduct];
        set({ products: updatedProducts });
      }
      
      return newProduct;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }
      
      const result = await response.json();
      const updatedProduct = result.data;
      
      if (updatedProduct) {
        const currentProducts = get().products;
        const updatedProducts = currentProducts.map(product => 
          product.id === id ? updatedProduct : product
        );
        set({ products: updatedProducts });
      }
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }
      
      const currentProducts = get().products;
      const filteredProducts = currentProducts.filter(product => product.id !== id);
      set({ products: filteredProducts });
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  },

  searchProducts: async (query: string) => {
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
      if (response.ok) {
        const result = await response.json();
        return Array.isArray(result) ? result : [];
      }
      return [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  },

  getProductsByCategory: async (category: string) => {
    try {
      const response = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
      if (response.ok) {
        const result = await response.json();
        return Array.isArray(result) ? result : [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  },

  refetch: async () => {
    set({ isLoading: true, initialized: false });
    await get().init();
  },
}));

// Initialize the store immediately
useProductStore.getState().init();
