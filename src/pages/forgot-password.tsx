import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { validateEmail, validateRequired } from '../utils/validators';
import { supabase } from '../lib/supabase';

export const ForgotPasswordPage: React.FC = () => {
  const { addNotification } = useUIStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRequired(email)) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (resetError) throw resetError;
      
      setEmailSent(true);
      addNotification('success', 'Password reset OTP sent to your email');
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email');
      addNotification('error', error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-850 mb-2">Check Your Email</h2>
            <p className="text-slate-600 mb-6">
              We've sent a password reset OTP to <strong>{email}</strong>
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            <Link to="/login">
              <Button variant="primary" fullWidth>
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-slate-850 mb-2">Forgot Password?</h1>
          <p className="text-slate-600">Enter your email to receive a password reset link</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              placeholder="you@example.com"
              autoComplete="email"
            />
            
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
