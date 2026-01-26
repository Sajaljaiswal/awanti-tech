import API from "./apiClient";

/* ================= STAFF APIs ================= */

// Get all staff
export const fetchStaff = async () => {
  const res = await API.get("/staff");
  return res.data;
};

// Create staff (ADMIN only)
export const createStaff = async (data) => {
  const res = await API.post("/staff", data);
  return res.data;
};

// Update staff
export const updateStaff = async (id, data) => {
  const res = await API.put(`/staff/${id}`, data);
  return res.data;
};

// Enable / Disable staff
export const toggleStaffStatus = async (id, status) => {
  const res = await API.patch(`/staff/${id}/status`, { status });
  return res.data;
};

// Delete staff
export const deleteStaff = async (id) => {
  const res = await API.delete(`/staff/${id}`);
  return res.data;
};

export const getStaffById = async (id) => {
  const res = await API.get(`/staff/${id}`);
  return res.data;
};

export const getTicketsByStaff = (staffId) => API.get(`/staff/assigned/${staffId}`);