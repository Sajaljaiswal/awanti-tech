import React from 'react';
import { Mail, Shield, MoreVertical } from 'lucide-react';

export default function UserManagement() {
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@awanti.com', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'Service Tech', email: 'tech@awanti.com', role: 'Editor', status: 'Active' },
  ];

  return (
    <div className="space-y-6 w-[59rem]" >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Invite User</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-semibold text-gray-600">User</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="p-4"><span className="flex items-center gap-1 text-sm"><Shield size={14}/> {user.role}</span></td>
                <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{user.status}</span></td>
                <td className="p-4 text-gray-400 cursor-pointer"><MoreVertical size={18}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}