'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/ClerkAuthContext';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const redirectUrl = searchParams.get('redirect_url') || '/';

  // If user is already signed in, redirect them
  useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <a href="/sign-up" className="font-medium text-brand hover:text-brand/80">
              create a new account
            </a>
          </p>
        </div>
        <div className="mt-8">
          <SignIn 
            path="/sign-in" 
            routing="path" 
            signUpUrl="/sign-up"
            redirectUrl={redirectUrl}
            appearance={{
              elements: {
                card: 'shadow-lg rounded-2xl',
                headerTitle: 'text-2xl font-bold text-gray-900',
                headerSubtitle: 'text-gray-600',
                socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50',
                socialButtonsBlockButtonText: 'text-gray-700',
                dividerLine: 'bg-gray-200',
                dividerText: 'text-gray-500',
                formFieldInput: 'focus:ring-2 focus:ring-brand focus:border-brand',
                footerActionText: 'text-gray-600',
                footerActionLink: 'text-brand hover:text-brand/80',
                formButtonPrimary: 'bg-brand hover:bg-brand/90',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
