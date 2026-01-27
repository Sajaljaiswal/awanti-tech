import React, { useState } from "react";
import { X, Plus, Trash2, Building2, User, Mail, MapPin, Phone, Monitor, CreditCard } from "lucide-react";

export default function DetailedAMCModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    owner_name: "",
    company_name: "AWANTI TECHNOLOGIES",
    email: "",
    address: "",
    site_address: "",
    contact_no: "",
    num_laptops: 0,
    num_computers: 0,
    num_printers: 0,
    num_scanners: 0,
    computer_configs: [{ user: "", config: "" }],
    on_network: "yes",
    os_type: "Windows",
    payment_cycle: "Yearly",
    rate_per_pc: 1600,
    payment_method: "Cheque"
  });

  const addConfigRow = () => {
    setForm({ ...form, computer_configs: [...form.computer_configs, { user: "", config: "" }] });
  };

  const updateConfig = (index, field, value) => {
    const newConfigs = [...form.computer_configs];
    newConfigs[index][field] = value;
    setForm({ ...form, computer_configs: newConfigs });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-slate-200">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">New Maintenance Contract</h2>
            <p className="text-sm text-slate-500">Fill in the details to generate a detailed AMC agreement.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
          
          {/* Section 1: Client Details */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold uppercase text-xs tracking-wider">
              <Building2 size={16} />
              <span>Client Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400" placeholder="Owner / Concerned Person" onChange={e => setForm({...form, owner_name: e.target.value})} />
                </div>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium" defaultValue={form.company_name} readOnly />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Email Address" onChange={e => setForm({...form, email: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                  <textarea className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[118px]" placeholder="Office Address" rows="3" onChange={e => setForm({...form, address: e.target.value})} />
                </div>
              </div>
            </div>
          </section>

         {/* Section 2: Contact & Assets */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 pt-8">
  <div className="md:col-span-1 space-y-4">
    <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold uppercase text-xs tracking-wider">
      <Phone size={16} />
      <span>Contact Details</span>
    </div>
    <input 
      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 outline-none" 
      placeholder="Primary Contact No." 
      value={form.contact_no}
      onChange={e => setForm({...form, contact_no: e.target.value})} 
    />
  </div>

  <div className="md:col-span-2 space-y-4">
    <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold uppercase text-xs tracking-wider">
      <Monitor size={16} />
      <span>Asset Inventory</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: 'Laptops', key: 'num_laptops' },
        { label: 'Computers', key: 'num_computers' },
        { label: 'Printers', key: 'num_printers' },
        { label: 'Scanners', key: 'num_scanners' }
      ].map((item) => (
        <div key={item.key} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{item.label}</label>
          <input 
            type="number" 
            className="w-full bg-transparent text-lg font-semibold text-slate-800 outline-none" 
            value={form[item.key]} 
            onChange={e => setForm({...form, [item.key]: parseInt(e.target.value) || 0})}
          />
        </div>
      ))}
    </div>
  </div>
</section>

{/* Section 4: Unit Rate Fix */}
<div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
  <label className="block text-[10px] font-bold text-indigo-600 uppercase mb-2">Unit Rate (per PC)</label>
  <div className="flex items-center gap-2">
    <span className="text-slate-400 font-bold">₹</span>
    <input 
      type="number" 
      className="bg-transparent text-xl font-bold text-slate-800 outline-none w-full" 
      value={form.rate_per_pc} 
      onChange={e => setForm({...form, rate_per_pc: parseFloat(e.target.value) || 0})}
    />
  </div>
</div>

          {/* Section 3: Hardware Config Table */}
          <section className="border-t border-slate-100 pt-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold uppercase text-xs tracking-wider">
                <Monitor size={16} />
                <span>Hardware Specifications</span>
              </div>
              <button onClick={addConfigRow} className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors flex items-center gap-1.5">
                <Plus size={14}/> Add New Device
              </button>
            </div>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase w-16 text-center">#</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">User / Desk ID</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">System Configuration</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {form.computer_configs.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-3 text-sm text-slate-400 text-center font-medium">{i + 1}</td>
                      <td className="px-4 py-3">
                        <input className="w-full bg-transparent text-sm text-slate-700 outline-none focus:text-indigo-600 font-medium" placeholder="e.g. Navdeep (Desk 25)" value={row.user} onChange={e => updateConfig(i, 'user', e.target.value)} />
                      </td>
                      <td className="px-4 py-3">
                        <input className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-300" placeholder="e.g. Core i3, 8GB RAM, 240GB SSD" value={row.config} onChange={e => updateConfig(i, 'config', e.target.value)} />
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => {
                          const filtered = form.computer_configs.filter((_, idx) => idx !== i);
                          setForm({...form, computer_configs: filtered});
                        }} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Terms & Payment */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-100 pt-8 pb-4">
             <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <label className="block text-[10px] font-bold text-indigo-600 uppercase mb-2">Unit Rate (per PC)</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">₹</span>
                  <input type="number" className="bg-transparent text-xl font-bold text-slate-800 outline-none w-full" defaultValue={1600} />
                </div>
             </div>

             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Payment Method</label>
                <div className="flex gap-4">
                  {['Cheque', 'Cash'].map(method => (
                    <label key={method} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="pay_method" className="w-4 h-4 text-indigo-600" checked={form.payment_method === method} onChange={() => setForm({...form, payment_method: method})} />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{method}</span>
                    </label>
                  ))}
                </div>
             </div>

             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Networked Office</label>
                <div className="flex gap-6">
                  {['Yes', 'No'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="net_status" className="w-4 h-4 text-indigo-600" defaultChecked={opt === 'Yes'} />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
             </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => onSave(form)}
            className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <CreditCard size={18} />
            Finalize & Save Contract
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}