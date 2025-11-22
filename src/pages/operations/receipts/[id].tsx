/**
 * RECEIPT DETAIL PAGE - PIXEL-PERFECT REBUILD FROM WIREFRAME
 * 
 * Changes Made:
 * - Rebuilt entire layout to match uploaded red+black wireframe exactly
 * - Added status flow indicator (Draft → Ready → Done) top-right
 * - Repositioned action buttons (New, Validate, Print, Cancel) to exact positions
 * - Created 2-column form layout with exact spacing
 * - Added Products table with "New Product" placeholder row
 * - Added signature lines at bottom (Prepared By / Checked By / Approved By)
 * - Matched all spacing, padding, and border radius from wireframe
 * 
 * Test Checklist:
 * ✓ Visual alignment at 1366×768 and 1920×1080
 * ✓ No console errors
 * ✓ Keyboard focus states visible
 * ✓ Print button triggers print preview
 * ✓ Status flow indicator displays correctly
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUIStore } from '../../../stores/uiStore';
import { getReceipts, getProducts, validateReceipt as validateReceiptRPC } from '../../../services/supabaseApi';

export const ReceiptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useUIStore();
  const [receipt, setReceipt] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [receiptsData, productsData] = await Promise.all([
          getReceipts(),
          getProducts(),
        ]);
        
        setProducts(productsData);

        if (id === 'new') {
          setReceipt({
            id: 'new',
            reference: 'WH/IN/NEW',
            status: 'draft',
            partner_name: '',
            scheduled_date: new Date().toISOString().split('T')[0],
            lines: [],
          });
        } else if (id) {
          const foundReceipt = receiptsData.find((r: any) => r.id === id);
          if (foundReceipt) {
            setReceipt(foundReceipt);
          } else {
            addNotification('error', 'Receipt not found');
            navigate('/operations/receipts');
          }
        }
      } catch (error: any) {
        addNotification('error', error.message || 'Failed to load receipt');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, addNotification, navigate]);

  const handleValidate = async () => {
    if (!receipt || !id || id === 'new') {
      addNotification('info', 'Please save the receipt first');
      return;
    }
    
    try {
      await validateReceiptRPC(id);
      addNotification('success', 'Receipt validated successfully');
      
      // Refresh receipt data
      const receiptsData = await getReceipts();
      const updatedReceipt = receiptsData.find((r: any) => r.id === id);
      if (updatedReceipt) {
        setReceipt(updatedReceipt);
      }
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to validate receipt');
    }
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
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 flex justify-center px-4 py-6">
      {/* Main Container - Matching Wireframe */}
      <div className="w-full max-w-6xl border-2 border-slate-300 rounded-3xl bg-white p-10">
        
        {/* Top Section */}
        <div className="flex items-start justify-between mb-8">
          {/* Left: Title and Info */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-semibold text-slate-900">Receipt</h1>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-900">{receipt.reference}</p>
              <p className="text-sm text-slate-600">Date: {receipt.scheduled_date}</p>
              <p className="text-sm text-slate-600">Partner: {receipt.partner_name || 'Not specified'}</p>
            </div>
          </div>

          {/* Right: Status Flow & Buttons */}
          <div className="flex flex-col items-end gap-4">
            {/* Status Flow Indicator */}
            <div className="border-2 border-slate-300 rounded-lg px-6 py-2 bg-white">
              <div className="flex items-center gap-3 text-sm">
                <span className={receipt.status === 'draft' ? 'font-semibold text-slate-900' : 'text-slate-500'}>
                  Draft
                </span>
                <span className="text-slate-400">→</span>
                <span className={receipt.status === 'ready' ? 'font-semibold text-slate-900' : 'text-slate-500'}>
                  Ready
                </span>
                <span className="text-slate-400">→</span>
                <span className={receipt.status === 'done' ? 'font-semibold text-slate-900' : 'text-slate-500'}>
                  Done
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/operations/receipts/new')}
                className="px-4 py-2 border-2 border-slate-900 text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                New
              </button>
              <button
                onClick={handleValidate}
                disabled={receipt.status === 'done'}
                className="px-4 py-2 border-2 border-slate-900 text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Validate
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border-2 border-slate-900 text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Print
              </button>
              <button
                onClick={() => navigate('/operations/receipts')}
                className="px-4 py-2 border-2 border-slate-900 text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Form Section - 2 Column Layout */}
        <div className="border-2 border-slate-300 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Receipt ID
              </label>
              <input
                type="text"
                value={receipt.reference}
                disabled
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Right Column */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Receive From
              </label>
              <input
                type="text"
                value={receipt.partner_name}
                onChange={(e) => setReceipt({ ...receipt, partner_name: e.target.value })}
                placeholder="Enter partner name"
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-slate-900 focus:outline-none"
              />
            </div>

            {/* Left Column */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Responsible
              </label>
              <input
                type="text"
                value="Auto-assigned"
                disabled
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Right Column */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Schedule Date
              </label>
              <input
                type="date"
                value={receipt.scheduled_date}
                onChange={(e) => setReceipt({ ...receipt, scheduled_date: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Products</h2>
          
          <div className="border-2 border-slate-300 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">Unit</th>
                </tr>
              </thead>
              <tbody>
                {receipt.lines && receipt.lines.length > 0 ? (
                  receipt.lines.map((line: any, index: number) => (
                    <tr key={line.id} className={index > 0 ? 'border-t border-dashed border-slate-300' : ''}>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {line.product?.name || 'Unknown Product'} ({line.product?.sku || 'N/A'})
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">{line.quantity}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">Units</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm text-slate-500 text-center">
                      No products added yet
                    </td>
                  </tr>
                )}
                {/* New Product Row */}
                <tr className="border-t border-dashed border-slate-300">
                  <td colSpan={3} className="px-6 py-4">
                    <button className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      + New Product
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature Lines */}
        <div className="flex justify-between items-end pt-12">
          <div className="text-center">
            <div className="w-48 border-b-2 border-dotted border-slate-400 mb-2"></div>
            <p className="text-sm text-slate-600">Prepared By</p>
          </div>
          <div className="text-center">
            <div className="w-48 border-b-2 border-dotted border-slate-400 mb-2"></div>
            <p className="text-sm text-slate-600">Checked By</p>
          </div>
          <div className="text-center">
            <div className="w-48 border-b-2 border-dotted border-slate-400 mb-2"></div>
            <p className="text-sm text-slate-600">Approved By</p>
          </div>
        </div>
      </div>
    </div>
  );
};
