import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Briefcase, Users, Layout, Search, RefreshCw, Filter, ArrowUpRight } from "lucide-react";
import { fetchAMCs, createAMC, updateAMC, deleteAMC, createDetailedAMC } from "../../api/amcApi";
import { fetchUsers } from "../../api/userApi";
import DetailedAMCModal from "./DetailedAMCModal";

export default function AMCManagement() {
  const [amcs, setAmcs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDetailedModal, setShowDetailedModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [form, setForm] = useState({
    customer_id: "",
    customer_type: "New Customer",
    amc_type: "New",
    duration_months: 12,
    fees: "",
    products_covered: "",
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setIsRefreshing(true);
    try {
      const a = await fetchAMCs();
      const u = await fetchUsers();
      setAmcs(a.data || []);
      setCustomers(u.data || []);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Filter logic
  const filteredAmcs = amcs.filter((amc) =>
    amc.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amc.customers?.mobile?.includes(searchTerm)
  );

  const submit = async () => {
    if (!form.customer_id || !form.fees) {
      alert("Customer & fees required");
      return;
    }
    if (editing) {
      const res = await updateAMC(editing.id, form);
      setAmcs((p) => p.map((a) => (a.id === res.data.id ? res.data : a)));
    } else {
      const res = await createAMC(form);
      setAmcs((p) => [res.data, ...p]);
    }
    close();
  };

  const close = () => {
    setShowModal(false);
    setEditing(null);
    setForm({
      customer_id: "",
      customer_type: "New Customer",
      amc_type: "New",
      duration_months: 12,
      fees: "",
      products_covered: "",
    });
  };

  const handleSaveDetailed = async (formData) => {
    try {
      const res = await createDetailedAMC(formData);
      setAmcs((prev) => [res.data, ...prev]);
      setShowDetailedModal(false);
      alert("Detailed AMC Created Successfully!");
    } catch (err) {
      alert("Error saving AMC: " + err.message);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Briefcase className="text-indigo-600" size={32} />
            AMC Management
          </h2>
          <p className="text-slate-500 mt-1">Manage, register, and track Annual Maintenance Contracts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className={`p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={() => setShowDetailedModal(true)}
            className="bg-white border border-slate-200 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Layout size={18} className="text-indigo-600" /> 
            Detailed Contract
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Register AMC
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by customer name or mobile..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-medium hover:bg-slate-50 transition-all">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Details</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Details</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAmcs.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-5">
                    <div className="font-bold text-slate-800 text-base">{a.customers?.name || "Standard Client"}</div>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                        <Users size={10} className="text-slate-500" />
                      </div>
                      {a.customers?.mobile || "No Mobile"}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 w-fit">
                        {a.duration_months} Months
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                        {a.products_covered || "General Service"}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="text-sm font-black text-slate-900 italic">₹{Number(a.fees).toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Paid Total</div>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      a.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${a.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      {a.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                         onClick={() => { setEditing(a); setForm(a); setShowModal(true); }}
                         className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                         onClick={async () => { if (confirm("Delete this contract?")) { await deleteAMC(a.id); setAmcs((p) => p.filter((x) => x.id !== a.id)); } }}
                         className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAmcs.length === 0 && (
          <div className="p-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-slate-200" size={40} />
            </div>
            <h3 className="text-slate-800 font-bold text-lg">No matching contracts</h3>
            <p className="text-slate-400 max-w-xs mx-auto mt-2">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>

      {/* QUICK REGISTER MODAL (Simplified & Polished) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden ring-1 ring-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editing ? "Update Service" : "Quick Registry"}
                </h3>
                <p className="text-slate-400 text-xs font-medium">Draft a new service agreement in seconds.</p>
              </div>
              <button onClick={close} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20}/></button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Client</label>
                <select
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                >
                  <option value="">Select Target Client</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.mobile}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fees (INR)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-700 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={form.fees}
                    onChange={(e) => setForm({ ...form, fees: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Term</label>
                  <select
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={form.duration_months}
                    onChange={(e) => setForm({...form, duration_months: e.target.value})}
                  >
                    <option value={12}>12 Months</option>
                    <option value={24}>24 Months</option>
                    <option value={6}>6 Months</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Scope of Work</label>
                <textarea
                  placeholder="What is covered under this AMC?"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px] resize-none"
                  value={form.products_covered}
                  onChange={(e) => setForm({ ...form, products_covered: e.target.value })}
                />
              </div>

              <button
                onClick={submit}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                {editing ? "Apply Changes" : "Confirm Registry"}
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED MODAL */}
      <DetailedAMCModal 
        isOpen={showDetailedModal} 
        onClose={() => setShowDetailedModal(false)} 
        onSave={handleSaveDetailed}
      />
    </div>
  );
}