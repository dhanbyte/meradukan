'use client';

import { useState } from 'react';
import { Gift } from 'lucide-react';
import SpinWheel from './SpinWheel';
import { useAuth } from '@/context/ClerkAuthContext';

export default function TryYourLuckButton() {
  const { user } = useAuth();
  const [showSpinWheel, setShowSpinWheel] = useState(false);

  const handleSpinWin = async (wonCoins: number) => {
    if (!user) return;
    
    try {
      // Get current coins
      const response = await fetch(`/api/user-data?userId=${user.id}&type=coins`);
      const currentCoins = response.ok ? await response.json() : 5;
      
      // Add won coins
      const newCoins = (currentCoins || 5) + wonCoins;
      
      await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          type: 'coins', 
          data: newCoins 
        })
      });
    } catch (error) {
      console.error('Error updating coins:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowSpinWheel(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-all"
      >
        <Gift size={18} />
        Try Your Luck
      </button>
      
      <SpinWheel 
        isOpen={showSpinWheel}
        onClose={() => setShowSpinWheel(false)}
        onWin={handleSpinWin}
      />
    </>
  );
}