import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Table } from '../../../components/Table';
import { StatusPill } from '../../../components/StatusPill';
import { KanbanToggle } from '../../../components/KanbanToggle';
import { EmptyState } from '../../../components/EmptyState';
import { getReceipts } from '../../../services/mockApi';
import type { Receipt } from '../../../services/mockApi';
import { formatDate } from '../../../utils/formatters';

export const ReceiptsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'kanban'>('list');

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const data = await getReceipts();
        const filter = searchParams.get('filter');
        
        if (filter === 'pending') {
          setReceipts(data.filter((r) => r.status !== 'done'));
        } else {
          setReceipts(data);
        }
      } catch (error) {
        console.error('Failed to fetch receipts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [searchParams]);

  const columns = [
    {
      key: 'reference',
      header: 'Reference',
      render: (receipt: Receipt) => (
        <span className="font-medium text-slate-850">{receipt.reference}</span>
      ),
    },
    {
      key: 'partner',
      header: 'Partner',
      render: (receipt: Receipt) => receipt.partner,
    },
    {
      key: 'scheduledDate',
      header: 'Scheduled Date',
      render: (receipt: Receipt) => formatDate(receipt.scheduledDate),
    },
    {
      key: 'sourceDocument',
      header: 'Source',
      render: (receipt: Receipt) => receipt.sourceDocument || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (receipt: Receipt) => <StatusPill status={receipt.status} />,
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
          <h1 className="text-[28px] font-semibold mb-2">Receipts</h1>
          <p className="text-slate-600">Manage incoming inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <KanbanToggle view={view} onChange={setView} />
          <Button variant="primary" onClick={() => navigate('/operations/receipts/new')}>
            New Receipt
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
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
            <p className="text-center text-slate-500">Kanban view coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};
