import { apiClient } from './api';
import { seiConfig } from '@/app/(main)/sei/sei-settings';

const mapResponseToFrontend = (data) => {
    if (!Array.isArray(data)) return [];

    return data.map(item => ({
        id: item[seiConfig.responseMapping.sei_number] || Math.random().toString(36).substr(2, 9), // Fallback ID if not provided
        sei_number: item[seiConfig.responseMapping.sei_number],
        description: item[seiConfig.responseMapping.description],
        assigned_to: item[seiConfig.responseMapping.assigned_to],
        deadline: item[seiConfig.responseMapping.deadline],
        status: item[seiConfig.responseMapping.status],
        type: item[seiConfig.responseMapping.type],
        ref_year: item[seiConfig.responseMapping.ref_year],
        tags: [] // Backend doesn't seem to return tags yet
    }));
};

export const fetchSeiProcesses = async (filters) => {
    try {
        const formData = new FormData();

        // Map frontend filters to backend parameters
        if (filters.year) formData.append(seiConfig.filters.ano_ref, filters.year);

        // Handle array filters (backend likely expects single values or specific format, sending first or joined for now)
        // Adjust logic if backend supports multiple values for same key
        if (filters.type && filters.type.length > 0) {
            // If multiple selection is allowed by backend? assume comma separated or passing multiple keys?
            // Standard FormData with same key pushes multiple values
            filters.type.forEach(t => formData.append(seiConfig.filters.tipo, t));
        }

        if (filters.status && filters.status.length > 0) {
            filters.status.forEach(s => formData.append(seiConfig.filters.status, s));
        }

        if (filters.dateRange?.to) {
            // Formatting date to expected format if needed (e.g., YYYY-MM-DD)
            // Assuming ISO string for now
            formData.append(seiConfig.filters.dt_fim_prevista, filters.dateRange.to.toISOString().split('T')[0]);
        }

        const response = await apiClient.post(seiConfig.endpoints.processo, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Often handled automatically by axios when passing FormData
            }
        });

        return mapResponseToFrontend(response.data);

    } catch (error) {
        console.error('Error fetching SEI processes:', error);
        throw error;
    }
};
