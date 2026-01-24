import { supabase } from "../supabaseClient";

export async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("User not logged in");

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}
