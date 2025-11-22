import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { BackButton } from '../../components/BackButton';
import { KanbanToggle } from '../../components/KanbanToggle';
import { useUIStore } from '../../stores/uiStore';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../../services/supabaseApi';

export const ProductsPage: React.FC = () => {
  const { addNotification } = useUIStore();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category_id: '',
    unit_of_measure: 'Unit',
    cost: '',
    selling_price: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createProduct({
        name: formData.name,
        sku: formData.sku,
        category_id: formData.category_id,
        unit_of_measure: formData.unit_of_measure,
        cost: parseFloat(formData.cost),
        selling_price: parseFloat(formData.selling_price),
        description: formData.description,
      });
      addNotification('success', 'Product created successfully');
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to create product');
    }
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, {
        name: formData.name,
        sku: formData.sku,
        category_id: formData.category_id,
        unit_of_measure: formData.unit_of_measure,
        cost: parseFloat(formData.cost),
        selling_price: parseFloat(formData.selling_price),
        description: formData.description,
      });
      addNotification('success', 'Product updated successfully');
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to update product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      addNotification('success', 'Product deleted successfully');
      fetchData();
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to delete product');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category_id: product.category_id,
      unit_of_measure: product.unit_of_measure,
      cost: product.cost.toString(),
      selling_price: product.selling_price.toString(),
      description: product.description || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      category_id: '',
      unit_of_measure: 'Unit',
      cost: '',
      selling_price: '',
      description: '',
    });
  };

  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (product: any) => (
        <div>
          <p className="font-medium text-slate-850">{product.name}</p>
          <p className="text-small text-slate-500">{product.sku}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (product: any) => product.category?.name || 'N/A',
    },
    {
      key: 'unit',
      header: 'Unit',
      render: (product: any) => product.unit_of_measure,
    },
    {
      key: 'cost',
      header: 'Cost',
      render: (product: any) => `₹${product.cost.toFixed(2)}`,
    },
    {
      key: 'sellingPrice',
      header: 'Selling Price',
      render: (product: any) => `₹${product.selling_price.toFixed(2)}`,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (product: any) => (
        <div className="flex gap-2">
          <Button variant="edit" size="sm" onClick={() => handleEdit(product)}>
            ✏️ Edit
          </Button>
          <Button variant="delete" size="sm" onClick={() => handleDelete(product.id)}>
            🗑️ Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-premium text-lg font-medium">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton to="/stock" />
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">📦 Products</h1>
            <p className="text-slate-600 font-medium">Manage your product catalog</p>
          </div>
          <div className="flex gap-3">
            <KanbanToggle view={view} onChange={setView} />
            <Button variant="primary" onClick={() => setShowModal(true)}>
              ➕ New Product
            </Button>
          </div>
        </div>

        <div className="premium-container">
          {view === 'list' ? (
            <Table columns={columns} data={products} />
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => {
                  const categoryProducts = products.filter(p => p.category_id === category.id);
                  return (
                    <div key={category.id} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-navy flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                          {category.name}
                        </h3>
                        <span className="text-sm font-semibold text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                          {categoryProducts.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {categoryProducts.map((product) => (
                          <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all">
                            <div className="font-semibold text-navy mb-1">{product.name}</div>
                            <div className="text-xs text-slate-500 mb-2">{product.sku}</div>
                            <div className="text-xs text-slate-600 mb-2">{product.unit_of_measure}</div>
                            <div className="flex justify-between text-xs mb-3">
                              <span className="text-slate-500">Cost: ₹{product.cost.toFixed(2)}</span>
                              <span className="text-green-600 font-semibold">Price: ₹{product.selling_price.toFixed(2)}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="edit" size="sm" onClick={() => handleEdit(product)} className="flex-1">✏️</Button>
                              <Button variant="delete" size="sm" onClick={() => handleDelete(product.id)} className="flex-1">🗑️</Button>
                            </div>
                          </div>
                        ))}
                        {categoryProducts.length === 0 && <div className="text-center text-slate-400 py-8 text-sm">No products</div>}
                      </div>
                    </div>
                  );
                })}
                {products.filter(p => !p.category_id).length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-navy flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                        Uncategorized
                      </h3>
                      <span className="text-sm font-semibold text-slate-600 bg-slate-200 px-2 py-1 rounded-full">
                        {products.filter(p => !p.category_id).length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {products.filter(p => !p.category_id).map((product) => (
                        <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                          <div className="font-semibold text-navy mb-1">{product.name}</div>
                          <div className="text-xs text-slate-500 mb-2">{product.sku}</div>
                          <div className="flex gap-2">
                            <Button variant="edit" size="sm" onClick={() => handleEdit(product)} className="flex-1">✏️</Button>
                            <Button variant="delete" size="sm" onClick={() => handleDelete(product.id)} className="flex-1">🗑️</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingProduct ? 'Edit Product' : 'Create Product'}
          footer={
            <>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={editingProduct ? handleUpdate : handleCreate}
              >
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
          />
          <Input
            label="SKU / Internal Reference"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="Enter SKU"
          />
          <Select
            label="Category"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            options={[
              { value: '', label: 'Select category' },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <Select
            label="Unit of Measure"
            value={formData.unit_of_measure}
            onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value })}
            options={[
              { value: 'Unit', label: 'Unit' },
              { value: 'kg', label: 'Kilogram' },
              { value: 'lbs', label: 'Pounds' },
              { value: 'box', label: 'Box' },
              { value: 'pallet', label: 'Pallet' },
            ]}
          />
          <Input
            label="Cost (₹)"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            placeholder="0.00"
          />
          <Input
            label="Selling Price (₹)"
            type="number"
            value={formData.selling_price}
            onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
            placeholder="0.00"
          />
          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              className="input-premium w-full"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="input-premium w-full"
            />
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};
