'use client'

import { useEffect, useState } from 'react';
import { Users, UserCheck, BarChart2 } from 'lucide-react';

interface ReferralStat {
  userId: string;
  name: string;
  email: string;
  totalReferrals: number;
  totalSignups: number;
  totalEarnings: number;
  lastUpdated: string;
}

export default function ReferralStats() {
  const [stats, setStats] = useState<ReferralStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/referrals');
        if (!response.ok) {
          throw new Error('Failed to fetch referral stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching referral stats:', err);
        setError('Failed to load referral statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Referrers</p>
              <p className="text-2xl font-semibold">{stats.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Referrals</p>
              <p className="text-2xl font-semibold">
                {stats.reduce((sum, stat) => sum + stat.totalReferrals, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <p className="text-2xl font-semibold">
                ₹{stats.reduce((sum, stat) => sum + (stat.totalEarnings || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signups</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.map((stat) => (
                <tr key={stat.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600">
                          {stat.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{stat.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.totalReferrals}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.totalSignups}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      ₹{stat.totalEarnings?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(stat.lastUpdated).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
