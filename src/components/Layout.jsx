import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Package, Wrench, 
  MapPin, LogOut, Bell, Search, Menu, X 
} from 'lucide-react';
import { supabase } from '../supabaseClient';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Users', path: '/users', icon: Users },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Services', path: '/services', icon: Wrench },
  { name: 'Tracking', path: '/tracking', icon: MapPin },
];

export default function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white p-6 
        transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:inset-0
      `}>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-indigo-400">Awanti Admin</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white"
            >
              <item.icon size={20} /> {item.name}
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout} 
          className="mt-auto flex items-center gap-2 text-slate-400 hover:text-red-400 pt-4 border-t border-slate-800 w-full transition"
        >
          <LogOut size={18}/> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
          <button className="md:hidden p-2" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center bg-gray-100 px-3 py-1.5 rounded-md w-96">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 ml-2 border-l pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-700">Admin User</p>
                <p className="text-[10px] text-gray-500">Store Manager</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}