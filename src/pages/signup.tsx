import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { validateEmail, validateRequired, validatePassword } from '../utils/validators';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const { addNotification } = useUIStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: typeof errors = {};
    
    if (!validateRequired(name)) {
      newErrors.name = 'Name is required';
    }
    
    if (!validateRequired(email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!validateRequired(password)) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      await signup(email, password, name);
      setShowEmailConfirmation(true);
      addNotification('success', 'Please check your email to confirm your account');
    } catch (error: any) {
      addNotification('error', error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-850 mb-2">Check Your Email</h1>
              <p className="text-slate-600 mb-4">
                We've sent a confirmation email to:
              </p>
              <p className="text-lg font-medium text-primary mb-6">{email}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-sm text-slate-700 mb-2">
                  <strong>Next steps:</strong>
                </p>
                <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
                  <li>Open your email inbox</li>
                  <li>Click the confirmation link in the email</li>
                  <li>Return here and sign in</li>
                </ol>
              </div>
            </div>
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
                fullWidth
              >
                Go to Login
              </Button>
              <button
                onClick={() => setShowEmailConfirmation(false)}
                className="text-sm text-slate-600 hover:text-slate-900 underline"
              >
                Didn't receive email? Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-slate-850 mb-2">Create Account</h1>
          <p className="text-slate-600">Join StockMaster today</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              placeholder="John Doe"
              autoComplete="name"
            />
            
            <Input
              label="Login ID"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            
            <div className="bg-[#E6EEF8] border border-slate-300 rounded-md p-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Password Requirements:</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-center gap-2">
                  <span className={password.length >= 8 && password.length <= 16 ? 'text-green-600' : 'text-slate-400'}>
                    {password.length >= 8 && password.length <= 16 ? '✓' : '○'}
                  </span>
                  Between 8-16 characters
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-slate-400'}>
                    {/[A-Z]/.test(password) ? '✓' : '○'}
                  </span>
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span className={/\d/.test(password) ? 'text-green-600' : 'text-slate-400'}>
                    {/\d/.test(password) ? '✓' : '○'}
                  </span>
                  One digit
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-slate-400'}>
                    {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '○'}
                  </span>
                  One special character
                </li>
              </ul>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
