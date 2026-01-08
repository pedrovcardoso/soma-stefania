import { apiClient } from './api';

const seiConfig = {
    endpoints: {
        processo: '/processo',
        detalheProcesso: '/detalheProcesso'
    },
    filters: {
        ano_ref: 'ano_referencia',
        tipo: 'tipo',
        status: 'status',
        dt_fim_prevista: 'dt_fim_prevista'
    },
    responseMapping: {
        status: 'status',
        sei_number: 'sei',
        description: 'descricao',
        ref_year: 'ano_referencia',
        deadline: 'dt_fim_prevista',
        type: 'tipo',
        assigned_to: 'atribuido'
    }
};

const mapResponseToFrontend = (data) => {
    if (!Array.isArray(data)) return [];

    return data.map(item => ({
        id: item[seiConfig.responseMapping.sei_number] || Math.random().toString(36).substr(2, 9),
        sei_number: item[seiConfig.responseMapping.sei_number],
        description: item[seiConfig.responseMapping.description],
        assigned_to: item[seiConfig.responseMapping.assigned_to],
        deadline: item[seiConfig.responseMapping.deadline],
        status: item[seiConfig.responseMapping.status],
        type: item[seiConfig.responseMapping.type],
        ref_year: item[seiConfig.responseMapping.ref_year]
    }));
};

export const fetchSeiProcesses = async (filters) => {
    try {
        const formData = new FormData();

        if (filters.year) formData.append(seiConfig.filters.ano_ref, filters.year);

        if (filters.type && filters.type.length > 0) {
            filters.type.forEach(t => formData.append(seiConfig.filters.tipo, t));
        }

        if (filters.status && filters.status.length > 0) {
            filters.status.forEach(s => formData.append(seiConfig.filters.status, s));
        }

        if (filters.dateRange?.to) {
            formData.append(seiConfig.filters.dt_fim_prevista, filters.dateRange.to.toISOString().split('T')[0]);
        }

        const response = await apiClient.post(seiConfig.endpoints.processo, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return mapResponseToFrontend(response.data);

    } catch (error) {
        console.error('Error fetching SEI processes:', error);
        throw error;
    }
};

export const fetchSeiProcessDetails = async (seiNumber) => {
    try {
        const formData = new FormData();
        formData.append('sei', seiNumber);

        const response = await apiClient.post(seiConfig.endpoints.detalheProcesso, formData);

        return response;
    } catch (error) {
        console.error('Error fetching SEI process details:', error);
        throw error;
    }
};