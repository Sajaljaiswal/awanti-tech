import React from 'react';
import { Clock, CheckCircle, ChevronRight, Calendar, User } from 'lucide-react';

export default function Services() {
  const services = [
    { id: 'SRV-101', client: 'Alice Smith', type: 'Tech Services', status: 'Pending', date: 'Jan 16, 2026' },
    { id: 'SRV-102', client: 'Bob Jones', type: 'CCTV Installation', status: 'Completed', date: 'Jan 14, 2026' },
    { id: 'SRV-103', client: 'Charlie Davis', type: 'Cartridge Refilling', status: 'In Progress', date: 'Jan 15, 2026' },
    { id: 'SRV-101', client: 'Alice Smith', type: 'Data Recovery', status: 'Pending', date: 'Jan 16, 2026' },
    { id: 'SRV-102', client: 'Bob Jones', type: 'AMC', status: 'Completed', date: 'Jan 14, 2026' },
    { id: 'SRV-103', client: 'Charlie Davis', type: 'Web Developement', status: 'In Progress', date: 'Jan 15, 2026' },
  
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'In Progress':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <div className="w-[58rem] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Service Requests</h2>
          <p className="text-sm text-gray-400 mt-1">Monitor maintenance and repair tasks.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Live Tracking
        </div>
      </div>

      {/* Services List */}
      <div className="grid gap-4">
        {services.map((srv) => (
          <div 
            key={srv.id} 
            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex gap-5 items-center">
              {/* Status Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                srv.status === 'Completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-amber-50 border-amber-100 text-amber-500'
              }`}>
                {srv.status === 'Completed' ? <CheckCircle size={22} /> : <Clock size={22} />}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {srv.type}
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <User size={12} /> {srv.client}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Calendar size={12} /> {srv.date}
                  </span>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                    #{srv.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
              {/* Status Badge */}
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(srv.status)}`}>
                {srv.status}
              </span>
              
              <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
                Details
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Aesthetic Empty State Helper */}
      <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
        <p className="text-sm text-gray-400 font-medium italic">No further requests at this time.</p>
      </div>
    </div>
  );
}