import API from "./apiClient";

export const createTicket = (payload) =>
  API.post("/tickets", payload);

export const getAllTickets = () =>
  API.get("/tickets");

export const updateTicketStatus = (ticketId, payload) =>
  API.patch(`/tickets/${ticketId}/status`, payload);

export const deleteTicket = (ticketId) =>
  API.delete(`/tickets/${ticketId}`);

export default API;
