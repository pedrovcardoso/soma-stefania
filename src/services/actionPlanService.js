import { apiClient } from './api';

export const actionPlanService = {
    fetchActionPlan: async (seiNumber) => {
        try {
            const formData = new FormData();
            formData.append('sei', seiNumber);
            const response = await apiClient.post('/planoAcao', formData);
            return response;
        } catch (error) {
            console.error('Error fetching Action Plan:', error);
            throw error;
        }
    }
};
