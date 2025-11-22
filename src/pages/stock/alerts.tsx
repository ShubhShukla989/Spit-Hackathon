import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import { BackButton } from '../../components/BackButton';
import { KanbanToggle } from '../../components/KanbanToggle';
import { useUIStore } from '../../stores/uiStore';
import { getStockAlerts, getAlertCounts, type StockAlert } from '../../services/alertService';

export const StockAlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useUIStore();
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [alertCounts, setAlertCounts] = useState({ critical: 0, warning: 0, info: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [view, setView] = useState<'list' | 'kanban'>('list');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const [alertsData, counts] = await Promise.all([
        getStockAlerts(),
        getAlertCounts(),
      ]);
      setAlerts(alertsData);
      setAlertCounts(counts);
      
      // Show notification if there are critical alerts
      if (counts.critical > 0) {
        addNotification('error', `${counts.critical} critical stock alert(s) require immediate attention!`);
      }
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to fetch stock alerts');
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.severity === filter);

  const columns = [
    {
      key: 'severity',
      header: 'Status',
      render: (alert: StockAlert) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            alert.severity === 'critical'
              ? 'bg-red-100 text-red-800'
              : alert.severity === 'warning'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {alert.severity === 'critical' ? '🔴 Critical' : alert.severity === 'warning' ? '⚠️ Warning' : 'ℹ️ Info'}
        </span>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      render: (alert: StockAlert) => (
        <div>
          <p className="font-medium text-slate-850">{alert.product_name}</p>
          <p className="text-small text-slate-500">{alert.product_sku}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (alert: StockAlert) => alert.location_name,
    },
    {
      key: 'stock',
      header: 'Current Stock',
      render: (alert: StockAlert) => (
        <span className={`font-semibold ${
          alert.current_stock === 0 ? 'text-red-600' : 'text-slate-900'
        }`}>
          {alert.current_stock}
        </span>
      ),
    },
    {
      key: 'min',
      header: 'Min Required',
      render: (alert: StockAlert) => (
        <span className="text-slate-600">{alert.min_quantity}</span>
      ),
    },
    {
      key: 'shortage',
      header: 'Shortage',
      render: (alert: StockAlert) => (
        <span className="font-medium text-red-600">-{alert.shortage}</span>
      ),
    },
    {
      key: 'suggested',
      header: 'Suggested Order',
      render: (alert: StockAlert) => (
        <span className="font-semibold text-green-600">+{alert.suggested_order}</span>
      ),
    },
    {
      key: 'vendor',
      header: 'Vendor',
      render: (alert: StockAlert) => alert.preferred_vendor || 'N/A',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (alert: StockAlert) => (
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            onClick={() => {
              addNotification('info', `Creating order for ${alert.product_name}...`);
              // TODO: Implement create purchase order
            }}
          >
            Order Now
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton to="/stock" />
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">🔔 Stock Alerts</h1>
          <p className="text-slate-600 font-medium">Monitor low stock levels and reorder requirements</p>
        </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div 
          className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
            filter === 'all' ? 'border-primary' : 'border-slate-200 hover:border-slate-300'
          }`}
          onClick={() => setFilter('all')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Alerts</p>
              <p className="text-3xl font-bold text-slate-900">{alertCounts.total}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div 
          className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
            filter === 'critical' ? 'border-red-500' : 'border-slate-200 hover:border-red-300'
          }`}
          onClick={() => setFilter('critical')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Critical</p>
              <p className="text-3xl font-bold text-red-600">{alertCounts.critical}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔴</span>
            </div>
          </div>
        </div>

        <div 
          className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
            filter === 'warning' ? 'border-yellow-500' : 'border-slate-200 hover:border-yellow-300'
          }`}
          onClick={() => setFilter('warning')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Warning</p>
              <p className="text-3xl font-bold text-yellow-600">{alertCounts.warning}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div 
          className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
            filter === 'info' ? 'border-blue-500' : 'border-slate-200 hover:border-blue-300'
          }`}
          onClick={() => setFilter('info')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Info</p>
              <p className="text-3xl font-bold text-blue-600">{alertCounts.info}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">ℹ️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <KanbanToggle view={view} onChange={setView} />
          <Button variant="secondary" onClick={fetchAlerts}>
            🔄 Refresh
          </Button>
          <Button variant="secondary" onClick={() => navigate('/stock/rules')}>
            ⚙️ Manage Rules
          </Button>
        </div>
        {filter !== 'all' && (
          <Button variant="secondary" onClick={() => setFilter('all')}>
            Clear Filter
          </Button>
        )}
      </div>

        {/* Alerts Table/Kanban */}
        <div className="premium-container">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="loading-premium text-lg font-medium">Loading alerts...</div>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <span className="text-6xl mb-4">✅</span>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Alerts!</h3>
              <p className="text-slate-600">All stock levels are healthy</p>
            </div>
          ) : view === 'list' ? (
            <Table columns={columns} data={filteredAlerts} />
          ) : (
            <div className="p-6">
              {/* Kanban Board */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Critical Column */}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      Critical
                    </h3>
                    <span className="text-sm font-semibold text-red-600 bg-red-200 px-2 py-1 rounded-full">
                      {alerts.filter(a => a.severity === 'critical').length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {alerts.filter(a => a.severity === 'critical').map((alert) => (
                      <div
                        key={alert.id}
                        className="bg-white p-4 rounded-lg shadow-sm border-2 border-red-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-navy">{alert.product_name}</div>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                            🔴 Critical
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 mb-2">{alert.location_name}</div>
                        <div className="flex justify-between text-xs">
                          <span className="text-red-600 font-semibold">Stock: {alert.current_stock}</span>
                          <span className="text-slate-500">Min: {alert.min_quantity}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-red-100">
                          <div className="text-xs text-green-600 font-semibold">Order: +{alert.suggested_order}</div>
                        </div>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => addNotification('info', `Creating order for ${alert.product_name}...`)}
                          className="w-full mt-2"
                        >
                          Order Now
                        </Button>
                      </div>
                    ))}
                    {alerts.filter(a => a.severity === 'critical').length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">No critical alerts</div>
                    )}
                  </div>
                </div>

                {/* Warning Column */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      Warning
                    </h3>
                    <span className="text-sm font-semibold text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full">
                      {alerts.filter(a => a.severity === 'warning').length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {alerts.filter(a => a.severity === 'warning').map((alert) => (
                      <div
                        key={alert.id}
                        className="bg-white p-4 rounded-lg shadow-sm border-2 border-yellow-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-navy">{alert.product_name}</div>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                            ⚠️ Warning
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 mb-2">{alert.location_name}</div>
                        <div className="flex justify-between text-xs">
                          <span className="text-yellow-600 font-semibold">Stock: {alert.current_stock}</span>
                          <span className="text-slate-500">Min: {alert.min_quantity}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-yellow-100">
                          <div className="text-xs text-green-600 font-semibold">Order: +{alert.suggested_order}</div>
                        </div>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => addNotification('info', `Creating order for ${alert.product_name}...`)}
                          className="w-full mt-2"
                        >
                          Order Now
                        </Button>
                      </div>
                    ))}
                    {alerts.filter(a => a.severity === 'warning').length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">No warnings</div>
                    )}
                  </div>
                </div>

                {/* Info Column */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      Info
                    </h3>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                      {alerts.filter(a => a.severity === 'info').length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {alerts.filter(a => a.severity === 'info').map((alert) => (
                      <div
                        key={alert.id}
                        className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-navy">{alert.product_name}</div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            ℹ️ Info
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 mb-2">{alert.location_name}</div>
                        <div className="flex justify-between text-xs">
                          <span className="text-blue-600 font-semibold">Stock: {alert.current_stock}</span>
                          <span className="text-slate-500">Min: {alert.min_quantity}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-blue-100">
                          <div className="text-xs text-green-600 font-semibold">Order: +{alert.suggested_order}</div>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => addNotification('info', `Creating order for ${alert.product_name}...`)}
                          className="w-full mt-2"
                        >
                          Order Now
                        </Button>
                      </div>
                    ))}
                    {alerts.filter(a => a.severity === 'info').length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">No info alerts</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
