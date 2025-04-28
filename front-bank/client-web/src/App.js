import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Configuration avec token d'authentification
const axiosInstance = axios.create({
  baseURL: API_URL
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse pour gérer les erreurs d'authentification
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Rediriger vers la page de login si le token est expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  login: (username, password) => axios.post(`${API_URL}/auth/login`, { username, password }),
  register: (userData) => axios.post(`${API_URL}/auth/register`, userData),
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Service client
export const customerService = {
  getAll: () => axiosInstance.get('/customers'),
  getById: (id) => axiosInstance.get(`/customers/${id}`),
  create: (customer) => axiosInstance.post('/customers', customer),
  update: (id, customer) => axiosInstance.put(`/customers/${id}`, customer),
  delete: (id) => axiosInstance.delete(`/customers/${id}`),
  getAccounts: (id) => axiosInstance.get(`/customers/${id}/accounts`)
};

// Service compte
export const accountService = {
  getAll: (page = 0, size = 10) => axiosInstance.get(`/accounts?page=${page}&size=${size}`),
  getById: (id) => axiosInstance.get(`/accounts/${id}`),
  create: (account) => axiosInstance.post('/accounts', account),
  getOperations: (id, page = 0, size = 20) => axiosInstance.get(`/accounts/${id}/operations?page=${page}&size=${size}`),
  getStatus: (id) => axiosInstance.get(`/accounts/${id}/status`),
  suspend: (id) => axiosInstance.put(`/accounts/${id}/suspend`),
  activate: (id) => axiosInstance.put(`/accounts/${id}/activate`)
};

// Service opération
export const operationService = {
  getAll: (page = 0, size = 20) => axiosInstance.get(`/operations?page=${page}&size=${size}`),
  getRecent: () => axiosInstance.get('/operations/recent'),
  getById: (id) => axiosInstance.get(`/operations/${id}`),
  debit: (accountId, amount, description) => axiosInstance.post(`/accounts/${accountId}/debit`, { amount, description }),
  credit: (accountId, amount, description) => axiosInstance.post(`/accounts/${accountId}/credit`, { amount, description }),
  transfer: (sourceId, destinationId, amount, description) => axiosInstance.post('/accounts/transfer', { 
    accountSource: sourceId, 
    accountDestination: destinationId, 
    amount,
    description
  })
};

// Service pour les statistiques et le tableau de bord
export const dashboardService = {
  getStats: () => axiosInstance.get('/stats'),
  getAccountSummary: () => axiosInstance.get('/stats/accounts'),
  getCustomerSummary: () => axiosInstance.get('/stats/customers'),
  getOperationSummary: () => axiosInstance.get('/stats/operations')
};

export default axiosInstance;