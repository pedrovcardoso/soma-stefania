'use client';

import { useState, useEffect, Fragment } from 'react';
import { MdSearch, MdMoreVert, MdLaunch, MdCalendarToday, MdExpandMore, MdSort, MdCheck, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import SmartTable from '@/components/ui/SmartTable';
import FilterPanel from '@/components/ui/FilterPanel';
import MultiSelect from '@/components/ui/MultiSelect';
import { getSeiProcesses } from '@/services/mockData';
import useTabStore from '@/store/useTabStore';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, Transition } from '@headlessui/react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Finalizado e Concluído': return 'bg-green-100 text-green-700';
    case 'Finalizado com Desdobramentos': return 'bg-teal-100 text-teal-700';
    case 'Aguarda resposta': return 'bg-purple-100 text-purple-700';
    case 'Acompanhamento especial': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100 text-slate-600';
  }
};

export default function SeiPage() {
  const [activeView, setActiveView] = useState('block');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const addTab = useTabStore((state) => state.addTab);
  const [filters, setFilters] = useState({
    year: '',
    type: [],
    status: [],
    assignedTo: [],
    search: '',
    datePreset: 'all',
    dateRange: { from: undefined, to: undefined }
  });

  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const columns = [
    {
      key: 'sei_number',
      label: 'Processo',
      render: (row) => (
        <div className="flex flex-col">
          <button
            onClick={() => addTab({
              id: `sei-${row.id}`,
              title: row.sei_number,
              path: `/sei/${row.id}`
            })}
            className="font-medium text-slate-700 hover:text-blue-600 hover:underline text-xs flex items-center gap-1 w-fit text-left"
          >
            {row.sei_number} <MdLaunch size={10} />
          </button>
          <span className="text-[10px] text-slate-400 mt-0.5">{row.type}</span>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Descrição',
      render: (row) => <div className="line-clamp-2 whitespace-normal text-xs text-slate-600" title={row.description}>{row.description}</div>
    },
    {
      key: 'assigned_to',
      label: 'Atribuído para',
      render: (row) => <span className="font-medium text-slate-700 text-sm">{row.assigned_to}</span>
    },
    {
      key: 'deadline',
      label: 'Prazo Final',
      render: (row) => (
        <div className="flex items-center gap-2 text-slate-600">
          <MdCalendarToday size={14} className="text-slate-400" />
          <span>{format(new Date(row.deadline), 'dd/MM/yyyy')}</span>
        </div>
      )
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200 uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Ações',
      width: 80,
      render: () => (
        <div className="flex justify-center">
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <MdMoreVert size={20} />
          </button>
        </div>
      )
    }
  ];

  const handleDatePresetChange = (preset) => {
    const now = new Date(); let from, to;
    switch (preset) {
      case 'today': from = startOfDay(now); to = endOfDay(now); break;
      case 'thisWeek': from = startOfWeek(now, { locale: ptBR }); to = endOfWeek(now, { locale: ptBR }); break;
      case 'lastWeek': const lws = startOfWeek(subWeeks(now, 1), { locale: ptBR }); from = lws; to = endOfWeek(lws, { locale: ptBR }); break;
      case 'thisMonth': from = startOfMonth(now); to = endOfMonth(now); break;
      case 'lastMonth': const lms = startOfMonth(subMonths(now, 1)); from = lms; to = endOfMonth(lms); break;
      case 'specific': from = filters.dateRange.from; to = filters.dateRange.to; break;
      default: from = undefined; to = undefined; break;
    }
    setFilters(prev => ({ ...prev, datePreset: preset, dateRange: { from, to } }));
  };

  useEffect(() => {
    // Carregar dados simulados
    getSeiProcesses().then(result => {
      setData(result);
      setIsLoading(false);
    });
  }, []);

  const handleClearFilters = () => {
    setFilters({ year: '', type: [], status: [], assignedTo: [], search: '', datePreset: 'all', dateRange: { from: undefined, to: undefined } });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Filtragem (simulada no client-side para este exemplo)
  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filteredData = data.filter(item => {
    const matchYear = !filters.year || item.ref_year.toString() === filters.year;
    const matchType = filters.type.length === 0 || filters.type.includes(item.type);
    const matchStatus = filters.status.length === 0 || filters.status.includes(item.status);
    const matchAssignedTo = filters.assignedTo.length === 0 || filters.assignedTo.includes(item.assigned_to);
    const matchSearch = !filters.search ||
      normalizeText(item.sei_number).includes(normalizeText(filters.search)) ||
      normalizeText(item.description).includes(normalizeText(filters.search));

    const matchDate = (!filters.dateRange.from || new Date(item.deadline) >= filters.dateRange.from) &&
      (!filters.dateRange.to || new Date(item.deadline) <= endOfDay(filters.dateRange.to));

    return matchYear && matchType && matchStatus && matchAssignedTo && matchSearch && matchDate;
  }).sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'deadline' || sortBy === 'received_date') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="h-full bg-slate-50/50 p-6 md:p-10 overflow-auto font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Processos SEI</h1>
          <p className="text-slate-500 mt-2">Gerencie e acompanhe as tramitações, prazos e documentos oficiais.</p>
        </div>

        {/* Filtros com componente reutilizável */}
        <FilterPanel onClear={handleClearFilters}>
          {/* Filtro por Ano */}
          <div className="flex-grow min-w-[150px]">
            <label className="text-xs font-semibold text-slate-500">Ano de Referência</label>
            <div className="relative mt-1">
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 appearance-none bg-slate-50 outline-none pr-8"
              >
                <option value="">Todos os anos</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <MdExpandMore className="text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Filtro por Prazo (Data) */}
          <div className="flex-grow min-w-[180px]">
            <label className="text-xs font-semibold text-slate-500 flex gap-2">
              <MdCalendarToday />
              Filtrar por Prazo
            </label>
            <div className="relative mt-1">
              <select value={filters.datePreset} onChange={(e) => handleDatePresetChange(e.target.value)} className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 appearance-none pr-8 bg-slate-50 outline-none">
                <option value="all">Qualquer data</option>
                <option value="today">Hoje</option>
                <option value="thisWeek">Esta Semana</option>
                <option value="lastWeek">Semana Passada</option>
                <option value="thisMonth">Este Mês</option>
                <option value="lastMonth">Mês Passado</option>
                <option value="specific">Período Específico...</option>
              </select>
              <MdExpandMore className="text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          {filters.datePreset === 'specific' && (
            <div className="flex-grow min-w-[180px]">
              <label className="text-xs font-semibold text-slate-500">Datas</label>
              <Popover className="relative mt-1 z-30">
                <Popover.Button className="w-full flex items-center justify-between p-2 text-sm text-left bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
                  <span className='flex items-center gap-2 text-slate-500'>
                    <MdCalendarToday className="text-slate-400" />
                    {filters.dateRange.from ? `${format(filters.dateRange.from, 'dd/MM/yyyy')} - ${filters.dateRange.to ? format(filters.dateRange.to, 'dd/MM/yyyy') : ''}` : 'Selecione...'}
                  </span>
                  <MdExpandMore className="text-slate-400" />
                </Popover.Button>
                <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                  <Popover.Panel className="absolute z-20 mt-1 bg-white border rounded-md shadow-lg">
                    <DayPicker mode="range" selected={filters.dateRange} onSelect={(range) => handleFilterChange('dateRange', range)} locale={ptBR} className="p-2" captionLayout="dropdown-buttons" fromYear={2020} toYear={new Date().getFullYear()} />
                  </Popover.Panel>
                </Transition>
              </Popover>
            </div>
          )}

          {/* Filtro por Tipo */}
          {/* Filtro por Tipo */}
          <div className="flex-grow min-w-[220px]">
            <MultiSelect
              label="Tipo"
              placeholder="Todos os tipos"
              options={[
                "Acompanhamento", "Auditoria", "Balanço Geral do Estado", "Denúncia",
                "Inspeção Ordinária", "Monitoramento", "Outros", "Relatório Temático",
                "Representação", "Solicitação TCE/CFAMGE", "Tomada de Contas Especial"
              ]}
              value={filters.type}
              onChange={(val) => handleFilterChange('type', val)}
            />
          </div>

          {/* Filtro por Status */}
          {/* Filtro por Status */}
          <div className="flex-grow min-w-[220px]">
            <MultiSelect
              label="Status"
              placeholder="Todos os status"
              options={[
                "Aguarda resposta", "Acompanhamento especial",
                "Finalizado e Concluído", "Finalizado com Desdobramentos"
              ]}
              value={filters.status}
              onChange={(val) => handleFilterChange('status', val)}
            />
          </div>

          {/* Filtro por Atribuído para */}
          <div className="flex-grow min-w-[220px]">
            <MultiSelect
              label="Atribuído para"
              placeholder="Todos"
              options={[...new Set(data.map(item => item.assigned_to))].sort()}
              value={filters.assignedTo}
              onChange={(val) => handleFilterChange('assignedTo', val)}
            />
          </div>

        </FilterPanel>

        {/* Busca em Destaque (Estilo History) */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <div className="relative w-full">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar processos por número, descrição ou tags..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>
        </div>



        {/* Sorting & View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-6 gap-4 border-b border-slate-200">

          {/* View Tabs (Left Side) */}
          <div className="flex space-x-6 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveView('block')}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeView === 'block' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Bloco
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeView === 'table' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Tabela
            </button>
            <button
              onClick={() => setActiveView('kanban')}
              className={`hidden pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeView === 'kanban' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Kanban
            </button>
          </div>

          {/* Custom Sort Selector (Right Side) */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end pb-2">

            <Popover className="relative">
              <Popover.Button className="flex items-center gap-2 px-3 py-1.5 text-slate-600 font-medium text-sm transition-colors hover:bg-slate-100 rounded-lg outline-none">
                <MdSort size={18} className="text-slate-500" />
                <span>
                  Ordenar: <span className="text-blue-600">{
                    sortBy === 'deadline' ? 'Prazo' :
                      sortBy === 'received_date' ? 'Recebimento' : 'Número SEI'
                  }</span>
                </span>
                <MdExpandMore size={16} className="text-slate-400" />
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Popover.Panel className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 p-1">
                  {[
                    { id: 'deadline', label: 'Prazo Final' },
                    { id: 'received_date', label: 'Data de Recebimento' },
                    { id: 'sei_number', label: 'Número SEI' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors ${sortBy === option.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      {option.label}
                      {sortBy === option.id && <MdCheck size={16} className="text-blue-600" />}
                    </button>
                  ))}
                </Popover.Panel>
              </Transition>
            </Popover>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              title={sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
            >
              {sortOrder === 'asc' ? <MdArrowUpward size={18} /> : <MdArrowDownward size={18} />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        {
          isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeView === 'table' && (
                <SmartTable
                  data={filteredData}
                  columns={columns}
                />
              )}
              {activeView === 'block' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.length > 0 ? filteredData.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full group">
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                          {item.type}
                        </span>
                        <div className="relative">
                          {/* Placeholder for menu if needed */}
                          <button className="text-slate-400 hover:text-slate-600 p-1 -mr-2">
                            <MdMoreVert size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="mb-4 flex-grow">
                        <button
                          onClick={() => addTab({
                            id: `sei-${item.id}`,
                            title: item.sei_number,
                            path: `/sei/${item.id}`
                          })}
                          className="font-medium text-slate-700 hover:text-blue-600 hover:underline text-sm flex items-center gap-2 mb-2 text-left w-full break-all"
                        >
                          {item.sei_number} <MdLaunch size={12} />
                        </button>
                        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-auto border-t border-slate-100 pt-3 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Atribuído para:</span>
                          <span className="font-medium text-slate-700 truncate max-w-[120px]" title={item.assigned_to}>{item.assigned_to}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Prazo:</span>
                          <div className="flex items-center gap-1.5 font-medium text-slate-700">
                            <MdCalendarToday size={14} className="text-slate-400" />
                            {format(new Date(item.deadline), 'dd/MM/yyyy')}
                          </div>
                        </div>

                        <div className="pt-1">
                          <span className={`inline-flex w-full justify-center items-center px-2 py-1.5 rounded-md text-xs font-semibold ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                      Nenhum processo encontrado.
                    </div>
                  )}
                </div>
              )}
              {activeView === 'kanban' && (
                <div className="bg-white p-10 rounded-xl border border-slate-200/80 text-center shadow-sm">
                  <p className="text-slate-400">Visualização Kanban em desenvolvimento.</p>
                </div>
              )}
            </>
          )
        }
      </div >
    </div >
  );
}
