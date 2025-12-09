export const mockSeiProcesses = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
    sei_number: '1630.01.0001880/2025-22',
    link: '#',
    ref_year: 2025,
    type: 'Denúncia',
    description: 'Averiguação de suposta irregularidade na compra de medicamentos.',
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
  },
  {
    id: '6',
    sei_number: '1630.01.0004120/2025-66',
    link: '#',
    ref_year: 2025,
    type: 'Consulta',
    description: 'Consulta sobre viabilidade técnica de nova sede regional.',
    tags: ['Infraestrutura'],
    status: 'Aguarda resposta',
    assigned_to: 'Engenharia',
    initials: 'EG',
    notes: '',
    received_date: '2025-02-12',
    deadline: '2025-03-12',
    response_date: null,
    has_dilation: false,
    dilation_process: null,
    dilation_deadline: null
  },
  {
    id: '7',
    sei_number: '1630.01.0000999/2024-12',
    link: '#',
    ref_year: 2024,
    type: 'Prestação de Contas',
    description: 'Prestação de contas final do convênio XYZ.',
    tags: ['Convênio', 'Financeiro'],
    status: 'Finalizado e Concluído',
    assigned_to: 'Ana Silva',
    initials: 'AS',
    notes: 'Aprovado sem ressalvas.',
    received_date: '2024-12-01',
    deadline: '2024-12-31',
    response_date: '2024-12-28',
    has_dilation: false,
    dilation_process: null,
    dilation_deadline: null
  }
];

export const mockDocuments = [
  {
    id: 'doc-001',
    title: 'Documento Técnico - SOMA',
    type: 'PDF',
    size: '2.5 MB',
    createdAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'doc-002',
    title: 'Planilha de Custos - 2025',
    type: 'XLSX',
    size: '1.2 MB',
    createdAt: '2025-12-02T14:30:00Z',
  },
  {
    id: 'doc-003',
    title: 'Ata de Reunião - Diretoria',
    type: 'DOCX',
    size: '500 KB',
    createdAt: '2025-12-03T09:00:00Z',
  }
];

export const mockDashboardData = {
  totalProcesses: mockSeiProcesses.length,
  pendingDocuments: 5,
  completed: mockSeiProcesses.filter(p => p.status.includes('Finalizado')).length,
};

// Histórico inicial (seed) caso o usuário limpe tudo, ou apenas para referência
// Histórico inicial (seed)
export const mockInitialHistory = [
  {
    id: 'sei-1',
    process: '1630.01.0001450/2025-42',
    title: '1630.01.0001450/2025-42',
    path: '/sei/1',
    pinned: true,
    favorited: true,
    accessedAt: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(), // 1 hora atrás
  },
  {
    id: 'doc-001',
    process: 'Documento Técnico - SOMA',
    title: 'Documento Técnico - SOMA',
    path: '/documents/doc-001',
    pinned: true,
    favorited: false,
    accessedAt: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(), // 2 horas atrás
  },
  {
    id: 'sei-2',
    process: '1630.01.0002100/2025-11',
    title: '1630.01.0002100/2025-11',
    path: '/sei/2',
    pinned: false,
    favorited: false,
    accessedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Ontem
  },
  {
    id: 'doc-002',
    process: 'Planilha de Custos - 2025',
    title: 'Planilha de Custos - 2025',
    path: '/documents/doc-002',
    pinned: false,
    favorited: true,
    accessedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // 2 dias atrás
  },
  {
    id: 'sei-5',
    process: '1630.01.0001880/2025-22',
    title: '1630.01.0001880/2025-22',
    path: '/sei/5',
    pinned: false,
    favorited: false,
    accessedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), // 5 dias atrás
  }
];

export const getSeiProcesses = async () => {
  // Simular delay de rede
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSeiProcesses);
    }, 800);
  });
};
