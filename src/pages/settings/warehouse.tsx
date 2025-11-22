import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { useUIStore } from '../../stores/uiStore';
import { getWarehouses, createWarehouse, updateWarehouse } from '../../services/supabaseApi';

export const WarehousePage: React.FC = () => {
  const { addNotification } = useUIStore();
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', address: '' });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const data = await getWarehouses();
      setWarehouses(data);
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createWarehouse({
        name: formData.name,
        code: formData.code,
        address: formData.address,
      });
      addNotification('success', 'Warehouse created successfully');
      setShowModal(false);
      setFormData({ name: '', code: '', address: '' });
      fetchWarehouses();
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to create warehouse');
    }
  };

  // @ts-ignore
  const handleUpdate = async () => {
    if (!editingWarehouse) return;
    try {
      await updateWarehouse(editingWarehouse.id, {
        name: formData.name,
        code: formData.code,
        address: formData.address,
      });
      addNotification('success', 'Warehouse updated successfully');
      setShowModal(false);
      setEditingWarehouse(null);
      setFormData({ name: '', code: '', address: '' });
      fetchWarehouses();
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to update warehouse');
    }
  };

  // @ts-ignore
  const handleEdit = (warehouse: any) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      code: warehouse.code,
      address: warehouse.address || '',
    });
    setShowModal(true);
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (warehouse: any) => (
        <span className="font-medium text-slate-850">{warehouse.name}</span>
      ),
    },
    {
      key: 'code',
      header: 'Code',
      render: (warehouse: any) => warehouse.code,
    },
    {
      key: 'address',
      header: 'Address',
      render: (warehouse: any) => warehouse.address,
    },
    {
      key: 'active',
      header: 'Status',
      render: (warehouse: any) => (
        <Badge variant={warehouse.active ? 'success' : 'default'}>
          {warehouse.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">🏢 Warehouses</h1>
            <p className="text-slate-600 font-medium">Manage warehouse locations</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            ➕ New Warehouse
          </Button>
        </div>

        <div className="premium-container">
          <Table columns={columns} data={warehouses} />
        </div>

        <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Warehouse"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Main Warehouse"
          />
          <Input
            label="Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="WH-MAIN"
          />
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="123 Industrial Blvd"
          />
        </div>
      </Modal>
      </div>
    </div>
  );
};
