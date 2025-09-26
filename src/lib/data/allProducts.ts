import { HOME_PRODUCTS } from './home';
import { TECH_PRODUCTS } from './tech';
import type { Product } from '../types';

export async function getAllProducts(): Promise<Product[]> {
  return [...HOME_PRODUCTS, ...TECH_PRODUCTS];
}

export async function getHomeProducts(): Promise<Product[]> {
  if (HOME_PRODUCTS.length === 0) {
    return TECH_PRODUCTS.slice(0, 8);
  }
  return HOME_PRODUCTS;
}

export async function getTechProducts(): Promise<Product[]> {
  if (TECH_PRODUCTS.length === 0) {
    return HOME_PRODUCTS.slice(0, 8);
  }
  return TECH_PRODUCTS;
}