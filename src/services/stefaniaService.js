
import { apiClient } from './api';

export const stefaniaService = {
    async getDistinctProcesses() {
        try {
            const response = await apiClient.get('/processodistintos');
            return response.data || [];
        } catch (error) {
            console.error('Erro ao buscar processos distintos:', error);
            return [];
        }
    },
    async askStefania(prompt, filtros = {}) {
        try {
            const payload = {
                prompt,
                filtros
            };
            const response = await apiClient.post('/ragconsulta', payload);
            return response;
        } catch (error) {
            console.error('Erro ao consultar StefanIA:', error);
            throw error;
        }
    },

    async getFilters() {
        try {
            const response = await apiClient.get('/filtros');
            return response;
        } catch (error) {
            console.error('Erro ao buscar filtros:', error);
            return {};
        }
    }
};
