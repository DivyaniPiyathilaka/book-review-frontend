import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

const register = (email, password) => {
  return axios.post(`${API_URL}/register`, { email, password });
};

const authService = { login, register };
export default authService;
