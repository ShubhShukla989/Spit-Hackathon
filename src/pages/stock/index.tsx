import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { BackButton } from '../../components/BackButton';
import { KanbanToggle } from '../../components/KanbanToggle';
import { useUIStore } from '../../stores/uiStore';
import { getStockLevels } from '../../services/supabaseApi';

export const StockPage: React.FC = () => {
  const { addNotification } = useUIStore();
  const [stockData, setStockData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState<'list' | 'kanban'>('list');

  useEffect(() => {
    fetchStockLevels();
  }, []);

  const fetchStockLevels = async () => {
    try {
      const data = await getStockLevels();
      setStockData(data);
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to fetch stock levels');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async () => {
    if (!selectedStock || !adjustmentQty) return;

    addNotification('info', 'Stock adjustment feature coming soon');
    setShowModal(false);
    setSelectedStock(null);
    setAdjustmentQty('');
  };

  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (stock: any) => (
        <div>
          <p className="font-medium text-slate-850">{stock.product?.name || 'N/A'}</p>
          <p className="text-small text-slate-500">{stock.product?.sku || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (stock: any) => stock.location?.name || 'N/A',
    },
    {
      key: 'category',
      header: 'Category',
      render: (stock: any) => stock.product?.category?.name || 'N/A',
    },
    {
      key: 'onHand',
      header: 'On Hand',
      render: (stock: any) => (
        <span className="font-medium">{stock.on_hand}</span>
      ),
    },
    {
      key: 'reserved',
      header: 'Reserved',
      render: (stock: any) => stock.reserved,
    },
    {
      key: 'available',
      header: 'Available',
      render: (stock: any) => (
        <span className="font-medium text-primary">{stock.available}</span>
      ),
    },
    {
      key: 'unit',
      header: 'Unit',
      render: (stock: any) => stock.product?.unit_of_measure || 'Unit',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (stock: any) => (
        <Button
          variant="edit"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStock(stock);
            setShowModal(true);
          }}
        >
          ⚙️ Adjust
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-premium text-lg font-medium">Loading stock levels...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">📊 Stock Levels</h1>
            <p className="text-slate-600 font-medium">Monitor and adjust inventory levels</p>
          </div>
          <KanbanToggle view={view} onChange={setView} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hover={false}>
            <p className="text-sm text-slate-500 uppercase tracking-wide mb-2 font-semibold">
              📦 Total Stock Items
            </p>
            <p className="text-4xl font-bold text-navy">{stockData.length}</p>
          </Card>
          <Card hover={false}>
            <p className="text-sm text-slate-500 uppercase tracking-wide mb-2 font-semibold">
              📥 Total On Hand
            </p>
            <p className="text-4xl font-bold text-navy">
              {stockData.reduce((sum, s) => sum + (s.on_hand || 0), 0)}
            </p>
          </Card>
          <Card hover={false}>
            <p className="text-sm text-slate-500 uppercase tracking-wide mb-2 font-semibold">
              ✅ Total Available
            </p>
            <p className="text-4xl font-bold text-gold">
              {stockData.reduce((sum, s) => sum + (s.available || 0), 0)}
            </p>
          </Card>
        </div>

        <div className="premium-container">
          {view === 'list' ? (
            <Table columns={columns} data={stockData} />
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Low Stock */}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      Low Stock
                    </h3>
                    <span className="text-sm font-semibold text-red-600 bg-red-200 px-2 py-1 rounded-full">
                      {stockData.filter(s => s.available < 10).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {stockData.filter(s => s.available < 10).map((stock) => (
                      <div key={stock.id} className="bg-white p-4 rounded-lg shadow-sm border-2 border-red-200">
                        <div className="font-semibold text-navy mb-1">{stock.product?.name}</div>
                        <div className="text-xs text-slate-500 mb-2">{stock.location?.name}</div>
                        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                          <div><span className="text-slate-500">On Hand:</span> <span className="font-bold">{stock.on_hand}</span></div>
                          <div><span className="text-slate-500">Reserved:</span> <span className="font-bold">{stock.reserved}</span></div>
                          <div><span className="text-slate-500">Available:</span> <span className="font-bold text-red-600">{stock.available}</span></div>
                        </div>
                        <Button variant="edit" size="sm" onClick={() => { setSelectedStock(stock); setShowModal(true); }} className="w-full">⚙️ Adjust</Button>
                      </div>
                    ))}
                    {stockData.filter(s => s.available < 10).length === 0 && <div className="text-center text-slate-400 py-8 text-sm">No low stock</div>}
                  </div>
                </div>
                {/* Medium Stock */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      Medium Stock
                    </h3>
                    <span className="text-sm font-semibold text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full">
                      {stockData.filter(s => s.available >= 10 && s.available < 50).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {stockData.filter(s => s.available >= 10 && s.available < 50).map((stock) => (
                      <div key={stock.id} className="bg-white p-4 rounded-lg shadow-sm border-2 border-yellow-200">
                        <div className="font-semibold text-navy mb-1">{stock.product?.name}</div>
                        <div className="text-xs text-slate-500 mb-2">{stock.location?.name}</div>
                        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                          <div><span className="text-slate-500">On Hand:</span> <span className="font-bold">{stock.on_hand}</span></div>
                          <div><span className="text-slate-500">Reserved:</span> <span className="font-bold">{stock.reserved}</span></div>
                          <div><span className="text-slate-500">Available:</span> <span className="font-bold text-yellow-600">{stock.available}</span></div>
                        </div>
                        <Button variant="edit" size="sm" onClick={() => { setSelectedStock(stock); setShowModal(true); }} className="w-full">⚙️ Adjust</Button>
                      </div>
                    ))}
                    {stockData.filter(s => s.available >= 10 && s.available < 50).length === 0 && <div className="text-center text-slate-400 py-8 text-sm">No medium stock</div>}
                  </div>
                </div>
                {/* High Stock */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      High Stock
                    </h3>
                    <span className="text-sm font-semibold text-green-600 bg-green-200 px-2 py-1 rounded-full">
                      {stockData.filter(s => s.available >= 50).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {stockData.filter(s => s.available >= 50).map((stock) => (
                      <div key={stock.id} className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-200">
                        <div className="font-semibold text-navy mb-1">{stock.product?.name}</div>
                        <div className="text-xs text-slate-500 mb-2">{stock.location?.name}</div>
                        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                          <div><span className="text-slate-500">On Hand:</span> <span className="font-bold">{stock.on_hand}</span></div>
                          <div><span className="text-slate-500">Reserved:</span> <span className="font-bold">{stock.reserved}</span></div>
                          <div><span className="text-slate-500">Available:</span> <span className="font-bold text-green-600">{stock.available}</span></div>
                        </div>
                        <Button variant="edit" size="sm" onClick={() => { setSelectedStock(stock); setShowModal(true); }} className="w-full">⚙️ Adjust</Button>
                      </div>
                    ))}
                    {stockData.filter(s => s.available >= 50).length === 0 && <div className="text-center text-slate-400 py-8 text-sm">No high stock</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
            setAdjustmentQty('');
          }}
          title="Adjust Stock"
          footer={
            <>
              <Button
                variant="secondary"
              onClick={() => {
                setShowModal(false);
                setSelectedProduct(null);
                setAdjustmentQty('');
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAdjust}>
              Adjust
            </Button>
          </>
        }
      >
        {selectedStock && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Product</p>
              <p className="font-medium text-slate-850">{selectedStock.product?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Location</p>
              <p className="font-medium text-slate-850">{selectedStock.location?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Current Stock</p>
              <p className="font-medium text-slate-850">{selectedStock.on_hand} {selectedStock.product?.unit_of_measure || 'Unit'}</p>
            </div>
            <Input
              label="Adjustment Quantity"
              type="number"
              value={adjustmentQty}
              onChange={(e) => setAdjustmentQty(e.target.value)}
              placeholder="Enter positive or negative number"
            />
            <p className="text-small text-slate-500">
              Use positive numbers to add stock, negative to remove
            </p>
          </div>
        )}
      </Modal>
      </div>
    </div>
  );
};
