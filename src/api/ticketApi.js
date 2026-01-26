import API from "./apiClient";

export const createTicket = (payload) =>
  API.post("/tickets", payload);

export const getAllTickets = () =>
  API.get("/tickets");

export const updateTicketStatus = (ticketId, payload) =>
  API.patch(`/tickets/${ticketId}/status`, payload);

export const deleteTicket = (ticketId) =>
  API.delete(`/tickets/${ticketId}`);



export const assignTicket = (ticketId, staff_id) =>
  API.put(`/tickets/${ticketId}/assign`, { staff_id });


export default API;
