export const seiConfig = {
    endpoints: {
        processo: '/processo',
        detalheProcesso: '/detalheProcesso',
        planoAcao: '/planoAcao'
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
