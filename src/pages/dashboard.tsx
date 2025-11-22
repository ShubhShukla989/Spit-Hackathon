import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReceipts, getDeliveries } from '../services/mockApi';
import type { Receipt, Delivery } from '../services/mockApi';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [receiptsData, deliveriesData] = await Promise.all([
          getReceipts(),
          getDeliveries(),
        ]);
        setReceipts(receiptsData);
        setDeliveries(deliveriesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toReceive = receipts.filter((r) => r.status !== 'done').length;
  const toDeliver = deliveries.filter((d) => d.status !== 'done').length;
  const waitingDeliveries = deliveries.filter((d) => d.status === 'waiting').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 flex justify-center px-4 py-6">
      {/* Large Container - Center Aligned */}
      <div className="w-full max-w-6xl border-2 border-slate-300 rounded-3xl bg-white p-10">
        {/* Two Cards Side by Side */}
        <div className="grid grid-cols-2 gap-8">
          {/* Receipt Card - Left */}
          <div className="border-2 border-slate-300 rounded-2xl p-8">
            <h2 className="text-xl font-medium text-slate-900 mb-8">Receipt</h2>
            
            {/* Stats on the right side */}
            <div className="flex justify-between items-start mb-12">
              <div>
                {/* Button */}
                <button
                  onClick={() => navigate('/operations/receipts?filter=pending')}
                  className="border-2 border-slate-900 text-slate-900 py-2 px-6 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  {toReceive} to receive
                </button>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm text-slate-600">1 Late</div>
                <div className="text-sm text-slate-600">{receipts.length} operations</div>
              </div>
            </div>
          </div>

          {/* Delivery Card - Right */}
          <div className="border-2 border-slate-300 rounded-2xl p-8">
            <h2 className="text-xl font-medium text-slate-900 mb-8">Delivery</h2>
            
            {/* Stats on the right side */}
            <div className="flex justify-between items-start mb-12">
              <div>
                {/* Button */}
                <button
                  onClick={() => navigate('/operations/delivery?filter=pending')}
                  className="border-2 border-slate-900 text-slate-900 py-2 px-6 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  {toDeliver} to deliver
                </button>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm text-slate-600">1 Late</div>
                <div className="text-sm text-slate-600">{waitingDeliveries} waiting</div>
                <div className="text-sm text-slate-600">{deliveries.length} operations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
