const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://10.180.168.23:5000';

export const login = async (email, password) => {
    const loginUrl = `${API_BASE_URL}/login`;

    const body = new URLSearchParams();
    body.append('email', email);
    body.append('password', password);

    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body,
        });

        if (!response.ok) {
            try {
                const errorData = await response.json();
                const errorMessage = errorData.message || errorData.error || 'Credenciais inválidas ou erro no servidor.';
                return { success: false, error: errorMessage };
            } catch (e) {
                return { success: false, error: `Erro ${response.status}: ${response.statusText}` };
            }
        }

        const data = await response.json();

        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }

        return { success: true, data };

    } catch (error) {
        console.error('Login service network error:', error);
        return {
            success: false,
            error: 'Não foi possível conectar ao servidor. Verifique sua conexão de rede.',
        };
    }
};

export const logout = () => {
    localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
    return localStorage.getItem('authToken') !== null;
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};