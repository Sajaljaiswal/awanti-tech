import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userApi";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    amc_details: {},
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await fetchUsers();
    setUsers(res.data);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.mobile) {
      alert("Name and mobile required");
      return;
    }

    if (editingUser) {
      const res = await updateUser(editingUser.id, formData);
      setUsers((prev) =>
        prev.map((u) => (u.id === res.data.id ? res.data : u)),
      );
    } else {
      const res = await createUser(formData);
      setUsers((prev) => [res.data, ...prev]);
    }

    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: "",
      mobile: "",
      email: "",
      address: "",
      amc_details: {},
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="w-[59rem] space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-gray-800 font-bold">User Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-500">
            <tr>
              <th className="p-4 text-gray-700">Name</th>
              <th className="p-4 text-gray-700">Mobile</th>
              <th className="p-4 text-gray-700">Email</th>
              <th className="p-4 text-gray-700">Address</th>
              <th className="p-4 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-4 text-gray-700">{u.name}</td>
                <td className="p-4 text-gray-700">{u.mobile}</td>
                <td className="p-4 text-gray-700">{u.email || "-"}</td>
                <td className="p-4 text-gray-700">{u.address || "-"}</td>
                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => {
                      setEditingUser(u);
                      setFormData(u);
                      setShowModal(true);
                    }}
                    className="text-blue-600"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
            <button onClick={closeModal} className="absolute right-4 top-4">
              <X />
            </button>

            <h3 className="text-xl font-bold mb-4">
              {editingUser ? "Edit User" : "Create User"}
            </h3>

            {["name", "mobile", "email", "address"].map((field) => (
              <input
                key={field}
                placeholder={field.toUpperCase()}
                className="w-full text-gray-700 border px-3 py-2 mb-3 rounded"
                value={formData[field] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
              />
            ))}

            <textarea
              placeholder="AMC Details (JSON optional)"
              className="w-full border text-gray-700 px-3 py-2 rounded"
              onChange={(e) => {
                try {
                  setFormData({
                    ...formData,
                    amc_details: JSON.parse(e.target.value),
                  });
                } catch {}
              }}
            />

            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
