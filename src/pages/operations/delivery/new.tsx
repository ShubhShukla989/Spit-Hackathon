import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { BackButton } from '../../../components/BackButton';
import { useUIStore } from '../../../stores/uiStore';
import { getProducts, getLocations, createDelivery } from '../../../services/supabaseApi';

export const NewDeliveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useUIStore();
  const [products, setProducts] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    partner: '',
    scheduled_date: new Date().toISOString().split('T')[0],
    source_document: '',
    location_id: '',
  });

  const [lines, setLines] = useState<Array<{
    product_id: string;
    quantity: number;
    location_id: string;
  }>>([
    { product_id: '', quantity: 1, location_id: '' }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, locationsData] = await Promise.all([
        getProducts(),
        getLocations(),
      ]);
      setProducts(productsData);
      setLocations(locationsData);
      
      // Set default location if available
      if (locationsData.length > 0) {
        setFormData(prev => ({ ...prev, location_id: locationsData[0].id }));
        setLines([{ product_id: '', quantity: 1, location_id: locationsData[0].id }]);
      }
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const addLine = () => {
    setLines([...lines, { product_id: '', quantity: 1, location_id: formData.location_id }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.partner) {
      addNotification('error', 'Partner/Customer name is required');
      return;
    }

    if (!formData.location_id) {
      addNotification('error', 'Source location is required');
      return;
    }

    const validLines = lines.filter(line => line.product_id && line.quantity > 0);
    if (validLines.length === 0) {
      addNotification('error', 'Please add at least one product line');
      return;
    }

    setSaving(true);
    try {
      const deliveryData = {
        partner: formData.partner,
        scheduled_date: formData.scheduled_date,
        source_document: formData.source_document || null,
        location_id: formData.location_id,
        status: 'draft',
        lines: validLines.map(line => ({
          product_id: line.product_id,
          quantity: line.quantity,
          location_id: line.location_id || formData.location_id,
        })),
      };

      const newDelivery = await createDelivery(deliveryData);
      addNotification('success', 'Delivery order created successfully');
      navigate(`/operations/delivery/${newDelivery.id}`);
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to create delivery order');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-premium text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton to="/operations/delivery" />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">📤 New Delivery Order</h1>
          <p className="text-slate-600 font-medium">Create a new outgoing inventory delivery</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="premium-container mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-navy mb-4">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Partner / Customer *"
                  value={formData.partner}
                  onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
                  placeholder="Enter customer name"
                  required
                />
                
                <Input
                  label="Scheduled Date *"
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  required
                />
                
                <Input
                  label="Source Document"
                  value={formData.source_document}
                  onChange={(e) => setFormData({ ...formData, source_document: e.target.value })}
                  placeholder="SO-001, etc."
                />
                
                <Select
                  label="Source Location *"
                  value={formData.location_id}
                  onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                  options={[
                    { value: '', label: 'Select location' },
                    ...locations.map((l) => ({ 
                      value: l.id, 
                      label: `${l.name} - ${l.warehouse?.name || 'Unknown'}` 
                    })),
                  ]}
                  required
                />
              </div>
            </div>
          </div>

          <div className="premium-container mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-navy">Products</h2>
                <Button type="button" variant="secondary" onClick={addLine}>
                  ➕ Add Product
                </Button>
              </div>

              <div className="space-y-4">
                {lines.map((line, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Select
                        label="Product *"
                        value={line.product_id}
                        onChange={(e) => updateLine(index, 'product_id', e.target.value)}
                        options={[
                          { value: '', label: 'Select product' },
                          ...products.map((p) => ({ 
                            value: p.id, 
                            label: `${p.name} (${p.sku})` 
                          })),
                        ]}
                        required
                      />
                    </div>
                    
                    <div className="w-32">
                      <Input
                        label="Quantity *"
                        type="number"
                        min="1"
                        value={line.quantity.toString()}
                        onChange={(e) => updateLine(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <Select
                        label="Location"
                        value={line.location_id || formData.location_id}
                        onChange={(e) => updateLine(index, 'location_id', e.target.value)}
                        options={[
                          { value: '', label: 'Use default' },
                          ...locations.map((l) => ({ 
                            value: l.id, 
                            label: `${l.name}` 
                          })),
                        ]}
                      />
                    </div>
                    
                    {lines.length > 1 && (
                      <Button
                        type="button"
                        variant="delete"
                        onClick={() => removeLine(index)}
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/operations/delivery')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
            >
              {saving ? 'Creating...' : 'Create Delivery Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
