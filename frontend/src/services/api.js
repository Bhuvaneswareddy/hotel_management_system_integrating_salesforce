import axios from "axios";

// Base URL for backend API
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// --------------------
// Auth APIs
// --------------------
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// --------------------
// Booking APIs
// --------------------
export const getBookings = async () => {
  const response = await api.get("/bookings");
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const updateBooking = async (id, updatedData) => {
  const response = await api.put(`/bookings/${id}`, updatedData);
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// --------------------
// Branch & Room APIs
// --------------------
export const getBranches = async () => {
  const response = await api.get("/branches");
  return response.data;
};

export const getRoomTypesByBranch = async (branchId) => {
  const response = await api.get(`/rooms/types/${branchId}`);
  return response.data;
};

export const getAvailableRooms = async (branchId, type, checkIn, checkOut) => {
  const response = await api.get(
    `/rooms/available?branchId=${branchId}&type=${type}&checkIn=${checkIn}&checkOut=${checkOut}`
  );
  return response.data;
};

// Export axios instance
export default api;
