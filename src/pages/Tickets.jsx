import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  ChevronRight,
  Calendar,
  User,
  Plus,
  X,
} from "lucide-react";

export default function Tickets() {
  const [tickets, setTickets] = useState([
    {
      id: "TCK-101",
      customer: "Alice Smith",
      issue: "Internet not working",
      status: "Pending",
      date: "Jan 16, 2026",
      assignedTo: null,
    },
    {
      id: "TCK-102",
      customer: "Bob Jones",
      issue: "CCTV Installation",
      status: "In Progress",
      date: "Jan 15, 2026",
      assignedTo: "Service Tech",
    },
    {
      id: "TCK-103",
      customer: "Charlie Davis",
      issue: "Printer cartridge refill",
      status: "Completed",
      date: "Jan 14, 2026",
      assignedTo: "Admin User",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    customer: "",
    issue: "",
    assignedTo: "",
  });

  /* ---------------- STATUS STYLES ---------------- */
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "In Progress":
        return "bg-blue-50 text-blue-600 border-blue-100";
      default:
        return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  /* ---------------- CREATE TICKET ---------------- */
  const handleCreateTicket = () => {
    if (!formData.customer || !formData.issue) return;

    setTickets((prev) => [
      {
        id: `TCK-${Math.floor(Math.random() * 900 + 100)}`,
        customer: formData.customer,
        issue: formData.issue,
        assignedTo: formData.assignedTo || null,
        status: formData.assignedTo ? "In Progress" : "Pending",
        date: new Date().toDateString(),
      },
      ...prev,
    ]);

    setShowModal(false);
    setFormData({ customer: "", issue: "", assignedTo: "" });
  };

  return (
    <div className="w-[58rem] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Ticket Management
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Track, assign, and resolve customer issues.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
        >
          <Plus size={16} /> Add Ticket
        </button>
      </div>

      {/* TICKET LIST */}
      <div className="grid gap-4">
        {tickets.map((tkt) => (
          <div
            key={tkt.id}
            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex gap-5 items-center">
              {/* STATUS ICON */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  tkt.status === "Completed"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-500"
                    : "bg-amber-50 border-amber-100 text-amber-500"
                }`}
              >
                {tkt.status === "Completed" ? (
                  <CheckCircle size={22} />
                ) : (
                  <Clock size={22} />
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600">
                  {tkt.issue}
                </h4>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <User size={12} /> {tkt.customer}
                  </span>

                  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Calendar size={12} /> {tkt.date}
                  </span>

                  <span className="text-[10px] font-bold text-gray-300 uppercase">
                    #{tkt.id}
                  </span>
                </div>

                {tkt.assignedTo && (
                  <p className="text-xs mt-1 text-indigo-500 font-semibold">
                    Assigned to: {tkt.assignedTo}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(
                  tkt.status,
                )}`}
              >
                {tkt.status}
              </span>

              <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase">
                View
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD TICKET MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Create Ticket
            </h3>

            <div className="space-y-4">
              {/* Customer */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.customer}
                  onChange={(e) =>
                    setFormData({ ...formData, customer: e.target.value })
                  }
                />
              </div>

              {/* Issue */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Issue / Problem
                </label>
                <input
                  type="text"
                  placeholder="Describe the issue"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.issue}
                  onChange={(e) =>
                    setFormData({ ...formData, issue: e.target.value })
                  }
                />
              </div>

              {/* Assign */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Assign To
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={formData.assignedTo}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedTo: e.target.value })
                  }
                >
                  <option value="">Assign later</option>
                  <option>Admin User</option>
                  <option>Service Tech</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreateTicket}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
            >
              Create Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
