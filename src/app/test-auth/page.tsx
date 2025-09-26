'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  refCode: string;
};

export default function TestAuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    refCode: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin 
      ? { email: formData.email, password: formData.password }
      : { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password,
          refCode: formData.refCode || undefined
        };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage({ 
        type: 'success', 
        text: isLogin ? 'Login successful!' : 'Registration successful!'
      });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred. Please try again.'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      refCode: ''
    });
    setMessage({ type: 'success', text: 'Logged out successfully' });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Sign In' : 'Create an Account'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin 
              ? 'Sign in to your account' 
              : 'Create a new account to get started'}
          </p>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {user ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold">Welcome, {user.name}!</h2>
            <div className="mt-4 space-y-2">
              <p>Email: {user.email}</p>
              <p>Referral Code: {user.referralCode}</p>
              <p>Referral Balance: ₹{user.referralBalance}</p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="refCode" className="block text-sm font-medium text-gray-700">
                    Referral Code (optional)
                  </label>
                  <input
                    id="refCode"
                    name="refCode"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.refCode}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLogin ? 'Sign in' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 text-center text-sm">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button 
                onClick={() => setIsLogin(false)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                onClick={() => setIsLogin(true)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
