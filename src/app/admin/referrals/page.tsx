'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type Referral = {
  id: string;
  referrerId: string;
  referrerEmail: string;
  refereeId: string;
  refereeEmail: string;
  amount: number;
  orderAmount: number;
  status: string;
  createdAt: string;
};

type User = {
  id: string;
  email: string;
  referralBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
};

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('referrals');
  const router = useRouter();
  
  // Check if user is admin (you'll need to implement this in your auth context)
  const { user, isAdmin } = useAuth();
  
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      router.push('/');
      return;
    }
    
    fetchData();
  }, [activeTab]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'referrals') {
        const res = await fetch('/api/admin/referrals');
        const data = await res.json();
        setReferrals(data);
      } else {
        const res = await fetch('/api/admin/referral-users');
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Access Denied. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Referral Management</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('referrals')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'referrals'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Referral History
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Balances
          </button>
        </nav>
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      ) : activeTab === 'referrals' ? (
        <ReferralHistoryTable referrals={referrals} />
      ) : (
        <UserBalancesTable users={users} />
      )}
    </div>
  );
}

function ReferralHistoryTable({ referrals }: { referrals: Referral[] }) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referrer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reward
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {referrals.map((referral) => (
              <tr key={referral.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="font-medium">{referral.referrerEmail}</div>
                  <div className="text-gray-500 text-xs">{referral.referrerId.substring(0, 8)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{referral.refereeEmail}</div>
                  <div className="text-gray-500 text-xs">{referral.refereeId.substring(0, 8)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{referral.orderAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  +₹{referral.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(referral.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    referral.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {referral.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserBalancesTable({ users }: { users: User[] }) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Earned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Withdrawn
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{user.referralBalance?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  ₹{user.totalEarned?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  ₹{user.totalWithdrawn?.toFixed(2) || '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
