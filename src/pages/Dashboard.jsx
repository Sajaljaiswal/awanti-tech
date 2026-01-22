import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Users, Package, Wrench, IndianRupee, 
  TrendingUp, Clock, Calendar, RefreshCcw, Loader2 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, loading, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
        +2.5%
      </span>
    </div>
    <div>
      <p className="text-xs font-medium text-gray-400 mb-1 tracking-tight">{title}</p>
      {loading ? (
        <Loader2 className="animate-spin text-indigo-200" size={20} />
      ) : (
        <h3 className="text-2xl font-semibold text-gray-800 tracking-tight">{value}</h3>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalUsers: 0, activeServices: 12, revenue: 12450 });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      setStats(prev => ({ ...prev, totalProducts: productCount || 0, totalUsers: userCount || 0 }));
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 px-4">
      {/* Soft Header */}
      <div className="flex justify-between items-end border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Hello, <span className="text-indigo-600">Admin</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">Here's a summary of your store's performance today.</p>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm font-medium text-gray-800">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-xs text-gray-400">
            {currentTime.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
      
      {/* Minimal Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Customers" value={stats.totalUsers} icon={Users} loading={loading} />
        <StatCard title="Inventory" value={stats.totalProducts} icon={Package} loading={loading} />
        <StatCard title="Requests" value={stats.activeServices} icon={Wrench} loading={loading} />
        <StatCard title="AMC" value={`₹${stats.revenue.toLocaleString()}`} icon={IndianRupee} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Simple Recent Activity */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-widest">Recent Activity</h3>
            <button className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors">View All</button>
          </div>
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-200 group-hover:bg-indigo-500 transition-colors" />
                  <p className="text-sm text-gray-600">Database synchronization successful</p>
                </div>
                <span className="text-xs text-gray-300">Just now</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aesthetic Info Card */}
        <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-4">Quick Tip</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              You can now manage your inventory and track services directly from the mobile app.
            </p>
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2 rounded-full text-xs font-medium transition-all backdrop-blur-sm">
              Dismiss
            </button>
          </div>
          {/* Subtle Abstract Shape */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
}