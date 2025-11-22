import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Table } from '../../../components/Table';
import { StatusPill } from '../../../components/StatusPill';
import { KanbanToggle } from '../../../components/KanbanToggle';
import { EmptyState } from '../../../components/EmptyState';
import { useUIStore } from '../../../stores/uiStore';
import { getReceipts } from '../../../services/supabaseApi';
import { formatDate } from '../../../utils/formatters';

export const ReceiptsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addNotification } = useUIStore();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'kanban'>('list');

  useEffect(() => {
    fetchReceipts();
  }, [searchParams]);

  const fetchReceipts = async () => {
    try {
      const data = await getReceipts();
      const filter = searchParams.get('filter');
      
      if (filter === 'pending') {
        setReceipts(data.filter((r: any) => r.status !== 'done'));
      } else {
        setReceipts(data);
      }
    } catch (error: any) {
      console.error('Failed to fetch receipts:', error);
      addNotification('error', error.message || 'Failed to fetch receipts');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'reference',
      header: 'Reference',
      render: (receipt: any) => (
        <span className="font-medium text-slate-850">{receipt.reference}</span>
      ),
    },
    {
      key: 'partner',
      header: 'Partner',
      render: (receipt: any) => receipt.partner,
    },
    {
      key: 'scheduledDate',
      header: 'Scheduled Date',
      render: (receipt: any) => formatDate(receipt.scheduled_date),
    },
    {
      key: 'sourceDocument',
      header: 'Source',
      render: (receipt: any) => receipt.source_document || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (receipt: any) => <StatusPill status={receipt.status} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-premium text-lg font-medium">Loading receipts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">📥 Receipts</h1>
            <p className="text-slate-600 font-medium">Manage incoming inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <KanbanToggle view={view} onChange={setView} />
            <Button variant="primary" onClick={() => navigate('/operations/receipts/new')}>
              ➕ New Receipt
            </Button>
          </div>
        </div>

        <div className="premium-container">
          {receipts.length === 0 ? (
            <EmptyState
              title="No receipts found"
              description="Create your first receipt to start tracking incoming inventory"
              action={
                <Button variant="primary" onClick={() => navigate('/operations/receipts/new')}>
                  Create Receipt
                </Button>
              }
            />
          ) : view === 'list' ? (
            <Table
              columns={columns}
              data={receipts}
              onRowClick={(receipt) => navigate(`/operations/receipts/${receipt.id}`)}
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
                      {receipts.filter(r => r.status === 'draft').length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {receipts.filter(r => r.status === 'draft').map((receipt) => (
                      <div
                        key={receipt.id}
                        onClick={() => navigate(`/operations/receipts/${receipt.id}`)}
                        className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="font-semibold text-navy mb-2">{receipt.reference}</div>
                        <div className="text-sm text-slate-600 mb-2">{receipt.partner}</div>
                        <div className="text-xs text-slate-500">{formatDate(receipt.scheduled_date)}</div>
                      </div>
                    ))}
                    {receipts.filter(r => r.status === 'draft').length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">No drafts</div>
                    )}
                  </div>
                </div>

                {/* Ready Column */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      Ready
                    </h3>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                      {receipts.filter(r => r.status === 'ready' || r.status === 'waiting').length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {receipts.filter(r => r.status === 'ready' || r.status === 'waiting').map((receipt) => (
                      <div
                        key={receipt.id}
                        onClick={() => navigate(`/operations/receipts/${receipt.id}`)}
                        className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="font-semibold text-navy mb-2">{receipt.reference}</div>
                        <div className="text-sm text-slate-600 mb-2">{receipt.partner}</div>
                        <div className="text-xs text-slate-500">{formatDate(receipt.scheduled_date)}</div>
                      </div>
                    ))}
                    {receipts.filter(r => r.status === 'ready' || r.status === 'waiting').length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">No ready items</div>
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
                      {receipts.filter(r => r.status === 'done').length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {receipts.filter(r => r.status === 'done').map((receipt) => (
                      <div
                        key={receipt.id}
                        onClick={() => navigate(`/operations/receipts/${receipt.id}`)}
                        className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="font-semibold text-navy mb-2">{receipt.reference}</div>
                        <div className="text-sm text-slate-600 mb-2">{receipt.partner}</div>
                        <div className="text-xs text-slate-500">{formatDate(receipt.scheduled_date)}</div>
                        <div className="mt-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            ✓ Completed
                          </span>
                        </div>
                      </div>
                    ))}
                    {receipts.filter(r => r.status === 'done').length === 0 && (
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
