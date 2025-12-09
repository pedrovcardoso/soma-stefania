// src/services/seiService.js

const MOCK_DATA = [
    {
        id: 1,
        sei_number: '1630.01.0001450/2025-42',
        link: 'https://sei.mg.gov.br/sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=12345',
        ref_year: 2025,
        type: 'Prestação de Contas',
        description: 'Análise preliminar da prestação de contas anual referente ao exercício de 2024.',
        tags: ['Urgente', 'Financeiro'],
        status: 'Acompanhamento especial',
        assigned_to: 'Ana Silva',
        initials: 'AS',
        notes: 'Aguardando envio dos balancetes complementares.',
        received_date: '2025-01-15',
        deadline: '2025-02-15',
        response_date: null,
        has_dilation: false,
        dilation_process: null,
        dilation_deadline: null
    },
    {
        id: 2,
        sei_number: '1630.01.0002100/2025-11',
        link: '#',
        ref_year: 2025,
        type: 'Diligência',
        description: 'Solicitação de esclarecimentos sobre contrato de aluguel de impressoras.',
        tags: ['Contratos', 'Administrativo'],
        status: 'Aguarda resposta',
        assigned_to: 'Carlos Eduardo',
        initials: 'CE',
        notes: 'Ofício enviado em 10/01. Prazo correndo.',
        received_date: '2025-01-10',
        deadline: '2025-01-30',
        response_date: null,
        has_dilation: true,
        dilation_process: '1630.01.0002105/2025-99',
        dilation_deadline: '2025-02-28'
    },
    {
        id: 3,
        sei_number: '1630.01.0000500/2024-88',
        link: '#',
        ref_year: 2024,
        type: 'Auditoria',
        description: 'Relatório final de auditoria nas contas de gestão fiscal.',
        tags: ['Auditoria', 'Compliance'],
        status: 'Finalizado e Concluído',
        assigned_to: 'Roberto Campos',
        initials: 'RC',
        notes: 'Arquivado conforme despacho.',
        received_date: '2024-11-20',
        deadline: '2024-12-20',
        response_date: '2024-12-18',
        has_dilation: false,
        dilation_process: null,
        dilation_deadline: null
    },
    {
        id: 4,
        sei_number: '1630.01.0003000/2025-01',
        link: '#',
        ref_year: 2025,
        type: 'Apenso',
        description: 'Juntada de documentos ao processo principal de licitação.',
        tags: ['Licitação'],
        status: 'Finalizado com Desdobramentos',
        assigned_to: 'Maria Oliveira',
        initials: 'MO',
        notes: 'Apensado ao processo 1450/2025.',
        received_date: '2025-02-01',
        deadline: '2025-02-05',
        response_date: '2025-02-04',
        has_dilation: false,
        dilation_process: null,
        dilation_deadline: null
    },
    {
        id: 5,
        sei_number: '1630.01.0001880/2025-22',
        link: '#',
        ref_year: 2025,
        type: 'Denúncia',
        description: 'Averiguação de suposta irregularidade n...',
        tags: ['Jurídico', 'Sigiloso'],
        status: 'Acompanhamento especial',
        assigned_to: 'Jurídico Central',
        initials: 'JC',
        notes: 'Prioridade máxima solicitada pelo Gabinete.',
        received_date: '2025-01-28',
        deadline: '2025-02-10',
        response_date: null,
        has_dilation: false,
        dilation_process: null,
        dilation_deadline: null
    }
];

export const getSeiProcesses = async () => {
    // Simular delay de rede
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_DATA);
        }, 800);
    });
};
