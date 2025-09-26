'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/ClerkAuthContext'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { Star, MessageSquare, X, User } from 'lucide-react'

interface Review {
  _id?: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  approved: boolean;
}

const StarRating = React.memo(({ 
  rating, 
  setRating, 
  readOnly = false 
}: { 
  rating: number, 
  setRating?: (rating: number) => void, 
  readOnly?: boolean 
}) => {
  // Generate a unique ID for this component instance
  const componentId = React.useMemo(() => Math.random().toString(36).substr(2, 9), []);
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        // Create a unique key using component ID, star number, and current rating
        const uniqueKey = `star-${componentId}-${star}-${rating}`;
        
        return (
          <button
            key={uniqueKey}
            type="button"
            onClick={() => !readOnly && setRating?.(star)}
            className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-500 transition-colors`}
            disabled={readOnly}
            aria-label={`Rate ${star} out of 5`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
});

// Add display name for better debugging
StarRating.displayName = 'StarRating';

const ReviewCard = ({ review }: { review: Review }) => {
  const [expanded, setExpanded] = useState(false)
  const maxLength = 200
  const shouldTruncate = review.body.length > maxLength
  const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <User className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">{review.userName}</h4>
              <div className="flex items-center">
                <StarRating rating={review.rating} readOnly />
                <span className="text-xs text-gray-500 ml-2">{reviewDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <h3 className="font-medium text-gray-900 mb-2">{review.title}</h3>
        <p className="text-sm text-gray-600">
          {shouldTruncate && !expanded ? (
            <>
              {review.body.substring(0, maxLength)}...
              <button 
                onClick={() => setExpanded(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-1"
              >
                Read more
              </button>
            </>
          ) : (
            <>
              {review.body}
              {shouldTruncate && (
                <button 
                  onClick={() => setExpanded(false)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-1"
                >
                  Show less
                </button>
              )}
            </>
          )}
        </p>
      </CardContent>
    </Card>
  )
}

export default function CustomerReviews({ product }: { product: Product }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [product.id])

  const fetchReviews = async () => {
    try {
      setFetchLoading(true)
      const response = await fetch(`/api/reviews?productId=${product.id}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      } else {
        throw new Error('Failed to fetch reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive'
      })
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to submit a review',
        variant: 'destructive'
      })
      return
    }

    if (!rating || !title.trim() || !body.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    if (rating < 1 || rating > 5) {
      toast({
        title: 'Invalid rating',
        description: 'Please select a rating between 1 and 5 stars',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      const reviewData = {
        productId: product.id,
        userId: user.id,
        userName: user.fullName || user.firstName || 'Anonymous User',
        rating,
        title: title.trim(),
        body: body.trim()
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit review')
      }
      
      // Reset form
      setRating(0)
      setTitle('')
      setBody('')
      setShowForm(false)
      
      // Refresh reviews
      await fetchReviews()
      
      toast({
        title: 'Review submitted!',
        description: 'Thank you for your feedback!',
      })
    } catch (error) {
      console.error('Error submitting review:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit review. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
    : 0

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => {
              // Create a unique key for each skeleton using index and timestamp
              const skeletonKey = `skeleton-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
              return (
                <div key={skeletonKey} className="h-32 bg-gray-200 rounded"></div>
              );
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Write a Review
        </Button>
      </div>

      {/* Average Rating */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex items-center">
            <div className="text-5xl font-bold mr-4">{averageRating.toFixed(1)}</div>
            <div>
              <StarRating rating={Math.round(averageRating)} readOnly />
              <p className="text-sm text-gray-600 mt-1">
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Write a Review</CardTitle>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Rating <span className="text-red-500">*</span>
                  </label>
                  <StarRating rating={rating} setRating={setRating} />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Review Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's most important to know?"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="review"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="What did you like or dislike? What did you use this product for?"
                    rows={4}
                    className="w-full"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading || !rating || !title.trim() || !body.trim()}>
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => {
            // Create a more stable key using review ID, user ID, and timestamp
            const reviewKey = `review-${review._id || 'new'}-${review.userId}-${review.createdAt || Date.now()}`;
            return (
              <ReviewCard 
                key={reviewKey}
                review={review} 
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
          <p className="mt-1 text-sm text-gray-500">Be the first to review this product!</p>
          <div className="mt-6">
            <Button onClick={() => setShowForm(true)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Write a Review
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}