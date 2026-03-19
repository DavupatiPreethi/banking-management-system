import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Accounts
export const getMyAccounts = () => API.get('/accounts/my-accounts');
export const createAccount = (data) => API.post('/accounts/create', data);
export const deposit = (data) => API.post('/accounts/deposit', data);
export const withdraw = (data) => API.post('/accounts/withdraw', data);
export const transfer = (data) => API.post('/accounts/transfer', data);
export const getTransactions = (accountNumber) => API.get(`/accounts/${accountNumber}/transactions`);

export default API;
