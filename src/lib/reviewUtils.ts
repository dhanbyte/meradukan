import { getMockReviews, addMockReview } from '../data/mockReviews';
import type { ObjectId } from 'mongodb';

export interface ReviewData {
  _id: string;
  productId: string | ObjectId;
  userId: string | ObjectId;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export async function getProductReviews(_productId?: string): Promise<ReviewData[]> {
  try {
    // Return the same reviews for all products
    return getMockReviews();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function addProductReview(reviewData: Omit<ReviewData, '_id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<{ success: boolean; error?: string }> {
  try {
    // Use mock data (note: won't persist between page refreshes)
    addMockReview(reviewData);
    return { success: true };
  } catch (error) {
    console.error('Error adding review:', error);
    return { success: false, error: 'Failed to add review' };
  }
}

// This function is no longer needed since we're not tracking ratings per product
async function updateProductRating(productId: string) {
  // No-op
  return;
}
