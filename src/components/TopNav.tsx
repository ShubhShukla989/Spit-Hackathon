import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [showOperationsMenu, setShowOperationsMenu] = React.useState(false);
  const [showStockMenu, setShowStockMenu] = React.useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
  ];

  const operationsSubmenu = [
    { label: 'Receipt', path: '/operations/receipts' },
    { label: 'Delivery', path: '/operations/delivery' },
    { label: 'Adjustment', path: '/operations/adjustments' },
  ];

  const stockSubmenu = [
    { label: 'Stock Levels', path: '/stock' },
    { label: 'Products', path: '/stock/products' },
    { label: 'Categories', path: '/stock/categories' },
    { label: 'Reordering Rules', path: '/stock/rules' },
    { label: 'Stock by Location', path: '/stock/locations' },
    { label: '🔔 Stock Alerts', path: '/stock/alerts' },
  ];

  const settingsSubmenu = [
    { label: 'Warehouse', path: '/settings/warehouse' },
    { label: 'Locations', path: '/settings/locations' },
  ];

  const navItemsAfterOperations = [
    { label: 'Move History', path: '/move-history' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isOperationsActive = () => {
    return location.pathname.startsWith('/operations');
  };

  const isStockActive = () => {
    return location.pathname.startsWith('/stock');
  };

  const isSettingsActive = () => {
    return location.pathname.startsWith('/settings');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOperationsClick = (path: string) => {
    navigate(path);
    setShowOperationsMenu(false);
  };

  const handleStockClick = (path: string) => {
    navigate(path);
    setShowStockMenu(false);
  };

  const handleSettingsClick = (path: string) => {
    navigate(path);
    setShowSettingsMenu(false);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.operations-dropdown') && !target.closest('.stock-dropdown') && !target.closest('.settings-dropdown') && !target.closest('.profile-dropdown')) {
        setShowOperationsMenu(false);
        setShowStockMenu(false);
        setShowSettingsMenu(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full pt-8 pb-6" style={{ backgroundColor: '#FAF9F7' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Rounded Navigation Box */}
        <div 
          className="border-[1.5px] rounded-2xl px-8 py-4 mb-4 shadow-lg transition-all duration-300" 
          style={{ 
            borderColor: '#D4A657', 
            backgroundColor: '#1E293B',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            {/* Left: Navigation Menu */}
            <nav className="flex items-center gap-12">
              {/* Dashboard */}
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`text-sm font-semibold transition-all duration-300 px-3 py-1.5 rounded-md ${
                    isActive(item.path)
                      ? 'font-bold'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    color: isActive(item.path) ? '#D4A657' : 'white',
                    backgroundColor: isActive(item.path) ? 'rgba(212, 166, 87, 0.1)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.color = '#D4A657';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Operations Dropdown */}
              <div className="relative operations-dropdown">
                <button
                  onClick={() => setShowOperationsMenu(!showOperationsMenu)}
                  className={`text-sm font-semibold transition-all duration-300 flex items-center gap-1 px-3 py-1.5 rounded-md ${
                    isOperationsActive()
                      ? 'font-bold'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    color: isOperationsActive() ? '#D4A657' : 'white',
                    backgroundColor: isOperationsActive() ? 'rgba(212, 166, 87, 0.1)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isOperationsActive()) {
                      e.currentTarget.style.color = '#D4A657';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isOperationsActive()) {
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                >
                  Operations
                  <svg 
                    className="w-4 h-4 transition-transform duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    style={{ transform: showOperationsMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showOperationsMenu && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-56 rounded-lg shadow-xl py-2 z-50 border-[1.5px] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ 
                      backgroundColor: '#FAF9F7',
                      borderColor: '#D4A657'
                    }}
                  >
                    {operationsSubmenu.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleOperationsClick(item.path)}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-200"
                        style={{ color: '#1E293B' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(212, 166, 87, 0.15)';
                          e.currentTarget.style.paddingLeft = '20px';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.paddingLeft = '16px';
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stock Dropdown */}
              <div className="relative stock-dropdown">
                <button
                  onClick={() => setShowStockMenu(!showStockMenu)}
                  className={`text-sm font-semibold transition-all duration-300 flex items-center gap-1 px-3 py-1.5 rounded-md ${
                    isStockActive()
                      ? 'font-bold'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    color: isStockActive() ? '#D4A657' : 'white',
                    backgroundColor: isStockActive() ? 'rgba(212, 166, 87, 0.1)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isStockActive()) {
                      e.currentTarget.style.color = '#D4A657';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isStockActive()) {
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                >
                  Stock
                  <svg 
                    className="w-4 h-4 transition-transform duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    style={{ transform: showStockMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showStockMenu && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-56 rounded-lg shadow-xl py-2 z-50 border-[1.5px] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ 
                      backgroundColor: '#FAF9F7',
                      borderColor: '#D4A657'
                    }}
                  >
                    {stockSubmenu.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleStockClick(item.path)}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-200"
                        style={{ color: '#1E293B' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(212, 166, 87, 0.15)';
                          e.currentTarget.style.paddingLeft = '20px';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.paddingLeft = '16px';
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Menu Items */}
              {navItemsAfterOperations.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`text-sm font-semibold transition-all duration-300 px-3 py-1.5 rounded-md ${
                    isActive(item.path)
                      ? 'font-bold'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    color: isActive(item.path) ? '#D4A657' : 'white',
                    backgroundColor: isActive(item.path) ? 'rgba(212, 166, 87, 0.1)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.color = '#D4A657';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}

              {/* Settings Dropdown */}
              <div className="relative settings-dropdown">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className={`text-sm font-semibold transition-all duration-300 flex items-center gap-1 px-3 py-1.5 rounded-md ${
                    isSettingsActive()
                      ? 'font-bold'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    color: isSettingsActive() ? '#D4A657' : 'white',
                    backgroundColor: isSettingsActive() ? 'rgba(212, 166, 87, 0.1)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSettingsActive()) {
                      e.currentTarget.style.color = '#D4A657';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSettingsActive()) {
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                >
                  Settings
                  <svg 
                    className="w-4 h-4 transition-transform duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    style={{ transform: showSettingsMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showSettingsMenu && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-56 rounded-lg shadow-xl py-2 z-50 border-[1.5px] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ 
                      backgroundColor: '#FAF9F7',
                      borderColor: '#D4A657'
                    }}
                  >
                    {settingsSubmenu.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleSettingsClick(item.path)}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-200"
                        style={{ color: '#1E293B' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(212, 166, 87, 0.15)';
                          e.currentTarget.style.paddingLeft = '20px';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.paddingLeft = '16px';
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
            
            {/* Right: Dashboard Title + User Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xl font-bold transition-all duration-300 hover:scale-105"
                style={{ color: '#D4A657' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#D4A657';
                }}
              >
                Dashboard
              </button>
              
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ 
                    border: '2px solid #D4A657',
                    backgroundColor: 'rgba(212, 166, 87, 0.1)'
                  }}
                  aria-label="User menu"
                  aria-expanded={showProfileMenu}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D4A657';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(212, 166, 87, 0.1)';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#D4A657">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {showProfileMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl py-2 z-50 border-[1.5px] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ 
                      backgroundColor: '#FAF9F7',
                      borderColor: '#D4A657'
                    }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(212, 166, 87, 0.3)' }}>
                      <p className="text-sm font-bold" style={{ color: '#1E293B' }}>{user?.name || 'User'}</p>
                      <p className="text-xs" style={{ color: '#64748b' }}>{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-200"
                      style={{ color: '#1E293B' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(212, 166, 87, 0.15)';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.paddingLeft = '16px';
                      }}
                    >
                      👤 Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-200"
                      style={{ color: '#1E293B' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(212, 166, 87, 0.15)';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.paddingLeft = '16px';
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Thin Horizontal Divider Line */}
        <div 
          className="w-full h-px" 
          style={{ 
            background: 'linear-gradient(to right, transparent, #D4A657, transparent)',
            opacity: 0.3
          }}
        ></div>
      </div>
    </div>
  );
};
