'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface SpinWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onWin: (coins: number) => void;
}

export default function SpinWheel({ isOpen, onClose, onWin }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    
    // Random coins between 1-5
    const coins = Math.floor(Math.random() * 5) + 1;
    
    setTimeout(() => {
      setResult(coins);
      setIsSpinning(false);
      onWin(coins);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Try Your Luck!</h3>
          <button onClick={onClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <div className={`w-32 h-32 mx-auto rounded-full border-4 border-blue-500 flex items-center justify-center text-2xl font-bold ${isSpinning ? 'animate-spin' : ''}`}>
            {result ? `${result} 🪙` : '🎯'}
          </div>
        </div>
        
        {result ? (
          <div className="space-y-4">
            <p className="text-green-600 font-bold">You won {result} coins!</p>
            <button 
              onClick={onClose}
              className="w-full bg-green-500 text-white py-2 rounded-lg font-medium"
            >
              Collect Coins
            </button>
          </div>
        ) : (
          <button 
            onClick={spinWheel}
            disabled={isSpinning}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {isSpinning ? 'Spinning...' : 'Spin Wheel'}
          </button>
        )}
      </div>
    </div>
  );
}