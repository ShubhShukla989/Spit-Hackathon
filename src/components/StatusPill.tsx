import React from 'react';
import type { ReceiptStatus, DeliveryStatus } from '../services/mockApi';

interface StatusPillProps {
  status: ReceiptStatus | DeliveryStatus | 'canceled';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const statusConfig = {
    draft: { label: 'Draft', className: 'bg-slate-200 text-slate-700' },
    waiting: { label: 'Waiting', className: 'bg-yellow-100 text-yellow-700' },
    ready: { label: 'Ready', className: 'bg-blue-100 text-blue-700' },
    done: { label: 'Done', className: 'bg-green-100 text-green-700' },
    canceled: { label: 'Canceled', className: 'bg-red-100 text-red-700' },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};
