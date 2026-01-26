import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStaffById, getTicketsByStaff } from "../../api/staffApi";
import { ArrowLeft, Mail, Phone, Shield, Calendar, Ticket, User, Clock } from "lucide-react";

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
        const staffData = staffRes.data ? staffRes.data : staffRes;
        setStaff(staffData);
        setTickets(ticketRes?.data || []);
      } catch (err) {
        console.error("Failed to load staff details", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [staffId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="ml-3 text-slate-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 mx-auto max-w-2xl mt-10">
        <p className="text-red-500 font-bold text-lg">Staff member not found</p>
        <Link to="/staff" className="mt-4 inline-flex items-center text-indigo-600 hover:underline">
          <ArrowLeft size={16} className="mr-1" /> Back to Staff List
        </Link>
      </div>
    );
  }

  return (
    <div className="w-[58rem] max-w-5xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      
      {/* HEADER & NAVIGATION */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/staff" className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Member Profile
            </h2>
            <p className="text-sm text-slate-500">View performance and assigned activities.</p>
          </div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
          staff.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
        }`}>
          {staff.status}
        </span>
      </div>

      {/* STAFF INFO CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center gap-2">
          <User size={18} className="text-indigo-500" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">General Information</span>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Full Name</p>
            <p className="text-lg font-bold text-slate-800">{staff.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Email Address</p>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail size={14} className="text-slate-300" />
              <p className="font-medium">{staff.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Mobile</p>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone size={14} className="text-slate-300" />
              <p className="font-medium">{staff.mobile}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Primary Role</p>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-indigo-500" />
              <p className="font-bold text-slate-800 capitalize">{staff.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ASSIGNED TICKETS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Ticket className="text-indigo-600" size={20} />
            Assigned Tickets
            <span className="ml-2 bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full border border-indigo-100">
              {tickets.length}
            </span>
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {tickets.length === 0 ? (
            <div className="p-16 text-center">
              <Clock className="mx-auto mb-3 opacity-10" size={48} />
              <p className="text-slate-400 font-medium">No tickets currently assigned to this member.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase">Ticket ID</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase">Reported Issue</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase text-right">Date Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        #{t.ticket_number}
                      </span>
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-semibold text-slate-800">{t.issue}</p>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        t.status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        t.status === "In Progress" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-slate-50 text-slate-500 border-slate-200"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-500 text-sm">
                        <Calendar size={12} />
                        {new Date(t.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}