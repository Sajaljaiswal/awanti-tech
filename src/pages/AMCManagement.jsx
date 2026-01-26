import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { fetchAMCs, createAMC, updateAMC, deleteAMC } from "../api/amcApi";
import { fetchUsers } from "../api/userApi";

export default function AMCManagement() {
  const [amcs, setAmcs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

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
    const a = await fetchAMCs();
    const u = await fetchUsers();
    setAmcs(a.data);
    setCustomers(u.data);
  };

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

  return (
    <div className="w-[59rem] space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl text-gray-800 font-bold">AMC Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus size={16} /> Register AMC
        </button>
      </div>

      <table className="w-full bg-white rounded-xl border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-gray-700">Customer</th>
            <th className="p-4 text-gray-700">Duration</th>
            <th className="p-4 text-gray-700">Fees</th>
            <th className="p-4 text-gray-700">Status</th>
            <th className="p-4 text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {amcs.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="p-4">
                {a.customers?.name}
                <div className="text-xs text-gray-800">
                  {a.customers?.mobile}
                </div>
              </td>
              <td className="p-4 text-gray-700">{a.duration_months} months</td>
              <td className="p-4 text-gray-700">₹{a.fees}</td>
              <td className="p-4 text-gray-700 capitalize">{a.status}</td>
              <td className="p-4 flex gap-3">
                <Pencil
                  className="cursor-pointer text-blue-600"
                  size={16}
                  onClick={() => {
                    setEditing(a);
                    setForm(a);
                    setShowModal(true);
                  }}
                />
                <Trash2
                  className="cursor-pointer text-red-600"
                  size={16}
                  onClick={async () => {
                    if (confirm("Delete AMC?")) {
                      await deleteAMC(a.id);
                      setAmcs((p) => p.filter((x) => x.id !== a.id));
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
            <button onClick={close} className="absolute right-4 top-4">
              <X />
            </button>

            <h3 className="text-xl font-bold mb-4">
              {editing ? "Edit AMC" : "Register AMC"}
            </h3>

            <select
              className="w-full border text-gray-700 p-2 mb-3"
              value={form.customer_id}
              onChange={(e) =>
                setForm({ ...form, customer_id: e.target.value })
              }
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.mobile})
                </option>
              ))}
            </select>

            <input
              placeholder="AMC Fees"
              className="w-full border text-gray-700 p-2 mb-3"
              value={form.fees}
              onChange={(e) => setForm({ ...form, fees: e.target.value })}
            />

            <textarea
              placeholder="Products Covered"
              className="w-full border text-gray-700 p-2 mb-3"
              value={form.products_covered}
              onChange={(e) =>
                setForm({ ...form, products_covered: e.target.value })
              }
            />

            <button
              onClick={submit}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              Save AMC
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
