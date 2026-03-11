export const actionPlanService = {
    fetchActionPlan: async (seiNumber) => {
        try {
            // migrado para fetch no frontend por conta do proxy da fazenda
            // const response = await fetch('/api/action-plan', {
            const response = await fetch('https://default4c86fd71d0164231a16057311d68b9.51.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/bf5db0b9668a4807aa43a854a44529c4/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XUWG2Xlc8cRTjWvU7EgMMDMPy9g_6b0Yw_Y6qHJJJAY', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sei: seiNumber }),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                const errorMessage = errorBody.message || `Error ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching Action Plan:', error);
            throw error;
        }
    }
};
