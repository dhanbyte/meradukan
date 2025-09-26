'use client'
import { useState, useEffect, useRef } from 'react'
import type { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/ClerkAuthContext'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { Star, MessageSquare, User, X, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data
const mockReviews = [
  {
    id: 1,
    author: "Priya S.",
    rating: 5,
    title: "Excellent Product!",
    body: "I've been using this for a few weeks now and I'm very impressed. The quality is fantastic and it exceeded my expectations. Highly recommended!",
    date: "2023-08-15",
    image: "/reviews/review-1.jpg"
  },
  {
    id: 2,
    author: "Amit K.",
    rating: 4,
    title: "Good value for money",
    body: "Overall, a great product for the price. It does exactly what it says it will do. The only minor issue was with the packaging, but the product itself is solid.",
    date: "2023-08-12",
    image: null
  },
  {
    id: 3,
    author: "Sunita M.",
    rating: 5,
    title: "Just what I needed",
    body: "I was looking for a product like this for a long time. It fits my needs perfectly. The delivery was quick and the customer service was helpful.",
    date: "2023-08-10",
    image: "/reviews/review-2.jpg"
  }
]

// Star Rating Component
const StarRating = ({ 
  rating, 
  setRating, 
  readOnly = false 
}: { 
  rating: number, 
  setRating?: (rating: number) => void, 
  readOnly?: boolean 
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && setRating?.(star)}
          className={cn(
            'focus:outline-none',
            readOnly ? 'cursor-default' : 'cursor-pointer'
          )}
          disabled={readOnly}
        >
          <Star 
            className={cn(
              'w-5 h-5',
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            )} 
          />
        </button>
      ))}
    </div>
  )
}

// Review Card Component
const ReviewCard = ({ review }: { review: typeof mockReviews[0] }) => {
  const [expanded, setExpanded] = useState(false)
  const maxLength = 200
  const shouldTruncate = review.body.length > maxLength
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <User className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">{review.author}</h4>
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">{review.date}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <h3 className="font-medium text-gray-900 mb-1">{review.title}</h3>
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
        
        {review.image && (
          <div className="mt-3">
            <div className="w-24 h-24 relative rounded-md overflow-hidden border border-gray-200">
              <Image
                src={review.image}
                alt="Review"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Main Component
export default function CustomerReviews({ product }: { product: Product }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [reviews, setReviews] = useState(mockReviews)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'withPhotos'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredReviews = activeTab === 'withPhotos' 
    ? reviews.filter(review => review.image) 
    : reviews

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    
    const files = Array.from(e.target.files)
    if (files.length + imagePreviews.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload up to 5 images per review.",
        variant: "destructive"
      })
      return
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setSelectedImages(prev => [...prev, ...newImages.map(img => img.file)])
    setImagePreviews(prev => [...prev, ...newImages.map(img => img.preview)])
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index])
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to submit a review.",
        variant: "destructive"
      })
      return
    }

    if (!rating || !title || !body) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('rating', rating.toString())
      formData.append('title', title)
      formData.append('body', body)
      formData.append('productId', product.id)
      
      selectedImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image)
      })

      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to submit review')
      
      const newReview = await response.json()
      setReviews(prev => [newReview, ...prev])
      
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      })
      
      // Reset form
      setShowForm(false)
      setRating(0)
      setTitle('')
      setBody('')
      setSelectedImages([])
      setImagePreviews([])
      
    } catch (error) {
      console.error('Error submitting review:', error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [imagePreviews])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mobile View */}
      <div className="md:hidden space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <Button 
            onClick={() => setShowForm(true)}
            className="shrink-0 ml-4"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Write Review
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 overflow-x-auto pb-1 scrollbar-hide">
          <button
            className={cn(
              'px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2',
              activeTab === 'all' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
            onClick={() => setActiveTab('all')}
          >
            All Reviews
          </button>
          <button
            className={cn(
              'px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2',
              activeTab === 'withPhotos' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
            onClick={() => setActiveTab('withPhotos')}
          >
            With Photos
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.slice(0, 3).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {filteredReviews.length > 3 && (
          <Button variant="outline" className="w-full">
            Load More Reviews
          </Button>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Write Review */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-6">
                    Share your experience to help other customers make better choices
                  </p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="w-full"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Reviews List */}
          <div className="w-full md:w-2/3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Reviews
                <span className="text-gray-500 text-base font-normal ml-2">({reviews.length})</span>
              </h2>
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="most-recent"
                >
                  <option value="most-recent">Most Recent</option>
                  <option value="highest-rated">Highest Rated</option>
                  <option value="lowest-rated">Lowest Rated</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-gray-200 mb-6">
              <button
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 -mb-px',
                  activeTab === 'all' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
                onClick={() => setActiveTab('all')}
              >
                All Reviews
              </button>
              <button
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 -mb-px',
                  activeTab === 'withPhotos' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
                onClick={() => setActiveTab('withPhotos')}
              >
                With Photos
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-3 text-base font-medium text-gray-900">No reviews yet</h3>
                  <p className="mt-1 text-sm text-gray-500 mb-4">Be the first to review this product</p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="px-5 py-2.5 text-sm"
                  >
                    Write a Review
                  </Button>
                </div>
              ) : (
                <>
                  {filteredReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                  
                  {filteredReviews.length > 3 && (
                    <div className="flex justify-center pt-2">
                      <Button 
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Load More Reviews
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => {
                setShowForm(false)
                // Clean up object URLs to prevent memory leaks
                imagePreviews.forEach(url => URL.revokeObjectURL(url))
                setImagePreviews([])
                setSelectedImages([])
              }}
            />
            <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="pb-4 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Write a Review</CardTitle>
                  <button 
                    onClick={() => {
                      setShowForm(false)
                      // Clean up object URLs to prevent memory leaks
                      imagePreviews.forEach(url => URL.revokeObjectURL(url))
                      setImagePreviews([])
                      setSelectedImages([])
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={(e) => {
                  e.preventDefault()
                  submitReview()
                }}>
                  <div className="space-y-6">
                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating <span className="text-red-500">*</span>
                      </label>
                      <StarRating rating={rating} setRating={setRating} />
                    </div>

                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Review Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Summarize your experience"
                        className="bg-white"
                        required
                      />
                    </div>

                    {/* Review Text */}
                    <div>
                      <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        id="review"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={4}
                        placeholder="Share details about your experience with this product"
                        className="bg-white min-h-[120px]"
                        required
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Photos (Optional)
                      </label>
                      <div className="mt-1 flex flex-wrap gap-3">
                        {/* Image Previews */}
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border border-gray-200 bg-gray-100">
                              <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 80px, 96px"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                              disabled={loading}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        
                        {/* Upload Button */}
                        {imagePreviews.length < 5 && (
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md bg-white cursor-pointer hover:border-blue-500 transition-colors"
                          >
                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500 text-center px-1">
                              Add Photo
                            </span>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={loading || imagePreviews.length >= 5}
                            />
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {imagePreviews.length}/5 photos (max 5MB each)
                      </p>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowForm(false)
                          // Clean up object URLs
                          imagePreviews.forEach(url => URL.revokeObjectURL(url))
                          setImagePreviews([])
                          setSelectedImages([])
                        }}
                        disabled={loading}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading || !rating || !title || !body}
                        className="w-full sm:w-auto"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : 'Submit Review'}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
