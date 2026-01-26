import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import StaffTickets from "./StaffTickets";

export default function StaffDashboard() {
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setStaff(data);
    }

    loadProfile();
  }, []);

  if (!staff) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <h2 className="font-bold">
          Welcome, {staff.name}
        </h2>
        <p className="text-xs text-gray-500 capitalize">
          Role: {staff.role}
        </p>
      </header>

      <StaffTickets staffId={staff.id} />
    </div>
  );
}
