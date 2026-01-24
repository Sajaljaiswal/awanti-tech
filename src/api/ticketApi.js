import axios from "axios";

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api" 
});
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);
// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const createTicket = (payload) =>
  API.post("/tickets/create", payload);

export const getAllTickets = () =>
  API.get("/tickets/all");

export const updateTicketStatus = (ticketId, payload) =>
  API.put(`/tickets/${ticketId}/status`, payload);

export const deleteTicket = (ticketId) =>
  API.delete(`/tickets/${ticketId}`);

export default API;
