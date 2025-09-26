import { ReviewData } from '../lib/reviewUtils';

// Mock reviews data - same for all products
const commonReviews: Omit<ReviewData, 'productId'>[] = [
  {
    _id: 'rev1',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    rating: 5,
    title: 'Excellent Product!',
    comment: 'This product exceeded my expectations. Highly recommended!',
    images: [],
    isVerifiedPurchase: true,
    status: 'approved',
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2023-09-15')
  },
  {
    _id: 'rev2',
    userId: 'user2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    rating: 4,
    title: 'Great quality',
    comment: 'Very good product, but delivery took longer than expected.',
    images: [],
    isVerifiedPurchase: true,
    status: 'approved',
    createdAt: new Date('2023-09-10'),
    updatedAt: new Date('2023-09-10')
  },
  {
    _id: 'rev3',
    userId: 'user3',
    userName: 'Alex Johnson',
    userEmail: 'alex@example.com',
    rating: 5,
    title: 'Amazing!',
    comment: 'Absolutely love this product. Will buy again!',
    images: [],
    isVerifiedPurchase: true,
    status: 'approved',
    createdAt: new Date('2023-09-18'),
    updatedAt: new Date('2023-09-18')
  }
];

// Mock reviews data - same for all products
export const mockReviews: Record<string, ReviewData[]> = {};

// Mock function to get reviews (same for all products)
export const getMockReviews = (): ReviewData[] => {
  // Return a deep copy of commonReviews for immutability
  return JSON.parse(JSON.stringify(commonReviews));
};

// Mock function to add a new review (not persisted between page refreshes)
export const addMockReview = (reviewData: Omit<ReviewData, '_id' | 'createdAt' | 'updatedAt' | 'status'>) => {
  const newReview: ReviewData = {
    ...reviewData,
    _id: `rev${Date.now()}`,
    status: 'approved',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Add to common reviews (will be lost on page refresh)
  commonReviews.unshift(newReview);
  return { success: true, data: newReview };
};
