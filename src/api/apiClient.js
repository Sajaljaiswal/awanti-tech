import axios from "axios";              
import { supabase } from "../supabaseClient";

const API = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://awanti-backend.onrender.com",
});

API.interceptors.request.use(
  async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default API;
