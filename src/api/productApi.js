import API from "./apiClient";

export const getProducts = () =>
  API.get("/products");

export const createProduct = (payload) =>
  API.post("/products", payload);

export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);
