'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/ClerkAuthContext';
import { format } from 'date-fns';

type ReferralReward = {
  id: string;
  refereeId: string;
  orderId: string;
  amount: number;
  orderAmount: number;
  status: string;
  createdAt: string;
};

export default function ReferralHistory() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchReferralHistory = async () => {
      try {
        // Use user.id or user._id based on your auth context
        const userId = user.id || user._id || user.uid;
        if (!userId) {
          throw new Error('User ID not found');
        }
        
        const response = await fetch(`/api/referral/history?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch referral history');
        }
        const data = await response.json();
        setRewards(data);
      } catch (err) {
        console.error('Error fetching referral history:', err);
        setError('Failed to load referral history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReferralHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Referral History</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Your referral earnings and activities</p>
      </div>
      
      {rewards.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No referral history found. Start referring friends to earn rewards!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reward
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(reward.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reward.orderId.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{reward.orderAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    +₹{reward.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reward.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : reward.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
