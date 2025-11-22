import React, { useState, useEffect } from 'react';
import { Table } from '../../components/Table';
import { Select } from '../../components/Select';
import { KanbanToggle } from '../../components/KanbanToggle';
import { useUIStore } from '../../stores/uiStore';
import { getStockLevels, getProducts } from '../../services/supabaseApi';


export const StockByLocationPage: React.FC = () => {
  const { addNotification } = useUIStore();
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [stockData, setStockData] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'kanban'>('list');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stockLevels, productsList] = await Promise.all([
        getStockLevels(),
        getProducts(),
      ]);
      setStockData(stockLevels);
      setProducts(productsList);
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filteredData =
    selectedProduct === 'all'
      ? stockData
      : stockData.filter((item) => item.product_id === selectedProduct);

  const columns = [
    {
      key: 'product',
      header: 'Product',
      render: (item: any) => (
        <div>
          <p className="font-medium text-slate-850">{item.product?.name || 'N/A'}</p>
          <p className="text-small text-slate-500">{item.product?.sku || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (item: any) => (
        <span className="text-slate-700">{item.location?.name || 'N/A'}</span>
      ),
    },
    {
      key: 'warehouse',
      header: 'Warehouse',
      render: (item: any) => (
        <span className="text-slate-600">{item.location?.warehouse?.name || 'N/A'}</span>
      ),
    },
    {
      key: 'onHand',
      header: 'On Hand',
      render: (item: any) => (
        <span className="font-medium">{item.on_hand}</span>
      ),
    },
    {
      key: 'reserved',
      header: 'Reserved',
      render: (item: any) => (
        <span className="text-slate-600">{item.reserved}</span>
      ),
    },
    {
      key: 'available',
      header: 'Available',
      render: (item: any) => (
        <span className="font-medium text-primary">{item.available}</span>
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
    <div className="min-h-screen bg-sand">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">📍 Stock by Location</h1>
          <p className="text-slate-600 font-medium">View stock distribution across locations</p>
        </div>

        <div className="mb-6 flex items-end gap-4">
          <div className="max-w-xs flex-1">
            <Select
              label="Filter by Product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              options={[
                { value: 'all', label: 'All Products' },
                ...products.map((p) => ({ value: p.id, label: p.name })),
              ]}
            />
          </div>
          <KanbanToggle view={view} onChange={setView} />
        </div>

        <div className="premium-container">
          {view === 'list' ? (
            <Table columns={columns} data={filteredData} />
          ) : (
            <div className="p-6">
              {/* Kanban Board - Group by Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Get unique locations */}
                {Array.from(new Set(filteredData.map(item => item.location?.name).filter(Boolean))).map((locationName) => {
                  const locationItems = filteredData.filter(item => item.location?.name === locationName);
                  const totalStock = locationItems.reduce((sum, item) => sum + (item.on_hand || 0), 0);
                  // const totalAvailable = locationItems.reduce((sum, item) => sum + (item.available || 0), 0);
                  
                  return (
                    <div key={locationName} className="bg-slate-50 rounded-lg p-4">
                      <div className="mb-4">
                        <h3 className="font-bold text-navy flex items-center gap-2 mb-2">
                          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                          {locationName}
                        </h3>
                        <div className="flex gap-2 text-xs">
                          <span className="bg-slate-200 px-2 py-1 rounded-full font-semibold text-slate-700">
                            {locationItems.length} items
                          </span>
                          <span className="bg-blue-100 px-2 py-1 rounded-full font-semibold text-blue-700">
                            {totalStock} total
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {locationItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                          >
                            <div className="font-semibold text-navy mb-1">{item.product?.name || 'N/A'}</div>
                            <div className="text-xs text-slate-500 mb-3">{item.product?.sku || 'N/A'}</div>
                            
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="text-slate-500 mb-1">On Hand</div>
                                <div className="font-bold text-navy">{item.on_hand}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-slate-500 mb-1">Reserved</div>
                                <div className="font-semibold text-yellow-600">{item.reserved}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-slate-500 mb-1">Available</div>
                                <div className="font-bold text-green-600">{item.available}</div>
                              </div>
                            </div>
                            
                            {item.available === 0 && (
                              <div className="mt-2 pt-2 border-t border-slate-200">
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                  ⚠️ Out of Stock
                                </span>
                              </div>
                            )}
                            {item.available > 0 && item.available < 10 && (
                              <div className="mt-2 pt-2 border-t border-slate-200">
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                                  ⚠️ Low Stock
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {filteredData.length === 0 && (
                  <div className="col-span-full text-center text-slate-400 py-12">
                    No stock data available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
