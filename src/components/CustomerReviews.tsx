'use client'

import { useState, useEffect, useMemo } from 'react';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import type { Product } from '../lib/types';
import { ReviewData } from '../lib/reviewUtils';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { useAuth, useUser } from '@clerk/nextjs';
import { useToast } from '../hooks/use-toast';
import Image from 'next/image';
import { Star, MessageSquare, X, Plus } from 'lucide-react';

// Extend ReviewData with frontend-specific fields
interface Review extends Omit<ReviewData, 'createdAt' | 'updatedAt' | 'userName' | 'comment'> {
  _id: string;
  createdAt: string; // ISO string format
  author: string; // Alias for userName
  body: string; // Alias for comment
}

interface ReviewFormData {
  rating: number;
  title: string;
  body: string;
  images: string[];
}

// Ensure the Product type has the required id field
type ProductWithId = Product & { id: string };

// Convert ReviewData to Review format for the frontend
const convertToReview = (data: ReviewData): Review => ({
  ...data,
  _id: data._id.toString(),
  author: data.userName,
  body: data.comment,
  createdAt: new Date(data.createdAt).toISOString(),
  // Ensure all required fields from ReviewData are included
  productId: data.productId.toString(),
  userId: data.userId.toString(),
  userEmail: data.userEmail,
  rating: data.rating,
  title: data.title,
  images: data.images || [],
  isVerifiedPurchase: data.isVerifiedPurchase || false,
  status: data.status || 'approved',
});

// Star Rating Component
const StarRating = ({ rating, onRatingChange, readOnly = false }: { rating: number; onRatingChange?: (rating: number) => void; readOnly?: boolean }) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => !readOnly && onRatingChange?.(star)}
        className={`${!readOnly ? 'cursor-pointer' : 'cursor-default'} text-2xl`}
      >
        {star <= rating ? '★' : '☆'}
      </button>
    ))}
  </div>
);

interface CustomerReviewsProps {
  product: ProductWithId;
}

export default function CustomerReviews({ product }: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'with-photos'>('all');
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    title: '',
    body: '',
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  
  // Calculate average rating
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);
  
  // Filter reviews based on active tab
  const filteredReviews = useMemo(() => {
    if (activeTab === 'with-photos') {
      return reviews.filter(review => review.images && review.images.length > 0);
    }
    return reviews;
  }, [reviews, activeTab]);
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // In a real app, you would upload the images to a storage service
    // and get back the URLs to store in your database
    const uploadedImages = Array.from(files).map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedImages]
    }));
  };
  
  // Remove image from the form
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/products/${product.id}/reviews`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setReviews(data.data.map(convertToReview));
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast({
          title: 'Error',
          description: 'Failed to load reviews. Please try again later.',
          variant: 'destructive',
        });
      }
    };

    fetchReviews();
  }, [product.id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn || !userId) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to leave a review.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.title.trim() || !formData.body.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: formData.rating,
          title: formData.title,
          comment: formData.body,
          images: formData.images,
          isVerifiedPurchase: false, // Set based on actual purchase verification
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Ensure the response data has all required fields
        const reviewData: ReviewData = {
          ...data.data,
          _id: data.data._id || new mongoose.Types.ObjectId().toString(),
          productId: data.data.productId || product.id,
          userId: data.data.userId || userId,
          userName: data.data.userName || user?.firstName || 'Anonymous',
          userEmail: data.data.userEmail || user?.emailAddresses?.[0]?.emailAddress || '',
          comment: data.data.comment || formData.body,
          isVerifiedPurchase: data.data.isVerifiedPurchase || false,
          status: data.data.status || 'approved',
          createdAt: new Date(data.data.createdAt || new Date()),
          updatedAt: new Date(data.data.updatedAt || new Date()),
        };

        const newReview = convertToReview(reviewData);
        setReviews(prevReviews => [newReview, ...prevReviews]);
        setFormData({
          rating: 5,
          title: '',
          body: '',
          images: [],
        });
        setShowReviewForm(false);

        toast({
          title: 'Thank you!',
          description: 'Your review has been submitted successfully.',
        });
      } else {
        throw new Error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <Button
          onClick={() => setShowReviewForm(!showReviewForm)}
          variant="outline"
        >
          {showReviewForm ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>

      {showReviewForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <StarRating
                  rating={formData.rating}
                  onRatingChange={(rating) =>
                    setFormData(prev => ({ ...prev, rating }))
                  }
                />
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Review Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Summarize your experience"
                  required
                />
              </div>

              <div>
                <label htmlFor="body" className="block text-sm font-medium mb-2">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  rows={4}
                  placeholder="Share your experience with this product"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Add Photos (Optional)
                </label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="w-24 h-24 relative rounded-md overflow-hidden">
                        <Image
                          src={image}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black/90 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {formData.images.length < 5 && (
                    <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                      <Plus className="w-6 h-6 text-gray-400" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  You can upload up to 5 images (max 5MB each)
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="text-4xl font-bold mr-4">{averageRating}</div>
            <div>
              <div className="flex">
                <StarRating rating={Math.round(Number(averageRating))} readOnly />
              </div>
              <div className="text-sm text-gray-500">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                activeTab === 'with-photos' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab('with-photos')}
            >
              With Photos ({reviews.filter(r => r.images?.length > 0).length})
            </button>
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p className="text-gray-500 mb-4">Be the first to review this product</p>
            <Button onClick={() => setShowReviewForm(true)}>
              Write a Review
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{review.author}</h4>
                      <div className="flex items-center">
                        <StarRating rating={review.rating} readOnly />
                        <div className="text-sm text-gray-500 mb-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h5 className="font-medium text-lg mt-2">{review.title}</h5>
                  <p className="text-gray-700 mt-1">{review.body}</p>
                  
                  {review.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {review.images.map((img, idx) => (
                        <div key={idx} className="w-20 h-20 relative rounded-md overflow-hidden">
                          <Image
                            src={img}
                            alt={`Review image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
