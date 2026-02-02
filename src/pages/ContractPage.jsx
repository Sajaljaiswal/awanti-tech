import React, { useEffect, useState } from "react";
import {
  Plus, Trash2, Briefcase, Search, RefreshCw, Mail, 
  Phone, MapPin, Calendar, CreditCard, Layout, Monitor, 
  Printer, Scan, Laptop, HardDrive
} from "lucide-react";
import {
  getAllContracts,
  createContract,
  deleteContract,
} from "../api/contractApi";

const ContractPage = () => {
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initialFormState = {
    username: "",
    mobile: "",
    email: "",
    address: "",
    no_of_laptop: 0,
    no_of_computer: 0,
    no_of_printer: 0,
    no_of_scanner: 0,
    starting_date: "",
    end_date: "",
    price: "",
    equipment: [
      { id: Date.now(), type: "Computer", config: "", quantity: 1 },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => { loadContracts(); }, []);

  const loadContracts = async () => {
    setIsRefreshing(true);
    try {
      const { data } = await getAllContracts();
      setContracts(data || []);
    } catch (err) {
      console.error("Error fetching contracts", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value 
    });
  };

  const addEquipmentRow = () => {
    setFormData({
      ...formData,
      equipment: [
        ...formData.equipment,
        { id: Date.now(), type: "Computer", config: "", quantity: 1 },
      ],
    });
  };

  const removeEquipmentRow = (id) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.filter((item) => item.id !== id),
    });
  };

  const handleEquipmentChange = (id, field, value) => {
    const updatedEquipment = formData.equipment.map((item) =>
      item.id === id ? { ...item, [field]: field === "quantity" ? Number(value) : value } : item
    );
    setFormData({ ...formData, equipment: updatedEquipment });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure all numbers are correctly typed for the backend
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        no_of_laptop: Number(formData.no_of_laptop),
        no_of_computer: Number(formData.no_of_computer),
        no_of_printer: Number(formData.no_of_printer),
        no_of_scanner: Number(formData.no_of_scanner),
      };

      await createContract(dataToSubmit);
      setIsModalOpen(false);
      setFormData(initialFormState);
      loadContracts();
      alert("Contract Created successfully!");
    } catch (err) {
      alert("Error saving contract. Please check all fields.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this contract permanently?")) {
      try {
        await deleteContract(id);
        loadContracts();
      } catch (err) {
        alert("Error deleting contract");
      }
    }
  };

  const filteredContracts = contracts.filter(
    (c) =>
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm)
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8 bg-[#fafafa] min-h-screen font-sans">
      
      {/* --- REFINED HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-100">
                <Briefcase className="text-white" size={24} />
            </div>
            AMC Registry
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage corporate client agreements and hardware lifecycles</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={loadContracts} className={`p-3 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all ${isRefreshing ? "animate-spin text-indigo-600" : "text-slate-600"}`}>
            <RefreshCw size={18} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95">
            <Plus size={20} /> New Contract
          </button>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search by client name or mobile..." 
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Client Identity</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Asset Summary</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Contract Period</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Value</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredContracts.map((c) => (
                <tr key={c.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="p-6">
                    <div className="font-bold text-slate-900 text-lg mb-1">{c.username}</div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5"><Phone size={14} /> {c.mobile}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5"><Mail size={14} /> {c.email || "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200 uppercase">Laptops: {c.no_of_laptop}</span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200 uppercase">Printers: {c.no_of_printer}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-emerald-600 flex items-center gap-2"><Calendar size={14} /> From: {c.starting_date}</div>
                      <div className="text-xs font-bold text-rose-500 flex items-center gap-2"><Calendar size={14} /> To: {c.end_date}</div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-xl font-black text-slate-900">₹{parseFloat(c.price).toLocaleString()}</div>
                    <span className="text-[10px] text-emerald-500 font-black uppercase flex items-center gap-1 mt-1"><CreditCard size={12} /> Active Agreement</span>
                  </td>
                  <td className="p-6 text-right">
                    <button onClick={() => handleDelete(c.id)} className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODERNIZED MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            
            <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Configure New AMC</h2>
                <p className="text-slate-500 text-sm">Draft a new service contract with itemized asset list</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
              
              {/* SECTION 1: Client Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Client Identity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 ml-1 flex items-center gap-2 uppercase tracking-tighter">Client Full Name</label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-4 text-slate-400" size={16} />
                            <input name="username" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800" placeholder="Enter company or individual name" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 ml-1 flex items-center gap-2 uppercase tracking-tighter">Mobile Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-4 text-slate-400" size={16} />
                            <input name="mobile" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800" placeholder="+91" />
                        </div>
                    </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 ml-1 flex items-center gap-2 uppercase tracking-tighter">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-4 text-slate-400" size={16} />
                            <input name="email" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800" placeholder="Email address" />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-600 ml-1 flex items-center gap-2 uppercase tracking-tighter">Site Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 text-slate-400" size={16} />
                            <input name="address" onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800" placeholder="Service location address" />
                        </div>
                    </div>
                </div>
              </div>

              {/* SECTION 2: Numeric Summary */}
              <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 border-l-4 border-slate-900 pl-3">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-slate-900">Numeric Summary</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5 mb-2"><Laptop size={12}/> Laptops</label>
                        <input type="number" name="no_of_laptop" onChange={handleChange} className="w-full text-lg font-bold text-slate-900 outline-none " placeholder="0" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5 mb-2"><Monitor size={12}/> Computers</label>
                        <input type="number" name="no_of_computer" onChange={handleChange} className="w-full text-lg font-bold text-slate-900 outline-none" placeholder="0" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5 mb-2"><Printer size={12}/> Printers</label>
                        <input type="number" name="no_of_printer" onChange={handleChange} className="w-full text-lg font-bold text-slate-900 outline-none" placeholder="0" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5 mb-2"><Scan size={12}/> Scanners</label>
                        <input type="number" name="no_of_scanner" onChange={handleChange} className="w-full text-lg font-bold text-slate-900 outline-none" placeholder="0" />
                    </div>
                </div>
              </div>

              {/* SECTION 3: Itemized Configuration Table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Itemized Inventory</h3>
                  </div>
                  <button type="button" onClick={addEquipmentRow} className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    <Plus size={16} /> Add New Entry
                  </button>
                </div>

                <div className="border border-slate-100 rounded-3xl overflow-hidden bg-slate-50/30">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-4 text-center w-16 text-[10px] uppercase">No.</th>
                        <th className="p-4 text-left text-[10px] uppercase">Device Type</th>
                        <th className="p-4 text-left text-[10px] uppercase">Model / OS / Spec</th>
                        <th className="p-4 text-center w-24 text-[10px] uppercase">Qty</th>
                        <th className="p-4 text-center w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.equipment.map((item, index) => (
                        <tr key={item.id} className="hover:bg-white group transition-all">
                          <td className="p-4 text-center text-slate-400 font-black">{index + 1}</td>
                          <td className="p-4">
                              <input placeholder="i7, 16GB, Win 11..." className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500" value={item.type} onChange={(e) => handleEquipmentChange(item.id, "type", e.target.value)} />
                            
                          </td>
                          <td className="p-4">
                            <input placeholder="i7, 16GB, Win 11..." className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500" value={item.config} onChange={(e) => handleEquipmentChange(item.id, "config", e.target.value)} />
                          </td>
                          <td className="p-4">
                            <input type="number" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-center font-bold text-slate-600" value={item.quantity} onChange={(e) => handleEquipmentChange(item.id, "quantity", e.target.value)} />
                          </td>
                          <td className="p-4 text-center">
                            <button type="button" onClick={() => removeEquipmentRow(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 4: Timeline & Commercials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Commencement Date</label>
                    <input type="date" name="starting_date" required onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Termination Date</label>
                    <input type="date" name="end_date" required onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-400 uppercase tracking-widest ml-1">Total Contract Value</label>
                    <div className="relative">
                        <div className="absolute left-4 top-3.5 text-indigo-600 font-bold">₹</div>
                        <input type="number" name="price" required onChange={handleChange} className="w-full bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl py-3.5 pl-10 pr-4 font-black outline-none focus:ring-2 focus:ring-indigo-600" placeholder="0.00" />
                    </div>
                </div>
              </div>
            </form>

            <div className="p-8 border-t bg-slate-50 flex justify-end gap-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3.5 text-slate-500 font-bold hover:text-slate-700 transition-colors">Discard Draft</button>
              <button onClick={handleSubmit} className="bg-indigo-600 text-white px-10 py-3.5 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                Generate Agreement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractPage;