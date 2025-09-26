'use client';

import { useState } from 'react';
import { X, Gift } from 'lucide-react';

interface ScratchCardProps {
  isOpen: boolean;
  onClose: () => void;
  onWin: (coins: number) => void;
  orderId: string;
}

export default function ScratchCard({ isOpen, onClose, onWin, orderId }: ScratchCardProps) {
  const [isScratched, setIsScratched] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const scratchCard = () => {
    if (isScratched) return;
    
    setIsScratched(true);
    const coins = Math.floor(Math.random() * 5) + 1;
    setResult(coins);
    onWin(coins);
  };

  const handleClose = () => {
    setIsScratched(false);
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Scratch Card</h3>
          <button onClick={handleClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">Order #{orderId}</p>
          
          <div 
            className={`w-40 h-32 mx-auto rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer transition-all ${
              isScratched ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-solid border-yellow-500' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={scratchCard}
          >
            {result ? (
              <div className="text-center">
                <Gift size={32} className="mx-auto mb-2" />
                <div className="text-2xl font-bold">{result} 🪙</div>
              </div>
            ) : (
              <div className="text-center text-gray-600">
                <div className="text-sm">Scratch to</div>
                <div className="text-sm">reveal coins!</div>
              </div>
            )}
          </div>
        </div>
        
        {result ? (
          <div className="space-y-4">
            <p className="text-green-600 font-bold">You won {result} coins!</p>
            <button 
              onClick={handleClose}
              className="w-full bg-green-500 text-white py-2 rounded-lg font-medium"
            >
              Collect Coins
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Tap the card to scratch and win 1-5 coins!</p>
        )}
      </div>
    </div>
  );
}