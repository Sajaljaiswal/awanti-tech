import API from "./apiClient";

/* CREATE CONTRACT */
export const createContract = (payload) => 
  API.post("/api/contracts", payload);

/* GET ALL CONTRACTS */
export const getAllContracts = () => 
  API.get("/api/contracts");
/* GET SINGLE CONTRACT BY ID */
export const getContractById = (contractId) => 
  API.get(`/api/contracts/${contractId}`);

/* UPDATE CONTRACT */
export const updateContract = (contractId, payload) => 
  API.put(`/api/contracts/${contractId}`, payload);

/* DELETE CONTRACT */
export const deleteContract = (contractId) => 
  API.delete(`/contracts/${contractId}`);

export default {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract
};