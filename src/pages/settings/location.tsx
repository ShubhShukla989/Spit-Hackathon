import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useUIStore } from '../../stores/uiStore';
import { getLocations, getWarehouses } from '../../services/mockApi';
import type { Location, Warehouse } from '../../services/mockApi';

export const LocationPage: React.FC = () => {
  const { addNotification } = useUIStore();
  const [locations, setLocations] = useState<Location[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', warehouseId: '', type: 'internal' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsData, warehousesData] = await Promise.all([
          getLocations(),
          getWarehouses(),
        ]);
        setLocations(locationsData);
        setWarehouses(warehousesData);
      } catch (error) {
        addNotification('error', 'Failed to fetch locations');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addNotification]);

  const handleCreate = () => {
    addNotification('success', 'Location created successfully');
    setShowModal(false);
    setFormData({ name: '', warehouseId: '', type: 'internal' });
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (location: Location) => (
        <span className="font-medium text-slate-850">{location.name}</span>
      ),
    },
    {
      key: 'warehouse',
      header: 'Warehouse',
      render: (location: Location) => location.warehouseName,
    },
    {
      key: 'type',
      header: 'Type',
      render: (location: Location) => (
        <Badge
          variant={
            location.type === 'internal'
              ? 'info'
              : location.type === 'supplier'
              ? 'success'
              : 'warning'
          }
        >
          {location.type}
        </Badge>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      render: (location: Location) => (
        <Badge variant={location.active ? 'success' : 'default'}>
          {location.active ? 'Active' : 'Inactive'}
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
          <h1 className="text-[28px] font-semibold mb-2">Locations</h1>
          <p className="text-slate-600">Manage storage locations</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          New Location
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <Table columns={columns} data={locations} />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Location"
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
            placeholder="Stock"
          />
          <Select
            label="Warehouse"
            value={formData.warehouseId}
            onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
            options={[
              { value: '', label: 'Select warehouse' },
              ...warehouses.map((w) => ({ value: w.id, label: w.name })),
            ]}
          />
          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'internal', label: 'Internal' },
              { value: 'supplier', label: 'Supplier' },
              { value: 'customer', label: 'Customer' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};
