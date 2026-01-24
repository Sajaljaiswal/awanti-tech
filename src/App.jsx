import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

// Pages & Components
import Login from './pages/Login';
import ProductManagement from './pages/ProductManagement';
// import UserManagement from './pages/UserManagement';
import StaffManagement from './pages/StaffManagement';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Tickets from './pages/Tickets';
import AMCManagement from './pages/AMCManagement';
import Requests from './pages/Requests';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    console.log("SUPABASE SESSION:", data.session);
  });
}, []);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/" replace />} 
        />

        <Route 
          path="/*" 
          element={
            session ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  {/* <Route path="/users" element={<UserManagement />} /> */}
                  <Route path="/staff" element={<StaffManagement />} />
                  <Route path="/products" element={<ProductManagement />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/amcManagement" element={<AMCManagement />} />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}