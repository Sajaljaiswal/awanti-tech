import React, { useEffect, useState } from "react";
import { Shield, MoreVertical, X, UserPlus, Users, Mail, Phone, Edit2, Trash2, Power, CheckCircle2 } from "lucide-react";
import {
  fetchStaff,
  createStaff,
  updateStaff,
  toggleStaffStatus,
  deleteStaff,
} from "../../api/staffApi";
import { Link } from "react-router-dom";

export default function StaffManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "Staff",
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await fetchStaff();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load staff", err);
    }
  };

  const handleCreateUser = async () => {
    setLoading(true);
    const newUser = await createStaff(formData);
    setUsers((prev) => [newUser, ...prev]);
    setShowModal(false);
    setLoading(false);
    resetForm();
  };

  const handleUpdateUser = async () => {
    const updated = await updateStaff(selectedUser.id, formData);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", mobile: "", role: "Staff" });
    setIsEditMode(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, mobile: user.mobile, role: user.role });
    setIsEditMode(true);
    setShowModal(true);
  };

  const confirmToggleStatus = async () => {
    if (!confirmUser) return;
    const newStatus = confirmUser.status === "active" ? "disabled" : "active";
    await toggleStaffStatus(confirmUser.id, newStatus);
    setUsers((prev) => prev.map((u) => u.id === confirmUser.id ? { ...u, status: newStatus } : u));
    setConfirmUser(null);
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;
    await deleteStaff(user.id);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  return (
    <div className="w-[58rem] max-w-6xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-indigo-600" />
            Staff Management
          </h2>
          <p className="text-slate-500 mt-1">Manage team roles, access levels, and account status.</p>
        </div>
        
        <Link to="/staff/login">
  <button
    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
  >
    <UserPlus size={18} />
    Staff Login
  </button>
</Link>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <UserPlus size={18} />
          Invite Staff
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-20 text-center text-slate-400">
                  <Users className="mx-auto mb-4 opacity-20" size={48} />
                  <p>No staff members found.</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <Link to={`/staff/${user.id}`} className="font-semibold text-indigo-600 hover:underline block">
                      {user.name}
                    </Link>
                    <span className="text-xs text-slate-400">ID: {user.id.slice(0, 8)}</span>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-slate-700 flex items-center gap-1.5">
                        <Mail size={12} className="text-slate-400" /> {user.email}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Phone size={12} className="text-slate-400" /> {user.mobile}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      <Shield size={14} className="text-indigo-500" />
                      {user.role}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tighter border ${
                      user.status === "active"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-red-50 text-red-600 border-red-100"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-5 relative">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === user.id && (
                        <div className="absolute right-10 top-12 bg-white border border-slate-200 rounded-xl shadow-xl w-44 z-50 py-2 overflow-hidden ring-4 ring-black/5">
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                            onClick={() => { handleEditUser(user); setActiveMenu(null); }}
                          >
                            <Edit2 size={14} /> Edit Profile
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            onClick={() => { setConfirmUser(user); setActiveMenu(null); }}
                          >
                            <Power size={14} className={user.status === "active" ? "text-red-500" : "text-emerald-500"} />
                            {user.status === "active" ? "Disable Account" : "Enable Account"}
                          </button>
                          <div className="h-px bg-slate-100 my-1" />
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            onClick={() => { handleDeleteUser(user); setActiveMenu(null); }}
                          >
                            <Trash2 size={14} /> Delete Member
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ring-1 ring-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">
                {isEditMode ? "Edit Staff Details" : "Invite New Member"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:bg-slate-200 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1 tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1 tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1 tracking-wider">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 00000 00000"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1 tracking-wider">Access Role</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Staff">Staff (Limited Access)</option>
                  <option value="User">User (View Only)</option>
                </select>
              </div>

              <button
                disabled={loading}
                onClick={isEditMode ? handleUpdateUser : handleCreateUser}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all mt-4 disabled:opacity-50"
              >
                {loading ? "Processing..." : isEditMode ? "Update Member Profile" : "Send Invite"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATUS CONFIRMATION MODAL */}
      {confirmUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center ring-1 ring-slate-200">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              confirmUser.status === 'active' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <Power size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Change Status?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to <strong>{confirmUser.status === "active" ? "disable" : "enable"}</strong> access for <strong>{confirmUser.name}</strong>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmUser(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleStatus}
                className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all ${
                  confirmUser.status === 'active' ? 'bg-red-600 shadow-red-100 hover:bg-red-700' : 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}