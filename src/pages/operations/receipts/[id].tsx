import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { StatusPill } from '../../../components/StatusPill';
import { Card } from '../../../components/Card';
import { useUIStore } from '../../../stores/uiStore';
import { getReceipt, validateReceipt, createReceipt, getProducts } from '../../../services/mockApi';
import type { Receipt } from '../../../services/mockApi';
import { formatDate } from '../../../utils/formatters';

export const ReceiptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useUIStore();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProducts();

        if (id === 'new') {
          setIsNew(true);
          setReceipt({
            id: 'new',
            reference: 'Draft',
            status: 'draft',
            partner: '',
            scheduledDate: new Date().toISOString().split('T')[0],
            lines: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else if (id) {
          const data = await getReceipt(id);
          setReceipt(data);
        }
      } catch (error) {
        addNotification('error', 'Failed to load receipt');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, addNotification]);

  const handleValidate = async () => {
    if (!receipt || !id) return;

    try {
      if (isNew) {
        const newReceipt = await createReceipt(receipt);
        addNotification('success', 'Receipt created successfully');
        navigate(`/operations/receipts/${newReceipt.id}`);
      } else {
        const updated = await validateReceipt(id);
        setReceipt(updated);
        addNotification('success', 'Receipt validated successfully');
      }
    } catch (error) {
      addNotification('error', 'Failed to validate receipt');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = () => {
    navigate('/operations/receipts');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Receipt not found</p>
        <Button variant="secondary" onClick={() => navigate('/operations/receipts')} className="mt-4">
          Back to Receipts
        </Button>
      </div>
    );
  }

  return (
    <div className="px-8 py-6 print-container">
      <div className="print-header">
        <h1 className="text-[28px] font-bold text-slate-850">{receipt.reference}</h1>
        <div className="print-meta">
          <p>Date: {formatDate(receipt.scheduledDate)}</p>
          <p>Partner: {receipt.partner}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 no-print actions">
        <div className="flex items-center gap-4">
          <h1 className="text-[28px] font-semibold">{receipt.reference}</h1>
          <StatusPill status={receipt.status} />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">New</Button>
          {receipt.status !== 'done' && (
            <Button variant="primary" size="sm" onClick={handleValidate}>
              Validate
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handlePrint}>
            Print
          </Button>
          <Button variant="danger" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>

      <Card className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Receipt ID"
            value={receipt.reference}
            disabled
          />
          <Input
            label="Receive From"
            value={receipt.partner}
            onChange={(e) => setReceipt({ ...receipt, partner: e.target.value })}
            disabled={!isNew && receipt.status !== 'draft'}
          />
          <Input
            label="Responsible"
            value="Auto-assigned"
            disabled
          />
          <Input
            label="Schedule Date"
            type="date"
            value={receipt.scheduledDate}
            onChange={(e) => setReceipt({ ...receipt, scheduledDate: e.target.value })}
            disabled={!isNew && receipt.status !== 'draft'}
          />
        </div>
      </Card>

      <Card className="mt-8">
        <h2 className="text-[20px] font-semibold mb-4">Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Unit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {receipt.lines.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                    No products added
                  </td>
                </tr>
              ) : (
                receipt.lines.map((line) => (
                  <tr key={line.id}>
                    <td className="px-4 py-3 text-sm text-slate-700">{line.productName}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{line.quantity}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{line.unit}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="signature-lines mt-8">
        <div className="sig">
          <p>Prepared By</p>
        </div>
        <div className="sig">
          <p>Checked By</p>
        </div>
        <div className="sig">
          <p>Approved By</p>
        </div>
      </div>
    </div>
  );
};
