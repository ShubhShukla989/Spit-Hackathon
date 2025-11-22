import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { validateRequired } from '../utils/validators';
import { supabase } from '../lib/supabase';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useUIStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    // Check if user came from password reset email
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setValidSession(true);
      } else {
        addNotification('error', 'Invalid or expired reset link');
        navigate('/login');
      }
    };
    
    checkSession();
  }, [navigate, addNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { password?: string; confirmPassword?: string } = {};
    
    if (!validateRequired(password)) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!validateRequired(confirmPassword)) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) throw error;
      
      addNotification('success', 'Password reset successfully! Please login with your new password.');
      navigate('/login');
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!validSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="loading-premium text-lg">Verifying reset link...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-slate-850 mb-2">Reset Password</h1>
          <p className="text-slate-600">Enter your new password</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="New Password"
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
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <strong>Password requirements:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-1 ml-4 list-disc">
                <li>At least 6 characters long</li>
                <li>Mix of letters and numbers recommended</li>
              </ul>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
