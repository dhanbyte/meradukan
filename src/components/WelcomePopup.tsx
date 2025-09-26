'use client'

import { useState, useEffect } from 'react'
import { X, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/ClerkAuthContext'
import { useToast } from '@/hooks/use-toast'

export default function WelcomePopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const checkUserAndShowPopup = async () => {
      if (!user || claimed) return
      
      try {
        // Check if user already has coins in database (existing user)
        const response = await fetch(`/api/user-data?userId=${user.id}&type=coins`)
        if (response.ok) {
          const coins = await response.json()
          
          // If user already has coins data, they're not new
          if (coins !== null && coins !== undefined) {
            return // Don't show popup for existing users
          }
        }
        
        // Check localStorage to prevent showing again
        const hasSeenPopup = localStorage.getItem(`welcomePopup_${user.id}`)
        if (hasSeenPopup) return
        
        // Show popup for new users after 2 seconds
        const timer = setTimeout(() => {
          setShowPopup(true)
        }, 2000)
        
        return () => clearTimeout(timer)
      } catch (error) {
        console.error('Error checking user status:', error)
      }
    }
    
    checkUserAndShowPopup()
  }, [user, claimed])

  const handleClaimCoins = async () => {
    if (!user) return

    try {
      // Give user 5 coins
      await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          type: 'coins', 
          data: 5 
        })
      })

      setClaimed(true)
      setShowPopup(false)
      localStorage.setItem(`welcomePopup_${user.id}`, 'true')
      
      toast({
        title: '🎉 Welcome Bonus Claimed!',
        description: '5 coins added! Use them for instant discounts on checkout.',
      })
    } catch (error) {
      console.error('Error claiming coins:', error)
      toast({
        title: 'Error',
        description: 'Failed to claim coins. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleClose = () => {
    setShowPopup(false)
    if (user) {
      localStorage.setItem(`welcomePopup_${user.id}`, 'true')
    }
  }

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to ShopWave! 🎉
          </h2>
          <p className="text-white/90 text-sm">
            Get started with your shopping journey
          </p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
              <div className="text-3xl font-bold text-yellow-600">5</div>
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white ml-1">
                ₹
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Get FREE 5 Coins!
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Use these coins to get instant discounts on your orders. 
              <br />
              <span className="font-medium">1 Coin = ₹1 Discount</span>
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleClaimCoins}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🎁 Claim Now
            </Button>
            
            <button
              onClick={handleClose}
              className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
      </div>
    </div>
  )
}