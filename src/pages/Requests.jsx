import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Ticket,
  CheckCircle,
  X,
  Loader2,
  Inbox,
  Mail,
  Phone,
  Calendar,
  Clock,
  ChevronRight,
  Save,
} from "lucide-react";
import { fetchAllRequests } from "../api/requestApi";
import toast from "react-hot-toast";
import { createTicket } from "../api/ticketApi";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRequest, setActiveRequest] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const [ticketFormData, setTicketFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
    product_type: "Laptop", // Default value
    issue: "",
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRequests();
      setRequests(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const markProcessed = async (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Processed" } : r)),
    );
  };

  const openTicketForm = (req) => {
    setActiveRequest(req);
    setTicketFormData({
      customer_name: req.name || "",
      phone: req.phone || "",
      address: req.address || "", // Prefill if available in request
      product_type: "Laptop", // Placeholder default
      issue: req.issue || "",
    });
    setShowTicketModal(true);
  };

  const handleCreateUser = async () => {
    await markProcessed(activeRequest.id);
    toast.success("User account setup successful!");
    setShowUserModal(false);
  };

  const handleCreateTicket = async () => {
    await markProcessed(activeRequest.id);
    toast.success("Service ticket generated!");
    setShowTicketModal(false);
  };

  const handleTicketSubmit = async () => {
    const loadingToast = toast.loading("Generating ticket...");
    try {
      await createTicket(ticketFormData);

      // Update the request status locally
      markProcessed(activeRequest.id);

      toast.success("Service ticket generated!", { id: loadingToast });
      setShowTicketModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Error generating ticket", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* REFINED HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Support Requests
            </h2>
            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Monitoring real-time incoming queries
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
              <span className="block text-[10px] uppercase font-black text-slate-400">
                Total
              </span>
              <span className="text-xl font-black text-indigo-600">
                {requests.length}
              </span>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
              <span className="block text-[10px] uppercase font-black text-slate-400">
                Pending
              </span>
              <span className="text-xl font-black text-amber-500">
                {requests.filter((r) => r.status !== "Processed").length}
              </span>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="relative">
              <Loader2
                className="animate-spin text-indigo-600"
                size={60}
                strokeWidth={1}
              />
              <div className="absolute inset-0 blur-2xl bg-indigo-500/20" />
            </div>
            <p className="text-slate-400 font-bold tracking-widest uppercase mt-6 text-xs">
              Syncing with database
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Inbox Zero!</h3>
            <p className="text-slate-400 max-w-xs mx-auto mt-2">
              No new support requests have arrived yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`group relative overflow-hidden bg-white border transition-all duration-300 rounded-[2.5rem] p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                  req.status === "Processed"
                    ? "border-emerald-100 bg-emerald-50/10 grayscale-[0.5] opacity-80"
                    : "border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
                }`}
              >
                {/* STATUS STRIP */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-2 ${req.status === "Processed" ? "bg-emerald-400" : "bg-indigo-500"}`}
                />

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500">
                      {req.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-black text-xl text-slate-800">
                          {req.name}
                        </h4>
                        {!req.user_id && (
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-black uppercase tracking-tighter">
                            Guest User
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-1">
                        <span className="text-sm text-slate-400 flex items-center gap-1.5 font-medium">
                          <Mail size={14} className="text-slate-300" />{" "}
                          {req.email}
                        </span>
                        <span className="text-sm text-slate-400 flex items-center gap-1.5 font-medium">
                          <Phone size={14} className="text-slate-300" />{" "}
                          {req.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 relative group-hover:bg-white transition-colors">
                    <span className="absolute -top-2 left-4 px-2 bg-white text-[10px] font-black text-indigo-500 uppercase">
                      Description
                    </span>
                    <p className="text-slate-600 text-sm italic leading-relaxed">
                      "{req.issue}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                      <Calendar size={12} /> {req.request_date}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                      <Clock size={12} /> {req.request_time}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-3 shrink-0">
                  {req.status !== "Processed" ? (
                    <>
                      <button
                        // onClick={() => { setActiveRequest(req); setShowTicketModal(true); }}
                        onClick={() => openTicketForm(req)}
                        className="flex-1 lg:w-48 flex items-center justify-center gap-2 text-xs font-black px-6 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 group/btn"
                      >
                        <Ticket size={18} /> CREATE TICKET
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-100/50 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-200">
                      <CheckCircle size={18} strokeWidth={3} /> Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      {showUserModal && (
        <Modal
          title="Setup Profile"
          onClose={() => setShowUserModal(false)}
          icon={<UserPlus className="text-indigo-600" />}
        >
          <div className="space-y-6">
            <p className="text-slate-500 leading-relaxed text-center">
              Create a permanent account for{" "}
              <span className="text-slate-900 font-bold underline decoration-indigo-500 underline-offset-4">
                {activeRequest.name}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 py-4 text-xs font-black text-slate-400 hover:text-slate-600"
              >
                CANCEL
              </button>
              <button
                onClick={handleCreateUser}
                className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                CONFIRM SETUP
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showTicketModal && (
        <TicketModal
          title="Generate Service Ticket"
          formData={ticketFormData}
          setFormData={setTicketFormData}
          onClose={() => setShowTicketModal(false)}
          onSubmit={handleTicketSubmit}
        />
      )}

      {showTicketModal && (
        <Modal
          title="Open Ticket"
          onClose={() => setShowTicketModal(false)}
          icon={<Ticket className="text-slate-900" />}
        >
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Context
              </span>
              <p className="text-sm font-bold text-slate-700 mt-1 italic">
                "{activeRequest.issue}"
              </p>
            </div>
            <button
              onClick={handleCreateTicket}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all"
            >
              GENERATE SERVICE TICKET
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose, icon }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-200 border border-white">
        <button
          onClick={onClose}
          className="absolute right-8 top-8 text-slate-300 hover:text-rose-500 transition-all p-2 bg-slate-50 rounded-full"
        >
          <X size={20} />
        </button>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
            {icon}
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase text-center">
            {title}
          </h3>
        </div>
        {children}
      </div>
    </div>
  );
}

function TicketModal({ title, onClose, onSubmit, formData, setFormData }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-200 border border-white">
        <button
          onClick={onClose}
          className="absolute right-8 top-8 text-slate-300 hover:text-rose-500 transition-all p-2 bg-slate-50 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100">
            <Ticket className="text-indigo-600" size={30} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase text-center">
            {title}
          </h3>
          <p className="text-xs text-slate-400 font-bold mt-1">
            Review details before saving
          </p>
        </div>

        <div className="space-y-3">
          {["customer_name", "phone", "address", "product_type", "issue"].map(
            (field) => (
              <div key={field}>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">
                  {field.replace("_", " ")}
                </label>
                <input
                  placeholder={`Enter ${field.replace("_", " ")}`}
                  value={formData[field] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>
            ),
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-xs font-black text-slate-400 hover:text-slate-600"
          >
            CANCEL
          </button>
          <button
            onClick={onSubmit}
            className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={18} /> SAVE TICKET
          </button>
        </div>
      </div>
    </div>
  );
}
