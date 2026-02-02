import { useEffect, useState } from "react";
import { getTicketsByStaff } from "../../api/staffApi";

export default function StaffTickets({ staffId }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  async function loadTickets() {
    try {
      const response = await getTicketsByStaff(staffId);
      
      // If your API returns { data: [...] }, use response.data
      // If it returns the array directly, use response
      const ticketArray = response.data || response || [];
      
      setTickets(Array.isArray(ticketArray) ? ticketArray : []);
    } catch (err) {
      console.error("Failed to load tickets", err);
      setTickets([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  }

  loadTickets();
}, [staffId]);

  if (loading) {
    return <p className="p-4">Loading tickets...</p>;
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-bold text-lg text-gray-800">My Tickets</h3>

      {tickets.length === 0 && (
        <p className="text-gray-400 text-gray-500">No tickets assigned</p>
      )}

      {tickets.map((t) => (
        <div
          key={t.id}
          className="bg-white p-4 rounded-lg shadow-sm border"
        >
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">{t.issue}</span>
            <span className="text-xs text-gray-500">
              {new Date(t.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Ticket #{t.ticket_number}
          </p>

          <span
            className={`inline-block mt-2 px-2 py-1 rounded text-xs font-bold ${
              t.status === "Completed"
                ? "bg-green-100 text-green-700"
                : t.status === "In Progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {t.status}
          </span>
        </div>
      ))}
    </div>
  );
}
