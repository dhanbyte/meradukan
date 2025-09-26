'use client'

import { useState } from 'react'
import { Star, ChevronRight, ShoppingCart, Heart, Share2, X, ShieldCheck, RotateCw } from 'lucide-react'

type Review = {
  id: number
  author: string
  rating: number
  title: string
  body: string
  date: string
  hasPhoto: boolean
}

type Product = {
  id: string
  name: string
  brand: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  description: string
  highlights: string[]
  specifications: {
    country: string
    dimensions: string
  }
  images: string[]
}

const mockProduct: Product = {
  id: '1',
  name: '5D HD Mobile Phone Screen Magnifier Amplifier (1 Pc / 8 Inch)',
  brand: 'PHOBIA',
  price: 49,
  originalPrice: 199,
  discount: 75,
  rating: 4.6,
  description: 'Enlarged 5D HD Mobile Phone Screen Magnifier Amplifier Movie Video Enlarger.',
  highlights: [
    'HD optical technology',
    'Comfortable and stylish',
    'Foldable and portable',
    'Simple and elegant design'
  ],
  specifications: {
    country: 'China',
    dimensions: '20cm x 14cm x 2cm'
  },
  images: ['/placeholder-product.jpg']
}

const mockReviews: Review[] = [
  {
    id: 1,
    author: 'Priya S.',
    rating: 5,
    title: 'Excellent Product!',
    body: 'I\'ve been using this for a few weeks now and I\'m very impressed. The quality is fantastic and it exceeded my expectations. Highly recommended!',
    date: '15 Aug 2023',
    hasPhoto: true
  },
  {
    id: 2,
    author: 'Amit K.',
    rating: 4,
    title: 'Good value for money',
    body: 'Overall, a great product for the price. It does exactly what it says it will do. The only minor issue was with the packaging, but the product itself is solid.',
    date: '12 Aug 2023',
    hasPhoto: true
  },
  {
    id: 3,
    author: 'Sunita M.',
    rating: 5,
    title: 'Just what I needed',
    body: 'I was looking for a product like this for a long time. It fits my needs perfectly. The delivery was quick and the customer service was helpful.',
    date: '10 Aug 2023',
    hasPhoto: false
  }
]

const relatedProducts = [
  {
    id: 1,
    name: 'Designer Mobile Holder (1Pc Only)',
    price: 9,
    originalPrice: 29,
    discount: 69,
    rating: 4.7,
    image: '/placeholder-mobile-holder.jpg'
  },
  {
    id: 2,
    name: 'Micro USB OTG to USB 2.0 (Android supported)',
    price: 9,
    originalPrice: 15,
    discount: 40,
    rating: 4.8,
    image: '/placeholder-otg.jpg'
  },
  {
    id: 3,
    name: 'Mobile Phone Holder, Mini Chair Cell Phone Stand',
    price: 29,
    originalPrice: 99,
    discount: 71,
    rating: 4.2,
    image: '/placeholder-phone-stand.jpg'
  },
  {
    id: 4,
    name: 'USB Type C to Headphone Jack Audio Connector (1 Pc)',
    price: 39,
    originalPrice: 199,
    discount: 80,
    rating: 4.7,
    image: '/placeholder-audio-adapter.jpg'
  }
]

export default function ProductDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const { toast } = useToast()
  const { user } = useAuth()
  const { add } = useCart()
  
  const [product, setProduct] = useState<Product>(mockProduct)
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'all' | 'withPhotos'>('all')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    title: '',
    body: '',
    rating: 0
  })

  const filteredReviews = activeTab === 'withPhotos' 
    ? reviews.filter(review => review.hasPhoto) 
    : reviews

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  const handleAddToCart = () => {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity
    })
    
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to leave a review.',
        variant: 'destructive'
      })
      return
    }

    if (!newReview.rating || !newReview.title || !newReview.body) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      })
      return
    }

    const review: Review = {
      id: Date.now(),
      author: user.firstName || 'Anonymous',
      rating: newReview.rating,
      title: newReview.title,
      body: newReview.body,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      hasPhoto: false
    }
    
    setReviews(prev => [review, ...prev])
    setNewReview({ title: '', body: '', rating: 0 })
    setShowReviewForm(false)
    
    toast({
      title: 'Review submitted!',
      description: 'Thank you for your feedback.'
    })
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/category/electronics" className="hover:text-gray-700">Electronics</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-400">{product.name}</span>
      </div>

      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="aspect-square relative">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="text-gray-600 mb-4">by {product.brand}</div>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
              <Star className="w-4 h-4 fill-current mr-1" />
              <span className="font-medium">{averageRating}</span>
            </div>
            <a href="#reviews" className="ml-2 text-sm text-blue-600 hover:underline">
              (View {reviews.length} reviews)
            </a>
          </div>

          <div className="mb-6">
            <span className="text-2xl font-bold">₹{product.price}</span>
            <span className="ml-2 text-gray-500 line-through">₹{product.originalPrice}</span>
            <span className="ml-2 text-green-600 font-medium">{product.discount}% off</span>
            <div className="text-sm text-gray-500">(Save ₹{product.originalPrice - product.price})</div>
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Highlights</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {product.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Specifications</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div>Country of Origin</div>
              <div>{product.specifications.country}</div>
              <div>Dimensions</div>
              <div>{product.specifications.dimensions}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border rounded-md">
              <button 
                onClick={decrementQuantity}
                className="px-3 py-1 text-xl"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button 
                onClick={incrementQuantity}
                className="px-3 py-1 text-xl"
              >
                +
              </button>
            </div>
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" className="p-2">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="p-2">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm">1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <RotateCw className="w-5 h-5" />
              <span className="text-sm">7 Days Return Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div id="reviews" className="mb-12">
        <ReviewSection />
      </div>

      {/* Related Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {relatedProducts.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm line-clamp-2 h-10 mb-1">{item.name}</h3>
                <div className="flex items-center mb-1">
                  <div className="flex items-center bg-blue-100 text-blue-800 px-1 rounded text-xs">
                    <Star className="w-3 h-3 fill-current mr-0.5" />
                    {item.rating}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-bold">₹{item.price}</span>
                  <span className="ml-2 text-xs text-gray-500 line-through">₹{item.originalPrice}</span>
                  <span className="ml-2 text-xs text-green-600">{item.discount}% off</span>
                </div>
                <Button size="sm" className="w-full mt-2 text-sm">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 
