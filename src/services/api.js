import useAuthStore from '@/store/useAuthStore';

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

  const selectedUnidade = typeof window !== 'undefined' ? useAuthStore.getState().selectedUnidade : null;
  const id_unidade = selectedUnidade?.id_unidade;

  const endpointsWithUnit = [
    '/consultaDocumento',
    '/detalheProcesso',
    '/listaDocumentos',
    '/validaProcessos'
  ];

  let finalEndpoint = endpoint;
  let finalData = data;

  if (id_unidade && endpointsWithUnit.some(ep => endpoint.startsWith(ep))) {
    if (method === 'GET') {
      const separator = finalEndpoint.includes('?') ? '&' : '?';
      finalEndpoint = `${finalEndpoint}${separator}id_unidade=${id_unidade}`;
    } else if (method === 'POST' || method === 'PUT') {
      if (finalData instanceof FormData) {
        finalData.append('id_unidade', id_unidade);
      } else if (finalData instanceof URLSearchParams) {
        finalData.append('id_unidade', id_unidade);
      } else {
        finalData = { ...finalData, id_unidade };
      }
    }
  }

  let body = undefined;

  if (method !== 'GET' && finalData) {
    if (finalData instanceof FormData) {
      delete headers['Content-Type'];
      body = finalData;
    } else if (finalData instanceof URLSearchParams) {
      delete headers['Content-Type'];
      body = finalData;
    } else {
      body = JSON.stringify(finalData);
    }
  }

  const config = {
    method,
    headers,
    body,
  };

  try {
    const baseUrl = (USE_MOCK && endpoint === '/planoAcao') ? '/api' : API_BASE_URL;
    const response = await fetch(`${baseUrl}${finalEndpoint}`, config);

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