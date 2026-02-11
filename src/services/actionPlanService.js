export const actionPlanService = {
    fetchActionPlan: async (seiNumber) => {
        try {
            const response = await fetch('/api/action-plan', {
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
