import axios from "axios";

const API_URL = `${process.env.base_url}/api/auth`;

export const register = (data) => {
  return axios.post(`${API_URL}/register`, data);
};

export const login = (data) => {
  return axios.post(`${API_URL}/login`, data);
};



