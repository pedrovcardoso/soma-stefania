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

export const listarAcessos = async (email) => {
    try {
        const formData = new FormData();
        formData.append('usuario', email);
        const response = await apiClient.post('/listaracessos', formData);
        
        if (response?.status === 'success') {
            return { success: true, data: response.data };
        }
        return { success: false, error: 'Erro ao listar acessos' };
    } catch (error) {
        console.error('Listar acessos error:', error);
        return {
            success: false,
            error: error.message || 'Erro ao listar acessos.',
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