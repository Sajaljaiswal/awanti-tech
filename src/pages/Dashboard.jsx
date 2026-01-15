import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Users, Package, Wrench, IndianRupee, 
  ArrowUpRight, ArrowDownRight, Loader2 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      {loading ? (
        <Loader2 className="animate-spin text-gray-300" size={20} />
      ) : (
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    activeServices: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // 1. Fetch Product Count
      const { count: productCount, error: pError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // 2. Fetch User Count (from your 'profiles' or 'users' table)
      const { count: userCount, error: uError } = await supabase
        .from('profiles') 
        .select('*', { count: 'exact', head: true });

      if (pError || uError) throw pError || uError;

      setStats({
        totalProducts: productCount || 0,
        totalUsers: userCount || 0,
        activeServices: 12, // Placeholder until you have a services table
        revenue: 12450      // Placeholder
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Shop Overview</h2>
          <p className="text-sm text-gray-500">Real-time data from your Supabase inventory.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Refresh Data
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          icon={Users} 
          color="bg-blue-500" 
          loading={loading}
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts.toLocaleString()} 
          icon={Package} 
          color="bg-indigo-500" 
          loading={loading}
        />
        <StatCard 
          title="Active Services" 
          value={stats.activeServices} 
          icon={Wrench} 
          color="bg-emerald-500" 
          loading={loading}
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.revenue.toLocaleString()}`} 
          icon={IndianRupee} 
          color="bg-orange-500" 
          loading={loading}
        />
      </div>

      {/* Recent Activity Table (Static for now) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Inventory Status</h3>
        <p className="text-sm text-gray-500">Your connection to Supabase is active. Recent database entries will appear here.</p>
      </div>
    </div>
  );
}