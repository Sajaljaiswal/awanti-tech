import React, { useState } from "react";
import { UserPlus, Ticket, CheckCircle, X } from "lucide-react";

export default function Requests() {
  const [requests, setRequests] = useState([
    {
      id: "REQ-101",
      name: "Rahul Verma",
      email: "rahul@gmail.com",
      issue: "Internet not working",
      date: "Jan 18, 2026",
      status: "New",
    },
    {
      id: "REQ-102",
      name: "Neha Sharma",
      email: "neha@gmail.com",
      issue: "CCTV installation",
      date: "Jan 17, 2026",
      status: "New",
    },
  ]);

  const [activeRequest, setActiveRequest] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  /* ---------------- CREATE USER ---------------- */
  const handleCreateUser = () => {
    console.log("User created:", activeRequest);
    markProcessed(activeRequest.id);
    setShowUserModal(false);
  };

  /* ---------------- CREATE TICKET ---------------- */
  const handleCreateTicket = () => {
    console.log("Ticket created:", activeRequest);
    markProcessed(activeRequest.id);
    setShowTicketModal(false);
  };

  /* ---------------- MARK DONE ---------------- */
  const markProcessed = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Processed" } : r)),
    );
  };

  return (
    <div className="w-[58rem] mx-auto space-y-8">
      {/* HEADER */}
      <div className="border-b pb-6">
        <h2 className="text-2xl font-semibold text-slate-900">New Requests</h2>
        <p className="text-sm text-slate-500 mt-1">
          Requests from new customers awaiting action
        </p>
      </div>

      {/* REQUEST LIST */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold text-slate-800">{req.name}</h4>
              <p className="text-sm text-slate-500">{req.email}</p>
              <p className="text-xs text-slate-400 mt-1">
                Issue: {req.issue} • {req.date}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {req.status === "New" ? (
                <>
                  <button
                    onClick={() => {
                      setActiveRequest(req);
                      setShowUserModal(true);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
                  >
                    <UserPlus size={14} /> Create User
                  </button>

                  <button
                    onClick={() => {
                      setActiveRequest(req);
                      setShowTicketModal(true);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                  >
                    <Ticket size={14} /> Create Ticket
                  </button>
                </>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <CheckCircle size={14} /> Processed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE USER MODAL */}
      {showUserModal && (
        <Modal title="Create User" onClose={() => setShowUserModal(false)}>
          <p className="text-sm text-slate-600 mb-4">
            Create account for <b>{activeRequest.name}</b>
          </p>

          <button
            onClick={handleCreateUser}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold"
          >
            Confirm Create User
          </button>
        </Modal>
      )}

      {/* CREATE TICKET MODAL */}
      {showTicketModal && (
        <Modal title="Create Ticket" onClose={() => setShowTicketModal(false)}>
          <p className="text-sm text-slate-600 mb-4">
            Create ticket for <b>{activeRequest.issue}</b>
          </p>

          <button
            onClick={handleCreateTicket}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold"
          >
            Confirm Create Ticket
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ================= REUSABLE MODAL ================= */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 bg-slate-900 text-white p-2 rounded-lg"
        >
          <X size={16} />
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-6">{title}</h3>

        {children}
      </div>
    </div>
  );
}
