import React, { useState } from "react";
import { Shield, MoreVertical, X } from "lucide-react";

/* ---------------- DEMO API (Replace Later) ---------------- */
const createUserAPI = (payload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: Date.now(),
          ...payload,
          status: "Active",
        },
      });
    }, 800);
  });
};
/* ---------------------------------------------------------- */

export default function StaffManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@awanti.com",
      role: "Super Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Service Tech",
      email: "tech@awanti.com",
      role: "Editor",
      status: "Active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Editor",
  });

  /* ---------------- HANDLE CREATE USER ---------------- */
  const handleCreateUser = async () => {
    if (!formData.name || !formData.email) return;

    setLoading(true);
    try {
      const res = await createUserAPI(formData);
      if (res.success) {
        setUsers((prev) => [...prev, res.data]);
        setShowModal(false);
        setFormData({ name: "", email: "", role: "Editor" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowModal(true);
  };

  const handleUpdateUser = () => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id ? { ...user, ...formData } : user,
      ),
    );

    setShowModal(false);
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData({ name: "", email: "", role: "Editor" });
  };

  const toggleUserStatus = () => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === confirmUser.id
          ? {
              ...user,
              status: user.status === "Active" ? "Disabled" : "Active",
            }
          : user,
      ),
    );
    setConfirmUser(null);
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
              <th className="p-4 font-semibold text-gray-600">User</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="p-4">
                  <span className="flex items-center gap-1 text-sm">
                    <Shield size={14} /> {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-gray-400 cursor-pointer">
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
                            alert("Edit user (connect edit modal)");
                            setActiveMenu(null);
                          }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            toggleUserStatus(user.id);
                            setActiveMenu(null);
                            setConfirmUser(user);
                          }}
                        >
                          {user.status === "Active"
                            ? "❌ Disable"
                            : "✅ Enable"}
                        </button>
                      </div>
                    )}

                    {confirmUser && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">
                            Confirm Action
                          </h3>

                          <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to{" "}
                            <b>
                              {confirmUser.status === "Active"
                                ? "disable"
                                : "enable"}
                            </b>{" "}
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
                              onClick={toggleUserStatus}
                              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </td>
              </tr>
            ))}
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
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
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

      {/* ========================================= */}
    </div>
  );
}
