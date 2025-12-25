import axios from 'axios';

// Automatically detect the correct API URL based on the current host
// This allows the app to work on both PC (localhost) and mobile (IP address)
const getApiUrl = () => {
    // If VITE_API_URL is set in .env, use it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // In production (Render), frontend and backend are on same domain
    // Check if we're on localhost or an IP address (development)
    const hostname = window.location.hostname;
    const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);

    if (isDevelopment) {
        // Development: use hostname with port 5000
        const protocol = window.location.protocol;
        return `${protocol}//${hostname}:5000/api`;
    } else {
        // Production: same domain, just /api
        return '/api';
    }
};

const API_URL = getApiUrl();

// Log the API URL for debugging (especially useful on mobile)
console.log('🔗 API URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
