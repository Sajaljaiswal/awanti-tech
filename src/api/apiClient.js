import axios from "axios";              // ✅ MISSING IMPORT (FIXED)
import { supabase } from "../supabaseClient";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use(
  async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;

    console.log("AXIOS INTERCEPTOR TOKEN:", token); // DEBUG

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default API;
