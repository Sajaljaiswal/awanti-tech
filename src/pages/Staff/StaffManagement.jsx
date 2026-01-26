import React, { useEffect, useState } from "react";
import { Shield, MoreVertical, X } from "lucide-react";
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
  console.log("Users:", users);
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

  const handleCreateUser = async () => {
    setLoading(true);
    const newUser = await createStaff(formData);
    setUsers((prev) => [newUser, ...prev]);
    setShowModal(false);
    setLoading(false);
  };

  const handleUpdateUser = async () => {
    const updated = await updateStaff(selectedUser.id, formData);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setShowModal(false);
  };

  useEffect(() => {
    async function loadStaff() {
      try {
        const data = await fetchStaff();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load staff", err);
      }
    }

    loadStaff();
  }, []);

  const confirmToggleStatus = async () => {
    if (!confirmUser) return;

    const newStatus = confirmUser.status === "active" ? "disabled" : "active";

    await toggleStaffStatus(confirmUser.id, newStatus);

    setUsers((prev) =>
      prev.map((u) =>
        u.id === confirmUser.id ? { ...u, status: newStatus } : u,
      ),
    );

    setConfirmUser(null);
  };

  const handleDeleteUser = async (user) => {
    if (!user) return;

    await deleteStaff(user.id);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  };
  return (
    <div className="space-y-6 w-[59rem]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Invite User
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Phone</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  No staff found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* USER INFO */}
                  <td className="p-4">
                     <Link
    to={`/staff/${user.id}`}
    className="font-medium text-indigo-600 hover:underline"
  >
    {user.name}
  </Link>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700 text-sm">{user.email}</span>
                  </td>
                  {/* PHONE */}
                  <td className="p-4">
                    <span className="text-gray-700 text-sm">{user.mobile}</span>
                  </td>

                  {/* ROLE */}
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-gray-600 text-sm capitalize">
                      <Shield size={14} />
                      {user.role || "Staff"}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 relative">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === user.id ? null : user.id)
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenu === user.id && (
                      <div className="absolute right-6 top-10 bg-white border rounded-lg shadow-lg w-36 z-50">
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            handleEditUser(user);
                            setActiveMenu(null);
                          }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            setConfirmUser(user);
                            setActiveMenu(null);
                          }}
                        >
                          {user.status === "active"
                            ? "❌ Disable"
                            : "✅ Enable"}
                        </button>

                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                          onClick={() => {
                            handleDeleteUser(user);
                            setActiveMenu(null);
                          }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-50 w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-gray-200">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
            >
              <X size={18} className="text-gray-700" />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {isEditMode ? "Edit Staff" : "Create New Staff"}
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-3 py-2"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Role
                </label>
                <select
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>

            {/* Action Button */}
            <button
              disabled={loading}
              onClick={isEditMode ? handleUpdateUser : handleCreateUser}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold disabled:opacity-50"
            >
              {isEditMode ? "Update Staff" : "Create Staff"}
            </button>
          </div>
        </div>
      )}
      {/* ================= CONFIRM ENABLE / DISABLE ================= */}
      {confirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Confirm Action
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to{" "}
              <b>{confirmUser.status === "active" ? "disable" : "enable"}</b>{" "}
              this staff member?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmUser(null)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={confirmToggleStatus}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
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
