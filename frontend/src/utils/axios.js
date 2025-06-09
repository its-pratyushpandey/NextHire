import axios from 'axios';
import { toast } from 'react-hot-toast';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    timeout: 5000,
    withCredentials: true
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ERR_NETWORK') {
            toast.error('Network error. Please check your connection.');
        } else if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
            toast.error('Session expired. Please login again.');
        } else {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            toast.error(errorMessage);
        }
        return Promise.reject(error);
    }
);

export default instance; 