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

const getSeiValue = (sei, key) => {
    if (!sei || !sei.__values__) return null;
    return sei.__values__[key];
};

const getSeiNestedValue = (obj, ...keys) => {
    let current = obj;
    for (const key of keys) {
        if (!current) return null;
        if (current.__values__) {
            current = current.__values__[key];
        } else {
            current = current[key];
        }
    }
    return current;
};

const formatDate = (dateStr) => {
    if (!dateStr || dateStr === '-') return null;
    if (/^\d{2}\/\d{2}\/\d{4}/.test(dateStr)) {
        return dateStr.split(' ')[0];
    }
    try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('pt-BR');
        }
    } catch (e) { }
    return dateStr;
};

const mapSeiDetailResponse = (data) => {
    if (!data || !data.processo) return null;
    const { processo, sei, tags } = data;

    return {
        sei: processo.sei,
        status: processo.status,
        ano_referencia: processo.ano_referencia,
        tipo: processo.tipo,
        descricao: processo.descricao,
        atribuido: processo.atribuido,
        unidade_atual: getSeiNestedValue(sei, 'UltimoAndamento', 'Unidade', 'Descricao'),
        observacoes_tramitacao: processo.obs,
        data_dilacao: formatDate(processo.dt_dilacao),
        sei_dilacao: processo.sei_dilacao,
        data_resposta: formatDate(processo.dt_resposta),
        recebimento: formatDate(processo.dt_recebimento),
        prazo_final: formatDate(processo.dt_fim_prevista),
        ultima_movimentacao: formatDate(getSeiNestedValue(sei, 'UltimoAndamento', 'DataHora')),
        link_acesso: getSeiValue(sei, 'LinkAcesso'),
        tags: tags?.map(t => t.tag) || [],
        procedimentos_relacionados: getSeiValue(sei, 'ProcedimentosRelacionados')?.map(p => ({
            formatado: p.__values__?.ProcedimentoFormatado,
            tipo: p.__values__?.TipoProcedimento?.__values__?.Nome
        })) || [],
        procedimentos_anexados: getSeiValue(sei, 'ProcedimentosAnexados')?.map(p => ({
            formatado: p.__values__?.ProcedimentoFormatado,
            tipo: p.__values__?.TipoProcedimento?.__values__?.Nome
        })) || [],
        raw: data
    };
};

export const fetchSeiProcessDetails = async (seiNumber) => {
    try {
        const formData = new FormData();
        formData.append('sei', seiNumber);

        const response = await apiClient.post(seiConfig.endpoints.detalheProcesso, formData);

        return mapSeiDetailResponse(response);
    } catch (error) {
        console.error('Error fetching SEI process details:', error);
        throw error;
    }
};

const mapFrontendToApi = (data) => {
    const toApiDate = (dateStr) => {
        if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    };

    return {
        sei: data.sei,
        status: data.status,
        ano_referencia: String(data.ano_referencia || ''),
        tipo: data.tipo,
        descricao: data.descricao,
        atribuicao: data.atribuido,
        responsavel: data.atribuido,
        obs: data.observacoes_tramitacao,
        dt_dilacao: toApiDate(data.data_dilacao),
        sei_dilacao: data.sei_dilacao,
        dt_resposta: toApiDate(data.data_resposta),
        dt_recebimento: toApiDate(data.recebimento),
        dt_fim_prevista: toApiDate(data.prazo_final)
    };
};

export const manterProcesso = async (operacao, data) => {
    try {
        const payload = {
            operacao,
            dados: operacao === 'excluir' ? { sei: data.sei } : mapFrontendToApi(data)
        };

        const response = await apiClient.post('/manterProcesso', payload);
        return response;
    } catch (error) {
        console.error(`Error in manterProcesso (${operacao}):`, error);
        throw error;
    }
};

export const prepararImportacao = async (seiNumber) => {
    try {
        const formData = new FormData();
        formData.append('sei', seiNumber);

        const response = await apiClient.post('/prepararImportacao', formData);

        return mapSeiDetailResponse({
            ...response,
            processo: {
                sei: seiNumber,
                status: 'Planejado',
                ano_referencia: new Date().getFullYear().toString(),
                tipo: '',
                descricao: '',
                atribuido: '',
                obs: '',
                dt_dilacao: '',
                sei_dilacao: '',
                dt_resposta: '',
                dt_recebimento: new Date().toLocaleDateString('pt-BR'),
                dt_fim_prevista: ''
            }
        });
    } catch (error) {
        console.error('Error preparing import:', error);
        throw error;
    }
};

export const fetchListaDocumentos = async (seiNumber) => {
    try {
        const params = new URLSearchParams();
        params.append('sei_principal', seiNumber);
        params.append('url_processo', `https://sei.mg.gov.br/sei/controlador.php?acao=procedimento_selecionar&id_procedimento=${seiNumber}`);

        const response = await apiClient.post('/listaDocumentos', params);
        return response.documentos || [];
    } catch (error) {
        console.error('Error fetching lista documentos:', error);
        throw error;
    }
};

export const fetchDetalheDocumento = async (protocolo) => {
    try {
        const params = new URLSearchParams();
        params.append('protocolo', protocolo);

        const response = await apiClient.post('/consultaDocumento', params);
        return response;
    } catch (error) {
        console.error('Error fetching detalhe documento:', error);
        throw error;
    }
};