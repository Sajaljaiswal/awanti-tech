import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Users, Search, Mail, Phone, MapPin, UserCheck, RefreshCw } from "lucide-react";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userApi";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.mobile?.includes(searchTerm)
  );

  const handleSubmit = async () => {
    if (!formData.name || !formData.mobile) {
      alert("Name and mobile required");
      return;
    }

    try {
      if (editingUser) {
        const res = await updateUser(editingUser.id, formData);
        setUsers((prev) => prev.map((u) => (u.id === res.data.id ? res.data : u)));
      } else {
        const res = await createUser(formData);
        setUsers((prev) => [res.data, ...prev]);
      }
      closeModal();
    } catch (err) {
      alert("Error saving user");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: "", mobile: "", email: "", address: "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="w-[58rem] max-w-6xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <UserCheck className="text-indigo-600" size={32} />
            User Management
          </h2>
          <p className="text-slate-500 mt-1">Manage your customer database and contact information.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadUsers}
            className={`p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Add New User
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or phone..." 
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Name</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Address</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-5">
                  <div className="font-bold text-slate-800">{u.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-0.5">Customer ID: {u.id.slice(0, 8)}</div>
                </td>
                <td className="p-5 text-sm text-slate-600 font-medium">{u.mobile}</td>
                <td className="p-5 text-sm text-slate-600">
                  {u.email ? (
                    <div className="flex items-center gap-1.5">
                      <Mail size={14} className="text-slate-300" />
                      {u.email}
                    </div>
                  ) : "-"}
                </td>
                <td className="p-5 text-sm text-slate-400 max-w-[200px] truncate">
                  {u.address || "-"}
                </td>
                <td className="p-5">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingUser(u); setFormData(u); setShowModal(true); }}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center text-slate-400">
            <Users className="mx-auto mb-4 opacity-20" size={48} />
            <p className="font-medium">No users found matching your search.</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden ring-1 ring-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingUser ? "Update Profile" : "Create New User"}
                </h3>
                <p className="text-slate-400 text-xs font-medium">Please enter the customer's official contact details.</p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20}/></button>
            </div>

            <div className="p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mobile No.</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="+91..." value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="email@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Permanent Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-300" size={16} />
                  <textarea className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px] resize-none" placeholder="Enter full office/residence address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {editingUser ? "Save Profile Changes" : "Confirm User Creation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}