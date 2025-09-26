'use client';

import { useEffect, useState } from 'react';
import { Copy, Gift, Wallet, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SimpleReferral() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [balance, setBalance] = useState(0);
  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      // Generate a simple referral code from user's UID
      const code = user.uid.substring(0, 8).toUpperCase();
      setReferralCode(code);
      // In a real app, fetch the actual balance from your database
      fetchUserBalance();
    }
  }, [user]);

  const fetchUserBalance = async () => {
    try {
      const response = await fetch(`/api/referral/balance?userId=${user.uid}`);
      const data = await response.json();
      if (response.ok) {
        setBalance(data.balance);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  const copyToClipboard = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/register?ref=${referralCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (Number(withdrawAmount) > balance) {
      setError('Insufficient balance');
      return;
    }

    try {
      const response = await fetch('/api/referral/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          amount: Number(withdrawAmount)
        })
      });

      const data = await response.json();
      if (response.ok) {
        setBalance(balance - Number(withdrawAmount));
        setWithdrawAmount('');
        setError('');
        alert('Withdrawal request submitted successfully!');
      } else {
        setError(data.error || 'Failed to process withdrawal');
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
      setError('Failed to process withdrawal');
    }
  };

  if (!user) {
    return <div>Please login to access referral program</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Refer & Earn</h2>
      
      {/* Referral Code Section */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Gift className="mr-2" /> Your Referral Code
        </h3>
        <div className="flex items-center">
          <div className="flex-1 p-3 bg-white border rounded-l-lg font-mono">
            {`${window.location.origin}/register?ref=${referralCode}`}
          </div>
          <button
            onClick={copyToClipboard}
            className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? 'Copied!' : <Copy />}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Share your referral link and earn ₹5-₹10 for every successful purchase made by your friends!
        </p>
      </div>

      {/* Balance Section */}
      <div className="mb-8 p-6 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Wallet className="mr-2" /> Your Earnings
        </h3>
        <div className="text-3xl font-bold mb-4">₹{balance.toFixed(2)}</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Withdraw Amount (₹)
            </label>
            <div className="flex">
              <input
                type="number"
                id="withdrawAmount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="flex-1 p-2 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount"
                min="1"
                step="1"
              />
              <button
                onClick={handleWithdraw}
                className="px-4 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
              >
                Withdraw
              </button>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          
          <div className="flex items-center justify-center">
            <span className="text-gray-600 mr-2">or</span>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Use for Shopping
            </button>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">How It Works</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-3">1</span>
            <span>Share your referral link with friends</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-3">2</span>
            <span>When they sign up and make a purchase, you earn:</span>
          </li>
          <li className="ml-9 mb-3 pl-1">
            <ul className="list-disc pl-5 text-gray-600">
              <li>₹5 for purchases under ₹100</li>
              <li>₹10 for purchases of ₹100 or more</li>
            </ul>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-3">3</span>
            <span>Use your earnings for shopping or withdraw to your bank account</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
