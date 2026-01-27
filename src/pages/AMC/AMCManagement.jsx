import React, { useEffect, useState } from "react";
import { Plus, Trash2, Briefcase, Users, Layout, Search, RefreshCw, Filter } from "lucide-react";
import { fetchAMCs, deleteAMC, createDetailedAMC } from "../../api/amcApi";
import DetailedAMCModal from "./DetailedAMCModal";

export default function AMCManagement() {
  const [amcs, setAmcs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailedModal, setShowDetailedModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchAMCs();
      setAmcs(res.data || []);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const filteredAmcs = amcs.filter((amc) =>
    amc.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amc.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveDetailed = async (formData) => {
    try {
      const res = await createDetailedAMC(formData);
      setAmcs((prev) => [res.data, ...prev]);
      setShowDetailedModal(false);
    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Briefcase className="text-indigo-600" size={32} /> AMC Registry
          </h2>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className={`p-2.5 rounded-xl border bg-white ${isRefreshing ? 'animate-spin' : ''}`}><RefreshCw size={20} /></button>
          <button onClick={() => setShowDetailedModal(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2">
            <Plus size={18} /> New Contract
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" placeholder="Search owner or company..." 
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase">Client / Company</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase">Assets</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase">Payment Info</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAmcs.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/80 group">
                <td className="p-5">
                  <div className="font-bold text-slate-800">{a.owner_name}</div>
                  <div className="text-xs text-indigo-600 font-medium">{a.company_name}</div>
                </td>
                <td className="p-5">
                  <div className="flex gap-2 text-[10px] font-bold">
                    <span className="bg-slate-100 px-2 py-1 rounded">PC: {a.num_computers}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded">LP: {a.num_laptops}</span>
                  </div>
                </td>
                <td className="p-5">
                  <div className="text-sm font-black text-slate-900">₹{a.rate_per_pc}/pc</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">{a.payment_method} - {a.payment_cycle}</div>
                </td>
                <td className="p-5 text-right">
                  <button onClick={() => deleteAMC(a.id).then(load)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DetailedAMCModal isOpen={showDetailedModal} onClose={() => setShowDetailedModal(false)} onSave={handleSaveDetailed} />
    </div>
  );
}