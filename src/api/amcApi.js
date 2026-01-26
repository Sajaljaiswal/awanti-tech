import API from "./apiClient";

export const fetchAMCs = () => API.get("/amc");

export const createAMC = (data) => API.post("/amc", data);

export const updateAMC = (id, data) => API.put(`/amc/${id}`, data);

export const deleteAMC = (id) => API.delete(`/amc/${id}`);
