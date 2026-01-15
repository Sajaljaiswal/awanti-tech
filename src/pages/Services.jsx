import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Services() {
  const services = [
    { id: 'SRV-101', client: 'Alice Smith', type: 'Piano Tuning', status: 'Pending' },
    { id: 'SRV-102', client: 'Bob Jones', type: 'Guitar Stringing', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Service Requests</h2>
      <div className="grid gap-4">
        {services.map(srv => (
          <div key={srv.id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className={srv.status === 'Pending' ? 'text-orange-500' : 'text-green-500'}>
                {srv.status === 'Pending' ? <Clock /> : <CheckCircle />}
              </div>
              <div>
                <h4 className="font-bold">{srv.type}</h4>
                <p className="text-sm text-gray-500">Client: {srv.client} • ID: {srv.id}</p>
              </div>
            </div>
            <button className="text-indigo-600 font-medium text-sm">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}