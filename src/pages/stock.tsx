import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { useUIStore } from '../stores/uiStore';
import { getStockLevels, adjustStock } from '../services/mockApi';
import type { Product } from '../services/mockApi';

export const StockPage: React.FC = () => {
  const { addNotification } = useUIStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getStockLevels();
      setProducts(data);
    } catch (error) {
      addNotification('error', 'Failed to fetch stock levels');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async () => {
    if (!selectedProduct || !adjustmentQty) return;

    try {
      const adjustment = parseInt(adjustmentQty);
      await adjustStock(selectedProduct.id, adjustment);
      addNotification('success', 'Stock adjusted successfully');
      setShowModal(false);
      setSelectedProduct(null);
      setAdjustmentQty('');
      fetchProducts();
    } catch (error) {
      addNotification('error', 'Failed to adjust stock');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (product: Product) => (
        <div>
          <p className="font-medium text-slate-850">{product.name}</p>
          <p className="text-small text-slate-500">{product.sku}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (product: Product) => product.category,
    },
    {
      key: 'onHand',
      header: 'On Hand',
      render: (product: Product) => (
        <span className="font-medium">{product.onHand}</span>
      ),
    },
    {
      key: 'reserved',
      header: 'Reserved',
      render: (product: Product) => product.reserved,
    },
    {
      key: 'available',
      header: 'Available',
      render: (product: Product) => (
        <span className="font-medium text-primary">{product.available}</span>
      ),
    },
    {
      key: 'unit',
      header: 'Unit',
      render: (product: Product) => product.unit,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (product: Product) => (
        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
            setShowModal(true);
          }}
        >
          Adjust
        </Button>
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
        <h1 className="text-[28px] font-semibold mb-2">Stock Levels</h1>
        <p className="text-slate-600">Monitor and adjust inventory levels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-small text-slate-500 uppercase tracking-wide mb-1">
            Total Products
          </p>
          <p className="text-3xl font-bold text-slate-850">{products.length}</p>
        </Card>
        <Card>
          <p className="text-small text-slate-500 uppercase tracking-wide mb-1">
            Total On Hand
          </p>
          <p className="text-3xl font-bold text-slate-850">
            {products.reduce((sum, p) => sum + p.onHand, 0)}
          </p>
        </Card>
        <Card>
          <p className="text-small text-slate-500 uppercase tracking-wide mb-1">
            Total Available
          </p>
          <p className="text-3xl font-bold text-primary">
            {products.reduce((sum, p) => sum + p.available, 0)}
          </p>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <Table columns={columns} data={products} />
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
        {selectedProduct && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Product</p>
              <p className="font-medium text-slate-850">{selectedProduct.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Current Stock</p>
              <p className="font-medium text-slate-850">{selectedProduct.onHand} {selectedProduct.unit}</p>
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
  );
};
