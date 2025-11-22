import React, { useEffect, useState } from 'react';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { getMoveHistory } from '../services/mockApi';
import type { MoveHistoryEntry } from '../services/mockApi';
import { formatDate } from '../utils/formatters';

export const MoveHistoryPage: React.FC = () => {
  const [moves, setMoves] = useState<MoveHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoves = async () => {
      try {
        const data = await getMoveHistory();
        setMoves(data);
      } catch (error) {
        console.error('Failed to fetch move history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoves();
  }, []);

  const columns = [
    {
      key: 'reference',
      header: 'Reference',
      render: (move: MoveHistoryEntry) => (
        <span className="font-medium text-slate-850">{move.reference}</span>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      render: (move: MoveHistoryEntry) => move.product,
    },
    {
      key: 'type',
      header: 'Type',
      render: (move: MoveHistoryEntry) => (
        <Badge variant={move.type === 'in' ? 'success' : 'danger'}>
          {move.type === 'in' ? 'IN' : 'OUT'}
        </Badge>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (move: MoveHistoryEntry) => (
        <span
          className={`font-medium ${
            move.type === 'in' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {move.type === 'in' ? '+' : '-'}
          {move.quantity}
        </span>
      ),
    },
    {
      key: 'from',
      header: 'From',
      render: (move: MoveHistoryEntry) => move.from,
    },
    {
      key: 'to',
      header: 'To',
      render: (move: MoveHistoryEntry) => move.to,
    },
    {
      key: 'date',
      header: 'Date',
      render: (move: MoveHistoryEntry) => formatDate(move.date),
    },
    {
      key: 'status',
      header: 'Status',
      render: (move: MoveHistoryEntry) => (
        <Badge variant={move.status === 'Done' ? 'success' : 'info'}>
          {move.status}
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
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold mb-2">Move History</h1>
        <p className="text-slate-600">Track all inventory movements</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <Table columns={columns} data={moves} emptyMessage="No moves recorded" />
      </div>
    </div>
  );
};
