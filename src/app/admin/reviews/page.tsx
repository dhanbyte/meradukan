'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const mockReviews = [
    {
      id: '1',
      productName: 'Wireless Bluetooth Earbuds',
      customerName: 'John Doe',
      rating: 5,
      comment: 'Excellent sound quality and battery life. Highly recommended!',
      date: '2024-01-15',
      status: 'approved'
    },
    {
      id: '2',
      productName: 'Smart Fitness Tracker',
      customerName: 'Jane Smith',
      rating: 4,
      comment: 'Good product but could have better app integration.',
      date: '2024-01-14',
      status: 'pending'
    }
  ]

  useEffect(() => {
    setReviews(mockReviews)
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reviews & Ratings</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="divide-y divide-gray-200">
          {reviews.map((review: any) => (
            <div key={review.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">{review.productName}</h3>
                  <p className="text-sm text-gray-500">by {review.customerName}</p>
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              <p className="text-gray-700 mb-4">{review.comment}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{review.date}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  review.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {review.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}