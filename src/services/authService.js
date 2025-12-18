import { apiClient } from './api';

export const login = async (email, password) => {
    try {
        await apiClient.post('/auth/login', { email, password });
        return { success: true };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.message || 'Erro ao realizar login.',
        };
    }
};

export const logout = async () => {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
        console.error('Erro no logout', error);
    } finally {
        window.location.href = '/login';
    }
};