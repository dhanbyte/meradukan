'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/ClerkAuthContext';
import { toast } from '@/hooks/use-toast';

export const useRequireAuth = (redirectPath = '/sign-in') => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const requireAuth = (action: string = 'perform this action') => {
    if (loading) return false;
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: `Please sign in to ${action}.`,
        variant: 'default',
      });
      router.push(redirectPath);
      return false;
    }
    
    return true;
  };

  return { requireAuth, user, loading };
};
