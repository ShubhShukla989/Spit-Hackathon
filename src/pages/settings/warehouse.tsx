import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { useUIStore } from '../../stores/uiStore';
import { getWarehouses } from '../../services/mockApi';
import type { Warehouse } from '../../services/mockApi';

export const WarehousePage: React.FC = () => {
  const { addNotification } = useUIStore();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', address: '' });

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getWarehouses();
        setWarehouses(data);
      } catch (error) {
        addNotification('error', 'Failed to fetch warehouses');
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, [addNotification]);

  const handleCreate = () => {
    addNotification('success', 'Warehouse created successfully');
    setShowModal(false);
    setFormData({ name: '', code: '', address: '' });
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (warehouse: Warehouse) => (
        <span className="font-medium text-slate-850">{warehouse.name}</span>
      ),
    },
    {
      key: 'code',
      header: 'Code',
      render: (warehouse: Warehouse) => warehouse.code,
    },
    {
      key: 'address',
      header: 'Address',
      render: (warehouse: Warehouse) => warehouse.address,
    },
    {
      key: 'active',
      header: 'Status',
      render: (warehouse: Warehouse) => (
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
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold mb-2">Warehouses</h1>
          <p className="text-slate-600">Manage warehouse locations</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          New Warehouse
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
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
  );
};
