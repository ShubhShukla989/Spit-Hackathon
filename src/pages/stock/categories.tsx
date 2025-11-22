import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { BackButton } from '../../components/BackButton';
import { KanbanToggle } from '../../components/KanbanToggle';
import { useUIStore } from '../../stores/uiStore';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/supabaseApi';

export const CategoriesPage: React.FC = () => {
  const { addNotification } = useUIStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [view, setView] = useState<'list' | 'kanban'>('list');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createCategory({
        name: formData.name,
        description: formData.description,
      });
      addNotification('success', 'Category created successfully');
      handleCloseModal();
      fetchCategories();
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to create category');
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, {
        name: formData.name,
        description: formData.description,
      });
      addNotification('success', 'Category updated successfully');
      handleCloseModal();
      fetchCategories();
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      addNotification('success', 'Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to delete category');
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const columns = [
    {
      key: 'name',
      header: 'Category Name',
      render: (category: any) => (
        <span className="font-medium text-slate-850">{category.name}</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (category: any) => (
        <span className="text-slate-600">{category.description || 'N/A'}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (category: any) => (
        <div className="flex gap-2">
          <Button variant="edit" size="sm" onClick={() => handleEdit(category)}>
            ✏️ Edit
          </Button>
          <Button variant="delete" size="sm" onClick={() => handleDelete(category.id)}>
            🗑️ Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-premium text-lg font-medium">Loading categories...</div>
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
            <h1 className="text-3xl font-bold text-navy mb-2">🏷️ Product Categories</h1>
            <p className="text-slate-600 font-medium">Organize your products by category</p>
          </div>
          <div className="flex items-center gap-3">
            <KanbanToggle view={view} onChange={setView} />
            <Button variant="primary" onClick={() => setShowModal(true)}>
              ➕ New Category
            </Button>
          </div>
        </div>

        <div className="premium-container">
          {view === 'list' ? (
            <Table columns={columns} data={categories} />
          ) : (
            <div className="p-6">
              {/* Kanban Board - Group by Description Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* With Description Column */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      Complete
                    </h3>
                    <span className="text-sm font-semibold text-green-600 bg-green-200 px-2 py-1 rounded-full">
                      {categories.filter(c => c.description && c.description.trim()).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {categories.filter(c => c.description && c.description.trim()).map((category) => (
                      <div
                        key={category.id}
                        className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="font-semibold text-navy mb-2">{category.name}</div>
                        <div className="text-sm text-slate-600 mb-3 line-clamp-2">{category.description}</div>
                        <div className="flex gap-2">
                          <Button variant="edit" size="sm" onClick={() => handleEdit(category)}>
                            ✏️ Edit
                          </Button>
                          <Button variant="delete" size="sm" onClick={() => handleDelete(category.id)}>
                            🗑️ Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    {categories.filter(c => c.description && c.description.trim()).length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">No complete categories</div>
                    )}
                  </div>
                </div>

                {/* Without Description Column */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      Incomplete
                    </h3>
                    <span className="text-sm font-semibold text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full">
                      {categories.filter(c => !c.description || !c.description.trim()).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {categories.filter(c => !c.description || !c.description.trim()).map((category) => (
                      <div
                        key={category.id}
                        className="bg-white p-4 rounded-lg shadow-sm border-2 border-yellow-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="font-semibold text-navy mb-2">{category.name}</div>
                        <div className="text-sm text-slate-400 mb-3 italic">No description</div>
                        <div className="flex gap-2">
                          <Button variant="edit" size="sm" onClick={() => handleEdit(category)}>
                            ✏️ Edit
                          </Button>
                          <Button variant="delete" size="sm" onClick={() => handleDelete(category.id)}>
                            🗑️ Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    {categories.filter(c => !c.description || !c.description.trim()).length === 0 && (
                      <div className="text-center text-slate-400 py-8 text-sm">No incomplete categories</div>
                    )}
                  </div>
                </div>

                {/* All Categories Column */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      All Categories
                    </h3>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                      {categories.length}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="font-semibold text-navy mb-1">{category.name}</div>
                        <div className="text-xs text-slate-500 mb-2">
                          {category.description ? '✓ Has description' : '⚠ Missing description'}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="edit" size="sm" onClick={() => handleEdit(category)}>
                            ✏️
                          </Button>
                          <Button variant="delete" size="sm" onClick={() => handleDelete(category.id)}>
                            🗑️
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingCategory ? 'Edit Category' : 'Create Category'}
          footer={
            <>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={editingCategory ? handleUpdate : handleCreate}
              >
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter category name"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter category description"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
            />
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};
