import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { StatusPill } from '../../../components/StatusPill';
import { Card } from '../../../components/Card';
import { useUIStore } from '../../../stores/uiStore';
import { getDelivery, validateDelivery, createDelivery, getProducts } from '../../../services/mockApi';
import type { Delivery } from '../../../services/mockApi';
import { formatDate } from '../../../utils/formatters';

export const DeliveryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useUIStore();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProducts();

        if (id === 'new') {
          setIsNew(true);
          setDelivery({
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
          const data = await getDelivery(id);
          setDelivery(data);
        }
      } catch (error) {
        addNotification('error', 'Failed to load delivery');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, addNotification]);

  const handleValidate = async () => {
    if (!delivery || !id) return;

    try {
      if (isNew) {
        const newDelivery = await createDelivery(delivery);
        addNotification('success', 'Delivery created successfully');
        navigate(`/operations/delivery/${newDelivery.id}`);
      } else {
        const updated = await validateDelivery(id);
        setDelivery(updated);
        
        if (updated.status === 'waiting') {
          addNotification('warning', 'Delivery marked as waiting due to insufficient stock');
        } else {
          addNotification('success', 'Delivery validated successfully');
        }
      }
    } catch (error) {
      addNotification('error', 'Failed to validate delivery');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = () => {
    navigate('/operations/delivery');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Delivery not found</p>
        <Button variant="secondary" onClick={() => navigate('/operations/delivery')} className="mt-4">
          Back to Deliveries
        </Button>
      </div>
    );
  }

  return (
    <div className="px-8 py-6 print-container">
      <div className="print-header">
        <h1 className="text-[28px] font-bold text-slate-850">{delivery.reference}</h1>
        <div className="print-meta">
          <p>Date: {formatDate(delivery.scheduledDate)}</p>
          <p>Partner: {delivery.partner}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 no-print actions">
        <div className="flex items-center gap-4">
          <h1 className="text-[28px] font-semibold">{delivery.reference}</h1>
          <StatusPill status={delivery.status} />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">New</Button>
          {delivery.status !== 'done' && delivery.status !== 'waiting' && (
            <Button variant="primary" size="sm" onClick={handleValidate}>
              Validate
            </Button>
          )}
          {delivery.status === 'waiting' && (
            <Button variant="primary" size="sm" onClick={handleValidate} disabled>
              Waiting for Stock
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
            label="Delivery ID"
            value={delivery.reference}
            disabled
          />
          <Input
            label="Delivery Address"
            value={delivery.partner}
            onChange={(e) => setDelivery({ ...delivery, partner: e.target.value })}
            disabled={!isNew && delivery.status !== 'draft'}
          />
          <Input
            label="Responsible"
            value="Auto-assigned"
            disabled
          />
          <Input
            label="Schedule Date"
            type="date"
            value={delivery.scheduledDate}
            onChange={(e) => setDelivery({ ...delivery, scheduledDate: e.target.value })}
            disabled={!isNew && delivery.status !== 'draft'}
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
                  Available
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {delivery.lines.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No products added
                  </td>
                </tr>
              ) : (
                delivery.lines.map((line) => {
                  const isInsufficient = line.quantity > line.available;
                  const difference = line.available - line.quantity;
                  return (
                    <tr key={line.id} className={isInsufficient ? 'bg-red-50' : ''}>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          {line.productName}
                          {isInsufficient && (
                            <span
                              className="text-red-600 text-xs cursor-help"
                              title="Insufficient stock — waiting"
                            >
                              ⚠️
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isInsufficient ? 'text-red-600 font-medium' : 'text-slate-700'}`}>
                        {line.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {line.available}
                      </td>
                      <td className={`px-4 py-3 text-sm font-medium ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {difference >= 0 ? `+${difference}` : difference}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {delivery.lines.some((line) => line.quantity > line.available) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800 flex items-center gap-2">
              <span>⚠️</span>
              <span>Some products have insufficient stock. This delivery will be marked as "Waiting" until stock is available.</span>
            </p>
          </div>
        )}
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
