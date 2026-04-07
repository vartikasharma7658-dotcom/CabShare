// src/utils/api.js
import axios from "axios";

const API = axios.create({
  // In production: REACT_APP_API_URL=https://cabshare-backend.onrender.com/api
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api" || "http://10.215.26.88:5000",
});

API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;