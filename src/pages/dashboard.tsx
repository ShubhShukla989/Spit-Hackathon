import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReceipts, getDeliveries, getDashboardKPIs } from '../services/supabaseApi';
import type { Receipt, Delivery } from '../services/supabaseApi';

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
        <div className="loading-premium text-lg font-medium">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F7' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Large Container - Center Aligned */}
        <div className="w-full bg-white rounded-xl p-12 shadow-lg" style={{ border: '1.5px solid #D4A657' }}>
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#1E293B' }}>
              📊 Dashboard Overview
            </h1>
            <p className="text-slate-600 text-lg">Monitor your warehouse operations at a glance</p>
          </div>

          {/* Two Cards Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Receipt Card - Left */}
            <div 
              className="bg-white rounded-xl p-8 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ border: '1.5px solid #D4A657' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#1E293B' }}>📥 Receipts</h2>
              </div>
              
              {/* Stats */}
              <div className="flex justify-between items-start">
                <div>
                  <button
                    onClick={() => navigate('/operations/receipts?filter=pending')}
                    className="inline-flex flex-col items-center gap-1 px-6 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                    style={{ 
                      backgroundColor: 'rgba(212, 166, 87, 0.15)', 
                      color: '#1E293B', 
                      border: '2px solid #D4A657' 
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E293B';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#1E293B';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(212, 166, 87, 0.15)';
                      e.currentTarget.style.color = '#1E293B';
                      e.currentTarget.style.borderColor = '#D4A657';
                    }}
                  >
                    <span className="text-3xl font-bold">{toReceive}</span>
                    <span className="text-sm">to receive</span>
                  </button>
                </div>
                <div className="text-right space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: '#E74C3C' }}>
                    1 Late
                  </div>
                  <div className="text-sm text-slate-600 font-medium">{receipts.length} operations</div>
                </div>
              </div>
            </div>

            {/* Delivery Card - Right */}
            <div 
              className="bg-white rounded-xl p-8 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ border: '1.5px solid #D4A657' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#1E293B' }}>📤 Deliveries</h2>
              </div>
              
              {/* Stats */}
              <div className="flex justify-between items-start">
                <div>
                  <button
                    onClick={() => navigate('/operations/delivery?filter=pending')}
                    className="inline-flex flex-col items-center gap-1 px-6 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                    style={{ 
                      backgroundColor: 'rgba(212, 166, 87, 0.15)', 
                      color: '#1E293B', 
                      border: '2px solid #D4A657' 
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E293B';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#1E293B';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(212, 166, 87, 0.15)';
                      e.currentTarget.style.color = '#1E293B';
                      e.currentTarget.style.borderColor = '#D4A657';
                    }}
                  >
                    <span className="text-3xl font-bold">{toDeliver}</span>
                    <span className="text-sm">to deliver</span>
                  </button>
                </div>
                <div className="text-right space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: '#E74C3C' }}>
                    1 Late
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#D4A657', color: '#1E293B' }}>
                    {waitingDeliveries} waiting
                  </div>
                  <div className="text-sm text-slate-600 font-medium">{deliveries.length} operations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
