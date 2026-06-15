import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { toast } from 'react-hot-toast';
import { FaTrash, FaPlus, FaTags } from 'react-icons/fa';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setIsAdding(true);
    try {
      await adminService.addCategory(newCategory.trim());
      toast.success('Category added successfully');
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Items previously assigned to this category will keep their string label, but this category will no longer be selectable for new items.')) return;

    try {
      await adminService.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FaTags className="text-emerald-500" /> Manage Categories
        </h1>
        <div className="bg-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300">
          Total Categories: <span className="font-bold text-emerald-400">{categories.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Add New Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-white mb-4">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Category Name</label>
                <input 
                  type="text" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Textiles, Furniture"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isAdding}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaPlus /> {isAdding ? 'Adding...' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Category List */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 text-sm border-b border-slate-800">
                  <th className="p-4 font-medium w-16 text-center">ID</th>
                  <th className="p-4 font-medium">Category Name</th>
                  <th className="p-4 font-medium text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr><td colSpan="3" className="p-8 text-center text-slate-500">Loading categories...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan="3" className="p-8 text-center text-slate-500">No categories found. Add one!</td></tr>
                ) : (
                  categories.map(category => (
                    <tr key={category.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-center text-slate-500">
                        {category.id}
                      </td>
                      <td className="p-4">
                        <div className="text-white font-medium">{category.name}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Category"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Categories;
