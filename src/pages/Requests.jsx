import React, { useState, useEffect } from "react";
import { UserPlus, Ticket, CheckCircle, X, Loader2, AlertCircle } from "lucide-react";
import { fetchAllRequests } from "../api/requestApi";
import toast from "react-hot-toast";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRequest, setActiveRequest] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // FETCH DATA FROM BACKEND
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRequests();
      // Backend se data aksar { data: [...] } format mein aata hai
      setRequests(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CREATE USER LOGIC ---------------- */
  const handleCreateUser = async () => {
    try {
      console.log("Creating user from request:", activeRequest);
      // Yahan aap apna createUser API call kar sakte hain
      
      await markProcessed(activeRequest.id);
      toast.success("User account setup successful!");
      setShowUserModal(false);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Error creating user");
    }
  };

  /* ---------------- CREATE TICKET LOGIC ---------------- */
  const handleCreateTicket = async () => {
    try {
      console.log("Generating ticket:", activeRequest);
      // Yahan aap apna createTicket API call kar sakte hain

      await markProcessed(activeRequest.id);
      toast.success("Service ticket generated!");
      setShowTicketModal(false);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Error generating ticket");
    }
  };

  /* ---------------- UPDATE STATUS IN BACKEND ---------------- */
  const markProcessed = async (id) => {
    try {
      // Backend update (Agar aapne patch route banaya hai)
      // await updateRequestStatus(id, "Processed");
      
      // UI Update
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Processed" } : r))
      );
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      console.error("Status update failed");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-6">
      {/* HEADER */}
      <div className="border-b pb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Support Requests</h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time inquiries from guest and registered users
          </p>
        </div>
        <div className="text-xs font-bold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase">
          {requests.length} Total Requests
        </div>
      </div>

      {/* REQUEST LIST */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
          <p className="text-slate-400 font-medium tracking-wide">Fetching data from server...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
          <AlertCircle className="mx-auto text-slate-300 mb-2" size={48} />
          <p className="text-slate-500 font-medium">No new requests found in the database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`bg-white border transition-all duration-200 rounded-2xl p-6 flex justify-between items-center hover:shadow-md ${
                req.status === "Processed" ? "border-green-100 bg-green-50/20" : "border-slate-200 shadow-sm"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-lg text-slate-800">{req.name}</h4>
                  {!req.user_id && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black uppercase">Guest</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 flex items-center gap-1 font-medium">{req.email} • {req.phone}</p>
                <div className="pt-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">Issue:</span>
                  <p className="text-sm text-slate-600 mt-0.5 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                    "{req.issue}"
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">
                  Received: {req.request_date} at {req.request_time}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                {req.status !== "Processed" ? (
                  <>
                    <button
                      onClick={() => { setActiveRequest(req); setShowUserModal(true); }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                      <UserPlus size={16} /> SETUP USER
                    </button>

                    <button
                      onClick={() => { setActiveRequest(req); setShowTicketModal(true); }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
                    >
                      <Ticket size={16} /> ISSUE TICKET
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase tracking-widest border border-green-200">
                    <CheckCircle size={14} /> Request Handled
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {showUserModal && (
        <Modal title="Onboard Customer" onClose={() => setShowUserModal(false)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              You are about to create a permanent profile for <b>{activeRequest.name}</b>. This will allow them to track their service history.
            </p>
            <button
              onClick={handleCreateUser}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all"
            >
              CONFIRM & CREATE
            </button>
          </div>
        </Modal>
      )}

      {showTicketModal && (
        <Modal title="Generate Service Ticket" onClose={() => setShowTicketModal(false)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Open a new support ticket for: <br/>
              <span className="font-bold text-slate-900">"{activeRequest.issue}"</span>
            </p>
            <button
              onClick={handleCreateTicket}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black shadow-xl transition-all"
            >
              CONFIRM TICKET
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= REUSABLE MODAL ================= */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-red-500 transition-colors p-2 bg-slate-50 rounded-full">
          <X size={20} />
        </button>
        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">{title}</h3>
        {children}
      </div>
    </div>
  );
}