import axios from 'axios';

const API = axios.create({ baseURL: 'https://banking-management-system-production.up.railway.app/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.setItem('sessionExpired', 'true');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login', data);

export const getMyAccounts   = ()                => API.get('/accounts/my-accounts');
export const createAccount   = (data)            => API.post('/accounts/create', data);
export const deposit         = (data)            => API.post('/accounts/deposit', data);
export const withdraw        = (data)            => API.post('/accounts/withdraw', data);
export const transfer        = (data)            => API.post('/accounts/transfer', data);
export const getTransactions = (accountNumber)   => API.get(`/accounts/${accountNumber}/transactions`);
export const changePassword  = (data)            => API.post('/auth/change-password', data);
export const getUserProfile  = ()                => API.get('/auth/profile');

export default API;
