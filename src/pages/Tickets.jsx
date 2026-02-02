import React, { useEffect, useState } from "react";
import { Plus, User, Calendar, Trash2, Pencil } from "lucide-react";
// 1. Toast import karein
import toast, { Toaster } from "react-hot-toast"; 
import {
  createTicket,
  getAllTickets,
  deleteTicket,
  assignTicket,
  updateTicketStatus,
} from "../api/ticketApi";
import { fetchStaff } from "../api/staffApi";

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [assigningTicket, setAssigningTicket] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
    product_type: "",
    issue: "",
  });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getAllTickets();
      setTickets(res.data);
    } catch (err) {
      toast.error("Failed to load tickets"); // 2. Error Toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchStaff()
      .then(setStaff)
      .catch(() => toast.error("Failed to load staff"));
  }, []);

  const handleCreate = async () => {
    const loadingToast = toast.loading("Creating ticket..."); // 3. Loading state
    try {
      await createTicket(formData);
      toast.success("Ticket created successfully!", { id: loadingToast }); // 4. Success
      setShowCreate(false);
      setFormData({
        customer_name: "",
        phone: "",
        address: "",
        product_type: "",
        issue: "",
      });
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed", { id: loadingToast });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this ticket permanently?")) return;
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
      toast.success("Ticket deleted"); // 5. Delete success
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedStaff) {
      toast.error("Please select staff");
      return;
    }

    try {
      await assignTicket(assigningTicket.id, selectedStaff);
      toast.success("Staff assigned successfully!");
      setShowAssign(false);
      setAssigningTicket(null);
      setSelectedStaff("");
      fetchTickets();
    } catch {
      toast.error("Assignment failed");
    }
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      await updateTicketStatus(ticketId, {
        status,
        staff_id: "SYSTEM",
      });
      toast.success(`Status updated to ${status}`);
      fetchTickets();
    } catch {
      toast.error("Status update failed");
    }
  };

  const openEditModal = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      customer_name: ticket.customer_name,
      phone: ticket.phone,
      address: ticket.address,
      product_type: ticket.product_type,
      issue: ticket.issue,
    });
    setShowEdit(true);
  };

  return (
    <div className="w-[59rem] mx-auto p-4 space-y-6">
      {/* 6. Toaster Component - Isse ek baar render karna zaroori hai */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-gray-800 font-bold">Ticket Management</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> Add Ticket
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-gray-900">Loading tickets...</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="bg-white border rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4"
            >
              <div>
                <h4 className="font-semibold">{t.issue}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <User size={12} /> {t.customer_name}
                  <Calendar size={12} />{" "}
                  {new Date(t.created_at).toLocaleDateString()}
                </p>
                <p className="text-[10px] text-gray-400 font-bold">
                  #{t.ticket_number}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => {
                    setAssigningTicket(t);
                    setShowAssign(true);
                  }}
                  className="text-indigo-600 text-sm border px-2 py-1 rounded"
                >
                  Assign
                </button>

                <button
                  onClick={() => openEditModal(t)}
                  className="text-blue-600"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreate && (
        <Modal
          title="Create Ticket"
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <Modal
          title="Edit Ticket"
          onClose={() => setShowEdit(false)}
          onSubmit={() => setShowEdit(false)}
          formData={formData}
          setFormData={setFormData}
          readOnly
        />
      )}

      {/* ASSIGN MODAL */}
      {showAssign && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6">
            <h3 className="text-xl text-gray-800 font-bold mb-4">Assign Ticket</h3>
            <p className="text-sm text-gray-600 mb-2">
              Ticket: <b>{assigningTicket.issue}</b>
            </p>

            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full border text-gray-800 rounded px-3 py-2 mb-4"
            >
              <option value="">Select Staff</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAssign(false)} className="px-4 py-2">
                Cancel
              </button>
              <button
                onClick={handleAssignTicket}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= MODAL COMPONENT ================= */

function Modal({ title, onClose, onSubmit, formData, setFormData }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>

        {["customer_name", "phone", "address", "product_type", "issue"].map(
          (field) => (
            <input
              key={field}
              placeholder={field.replace("_", " ").toUpperCase()}
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              className="w-full border text-gray-800 rounded px-3 py-2 mb-3 outline-none"
            />
          ),
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow-sm hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}