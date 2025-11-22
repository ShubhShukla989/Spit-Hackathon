import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { KanbanToggle } from '../../components/KanbanToggle';
import { useUIStore } from '../../stores/uiStore';
import { 
  getReorderRules, 
  createReorderRule, 
  updateReorderRule, 
  deleteReorderRule,
  getProducts,
  getLocations 
} from '../../services/supabaseApi';

export const ReorderingRulesPage: React.FC = () => {
  const { addNotification } = useUIStore();
  const [rules, setRules] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingRule, setEditingRule] = useState<any | null>(null);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [formData, setFormData] = useState({
    product_id: '',
    location_id: '',
    min_quantity: '',
    max_quantity: '',
    preferred_vendor: '',
    auto_replenish: false,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [rulesData, productsData, locationsData] = await Promise.all([
        getReorderRules(),
        getProducts(),
        getLocations(),
      ]);
      setRules(rulesData);
      setProducts(productsData);
      setLocations(locationsData);
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.product_id || !formData.min_quantity || !formData.max_quantity) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      await createReorderRule({
        product_id: formData.product_id,
        location_id: formData.location_id || undefined,
        min_quantity: parseInt(formData.min_quantity),
        max_quantity: parseInt(formData.max_quantity),
        preferred_vendor: formData.preferred_vendor || undefined,
        auto_replenish: formData.auto_replenish,
      });
      
      addNotification('success', 'Reordering rule created successfully');
      await fetchInitialData();
      handleCloseDrawer();
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to create rule');
    }
  };

  const handleUpdate = async () => {
    if (!editingRule) return;
    
    if (!formData.product_id || !formData.min_quantity || !formData.max_quantity) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      await updateReorderRule(editingRule.id, {
        product_id: formData.product_id,
        location_id: formData.location_id || null,
        min_quantity: parseInt(formData.min_quantity),
        max_quantity: parseInt(formData.max_quantity),
        preferred_vendor: formData.preferred_vendor || null,
        auto_replenish: formData.auto_replenish,
      });
      
      addNotification('success', 'Reordering rule updated successfully');
      await fetchInitialData();
      handleCloseDrawer();
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to update rule');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    
    try {
      await deleteReorderRule(id);
      addNotification('success', 'Reordering rule deleted successfully');
      await fetchInitialData();
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to delete rule');
    }
  };

  const handleEdit = (rule: any) => {
    setEditingRule(rule);
    setFormData({
      product_id: rule.product_id || '',
      location_id: rule.location_id || '',
      min_quantity: rule.min_quantity?.toString() || '',
      max_quantity: rule.max_quantity?.toString() || '',
      preferred_vendor: rule.preferred_vendor || '',
      auto_replenish: rule.auto_replenish || false,
    });
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditingRule(null);
    setFormData({
      product_id: '',
      location_id: '',
      min_quantity: '',
      max_quantity: '',
      preferred_vendor: '',
      auto_replenish: false,
    });
  };

  const columns = [
    {
      key: 'product',
      header: 'Product',
      render: (rule: any) => (
        <div>
          <p className="font-medium text-slate-850">{rule.product?.name || 'N/A'}</p>
          <p className="text-small text-slate-500">{rule.product?.sku || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (rule: any) => rule.location?.name || 'All Locations',
    },
    {
      key: 'minQuantity',
      header: 'Min Quantity',
      render: (rule: any) => (
        <span className="font-medium">{rule.min_quantity}</span>
      ),
    },
    {
      key: 'maxQuantity',
      header: 'Max Quantity',
      render: (rule: any) => (
        <span className="font-medium">{rule.max_quantity}</span>
      ),
    },
    {
      key: 'preferredVendor',
      header: 'Preferred Vendor',
      render: (rule: any) => rule.preferred_vendor || 'N/A',
    },
    {
      key: 'autoReplenish',
      header: 'Auto Replenish',
      render: (rule: any) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            rule.auto_replenish
              ? 'bg-green-100 text-green-800'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {rule.auto_replenish ? 'Enabled' : 'Disabled'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (rule: any) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => handleEdit(rule)}>
            Edit
          </Button>
          <Button variant="secondary" onClick={() => handleDelete(rule.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">⚙️ Reordering Rules</h1>
            <p className="text-slate-600 font-medium">Configure automatic reordering rules</p>
          </div>
          <div className="flex items-center gap-3">
            <KanbanToggle view={view} onChange={setView} />
            <Button variant="primary" onClick={() => setShowDrawer(true)}>
              ➕ New Rule
            </Button>
          </div>
        </div>

        <div className="premium-container">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="loading-premium text-lg font-medium">Loading rules...</div>
            </div>
          ) : view === 'list' ? (
            <Table columns={columns} data={rules} />
          ) : (
            <div className="p-6">
              {/* Kanban Board - Group by Auto Replenish Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Auto Replenish Enabled Column */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      Auto Replenish
                    </h3>
                    <span className="text-sm font-semibold text-green-600 bg-green-200 px-2 py-1 rounded-full">
                      {rules.filter(r => r.auto_replenish).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {rules.filter(r => r.auto_replenish).map((rule) => (
                      <div
                        key={rule.id}
                        className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="font-semibold text-navy mb-2">{rule.product?.name || 'N/A'}</div>
                        <div className="text-xs text-slate-500 mb-2">{rule.product?.sku || 'N/A'}</div>
                        <div className="text-sm text-slate-600 mb-2">
                          📍 {rule.location?.name || 'All Locations'}
                        </div>
                        <div className="flex items-center gap-3 text-sm mb-3">
                          <span className="text-slate-600">Min: <strong>{rule.min_quantity}</strong></span>
                          <span className="text-slate-600">Max: <strong>{rule.max_quantity}</strong></span>
                        </div>
                        {rule.preferred_vendor && (
                          <div className="text-xs text-slate-500 mb-3">
                            🏢 {rule.preferred_vendor}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(rule)}>
                            Edit
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(rule.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    {rules.filter(r => r.auto_replenish).length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">No auto-replenish rules</div>
                    )}
                  </div>
                </div>

                {/* Manual Replenish Column */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      Manual
                    </h3>
                    <span className="text-sm font-semibold text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full">
                      {rules.filter(r => !r.auto_replenish).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {rules.filter(r => !r.auto_replenish).map((rule) => (
                      <div
                        key={rule.id}
                        className="bg-white p-4 rounded-lg shadow-sm border-2 border-yellow-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="font-semibold text-navy mb-2">{rule.product?.name || 'N/A'}</div>
                        <div className="text-xs text-slate-500 mb-2">{rule.product?.sku || 'N/A'}</div>
                        <div className="text-sm text-slate-600 mb-2">
                          📍 {rule.location?.name || 'All Locations'}
                        </div>
                        <div className="flex items-center gap-3 text-sm mb-3">
                          <span className="text-slate-600">Min: <strong>{rule.min_quantity}</strong></span>
                          <span className="text-slate-600">Max: <strong>{rule.max_quantity}</strong></span>
                        </div>
                        {rule.preferred_vendor && (
                          <div className="text-xs text-slate-500 mb-3">
                            🏢 {rule.preferred_vendor}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(rule)}>
                            Edit
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(rule.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    {rules.filter(r => !r.auto_replenish).length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">No manual rules</div>
                    )}
                  </div>
                </div>

                {/* All Rules Column */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      All Rules
                    </h3>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                      {rules.length}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {rules.map((rule) => (
                      <div
                        key={rule.id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="font-semibold text-navy mb-1">{rule.product?.name || 'N/A'}</div>
                        <div className="text-xs text-slate-500 mb-2">{rule.product?.sku || 'N/A'}</div>
                        <div className="flex items-center gap-2 text-xs mb-2">
                          <span className={`px-2 py-1 rounded ${rule.auto_replenish ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {rule.auto_replenish ? '🔄 Auto' : '✋ Manual'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(rule)}>
                            Edit
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(rule.id)}>
                            Del
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Modal
          isOpen={showDrawer}
          onClose={handleCloseDrawer}
          title={editingRule ? 'Edit Reordering Rule' : 'Create Reordering Rule'}
          footer={
            <>
              <Button variant="secondary" onClick={handleCloseDrawer}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={editingRule ? handleUpdate : handleCreate}
              >
                {editingRule ? 'Update' : 'Create'}
              </Button>
            </>
          }
        >
        <div className="space-y-4">
          <Select
            label="Product *"
            value={formData.product_id}
            onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
            options={[
              { value: '', label: 'Select product' },
              ...products.map((p) => ({ value: p.id, label: `${p.name} (${p.sku})` })),
            ]}
          />
          
          <Select
            label="Location (Optional)"
            value={formData.location_id}
            onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
            options={[
              { value: '', label: 'All locations' },
              ...locations.map((l) => ({ 
                value: l.id, 
                label: `${l.name} - ${l.warehouse?.name || 'Unknown'}` 
              })),
            ]}
          />

          <Input
            label="Minimum Quantity *"
            type="number"
            value={formData.min_quantity}
            onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
            placeholder="Enter minimum quantity"
          />
          
          <Input
            label="Maximum Quantity *"
            type="number"
            value={formData.max_quantity}
            onChange={(e) => setFormData({ ...formData, max_quantity: e.target.value })}
            placeholder="Enter maximum quantity"
          />
          
          <Input
            label="Preferred Vendor"
            value={formData.preferred_vendor}
            onChange={(e) => setFormData({ ...formData, preferred_vendor: e.target.value })}
            placeholder="Enter vendor name"
          />
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoReplenish"
              checked={formData.auto_replenish}
              onChange={(e) =>
                setFormData({ ...formData, auto_replenish: e.target.checked })
              }
              className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
            />
            <label htmlFor="autoReplenish" className="text-sm font-medium text-slate-700">
              Enable Auto Replenish
            </label>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};
