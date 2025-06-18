import axios from 'axios';

// Base URL for the API
export const BASE_URL = "http://localhost:7000/api";

// Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Utility: Get token from localStorage
export const getToken = () => localStorage.getItem("token");

// Utility: Get user object from localStorage
export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Utility: Logout function
export const logoutAPI = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/"; // Redirect to login page or home
};

// Generalized API request handler
export const apiRequest = async (endpoint, data = {}, method = "get") => {
  const token = getToken();
  const isFormData = data instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  };

  try {
    const config = {
      url: endpoint,
      method,
      headers,
      ...(method === "get" ? { params: data } : { data }),
    };

    const response = await axiosInstance.request(config);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    // Rethrow parsed error for component-level handling
    throw error.response?.data || { message: error.message };
  }
};

// Auth APIs
export const loginAPI = async (payload) => {
  try {
    const response = await apiRequest("/user/login", payload, "post");
    if (response?.token) {
      localStorage.setItem("token", response.token);
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      return response;
    }
    throw new Error(response?.message || "Login failed");
  } catch (error) {
    throw error;
  }
};

export const registerAPI = async (payload) => {
  return await apiRequest("/user/register", payload, "post");
};

export const getUserInfo = async () => {
  return await apiRequest("/user/getUserInfo", {}, "get");
};
export const getAllPropertiesAPI = async () => {
  return await apiRequest("/properties/getAllProperties", {}, "get");
};

// Fetch single property by ID
export const getPropertyByIdAPI = async (id) => {
  return await apiRequest(`/properties/getPropertyById/${id}`, {}, "get");
};

// Fetch available filter options (property type, location, bedrooms)
export const getFilterOptionsAPI = async () => {
  return await apiRequest("/properties/filters", {}, "get");
};

// Search properties with filters (type, location, bedroom, price)
export const searchPropertiesAPI = async (filters) => {
  return await apiRequest("/properties/search", filters, "get");
};

// Create a new property (with FormData for image)
export const createPropertyAPI = async (formData) => {
  return await apiRequest("/properties/createProperty", formData, "post");
};

// Update an existing property
export const updatePropertyAPI = async (id, formData) => {
  return await apiRequest(`/properties/updateProperty/${id}`, formData, "put");
};

// Delete a property
export const deletePropertyAPI = async (id) => {
  return await apiRequest(`/properties/deleteProperty/${id}`, {}, "delete");
};