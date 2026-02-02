import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  X,
  Upload,
  ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

// API Imports
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../api/productApi";

export default function ProductManagement() {
  /* ================= STATES ================= */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await getProducts();
      const data = Array.isArray(res) ? res : res?.data || [];
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  /* ================= FILE HANDLING ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /* ================= ADD PRODUCT ================= */
  async function handleAddProduct(e) {
    e.preventDefault();
    setUploading(true);

    try {
      const response = await createProduct({
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        image_url: null, 
      });

      if (response) {
        toast.success("Product added successfully 🎉");
        await fetchProducts(); 
        setFormData({ name: "", category: "", price: "", stock: "" });
        setImageFile(null);
        setPreviewUrl(null);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Add Error:", err);
      toast.error("Product not added ❌");
    } finally {
      setUploading(false);
    }
  }

  /* ================= DELETE PRODUCT ================= */
  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return;

    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success("Product deleted successfully 🗑️");
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Product delete failed ❌");
    }
  }

  return (
    // "w-full" aur container padding laptop screen cover karne ke liye
    <div className="w-full min-h-screen bg-gray-50 px-4 py-8 md:px-10">
      
      {/* HEADER - Laptop Full Width */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
            Inventory Management
          </h2>
          <p className="text-gray-500">Live Dashboard • Control your store items</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-transform active:scale-95 font-semibold"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      {/* TABLE SECTION - Full Width */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-32 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
            <p className="text-gray-600 font-medium">Updating Inventory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold border-b">
                <tr>
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-center">Price</th>
                  <th className="px-6 py-4 text-center">Stock Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20 text-gray-400 italic">
                      Inventory is empty. Start adding products!
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={22} className="text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 block text-base">{p.name}</span>
                        <span className="text-xs text-gray-400">ID: #{p.id.toString().slice(-5)}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{p.category || "General"}</td>
                      <td className="px-6 py-4 text-center font-bold text-indigo-700 text-lg">₹{p.price}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL - Inputs Corrected */}
      {isModalOpen && (
        <div className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Add New Item</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500 transition-colors"><X /></button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-5 bg-white">
              {/* IMAGE INPUT */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 bg-gray-50 hover:bg-indigo-50 transition-colors text-center">
                <input type="file" hidden id="fileInput" onChange={handleFileChange} accept="image/*" />
                <label htmlFor="fileInput" className="cursor-pointer block p-4">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="mx-auto h-28 object-contain rounded" />
                  ) : (
                    <div className="py-2">
                      <Upload className="mx-auto text-indigo-500 mb-2" size={28} />
                      <p className="text-sm font-semibold text-gray-600">Upload Product Image</p>
                    </div>
                  )}
                </label>
              </div>

              {/* TEXT INPUTS - Explicitly Black Text */}
              <div className="space-y-4">
                <input
                  required
                  placeholder="Product Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <input
                  placeholder="Category (e.g. Electronics)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase px-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase px-1">Stock Qty</label>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={uploading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex justify-center items-center gap-2"
              >
                {uploading ? (
                  <><Loader2 className="animate-spin" size={20} /> Processing...</>
                ) : (
                  "Confirm & Save Product"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}