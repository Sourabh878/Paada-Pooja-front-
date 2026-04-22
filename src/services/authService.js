import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const register = (data) => {
  return axios.post(`${API_URL}/register`, data);
};

export const login = (data) => {
  return axios.post(`${API_URL}/login`, data);
};
