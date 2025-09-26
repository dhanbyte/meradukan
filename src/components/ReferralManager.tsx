'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/ClerkAuthContext'
import { referralService, type ReferralCode, type ReferralStats } from '@/lib/referralService'
import { Copy, Plus, Share2, Users, ArrowUpRight, Loader2, Coins } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'
import { Badge } from './ui/badge'

export default function ReferralManager() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([])
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (user) {
      loadReferralCodes()
      loadStats()
    }
  }, [user])

  const loadReferralCodes = async () => {
    if (!user) return
    
    try {
      const codes = await referralService.getUserReferralCodes(user.id)
      setReferralCodes(codes)
    } catch (error) {
      console.error('Error loading referral codes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    if (!user) return
    
    try {
      const userStats = await referralService.getReferralStats(user.id)
      setStats(userStats)
    } catch (error) {
      console.error('Error loading referral stats:', error)
    }
  }

  const createReferralCode = async () => {
    if (!user) return
    
    setIsCreating(true)
    try {
      const newCode = await referralService.createReferralCode(user.id, 5) // 5% discount
      if (newCode) {
        setReferralCodes(prev => [...prev, newCode])
        toast({ title: "Referral Code Created!", description: `Your new code: ${newCode.code}` })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create referral code", variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    const isLink = text.includes('http')
    toast({ 
      title: "Copied!", 
      description: isLink ? "Referral link copied to clipboard" : `Referral code ${text} copied to clipboard` 
    })
  }

  const shareReferralLink = (code: string) => {
    const shareLink = referralService.getShareLink(code)
    if (navigator.share) {
      navigator.share({
        title: 'Get 5% discount on ShopWave!',
        text: `Use my referral code ${code} and get 5% discount on all products!`,
        url: shareLink
      })
    } else {
      navigator.clipboard.writeText(shareLink)
      toast({ title: "Link Copied!", description: "Referral link copied to clipboard" })
    }
  }

  if (!user) return null

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-l-4 border-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription className="text-sm font-medium text-gray-500">Total Earnings</CardDescription>
                <CardTitle className="text-2xl font-bold text-gray-800">₹{stats?.totalEarned?.toFixed(2) || '0.00'}</CardTitle>
              </div>
              <div className="p-2 rounded-full bg-blue-50">
                <Coins className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Users className="mr-1 h-4 w-4" />
              <span>{stats?.totalReferrals || 0} successful referrals</span>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription className="text-sm font-medium text-gray-500">Available Balance</CardDescription>
                <CardTitle className="text-2xl font-bold text-gray-800">₹{stats?.availableBalance?.toFixed(2) || '0.00'}</CardTitle>
              </div>
              <div className="p-2 rounded-full bg-green-50">
                <Coins className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white">
              <Coins className="mr-2 h-4 w-4" />
              Withdraw Earnings
            </Button>
          </CardHeader>
        </Card>
      </div>

      {/* Referral Link Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">Your Referral Link</CardTitle>
              <CardDescription className="text-sm text-gray-500">Share this link with friends to earn rewards</CardDescription>
            </div>
            <Button 
              onClick={createReferralCode} 
              disabled={isCreating}
              className="mt-3 sm:mt-0 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create New Code
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {referralCodes.length > 0 ? (
            <div className="space-y-4">
              {referralCodes.map((code) => (
                <div key={code.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 flex items-center bg-white border rounded-lg px-4 py-2 text-sm font-mono overflow-x-auto">
                      {referralService.getShareLink(code.code)}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => copyToClipboard(referralService.getShareLink(code.code))}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => shareReferralLink(code.code)}
                      >
                        <Share2 className="h-4 w-4 mr-1" /> Share
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {code.discountPercentage}% OFF
                    </Badge>
                    <span className="text-gray-500">Used {code.usedCount || 0} times</span>
                    {code.isActive ? (
                      <Badge variant="success" className="ml-auto">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="ml-auto">Inactive</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <p className="text-gray-500">You don't have any referral codes yet.</p>
              <Button 
                onClick={createReferralCode} 
                disabled={isCreating}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Create Your First Referral Code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">Recent Referrals</CardTitle>
              <CardDescription className="text-sm text-gray-500">People who joined using your referral</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-blue-600 hover:text-blue-700 mt-2 sm:mt-0">
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {stats?.recentReferrals && stats.recentReferrals.length > 0 ? (
            <div className="space-y-3">
              {stats.recentReferrals.map((ref, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{ref.email || 'New User'}</p>
                      <p className="text-xs text-gray-500">
                        Joined on {new Date(ref.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    +₹{ref.earnedAmount?.toFixed(2) || '0.00'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-3 text-sm font-medium text-gray-900">No referrals yet</h3>
              <p className="mt-1 text-sm text-gray-500">Share your referral link to start earning rewards</p>
              {referralCodes.length > 0 && (
                <div className="mt-6">
                  <Button 
                    variant="outline"
                    className="border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    onClick={() => {
                      const link = referralService.getShareLink(referralCodes[0].code);
                      copyToClipboard(link);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Referral Link
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}