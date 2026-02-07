import React, { useEffect, useState } from "react";
import { getTicketsByStaff } from "../../api/staffApi";
// 1. API aur Toast import karein
import { updateTicketStatus } from "../../api/ticketApi";
import toast, { Toaster } from "react-hot-toast";

// Dropdown options
const STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Closed"];

export default function StaffTickets({ staffId }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await getTicketsByStaff(staffId);
      const ticketArray = response.data || response || [];
      setTickets(Array.isArray(ticketArray) ? ticketArray : []);
    } catch (err) {
      console.error("Failed to load tickets", err);
      toast.error("Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [staffId]);

  // 2. Status Change Handler
  const handleStatusChange = async (ticketId, newStatus) => {
    const loadingToast = toast.loading("Updating status...");
    try {
      // Backend ko sirf naya status bhejenge, history backend handle karega
      await updateTicketStatus(ticketId, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`, { id: loadingToast });
      loadTickets(); // List refresh karein taaki history dikhe
    } catch (err) {
      toast.error("Failed to update status", { id: loadingToast });
    }
  };

  if (loading) {
    return <p className="p-4">Loading tickets...</p>;
  }

  return (
    <div className="p-4 space-y-4">
      <Toaster position="top-right" />
      <h3 className="font-bold text-lg text-gray-800">My Tickets</h3>

      {tickets.length === 0 && (
        <p className="text-gray-500">No tickets assigned</p>
      )}

      {tickets.map((t) => (
        <div
          key={t.id}
          className="bg-white p-4 rounded-lg shadow-sm border space-y-3"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-gray-800">{t.issue}</span>
              <p className="text-xs text-gray-500 mt-1">
                Ticket #{t.ticket_number}
              </p>
            </div>
            
            {/* 3. Dropdown for Status */}
            <select
              value={t.status || "Pending"}
              onChange={(e) => handleStatusChange(t.id, e.target.value)}
              className="text-xs font-bold border rounded px-2 py-1 bg-gray-50 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400">
              Assigned on: {new Date(t.created_at).toLocaleDateString()}
            </span>
            
            {/* Status Badge (Visual only) */}
            <span
              className={`px-2 py-1 rounded text-[10px] font-bold ${
                t.status === "Completed" || t.status === "Closed"
                  ? "bg-green-100 text-green-700"
                  : t.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {t.status}
            </span>
          </div>

          {/* 4. History Log (Aapne jo minor sa manga tha) */}
          {t.status_history && t.status_history.length > 0 && (
            <div className="mt-2 p-2 bg-slate-50 rounded border-l-2 border-indigo-400">
              <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Recent Activity</p>
              {t.status_history.slice(-2).map((log, index) => (
                <div key={index} className="text-[10px] text-gray-600 flex justify-between">
                  <span>• {log.status} by <b className="text-indigo-600">{log.by || log.updated_by_name}</b></span>
                  <span className="text-gray-400 italic">{log.at || log.updated_at}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}