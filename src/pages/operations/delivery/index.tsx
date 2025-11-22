import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Table } from '../../../components/Table';
import { StatusPill } from '../../../components/StatusPill';
import { KanbanToggle } from '../../../components/KanbanToggle';
import { EmptyState } from '../../../components/EmptyState';
import { useUIStore } from '../../../stores/uiStore';
import { getDeliveries } from '../../../services/supabaseApi';
import { formatDate } from '../../../utils/formatters';

export const DeliveryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addNotification } = useUIStore();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'kanban'>('list');

  useEffect(() => {
    fetchDeliveries();
  }, [searchParams]);

  const fetchDeliveries = async () => {
    try {
      const data = await getDeliveries();
      const filter = searchParams.get('filter');
      
      if (filter === 'pending') {
        setDeliveries(data.filter((d: any) => d.status !== 'done'));
      } else {
        setDeliveries(data);
      }
    } catch (error: any) {
      console.error('Failed to fetch deliveries:', error);
      addNotification('error', error.message || 'Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'reference',
      header: 'Reference',
      render: (delivery: any) => (
        <span className="font-medium text-slate-850">{delivery.reference}</span>
      ),
    },
    {
      key: 'partner',
      header: 'Partner',
      render: (delivery: any) => delivery.partner,
    },
    {
      key: 'scheduledDate',
      header: 'Scheduled Date',
      render: (delivery: any) => formatDate(delivery.scheduled_date),
    },
    {
      key: 'sourceDocument',
      header: 'Source',
      render: (delivery: any) => delivery.source_document || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (delivery: any) => <StatusPill status={delivery.status} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-premium text-lg font-medium">Loading deliveries...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">📤 Delivery Orders</h1>
            <p className="text-slate-600 font-medium">Manage outgoing inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <KanbanToggle view={view} onChange={setView} />
            <Button variant="primary" onClick={() => navigate('/operations/delivery/new')}>
              ➕ New Delivery
            </Button>
          </div>
        </div>

        <div className="premium-container">
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
              {/* Kanban Board */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Draft Column */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                      Draft
                    </h3>
                    <span className="text-sm font-semibold text-slate-600 bg-slate-200 px-2 py-1 rounded-full">
                      {deliveries.filter(d => d.status === 'draft').length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {deliveries.filter(d => d.status === 'draft').map((delivery) => (
                      <div
                        key={delivery.id}
                        onClick={() => navigate(`/operations/delivery/${delivery.id}`)}
                        className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="font-semibold text-navy mb-2">{delivery.reference}</div>
                        <div className="text-sm text-slate-600 mb-2">{delivery.partner}</div>
                        <div className="text-xs text-slate-500">{formatDate(delivery.scheduled_date)}</div>
                      </div>
                    ))}
                    {deliveries.filter(d => d.status === 'draft').length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">No drafts</div>
                    )}
                  </div>
                </div>

                {/* Waiting Column */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      Waiting
                    </h3>
                    <span className="text-sm font-semibold text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full">
                      {deliveries.filter(d => d.status === 'waiting' || d.status === 'ready').length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {deliveries.filter(d => d.status === 'waiting' || d.status === 'ready').map((delivery) => (
                      <div
                        key={delivery.id}
                        onClick={() => navigate(`/operations/delivery/${delivery.id}`)}
                        className="bg-white p-4 rounded-lg shadow-sm border-2 border-yellow-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="font-semibold text-navy mb-2">{delivery.reference}</div>
                        <div className="text-sm text-slate-600 mb-2">{delivery.partner}</div>
                        <div className="text-xs text-slate-500">{formatDate(delivery.scheduled_date)}</div>
                      </div>
                    ))}
                    {deliveries.filter(d => d.status === 'waiting' || d.status === 'ready').length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">No waiting items</div>
                    )}
                  </div>
                </div>

                {/* Done Column */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      Done
                    </h3>
                    <span className="text-sm font-semibold text-green-600 bg-green-200 px-2 py-1 rounded-full">
                      {deliveries.filter(d => d.status === 'done').length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {deliveries.filter(d => d.status === 'done').map((delivery) => (
                      <div
                        key={delivery.id}
                        onClick={() => navigate(`/operations/delivery/${delivery.id}`)}
                        className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="font-semibold text-navy mb-2">{delivery.reference}</div>
                        <div className="text-sm text-slate-600 mb-2">{delivery.partner}</div>
                        <div className="text-xs text-slate-500">{formatDate(delivery.scheduled_date)}</div>
                        <div className="mt-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            ✓ Completed
                          </span>
                        </div>
                      </div>
                    ))}
                    {deliveries.filter(d => d.status === 'done').length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">No completed items</div>
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
