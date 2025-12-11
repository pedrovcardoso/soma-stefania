export const seiConfig = {
    endpoints: {
        processo: '/processo'
    },
    filters: {
        ano_ref: 'ano_referencia',
        tipo: 'tipo',
        status: 'status',
        dt_fim_prevista: 'dt_fim_prevista'
    },
    responseMapping: {
        status: 'status',
        sei_number: 'SEI',
        description: 'descricao',
        ref_year: 'ano_referencia',
        deadline: 'dt_fim_prevista',
        type: 'tipo',
        assigned_to: 'atribuido'
    }
};
