'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR to avoid hydration issues
const SimpleReferral = dynamic(() => import('@/components/SimpleReferral'), { ssr: false });
const ReferralHistory = dynamic(() => import('@/components/ReferralHistory'), { ssr: false });

// Import AuthContext with proper type checking
declare global {
  interface Window {
    __NEXT_DATA__: any;
  }
}

// Simple loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export default function ReferralPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (!data.user) {
          router.push('/login?redirect=/referral');
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push('/login?redirect=/referral');
      } finally {
        setIsLoading(false);
        setInitialLoad(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state
  if (isLoading || initialLoad) {
    return <LoadingSpinner />;
  }

  // If not authenticated (handled by the effect, but just in case)
  if (!isAuthenticated) {
    return null; // Redirect will happen in the effect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Referral Program</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <SimpleReferral />
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Your Referral History</h2>
          <ReferralHistory />
        </div>
        
        <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Referral Program Terms</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Earn ₹5 for purchases under ₹100</li>
                  <li>Earn ₹10 for purchases of ₹100 or more</li>
                  <li>Minimum withdrawal amount is ₹100</li>
                  <li>Withdrawals are processed within 3-5 business days</li>
                  <li>Referral rewards expire after 6 months of inactivity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
