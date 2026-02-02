import React, { useEffect, useState } from "react";
import {
  Shield,
  X,
  UserPlus,
  Users,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Password added in initial state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "", 
    role: "staff",
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
    // ✅ Validation: Password check
    if (!formData.password || formData.password.length < 6) {
      alert("Password is required and must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Call API with all formData (including password)
      const response = await createStaff(formData);

      // Backend se agar { message, staff } aa raha hai toh:
      const newUser = response.staff || response; 

      setUsers((prev) => [newUser, ...prev]);
      setShowModal(false);
      resetForm();
      alert("Staff created successfully!");
    } catch (err) {
      console.error("Create Staff Error:", err);
      alert(err?.response?.data?.message || "Failed to create staff");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      password: "",
      role: "staff",
    });
    setIsEditMode(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;
    try {
      await deleteStaff(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Error deleting staff");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-indigo-600" />
            Staff Management
          </h2>
          <p className="text-slate-500 mt-1">
            Manage team roles, access levels, and account status.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/staff/login">
            <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center gap-2">
              Staff Login
            </button>
          </Link>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <UserPlus size={18} />
            Invite Staff
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-20 text-center text-slate-400">No staff members found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5">
                    <span className="font-semibold text-indigo-600 block">{user.name}</span>
                    <span className="text-xs text-slate-400">ID: {user.id?.slice(0, 8)}</span>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-slate-700 flex items-center gap-1.5"><Mail size={12} /> {user.email}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5"><Phone size={12} /> {user.mobile}</div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      <Shield size={14} /> {user.role}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button onClick={() => handleDeleteUser(user)} className="text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-slate-900">
                {isEditMode ? "Edit Staff" : "Add New Staff"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  placeholder="John Doe"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* ✅ Password Field - Only visible when NOT in edit mode */}
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                <input
                  placeholder="+91 0000000000"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                disabled={loading}
                onClick={handleCreateUser}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:bg-indigo-300 flex justify-center items-center"
              >
                {loading ? "Processing..." : isEditMode ? "Update Details" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}