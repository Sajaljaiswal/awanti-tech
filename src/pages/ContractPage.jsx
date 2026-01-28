import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Briefcase, 
  Search, 
  RefreshCw, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CreditCard, 
  Layout
} from "lucide-react";
import { getAllContracts, createContract, deleteContract } from '../api/contractApi';

const ContractPage = () => {
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '', mobile: '', email: '', address: '',
    no_of_laptop: '', starting_date: '', end_date: '', price: ''
  });

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    setIsRefreshing(true);
    try {
      const { data } = await getAllContracts();
      setContracts(data || []);
    } catch (err) {
      console.error("Error fetching contracts", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Smooth transition
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContract(formData);
      setIsModalOpen(false);
      setFormData({
        username: '', mobile: '', email: '', address: '',
        no_of_laptop: '', starting_date: '', end_date: '', price: ''
      });
      loadContracts();
      alert("Contract Created successfully!");
    } catch (err) {
      alert("Error saving contract");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      try {
        await deleteContract(id);
        loadContracts();
      } catch (err) {
        alert("Error deleting contract");
      }
    }
  };

  const filteredContracts = contracts.filter(c => 
    c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobile.includes(searchTerm) ||
    c.contract_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Briefcase className="text-indigo-600" size={32} /> AMC Registry
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage client agreements and equipment tracking</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={loadContracts} 
            className={`p-2.5 rounded-xl border bg-white shadow-sm hover:bg-slate-50 transition-all ${isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-600'}`}
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Plus size={18} /> New Contract
          </button>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search by name, phone, or contract ID..." 
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Client Details</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Assets</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Validity</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredContracts.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80 group transition-colors">
                <td className="p-5">
                  <div className="font-bold text-slate-800 text-base">{c.username}</div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                       <Phone size={12} /> {c.mobile}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                       <Mail size={12} /> {c.email || 'No email provided'}
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase">
                    Laptops: {c.no_of_laptop}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-1 text-emerald-600"><Calendar size={12}/> {c.starting_date}</span>
                    <span className="flex items-center gap-1 text-rose-500 font-bold"><Calendar size={12}/> {c.end_date}</span>
                  </div>
                </td>
                <td className="p-5">
                  <div className="text-base font-black text-slate-900">₹{parseFloat(c.price).toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <CreditCard size={10} /> Fully Paid
                  </div>
                </td>
                <td className="p-5 text-right">
                  <button 
                    onClick={() => handleDelete(c.id)} 
                    className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredContracts.length === 0 && (
          <div className="p-20 text-center text-slate-400">
            <Layout size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">No contracts found matching your search.</p>
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b bg-slate-50">
              <h2 className="text-2xl font-bold text-slate-800">New Contract Details</h2>
              <p className="text-slate-500 text-sm">Please fill out all client and asset information.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Client Name</label>
                  <input type="text" name="username" value={formData.username} required onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Sajal Jaiswal" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                  <input type="text" name="mobile" value={formData.mobile} required onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="+91 ..." />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-slate-400" size={16} />
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 pl-10 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Business or Home address" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">No. of Laptops</label>
                  <input type="number" name="no_of_laptop" value={formData.no_of_laptop} required onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contract Value (₹)</label>
                  <input type="number" name="price" value={formData.price} required onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Start Date</label>
                  <input type="date" name="starting_date" value={formData.starting_date} required onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Expiry Date</label>
                  <input type="date" name="end_date" value={formData.end_date} required onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                  Create Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractPage;