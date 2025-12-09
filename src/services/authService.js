// This service simulates an API call for authentication.

export const login = (email, password) => {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            if (email === 'admin@admin' && password === '123') {
                resolve({
                    success: true,
                    user: { name: 'Admin User', email: 'admin@admin' },
                    token: 'mock-jwt-token-for-admin-user' 
                });
            } else {
                resolve({
                    success: false,
                    error: 'E-mail ou senha inválidos. Por favor, tente novamente.'
                });
            }
        }, 1500); // 1.5 second delay
    });
};