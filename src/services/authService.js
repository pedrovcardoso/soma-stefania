import { apiClient } from './api';

export const login = async (email, password) => {
    try {
        // apiClient connects to either Mock or Real API based on env var
        // It also handles JSON vs Text responses automatically
        const data = await apiClient.post('/login', { email, password });

        // If the API returns a text string (success message), we simulate a token for frontend state
        if (typeof data === 'string') {
            // Mock success scenario or Real API returning text
            const fakeToken = 'mock-token-' + Date.now();
            localStorage.setItem('authToken', fakeToken);
            return { success: true, data: { message: data, token: fakeToken } };
        }

        // If it returns JSON (Real API might return JSON in future or error objects)
        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }

        return { success: true, data };

    } catch (error) {
        console.error('Login service error:', error);
        return {
            success: false,
            error: error.message || 'Erro ao realizar login.',
        };
    }
};

export const logout = () => {
    localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
    return localStorage.getItem('authToken') !== null;
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};