import { apiClient } from './api';

export const fetchTags = async () => {
    try {
        const response = await apiClient.post('/manterTags_bp', {
            operacao: 'consultar',
            dados: {}
        });
        return response.data || [];
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
};

export const manterTag = async (operacao, dados) => {
    try {
        const response = await apiClient.post('/manterTags_bp', {
            operacao,
            dados
        });
        return response;
    } catch (error) {
        console.error(`Error in manterTag (${operacao}):`, error);
        throw error;
    }
};

export const manterVinculacaoTag = async (operacao, dados) => {
    try {
        const response = await apiClient.post('/mantervinculacaoTags_bp', {
            operacao,
            dados
        });
        return response;
    } catch (error) {
        console.error(`Error in manterVinculacaoTag (${operacao}):`, error);
        throw error;
    }
};
