import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { validateEmail, validateRequired } from '../utils/validators';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addNotification } = useUIStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { email?: string; password?: string } = {};
    
    if (!validateRequired(email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!validateRequired(password)) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
      addNotification('success', 'Login successful');
      navigate('/dashboard');
    } catch (error: any) {
      addNotification('error', error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-slate-850 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to your StockMaster account</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
              autoComplete="current-password"
            />
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-slate-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
