import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getAppHost = () => {
    if (Platform.OS === 'android') {
        return '10.0.2.2';
    }
    return '192.168.0.86';
};

const API_BASE_URL = `http://${getAppHost()}:3000/api`; // Backend local URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Function to set auth token
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (name, email, password, cpf, role) => api.post('/auth/register', { name, email, password, cpf, role }),
};

export const professionalsAPI = {
    getAll: () => api.get('/professionals'),
    getById: (id) => api.get(`/professionals/${id}`),
};

export const usersAPI = {
    getAll: (role) => api.get('/users', { params: { role } }),
};

export const subscriptionsAPI = {
    create: (data) => api.post('/subscriptions', data),
    getUserSubscriptions: () => api.get('/subscriptions'),
};

export default api;