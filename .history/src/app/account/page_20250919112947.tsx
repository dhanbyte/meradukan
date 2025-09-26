
'use client'
import { useState, useEffect } from 'react'
import React from 'react'
import { User, Package, Heart, MapPin, LifeBuoy, LogOut, ChevronRight, Edit, Gift, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AddressManager from '@/components/AddressManager'
import ReferralManager from '@/components/ReferralManager'
import { useOrders } from '../../lib/ordersStore'
import { useWishlist } from '../../lib/wishlistStore'
import { useAuth } from '@/context/ClerkAuthContext'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import LoadingSpinner from '@/components/LoadingSpinner'
import { referralService } from '@/lib/referralService'
import LuckCard from '@/components/LuckCard'
import CoinsSection from '@/components/CoinsSection'

const accountSections = {
  DASHBOARD: 'DASHBOARD',
  ADDRESSES: 'ADDRESSES',
  EDIT_PROFILE: 'EDIT_PROFILE',
  REFERRALS: 'REFERRALS',
  COINS: 'COINS',
}

const AuthForm = () => {
    return (
        <div className="mx-auto max-w-sm card p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Login or Sign Up</h1>
            <p className="text-sm text-gray-500 mb-4">Choose an option to continue</p>
            <div className="space-y-4">
                <SignInButton mode="modal">
                    <Button className="w-full">
                        Sign In
                    </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                    <Button variant="outline" className="w-full">
                        Sign Up
                    </Button>
                </SignUpButton>
            </div>
        </div>
    );
};

const EditProfileSection = ({ onBack }: { onBack: () => void }) => {
    const { user, updateUserProfile } = useAuth();
    const [fullName, setFullName] = useState(user?.fullName || '');
    const { toast } = useToast();

    const handleSave = async () => {
        if (!fullName.trim()) {
            toast({ title: "Name Required", description: "Please enter your full name.", variant: "destructive" });
            return;
        }
        await updateUserProfile({ fullName });
        toast({ title: "Profile Updated!", description: "Your name has been updated successfully." });
        onBack();
    };

    return (
        <div className="card p-6">
             <button onClick={onBack} className="text-sm text-brand font-semibold mb-4">&larr; Back to Account</button>
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
                 <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm mt-1"
                    />
                </div>
                <Button onClick={handleSave} className="w-full">
                    Save Changes
                </Button>
            </div>
        </div>
    );
};


export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const [activeSection, setActiveSection] = useState(accountSections.DASHBOARD)
  const [referralStats, setReferralStats] = useState({ totalEarned: 0, totalReferrals: 0 })
  const { hasNewOrder, orders } = useOrders()
  const { hasNewItem } = useWishlist()
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [userCoins, setUserCoins] = useState(5)
  const [usedScratchCards, setUsedScratchCards] = useState<string[]>([])
  const [usedSpins, setUsedSpins] = useState<string[]>([])

  useEffect(() => {
    const loadReferralStats = async () => {
      if (!user?.id) return
      try {
        const stats = await referralService.getReferralStats(user.id)
        setReferralStats({
          totalEarned: stats?.totalEarned || 0,
          totalReferrals: stats?.totalReferrals || 0
        })
      } catch (error) {
        console.error('Error loading referral stats:', error)
      } finally {
        setIsLoadingStats(false)
      }
    }
    
    loadReferralStats()
  }, [user?.id])

  // Fetch user coins and used scratch cards
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return
      
      try {
        // Get coins
        const coinsResponse = await fetch(`/api/user-data?userId=${user.id}&type=coins`)
        if (coinsResponse.ok) {
          const coins = await coinsResponse.json()
          setUserCoins(coins || 5)
        }
        
        // Get used scratch cards
        const scratchResponse = await fetch(`/api/user-data?userId=${user.id}&type=scratchCards`)
        if (scratchResponse.ok) {
          const used = await scratchResponse.json()
          setUsedScratchCards(used || [])
        }
        
        // Get used spins
        const spinsResponse = await fetch(`/api/user-data?userId=${user.id}&type=usedSpins`)
        if (spinsResponse.ok) {
          const usedSpinsList = await spinsResponse.json()
          setUsedSpins(usedSpinsList || [])
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    
    fetchUserData()
  }, [user?.id])
  
  if (loading) {
    return <div className="flex justify-center py-10"><LoadingSpinner /></div>
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case accountSections.ADDRESSES:
        return <AddressManager onBack={() => setActiveSection(accountSections.DASHBOARD)} />
      case accountSections.EDIT_PROFILE:
        return <EditProfileSection onBack={() => setActiveSection(accountSections.DASHBOARD)} />
      case accountSections.REFERRALS:
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button 
                onClick={() => setActiveSection(accountSections.DASHBOARD)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Back to dashboard"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
              <h2 className="text-xl font-bold">Referral Program</h2>
            </div>
            <ReferralManager />
          </div>
        )
      case accountSections.COINS:
        return (
          <CoinsSection 
            onBack={() => setActiveSection(accountSections.DASHBOARD)} 
            userCoins={userCoins} 
            onCoinsUpdate={setUserCoins}
            orders={orders || []}
            usedSpins={usedSpins}
            referralEarnings={referralStats.totalEarned}
            onSpinUsed={(orderId) => {
              const newUsedSpins = [...usedSpins, orderId]
              setUsedSpins(newUsedSpins)
              fetch('/api/user-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id, type: 'usedSpins', data: newUsedSpins })
              })
            }}
          />
        )
      case accountSections.DASHBOARD:
      default:
        return (
          <div>
            <div className="card p-4 md:p-6 mb-6">
                <div className="flex items-center gap-4">
                    <UserButton afterSignOutUrl="/" />
                    <div>
                        <h2 className="text-xl font-bold">{user.fullName || 'Welcome!'}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <DashboardCard icon={Package} title="My Orders" href="/orders" hasNotification={hasNewOrder} />
                <DashboardCard icon={Heart} title="Wishlist" href="/wishlist" hasNotification={hasNewItem} />
                <DashboardCard icon={MapPin} title="My Addresses" onClick={() => setActiveSection(accountSections.ADDRESSES)} />
                <DashboardCard 
                  icon={Gift} 
                  title="Referrals" 
                  subtitle={!isLoadingStats ? `${referralStats.totalReferrals} friends joined` : 'Loading...'}
                  onClick={() => setActiveSection(accountSections.REFERRALS)} 
                />
                <DashboardCard icon={Edit} title="Edit Profile" onClick={() => setActiveSection(accountSections.EDIT_PROFILE)} />
                <DashboardCard 
                  icon={() => <span className="text-xl">🪙</span>} 
                  title="My Coins" 
                  subtitle={`${userCoins} coins available`}
                  onClick={() => setActiveSection(accountSections.COINS)} 
                />
            </div>

            {/* Coins & Try Your Luck Card */}
            {orders && orders.length > 0 && (
              <div className="mb-6">
                <LuckCard 
                  userCoins={userCoins}
                  orders={orders}
                  usedScratchCards={usedScratchCards}
                  onScratchWin={(wonCoins, orderId) => {
                    const newCoins = userCoins + wonCoins
                    setUserCoins(newCoins)
                    const newUsedCards = [...usedScratchCards, orderId]
                    setUsedScratchCards(newUsedCards)
                    
                    // Update database
                    fetch('/api/user-data', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: user?.id, type: 'coins', data: newCoins })
                    })
                    fetch('/api/user-data', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: user?.id, type: 'scratchCards', data: newUsedCards })
                    })
                  }}
                />
              </div>
            )}

            {/* Referral Stats Banner */}
            {!isLoadingStats && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Your Referral Earnings</h3>
                    <p className="text-2xl font-bold text-indigo-600">₹{referralStats.totalEarned.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Earned from {referralStats.totalReferrals} referrals</p>
                  </div>
                  <Button 
                    onClick={() => setActiveSection(accountSections.REFERRALS)}
                    variant="outline"
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            )}

            <div className="card p-4">
                 <AccountLink title="Logout" icon={LogOut} onClick={logout} />
            </div>
          </div>
        )
    }
  }



  return (
     <motion.div
      key={activeSection}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="mx-auto max-w-2xl"
    >
      {renderSection()}
    </motion.div>
  )
}

const DashboardCard = ({ 
  icon: Icon, 
  title, 
  subtitle,
  href, 
  onClick, 
  hasNotification 
}: { 
  icon: React.ElementType, 
  title: string, 
  subtitle?: string,
  href?: string, 
  onClick?: () => void, 
  hasNotification?: boolean 
}) => {
  const content = (
      <div className="card p-4 text-center flex flex-col items-center justify-center h-full relative">
          {hasNotification && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full blinking-dot"></div>}
          <div className="p-2 mb-2 rounded-full bg-indigo-50">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return <button onClick={onClick} className="w-full">{content}</button>;
};

const AccountLink = ({ title, icon: Icon, onClick }: { title: string, icon: React.ElementType, onClick?: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{title}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
)
