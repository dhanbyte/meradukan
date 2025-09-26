'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toast';

import BackInStockPopup from '@/components/BackInStockPopup';
import WelcomePopup from '@/components/WelcomePopup';
import { useProductStore } from '@/lib/productStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import LoadingFallback from '@/components/LoadingFallback';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function RootContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [pathname, setPathname] = useState('');
  
  useEffect(() => {
    try {
      setMounted(true);
      if (typeof window !== 'undefined') {
        setPathname(window.location.pathname);
      }
    } catch (error) {
      console.error('RootContent mount error:', error);
      setMounted(true);
    }
  }, []);

  if (!mounted) {
    return <LoadingFallback />;
  }

  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <RootContentInner>{children}</RootContentInner>
    </ErrorBoundary>
  );
}

function RootContentInner({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    try {
      // Small delay to ensure everything is mounted
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('RootContentInner error:', error);
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <ErrorBoundary>
          <TopBar />
        </ErrorBoundary>
        
        <main className="container py-4 pb-24 md:pb-8 flex-grow">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </div>
      
      <ErrorBoundary>
        <BottomNav />
      </ErrorBoundary>

      <ErrorBoundary>
        <BackInStockPopup />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <WelcomePopup />
      </ErrorBoundary>
      
      <Toaster />
    </>
  );
}