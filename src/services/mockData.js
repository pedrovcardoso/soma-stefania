export const mockRecentAccesses = [
  // --- Hoje (05 de Dezembro, 2025) ---
  {
    id: '1',
    process: '1190.01.0011196/2025-73',
    title: 'Análise de Contrato - Aquisição de Software',
    path: '/sei/1190.01.0011196/2025-73',
    pinned: true,
    favorited: true,
    accessedAt: '2025-12-05T14:30:00Z',
  },
  {
    id: '2',
    process: 'Dashboard Principal',
    title: 'Visualização de métricas e estatísticas gerais',
    path: '/dashboard',
    pinned: false,
    favorited: false,
    accessedAt: '2025-12-05T11:15:00Z',
  },
  {
    id: '3',
    process: 'DOC-087-2025',
    title: 'Relatório Técnico Preliminar - Auditoria Interna',
    path: '/documents/doc-087-2025',
    pinned: false,
    favorited: true,
    accessedAt: '2025-12-05T09:45:00Z',
  },
  
  // --- Ontem (04 de Dezembro, 2025) ---
  {
    id: '4',
    process: '4600.17.728451/2024-12',
    title: 'Processo Administrativo Disciplinar',
    path: '/sei/4600.17.728451/2024-12',
    pinned: false,
    favorited: false,
    accessedAt: '2025-12-04T16:20:00Z',
  },
  {
    id: '5',
    process: '1190.01.0011196/2025-73',
    title: 'Análise de Contrato - Aquisição de Software',
    path: '/sei/1190.01.0011196/2025-73',
    pinned: true,
    favorited: true,
    accessedAt: '2025-12-04T10:10:00Z',
  },

  // --- Esta Semana ---
  {
    id: '6',
    process: 'MEM-152-2025',
    title: 'Memorando de Abertura de Plano de Ação',
    path: '/documents/mem-152-2025',
    pinned: false,
    favorited: false,
    accessedAt: '2025-12-03T15:00:00Z',
  },
  {
    id: '7',
    process: '3301.55.984152/2023-01',
    title: 'Relatório de Atividades - Exercício 2023',
    path: '/sei/3301.55.984152/2023-01',
    pinned: true,
    favorited: false,
    accessedAt: '2025-12-02T11:30:00Z',
  },

  // --- Mais Antigo ---
  {
    id: '8',
    process: '9840.12.654181/2022-55',
    title: 'Licitação - Concorrência Pública Nº 05/2022',
    path: '/sei/9840.12.654181/2022-55',
    pinned: false,
    favorited: false,
    accessedAt: '2025-11-28T17:00:00Z',
  },
  {
    id: '9',
    process: 'OFICIO-998-2024',
    title: 'Ofício Circular para Unidades Gestoras',
    path: '/documents/oficio-998-2024',
    pinned: false,
    favorited: true,
    accessedAt: '2025-11-25T10:15:00Z',
  },
  {
    id: '10',
    process: '1190.01.0011196/2025-73',
    title: 'Análise de Contrato - Aquisição de Software',
    path: '/sei/1190.01.0011196/2025-73',
    pinned: true,
    favorited: true,
    accessedAt: '2025-11-20T14:30:00Z',
  },
];

export const mockSeiProcesses = [
  {
    id: '1190.01.0011196/2025-73',
    title: '2024 - Relatório Técnico Preliminar',
    status: 'Em análise',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-12-05T10:30:00Z',
  },
  {
    id: '46001772',
    title: 'Processo Administrativo',
    status: 'Concluído',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-12-04T15:20:00Z',
  },
]

export const mockDocuments = [
  {
    id: 'doc-001',
    title: 'Documento Técnico',
    type: 'PDF',
    size: '2.5 MB',
    createdAt: '2025-12-01T10:00:00Z',
  },
]

export const mockDashboardData = {
  totalProcesses: 0,
  pendingDocuments: 0,
  completed: 0,
}

