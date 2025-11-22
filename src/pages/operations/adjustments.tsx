import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useUIStore } from '../../stores/uiStore';
import { getProducts, getLocations, createStockAdjustment } from '../../services/supabaseApi';

export const AdjustmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useUIStore();
  const [products, setProducts] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    location_id: '',
    quantity_change: '',
    reason: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [productsData, locationsData] = await Promise.all([
        getProducts(),
        getLocations(),
      ]);
      setProducts(productsData);
      setLocations(locationsData);
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.product_id || !formData.location_id || !formData.quantity_change) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      await createStockAdjustment({
        product_id: formData.product_id,
        location_id: formData.location_id,
        quantity_change: parseInt(formData.quantity_change),
        reason: formData.reason || 'Manual adjustment',
      });
      
      addNotification('success', 'Stock adjustment created successfully');
      setShowModal(false);
      setFormData({
        product_id: '',
        location_id: '',
        quantity_change: '',
        reason: '',
      });
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to create adjustment');
    }
  };

  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">⚖️ Stock Adjustments</h1>
            <p className="text-slate-600 font-medium">Manage inventory adjustments</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            ➕ New Adjustment
          </Button>
        </div>

        <div className="premium-container p-12">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Create Stock Adjustments</h2>
            <p className="text-slate-600 mb-6">Click "New Adjustment" to create a stock adjustment</p>
          </div>
        </div>

        {/* Adjustment Modal */}
        <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="New Stock Adjustment"
      >
        <div className="space-y-4">
          <Select
            label="Product"
            value={formData.product_id}
            onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
            options={[
              { value: '', label: 'Select product' },
              ...products.map((p) => ({ value: p.id, label: `${p.name} (${p.sku})` })),
            ]}
          />
          
          <Select
            label="Location"
            value={formData.location_id}
            onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
            options={[
              { value: '', label: 'Select location' },
              ...locations.map((l) => ({ 
                value: l.id, 
                label: `${l.name} - ${l.warehouse?.name || 'Unknown'}` 
              })),
            ]}
          />

          <Input
            label="Quantity Change"
            type="number"
            value={formData.quantity_change}
            onChange={(e) => setFormData({ ...formData, quantity_change: e.target.value })}
            placeholder="Enter quantity (use negative for decrease)"
          />

          <Input
            label="Reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Enter reason for adjustment"
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Adjustment
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};
