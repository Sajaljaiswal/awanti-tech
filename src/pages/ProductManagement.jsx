import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Plus, Search, Edit2, Trash2, 
  Package, Filter, Loader2, X, Upload, ImageIcon 
} from "lucide-react";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({ name: '', category: '', price: '', stock: '' });
  const [imageFile, setImageFile] = useState(null);

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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  async function handleAddProduct(e) {
    e.preventDefault();
    setUploading(true);
    
    let image_url = '';

    try {
      // 1. Upload Image to Storage if file exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        image_url = urlData.publicUrl;
      }

      // 3. Insert Product into DB
      const { data, error: dbError } = await supabase
        .from('products')
        .insert([{ ...formData, image_url }])
        .select();

      if (dbError) throw dbError;

      setProducts([data[0], ...products]);
      setIsModalOpen(false);
      setFormData({ name: '', category: '', price: '', stock: '' });
      setImageFile(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(product) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // 1. Delete image from storage if it exists
      if (product.image_url) {
        const path = product.image_url.split('/').pop();
        await supabase.storage.from('product-images').remove([path]);
      }
      // 2. Delete from DB
      const { error } = await supabase.from('products').delete().eq('id', product.id);
      if (error) alert(error.message);
      else setProducts(products.filter(p => p.id !== product.id));
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-[59rem] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Inventory Management</h2>
          <p className="text-sm text-gray-400 mt-1">Upload products and manage your catalog.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={18}/> New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 font-mono">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-gray-300" size={20} />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-gray-400 font-bold">₹{product.price} • {product.stock} in stock</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(product)}
                      className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              {/* Image Picker */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl p-6 bg-gray-50 hover:bg-white transition-all cursor-pointer relative group">
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Upload className="text-indigo-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {imageFile ? imageFile.name : "Select Product Photo"}
                </p>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" required placeholder="Product Name"
                  className="w-full bg-gray-50 border-gray-100 border rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Category"
                    className="w-full bg-gray-50 border-gray-100 border rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white outline-none transition-all"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                  <input 
                    type="number" placeholder="Price (₹)"
                    className="w-full bg-gray-50 border-gray-100 border rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white outline-none transition-all"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <input 
                  type="number" placeholder="Stock Count"
                  className="w-full bg-gray-50 border-gray-100 border rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white outline-none transition-all"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                />
              </div>

              <button 
                disabled={uploading}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-gray-200 transition-all shadow-lg"
              >
                {uploading ? <Loader2 className="animate-spin" /> : <><Plus size={20}/> Add to Inventory</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}