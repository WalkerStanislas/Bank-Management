import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

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

export const customerService = {
  getAll: () => axiosInstance.get('/customers'),
  getById: (id) => axiosInstance.get(`/customers/${id}`),
  create: (customer) => axiosInstance.post('/customers', customer)
};

export const accountService = {
  getAll: (page = 0, size = 10) => axiosInstance.get(`/accounts?page=${page}&size=${size}`),
  getById: (id) => axiosInstance.get(`/accounts/${id}`),
  getOperations: (id) => axiosInstance.get(`/accounts/${id}/operations`)
};

export const operationService = {
  debit: (accountId, amount, description) =>
    axiosInstance.post(`/accounts/${accountId}/debit`, { amount, description }),
  credit: (accountId, amount, description) =>
    axiosInstance.post(`/accounts/${accountId}/credit`, { amount, description }),
  transfer: (sourceId, destinationId, amount) =>
    axiosInstance.post('/accounts/transfer', {
      accountSource: sourceId,
      accountDestination: destinationId,
      amount
    })
};
