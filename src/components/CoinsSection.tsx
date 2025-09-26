'use client';

import { useState } from 'react';
import React from 'react';
import { Gift, ArrowLeft } from 'lucide-react';
import SpinWheel from './SpinWheel';
import { useAuth } from '@/context/ClerkAuthContext';

interface CoinsSectionProps {
  onBack: () => void;
  userCoins: number;
  onCoinsUpdate: (newCoins: number) => void;
  orders: any[];
  usedSpins: string[];
  onSpinUsed: (orderId: string) => void;
  referralEarnings: number;
}

export default function CoinsSection({ onBack, userCoins, onCoinsUpdate, orders, usedSpins, onSpinUsed, referralEarnings }: CoinsSectionProps) {
  const { user } = useAuth();
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [availableSpins, setAvailableSpins] = useState(0);
  const [coinsFromSpins, setCoinsFromSpins] = useState(0);
  const [coinsFromReferrals, setCoinsFromReferrals] = useState(0);

  // Calculate available spins and coin breakdown
  React.useEffect(() => {
    const available = orders.filter(order => !usedSpins.includes(order.id)).length;
    setAvailableSpins(available);
    
    // Calculate coins from spins (assume user got coins from used spins)
    const usedSpinCount = usedSpins.length;
    setCoinsFromSpins(usedSpinCount * 3); // Average 3 coins per spin
    
    // Convert referral earnings to coins (₹1 = 1 coin)
    setCoinsFromReferrals(Math.floor(referralEarnings));
  }, [orders, usedSpins, referralEarnings]);

  const handleSpinWin = async (wonCoins: number) => {
    const newCoins = userCoins + wonCoins;
    onCoinsUpdate(newCoins);
    
    // Mark oldest unused order as used
    const unusedOrder = orders.find(order => !usedSpins.includes(order.id));
    if (unusedOrder) {
      onSpinUsed(unusedOrder.id);
    }
    
    try {
      await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id, 
          type: 'coins', 
          data: newCoins 
        })
      });
    } catch (error) {
      console.error('Error updating coins:', error);
    }
  };

  const handleSpinClick = () => {
    if (availableSpins > 0) {
      setShowSpinWheel(true);
    }
  };

  return (
    <div>
      <button onClick={onBack} className="text-sm text-brand font-semibold mb-4 flex items-center gap-2">
        <ArrowLeft size={16} />
        Back to Account
      </button>
      
      <div className="card p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🪙</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">My Coins</h2>
          <p className="text-4xl font-bold text-orange-600 mb-2">{userCoins}</p>
          <p className="text-sm text-gray-500">1 coin = ₹1 discount</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">Coin Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>From Spin Wheels:</span>
              <span className="font-medium">{coinsFromSpins} 🪙</span>
            </div>
            <div className="flex justify-between">
              <span>From Referrals:</span>
              <span className="font-medium">{coinsFromReferrals} 🪙</span>
            </div>
            <div className="flex justify-between">
              <span>Base Coins:</span>
              <span className="font-medium">{userCoins - coinsFromSpins - coinsFromReferrals} 🪙</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Available:</span>
              <span>{userCoins} 🪙</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-gray-600">Available Spins: {availableSpins}</p>
          </div>
        </div>
        
        <button
          onClick={handleSpinClick}
          disabled={availableSpins === 0}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
            availableSpins > 0 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Gift size={20} />
          {availableSpins > 0 ? 'Try Your Luck - Spin Wheel' : 'No Spins Available - Place Order'}
        </button>
      </div>
      
      <SpinWheel 
        isOpen={showSpinWheel}
        onClose={() => setShowSpinWheel(false)}
        onWin={handleSpinWin}
      />
    </div>
  );
}