import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (usn, password) => api.post('/auth/login', { usn, password }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  forgotPassword: (usn, email) => api.post('/auth/forgot-password', { usn, email }),
  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
  getMe: () => api.get('/auth/me')
};

export const studentService = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  register: (data) => api.post('/students/register', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  getPlacements: (id) => api.get(`/students/${id}/placements`)
};

export const companyService = {
  getAll: () => api.get('/companies'),
  getById: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data)
};

export const placementService = {
  getAll: () => api.get('/placements'),
  getById: (id) => api.get(`/placements/${id}`),
  create: (data) => api.post('/placements', data),
  update: (id, data) => api.put(`/placements/${id}`, data)
};

export const reportService = {
  getDashboard: () => api.get('/reports/dashboard'),
  getBranchReport: (branch) => api.get(`/reports/branch/${branch}`),
  getEventsReport: () => api.get('/reports/events'),
  exportPlacements: () => api.get('/reports/export/placements')
};

export default api;
