import React, { useEffect, useState } from "react";
import { Plus, User, Calendar, Trash2, Pencil } from "lucide-react";
import {
  createTicket,
  getAllTickets,
  deleteTicket,
  updateTicketStatus,
} from "../api/ticketApi";

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- CREATE MODAL ---------- */
  const [showCreate, setShowCreate] = useState(false);

  /* ---------- EDIT MODAL ---------- */
  const [showEdit, setShowEdit] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  /* ---------- FORM ---------- */
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
    product_type: "",
    issue: "",
  });

  /* ---------- FETCH ---------- */
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getAllTickets();
      setTickets(res.data);
    } catch (err) {
      alert("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  /* ---------- CREATE ---------- */
  const handleCreate = async () => {
    try {
      await createTicket(formData);
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
      alert(err.response?.data?.message || "Create failed");
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this ticket permanently?")) return;
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  /* ---------- STATUS UPDATE ---------- */
  const handleStatusChange = async (ticketId, status) => {
    try {
      await updateTicketStatus(ticketId, {
        status,
        staff_id: "SYSTEM", // or req.user.id if available
      });
      fetchTickets();
    } catch {
      alert("Status update failed");
    }
  };

  /* ---------- EDIT ---------- */
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
                {/* STATUS DROPDOWN */}
                {/* <select
                  value={t.assigned_staff_id || ""}
                  onChange={(e) =>
                    assignTicket(t.id, { staff_id: e.target.value })
                  }
                >
                  <option value="">Unassigned</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select> */}

                {/* EDIT */}
                <button
                  onClick={() => openEditModal(t)}
                  className="text-blue-600"
                >
                  <Pencil size={16} />
                </button>

                {/* DELETE */}
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
    </div>
  );
}

/* ================= MODAL COMPONENT ================= */

function Modal({ title, onClose, onSubmit, formData, setFormData }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-red w-full max-w-md rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">{title}</h3>

        {["customer_name", "phone", "address", "product_type", "issue"].map(
          (field) => (
            <input
              key={field}
              placeholder={field.replace("_", " ").toUpperCase()}
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-3"
            />
          ),
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
