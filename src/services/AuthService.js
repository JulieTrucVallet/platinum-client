import axios from "axios";
import { API_URL } from "../config";

export async function login(email, password) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data; // { token, user }
}

export async function register(formData) {
  const res = await axios.post(`${API_URL}/auth/register`, formData);
  return res.data;
}

export async function getProfile() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}