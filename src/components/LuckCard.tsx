'use client';

import { useState } from 'react';
import { Gift } from 'lucide-react';
import ScratchCard from './ScratchCard';

interface LuckCardProps {
  userCoins: number;
  orders: any[];
  usedScratchCards: string[];
  onScratchWin: (wonCoins: number, orderId: string) => void;
}

export default function LuckCard({ userCoins, orders, usedScratchCards, onScratchWin }: LuckCardProps) {
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');

  const handleScratchWin = (wonCoins: number) => {
    onScratchWin(wonCoins, selectedOrderId);
    setShowScratchCard(false);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <Gift size={18} />
        </div>
        <h3 className="font-bold text-lg">Your Coins</h3>
      </div>
      
      <div className="mb-4">
        <p className="text-3xl font-bold">{userCoins} 🪙</p>
        <p className="text-sm opacity-90">1 coin = ₹1 discount</p>
      </div>
      
      <div className="bg-white/10 rounded-lg p-3">
        <h4 className="font-semibold mb-3 text-sm">Try Your Luck - Scratch Cards</h4>
        <div className="grid grid-cols-3 gap-2">
          {orders.slice(0, 6).map((order) => {
            const isUsed = usedScratchCards.includes(order.id);
            return (
              <button
                key={order.id}
                onClick={() => {
                  if (!isUsed) {
                    setSelectedOrderId(order.id);
                    setShowScratchCard(true);
                  }
                }}
                disabled={isUsed}
                className={`p-2 rounded-lg text-xs font-medium transition-all ${
                  isUsed 
                    ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <div className="text-center">
                  <div>#{order.id.slice(-4)}</div>
                  <div className="text-xs mt-1">{isUsed ? 'Used' : 'Scratch!'}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <ScratchCard 
        isOpen={showScratchCard}
        onClose={() => setShowScratchCard(false)}
        onWin={handleScratchWin}
        orderId={selectedOrderId}
      />
    </div>
  );
}