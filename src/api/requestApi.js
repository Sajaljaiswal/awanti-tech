import API from "./apiClient"; // Axios instance

export const fetchAllRequests = async () => {
  try {
    const res = await API.get("/requests/all");

    // ✅ Always return data safely
    return res?.data || [];

  } catch (err) {
    console.error("Fetch Requests Error:", err);

    // ✅ Proper error message
    throw new Error(
      err?.response?.data?.message ||
      "Failed to fetch requests"
    );
  }
};
