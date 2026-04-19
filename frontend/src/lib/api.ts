import axios from "axios";
import { getAccessTokenSafely } from "./supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the absolute latest Supabase access token to every request
api.interceptors.request.use(async (config) => {
  const accessToken = await getAccessTokenSafely();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default api;