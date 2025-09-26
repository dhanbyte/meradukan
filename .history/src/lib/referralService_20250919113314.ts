// Client-side referral service - uses API calls only

export interface ReferralCode {
  id: string
  code: string
  userId: string
  discountPercentage: number
  maxUses: number
  currentUses: number
  isActive: boolean
  expiresAt?: string
  createdAt: string
}

export interface ReferralReward {
  id: string
  referrerId: string
  refereeId: string
  orderId: string
  rewardAmount: number
  coins: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
}

export interface ReferralStats {
  totalEarned: number
  totalReferrals: number
  totalSignups: number
  totalEarnings: number
  totalCoins: number
  usedCoins: number
  availableCoins: number
  activeReferralCodes: number
  referralHistory: ReferralReward[]
  signupHistory: any[]
}

export class ReferralService {
  private static instance: ReferralService

  private constructor() {}

  public static getInstance(): ReferralService {
    if (!ReferralService.instance) {
      ReferralService.instance = new ReferralService()
    }
    return ReferralService.instance
  }

  // Generate a unique referral code
  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Create a new referral code for a user
  async createReferralCode(
    userId: string, 
    discountPercentage: number = 10, 
    maxUses: number = 100
  ): Promise<ReferralCode | null> {
    try {
      let code = this.generateReferralCode()
      let attempts = 0
      
      const newReferralCode: ReferralCode = {
        id: `ref_${Date.now()}`,
        code,
        userId,
        discountPercentage,
        maxUses,
        currentUses: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      }
      
      const existingCodes = await this.getUserReferralCodes(userId)
      const updatedCodes = [...existingCodes, newReferralCode]
      
      await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type: 'referrals', data: updatedCodes })
      })
      
      return newReferralCode
    } catch (error) {
      console.error('Error in createReferralCode:', error)
      return null
    }
  }

  // Get user's referral codes
  async getUserReferralCodes(userId: string): Promise<ReferralCode[]> {
    try {
      const response = await fetch(`/api/user-data?userId=${userId}&type=referrals`)
      const result = await response.json()
      return result || []
    } catch (error) {
      console.error('Error in getUserReferralCodes:', error)
      return []
    }
  }

  // Validate a referral code
  async validateReferralCode(code: string): Promise<ReferralCode | null> {
    try {
      const response = await fetch(`/api/referrals/validate?code=${code}`)
      const result = await response.json()
      return response.ok ? result.data : null
    } catch (error) {
      console.error('Error in validateReferralCode:', error)
      return null
    }
  }

  // Apply referral code and calculate discount (₹5 flat discount on home products and other categories, excluding Ayurvedic)
  async applyReferralCode(code: string, cartItems: any[]): Promise<{
    isValid: boolean
    discountAmount: number
    referralCode?: ReferralCode
  }> {
    try {
      const referralCode = await this.validateReferralCode(code)
      
      if (!referralCode) {
        return { isValid: false, discountAmount: 0 }
      }

      // Import product store to get product details
      const { useProductStore } = await import('./productStore')
      const products = useProductStore.getState().products
      
      // Check if cart has eligible products (Home or other categories, excluding Ayurvedic)
      const hasEligibleProducts = cartItems.some(item => {
        const product = products.find(p => p.id === item.id)
        return product && product.category !== 'Ayurvedic'
      })
      
      // Give ₹5 flat discount if there are eligible products
      const discountAmount = hasEligibleProducts ? 5 : 0
      
      return {
        isValid: true,
        discountAmount,
        referralCode
      }
    } catch (error) {
      console.error('Error in applyReferralCode:', error)
      return { isValid: false, discountAmount: 0 }
    }
  }

  // Record referral usage when order is placed
  async recordReferralUsage(
    code: string, 
    refereeId: string, 
    orderId: string, 
    orderAmount: number
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/referrals/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, refereeId, orderId, orderAmount })
      })
      return response.ok
    } catch (error) {
      console.error('Error recording referral usage:', error)
      return false
    }
  }

  // Get referral statistics for a user
  async getReferralStats(userId: string): Promise<ReferralStats> {
    if (!userId) {
      console.error('User ID is required to fetch referral stats')
      return this.getDefaultStats()
    }
    
    try {
      const response = await fetch(`/api/referrals/stats?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        console.error('Failed to fetch referral stats:', response.status, response.statusText)
        return this.getDefaultStats()
      }
      
      const data = await response.json()
      return data
      
    } catch (error) {
      console.error('Error getting referral stats:', error)
      return this.getDefaultStats()
    }
  }
  
  // Return default stats object
  private getDefaultStats(): ReferralStats {
    return { 
      totalReferrals: 0,
      totalSignups: 0,
      totalEarnings: 0, 
      totalCoins: 0,
      usedCoins: 0,
      availableCoins: 0,
      activeReferralCodes: 0,
      referralHistory: [],
      signupHistory: []
    }
  }

  // Use coins for discount
  async useCoins(userId: string, coinsToUse: number): Promise<boolean> {
    try {
      const response = await fetch('/api/referrals/use-coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, coinsToUse })
      })
      return response.ok
    } catch (error) {
      console.error('Error using coins:', error)
      return false
    }
  }

  // Get share link for referral code
  getShareLink(code: string): string {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}?ref=${code}`
    }
    return `https://shopwave.dhanbyte.me?ref=${code}`
  }
}

export const referralService = ReferralService.getInstance()
