import axios from "axios";

// 1. Define the actual string URL of your backend. 
// Port 5000 is standard for Express, while 5173 is your React Vite port.
const BASE_URL = "http://localhost:5000/api/amcs"; 

/**
 * FETCH ALL AMCs
 */
export const fetchAMCs = async () => {
  try {
    // Use BASE_URL directly here
    const response = await axios.get(BASE_URL);
    return response.data; 
  } catch (error) {
    console.error("Error fetching AMCs:", error);
    throw error;
  }
};

/**
 * CREATE DETAILED AMC
 */
export const createDetailedAMC = async (formData) => {
  try {
    const response = await axios.post(BASE_URL, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating detailed AMC:", error);
    throw error;
  }
};

/**
 * UPDATE AMC
 */
export const updateAMC = async (id, formData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating AMC:", error);
    throw error;
  }
};

/**
 * DELETE AMC
 */
export const deleteAMC = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting AMC:", error);
    throw error;
  }
};

export const createAMC = createDetailedAMC;