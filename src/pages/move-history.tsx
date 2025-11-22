import React, { useEffect, useState } from 'react';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { useUIStore } from '../stores/uiStore';
import { getMoveHistory } from '../services/supabaseApi';
import { formatDate } from '../utils/formatters';

export const MoveHistoryPage: React.FC = () => {
  const { addNotification } = useUIStore();
  const [moves, setMoves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoves();
  }, []);

  const fetchMoves = async () => {
    try {
      const data = await getMoveHistory();
      setMoves(data);
    } catch (error: any) {
      console.error('Failed to fetch move history:', error);
      addNotification('error', error.message || 'Failed to fetch move history');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'reference',
      header: 'Reference',
      render: (move: any) => (
        <span className="font-medium text-slate-850">{move.reference}</span>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      render: (move: any) => move.product_name || 'N/A',
    },
    {
      key: 'type',
      header: 'Type',
      render: (move: any) => (
        <Badge variant={move.quantity_change > 0 ? 'success' : 'danger'}>
          {move.operation_type?.toUpperCase() || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (move: any) => (
        <span
          className={`font-medium ${
            move.quantity_change > 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {move.quantity_change > 0 ? '+' : ''}
          {move.quantity_change}
        </span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (move: any) => move.location_name || 'N/A',
    },
    {
      key: 'warehouse',
      header: 'Warehouse',
      render: (move: any) => move.warehouse_name || 'N/A',
    },
    {
      key: 'date',
      header: 'Date',
      render: (move: any) => formatDate(move.created_at),
    },
    {
      key: 'user',
      header: 'User',
      render: (move: any) => move.created_by_name || 'System',
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">📜 Move History</h1>
          <p className="text-slate-600 font-medium">Track all inventory movements</p>
        </div>

        <div className="premium-container">
          <Table columns={columns} data={moves} emptyMessage="No moves recorded" />
        </div>
      </div>
    </div>
  );
};
