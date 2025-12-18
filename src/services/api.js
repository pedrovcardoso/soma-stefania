const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

const API_BASE_URL = USE_MOCK ? '/api/mock' : '/api';

function toFormData(data) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return formData;
}

async function request(endpoint, { method = 'GET', data, headers: customHeaders = {} } = {}) {
  const headers = { 
    'Content-Type': 'application/json',
    ...customHeaders 
  };

  let body = undefined;

  if (method !== 'GET' && data) {
    if (data instanceof FormData) {
      delete headers['Content-Type']; 
      body = data;
    } else {
      body = JSON.stringify(data);
    }
  }

  const config = {
    method,
    headers,
    body,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const errorMessage = errorBody?.message || errorBody || `Erro: ${response.status}`;
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }

  } catch (error) {
    console.error(`API Request Failed: ${endpoint}`, error);
    throw error;
  }
}

export const apiClient = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, data) => request(endpoint, { method: 'POST', data }),
  put: (endpoint, data) => request(endpoint, { method: 'PUT', data }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export const processService = {
  async getProcesses(filters = {}) {
    const response = await apiClient.post('/processo', filters)

    if (response.data) {
      return Array.isArray(response.data) ? response.data : [response.data]
    }
    return []
  },

  async getFilters() {
    return apiClient.get('/filtros')
  },
}

export const historyService = {
  async getRecentAccesses(limit = 10) {
    return []
  },
}