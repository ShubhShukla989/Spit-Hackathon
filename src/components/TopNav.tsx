import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Operations', path: '/operations/receipts' },
    { label: 'Stock', path: '/stock' },
    { label: 'Move History', path: '/move-history' },
    { label: 'Settings', path: '/settings/warehouse' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full bg-slate-50 pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Rounded Navigation Box */}
        <div className="border-2 border-slate-300 rounded-2xl bg-white px-8 py-4 mb-4">
          <div className="flex items-center justify-between">
            {/* Left: Navigation Menu */}
            <nav className="flex items-center gap-12">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`text-sm font-normal transition-colors ${
                    isActive(item.path)
                      ? 'text-slate-900 font-medium'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            
            {/* Right: Dashboard Title + User Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xl font-medium text-slate-900 hover:text-slate-700 transition-colors"
              >
                Dashboard
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 border border-slate-300 rounded flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                  aria-label="User menu"
                  aria-expanded={showProfileMenu}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-200">
                      <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Thin Horizontal Divider Line */}
        <div className="w-full h-px bg-slate-300"></div>
      </div>
    </div>
  );
};
