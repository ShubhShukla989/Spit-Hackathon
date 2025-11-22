import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      addNotification('success', 'Profile updated successfully');
    } catch (error) {
      addNotification('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 py-6 max-w-2xl">
      <h1 className="text-[28px] font-semibold mb-6">Profile</h1>

      <Card>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-h2">{user?.name}</h2>
              <p className="text-slate-500">{user?.role}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="secondary" onClick={() => {
              setName(user?.name || '');
              setEmail(user?.email || '');
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
