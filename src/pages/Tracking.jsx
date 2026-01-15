import React from 'react';
import { MapPin } from 'lucide-react';

export default function Tracking() {
  return (
    <div className="space-y-6 w-[58rem]">
      <h2 className="text-2xl font-bold text-gray-800">Logistics & Tracking</h2>
      <div className="bg-slate-100 h-64 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <MapPin size={48} className="mx-auto mb-2 opacity-20" />
          <p>Map API Integration Placeholder</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-bold">Active Shipments</h3>
        <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between">
          <div>
            <p className="font-medium">Order #AW-9920</p>
            <p className="text-xs text-gray-400">In Transit - Expected Friday</p>
          </div>
          <div className="w-1/2 bg-gray-200 h-2 rounded-full self-center relative">
            <div className="bg-indigo-600 h-2 rounded-full w-[70%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}