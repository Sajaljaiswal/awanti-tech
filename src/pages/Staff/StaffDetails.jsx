import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStaffById } from "../../api/staffApi";
import { getTicketsByStaff } from "../../api/staffApi";
import { ArrowLeft } from "lucide-react";

export default function StaffDetails() {
  const { staffId } = useParams();

  const [staff, setStaff] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   async function load() {
  try {
    const staffRes = await getStaffById(staffId);
    const ticketRes = await getTicketsByStaff(staffId);

    // 1. Fix Staff: Since staffRes is already the object
    // If staffRes.data exists use it, otherwise use staffRes directly
    const staffData = staffRes.data ? staffRes.data : staffRes;
    setStaff(staffData);

    // 2. Fix Tickets: ticketRes is an Axios response, so we need .data
    // We also ensure it's an array to prevent .map() errors
    if (ticketRes && ticketRes.data) {
      setTickets(ticketRes.data);
    } else {
      setTickets([]);
    }

  } catch (err) {
    console.error("Failed to load staff details", err);
  } finally {
    setLoading(false);
  }
}

    load();
  }, [staffId]);

  if (loading) {
    return <p className="p-6">Loading staff details...</p>;
  }

  if (!staff) {
    return <p className="p-6 text-red-600">Staff not found</p>;
  }

  return (
    <div className="w-[59rem] mx-auto p-4 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Link to="/staff" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">
          Staff Details
        </h2>
      </div>

      {/* STAFF INFO */}
      <div className="bg-white rounded-xl border p-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-semibold text-gray-800">{staff.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="capitalize text-gray-800">{staff.role}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-gray-800">{staff.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Mobile</p>
          <p className="text-gray-800">{staff.mobile}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold ${
              staff.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {staff.status}
          </span>
        </div>
      </div>

      {/* ASSIGNED TICKETS */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <h3 className="text-lg text-gray-800 font-bold p-4 border-b">
          Assigned Tickets ({tickets.length})
        </h3>

        {tickets.length === 0 ? (
          <p className="p-6 text-gray-400">No tickets assigned</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-gray-800">Ticket #</th>
                <th className="p-4 text-left text-gray-800">Issue</th>
                <th className="p-4 text-left text-gray-800">Status</th>
                <th className="p-4 text-left text-gray-800">Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-4 text-sm text-gray-800 font-mono">
                    {t.ticket_number}
                  </td>
                  <td className="p-4 text-gray-800">{t.issue}</td>
                  <td className="p-4text-gray-800">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        t.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : t.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-900 text-gray-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
