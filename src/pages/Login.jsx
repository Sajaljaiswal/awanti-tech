import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Music, Lock, Mail, Loader2, AlertCircle, ChevronRight, TextSearch } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-[80rem] flex min-h-screen bg-white">
      {/* Left Side: Form Area */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-24 lg:px-32 relative z-10">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Logo (only visible on small screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Music className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Awanti</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-400 mt-2 text-sm">Please enter your details to access the admin panel.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 bg-rose-50 text-rose-600 p-4 rounded-xl text-sm border border-rose-100 animate-in fade-in zoom-in duration-300">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@awanti.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
                <button type="button" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Forgot?</button>
              </div>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-xl shadow-slate-200 hover:shadow-indigo-200 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign in to Dashboard
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-slate-400 text-xs tracking-tight">
            &copy; 2026 Awanti Tech. <br />
            Internal Management System.
          </p>
        </div>
      </div>

      {/* Right Side: Visual/Aesthetic Area */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-blue-100/50 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center p-12">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-indigo-100 inline-block mb-8">
            <TextSearch className="text-indigo-600" size={64} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tighter mb-4">
            Harmonizing <br />
            <span className="text-indigo-600">Your Inventory.</span>
          </h1>
          <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">
            The premium management suite for Awanti's Tech.
          </p>
        </div>
        
        {/* Floating Stat Indicator (Aesthetic Detail) */}
        <div className="absolute bottom-12 right-12 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-lg flex items-center gap-4 animate-bounce-slow">
           <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
              <Music size={20} />
           </div>
           <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Inventory</p>
              <p className="text-sm font-bold text-slate-800">452 Products</p>
           </div>
        </div>
      </div>
    </div>
  );
}