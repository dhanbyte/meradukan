'use client';
import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/ClerkAuthContext';
import Image from 'next/image';

interface Review {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewSectionProps {
  productId?: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
    images: [] as string[]
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?status=approved');
      const data = await response.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to submit a review',
        variant: 'destructive'
      });
      return;
    }

    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.firstName + ' ' + user.lastName,
          userEmail: user.emailAddresses[0]?.emailAddress,
          rating: reviewForm.rating,
          title: reviewForm.title.trim(),
          comment: reviewForm.comment.trim(),
          images: reviewForm.images
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Review Submitted!',
          description: 'Your review has been submitted and will be visible soon.',
        });

        // Reset form and hide it
        setReviewForm({
          rating: 5,
          title: '',
          comment: '',
          images: []
        });
        setShowAddReview(false);

        // Refresh reviews
        fetchReviews();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to submit review',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange && onChange(star)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-transform`}
          >
            <Star
              size={interactive ? 20 : 16}
              className={`${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold">{calculateAverageRating()}</span>
            {renderStars(parseFloat(calculateAverageRating()))}
            <span className="text-gray-600">({reviews.length} reviews)</span>
          </div>
        </div>

        <Button
          onClick={() => setShowAddReview(!showAddReview)}
          variant={showAddReview ? "outline" : "default"}
          className="flex items-center gap-2"
        >
          <MessageCircle size={16} />
          {showAddReview ? 'Cancel' : 'Write Review'}
        </Button>
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h4 className="font-semibold mb-4">Write Your Review</h4>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating *</label>
              <div className="flex items-center gap-2">
                {renderStars(reviewForm.rating, true, (rating) =>
                  setReviewForm(prev => ({ ...prev, rating }))
                )}
                <span className="text-sm text-gray-600 ml-2">
                  {reviewForm.rating} out of 5 stars
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Review Title *</label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={100}
                required
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Review *</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Tell others about your experience with our products..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={2000}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {reviewForm.comment.length}/2000 characters
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddReview(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !reviewForm.title.trim() || !reviewForm.comment.trim()}
                className="flex items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No reviews yet. Be the first to review our products!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white border rounded-lg p-6 space-y-4">
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{review.userName}</div>
                    <div className="text-sm text-gray-500">{review.userEmail}</div>
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(review.rating)}
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {review.images.map((image, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Review image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <ThumbsUp size={16} />
                  <span className="text-sm">Helpful</span>
                </button>
                {review.isVerifiedPurchase && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
