import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Plus, Search, MoreVertical, Edit2, Trash2, 
  Package, Filter, Loader2, X 
} from "lucide-react";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', stock: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching products:', error.message);
    else setProducts(data);
    setLoading(false);
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    const { data, error } = await supabase
      .from('products')
      .insert([formData])
      .select();

    if (error) {
      alert(error.message);
    } else {
      setProducts([data[0], ...products]);
      setIsModalOpen(false);
      setFormData({ name: '', category: '', price: '', stock: '' });
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) alert(error.message);
      else setProducts(products.filter(p => p.id !== id));
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-[59rem] space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Inventory</h2>
          <p className="text-sm text-gray-400 mt-1">Manage and track your musical instruments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Plus size={18}/> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 outline-none text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition-all">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Aesthetic Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
            <p className="text-sm font-medium">Syncing with database...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Package size={20} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full uppercase tracking-tight">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock < 5 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <span className="text-sm text-gray-600">{product.stock} units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Aesthetic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Name</label>
                <input 
                  type="text" required
                  className="w-full bg-gray-50 border-gray-100 border rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Category</label>
                  <input 
                    type="text" required
                    className="w-full bg-gray-50 border-gray-100 border rounded-xl px-4 py-2.5 text-sm focus:bg-white text-slate-900 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Price</label>
                  <input 
                    type="number" required
                    className="w-full bg-gray-50 border-gray-100 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 text-slate-900 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Stock Count</label>
                <input 
                  type="number" required
                  className="w-full bg-gray-50 border-gray-100 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 text-slate-900 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                />
              </div>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold mt-4 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}