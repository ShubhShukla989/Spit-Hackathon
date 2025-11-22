import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Table } from '../../../components/Table';
import { StatusPill } from '../../../components/StatusPill';
import { KanbanToggle } from '../../../components/KanbanToggle';
import { EmptyState } from '../../../components/EmptyState';
import { getDeliveries } from '../../../services/mockApi';
import type { Delivery } from '../../../services/mockApi';
import { formatDate } from '../../../utils/formatters';

export const DeliveryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'kanban'>('list');

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await getDeliveries();
        const filter = searchParams.get('filter');
        
        if (filter === 'pending') {
          setDeliveries(data.filter((d) => d.status !== 'done'));
        } else {
          setDeliveries(data);
        }
      } catch (error) {
        console.error('Failed to fetch deliveries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [searchParams]);

  const columns = [
    {
      key: 'reference',
      header: 'Reference',
      render: (delivery: Delivery) => (
        <span className="font-medium text-slate-850">{delivery.reference}</span>
      ),
    },
    {
      key: 'partner',
      header: 'Partner',
      render: (delivery: Delivery) => delivery.partner,
    },
    {
      key: 'scheduledDate',
      header: 'Scheduled Date',
      render: (delivery: Delivery) => formatDate(delivery.scheduledDate),
    },
    {
      key: 'sourceDocument',
      header: 'Source',
      render: (delivery: Delivery) => delivery.sourceDocument || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (delivery: Delivery) => <StatusPill status={delivery.status} />,
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
          <h1 className="text-[28px] font-semibold mb-2">Delivery Orders</h1>
          <p className="text-slate-600">Manage outgoing inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <KanbanToggle view={view} onChange={setView} />
          <Button variant="primary" onClick={() => navigate('/operations/delivery/new')}>
            New Delivery
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        {deliveries.length === 0 ? (
          <EmptyState
            title="No deliveries found"
            description="Create your first delivery order to start tracking outgoing inventory"
            action={
              <Button variant="primary" onClick={() => navigate('/operations/delivery/new')}>
                Create Delivery
              </Button>
            }
          />
        ) : view === 'list' ? (
          <Table
            columns={columns}
            data={deliveries}
            onRowClick={(delivery) => navigate(`/operations/delivery/${delivery.id}`)}
          />
        ) : (
          <div className="p-6">
            <p className="text-center text-slate-500">Kanban view coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};
