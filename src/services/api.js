const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://10.180.168.23:5000' // Ajuste para o IP correto se necessário

/**
 * Utilitário para converter Objeto JS em FormData.
 * O backend Flask (request.form) exige esse formato.
 */
function toFormData(data) {
  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    // Apenas adiciona se o valor não for null/undefined para evitar strings "undefined"
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key])
    }
  })
  return formData
}

/**
 * Cliente HTTP centralizado.
 * Ajustado para lidar com endpoints que exigem Form Data em vez de JSON.
 */
async function request(endpoint, { method = 'GET', data, headers: customHeaders = {} } = {}) {
  // Configuração inicial de Headers
  const headers = { ...customHeaders }

  let body = undefined

  // Lógica de preparação do Body
  if (method !== 'GET' && data) {
    if (data instanceof FormData) {
      // Se já for FormData, passamos direto. 
      // O browser define o Content-Type com boundary automaticamente.
      body = data
    } else {
      // Se for objeto comum, convertemos para FormData (exigência do Backend /login e /processo)
      body = toFormData(data)
      // Não definimos Content-Type: application/json aqui, pois é multipart/form-data implícito
    }
  }

  const config = {
    method,
    mode: 'cors',
    headers, // Nota: Se for FormData, não deve ter Content-Type explícito no header
    body,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      // Tenta ler msg de erro do backend (ex: { "status": "error", "message": "..." })
      const errorBody = await response.json().catch(() => null)
      const errorMessage = errorBody?.message || `Erro na requisição: ${response.status}`
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Request Failed: ${endpoint}`, error)
    throw error
  }
}

export const apiClient = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, data) => request(endpoint, { method: 'POST', data }),
  put: (endpoint, data) => request(endpoint, { method: 'PUT', data }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
}

// --- Services Específicos do Domínio ---

export const authService = {
  /**
   * Realiza login no sistema.
   * Endpoint: POST /login
   * @param {string} email - Usuário/Email
   * @param {string} password - Senha
   */
  async login(email, password) {
    // O apiClient converte automaticamente este objeto para FormData
    return apiClient.post('/login', { email, password })
  },
}

export const processService = {
  /**
   * Busca processos filtrados.
   * Endpoint: POST /processo (O backend usa POST para busca filtrada)
   * @param {Object} filters - { ano_referencia, tipo, status, dt_fim_prevista }
   */
  async getProcesses(filters = {}) {
    // Mapeia a resposta para garantir consistência
    // O backend retorna { data: {...} } ou idealmente retornará lista no futuro
    const response = await apiClient.post('/processo', filters)
    
    // Tratamento defensivo caso o backend retorne objeto único ou array
    if (response.data) {
      return Array.isArray(response.data) ? response.data : [response.data]
    }
    return []
  },

  /**
   * Busca os dados para popular os Selects de filtro.
   * Endpoint: GET /filtros
   */
  async getFilters() {
    return apiClient.get('/filtros')
  },
}

// Serviço placeholder para manter compatibilidade com sua estrutura anterior
// caso vá implementar histórico localmente no frontend ou em outra rota futura
export const historyService = {
  async getRecentAccesses(limit = 10) {
    // Simulação ou chamada futura se houver endpoint
    // return apiClient.get(`/api/history/recent?limit=${limit}`)
    return [] 
  },
}