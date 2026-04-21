import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to set auth token
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = api.defaults.headers.common['Authorization'];
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (name, email, password, role) => api.post('/auth/register', { name, email, password, role }),
};

export const professionalsAPI = {
    getAll: () => api.get('/professionals'),
    getById: (id) => api.get(`/professionals/${id}`),
};

export const subscriptionsAPI = {
    create: (data) => api.post('/subscriptions', data),
    getUserSubscriptions: () => api.get('/subscriptions'),
};

export default api;