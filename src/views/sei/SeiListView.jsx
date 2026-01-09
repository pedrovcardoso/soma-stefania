'use client';

import { useState, useEffect, Fragment } from 'react';
import { MdSearch, MdMoreVert, MdLaunch, MdCalendarToday, MdExpandMore, MdSort, MdCheck, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import SmartTable from '@/components/ui/SmartTable';
import FilterPanel from '@/components/ui/FilterPanel';
import MultiSelect from '@/components/ui/MultiSelect';
import useTabStore from '@/store/useTabStore';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, Transition } from '@headlessui/react';
import { fetchSeiProcesses } from '@/services/seiService';

const getStatusColor = (status) => {
  switch (status) {
    case 'Finalizado e Concluído': return 'bg-green-100 text-green-700';
    case 'Finalizado com Desdobramentos': return 'bg-teal-100 text-teal-700';
    case 'Aguarda resposta': return 'bg-purple-100 text-purple-700';
    case 'Acompanhamento especial': return 'bg-red-100 text-red-700';
    default: return 'bg-accent-soft text-text-secondary';
  }
};

export default function SeiListView({ lastReload }) {
  const [activeView, setActiveView] = useState('block');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const openTab = useTabStore((state) => state.openTab);
  const updateTab = useTabStore((state) => state.updateTab);

  useEffect(() => {
    updateTab('sei', {
      data: {
        subLabel: activeView === 'block' ? 'Bloco' : activeView === 'table' ? 'Tabela' : 'Kanban'
      }
    });
  }, [activeView, updateTab]);

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
  const [sortOrder, setSortOrder] = useState('asc');

  const columns = [
    {
      key: 'sei_number',
      label: 'Processo',
      render: (row) => (
        <div className="flex flex-col">
          <button
            onClick={() => openTab({
              id: row.sei_number,
              type: 'sei_detail',
              title: row.sei_number
            })}
            className="font-medium text-text hover:text-accent hover:underline text-xs flex items-center gap-1 w-fit text-left"
          >
            {row.sei_number} <MdLaunch size={10} />
          </button>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Descrição',
      render: (row) => <div className="line-clamp-2 whitespace-normal text-xs text-text-secondary" title={row.description}>{row.description}</div>
    },
    {
      key: 'assigned_to',
      label: 'Atribuído para',
      render: (row) => <span className="font-medium text-text text-sm">{row.assigned_to}</span>
    },
    {
      key: 'deadline',
      label: 'Prazo Final',
      render: (row) => (
        <div className="flex items-center gap-2 text-text-secondary">
          <MdCalendarToday size={14} className="text-text-muted" />
          <span>{format(new Date(row.deadline), 'dd/MM/yyyy')}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (row) => <div className="line-clamp-2 whitespace-normal text-xs text-text-muted" title={row.type}>{row.type}</div>
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
          <button className="text-text-muted hover:text-text p-1 rounded-full hover:bg-surface-alt transition-colors">
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
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchSeiProcesses(filters);
        setData(result);
      } catch (error) {
        console.error("Failed to load SEI data", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, lastReload]);

  const handleClearFilters = () => {
    setFilters({ year: '', type: [], status: [], assignedTo: [], search: '', datePreset: 'all', dateRange: { from: undefined, to: undefined } });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredData = [...data].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'deadline' || sortBy === 'received_date') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filterInputClass = "w-full h-[42px] px-3 text-sm border border-border rounded-lg bg-surface-alt hover:border-text-muted/50 focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none outline-none transition-all text-text";

  return (
    <div className="h-full bg-surface-alt/50 px-6 pt-2 pb-6 md:px-10 md:pt-4 md:pb-10 overflow-auto font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-text tracking-tight">Processos SEI</h1>
          <p className="text-text-secondary mt-2">Gerencie e acompanhe as tramitações, prazos e documentos oficiais.</p>
        </div>

        <FilterPanel onClear={handleClearFilters}>
          <div className="flex-grow min-w-[150px]">
            <label className="text-xs font-semibold text-text-muted">Ano de Referência</label>
            <div className="relative mt-1">
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className={filterInputClass}
              >
                <option value="">Todos os anos</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <MdExpandMore className="text-text-muted/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="flex-grow min-w-[180px]">
            <label className="text-xs font-semibold text-text-muted flex items-center gap-1">
              <MdCalendarToday />
              Filtrar por Prazo
            </label>
            <div className="relative mt-1">
              <select
                value={filters.datePreset}
                onChange={(e) => handleDatePresetChange(e.target.value)}
                className={filterInputClass}
              >
                <option value="all">Qualquer data</option>
                <option value="today">Hoje</option>
                <option value="thisWeek">Esta Semana</option>
                <option value="lastWeek">Semana Passada</option>
                <option value="thisMonth">Este Mês</option>
                <option value="lastMonth">Mês Passado</option>
                <option value="specific">Período Específico...</option>
              </select>
              <MdExpandMore className="text-text-muted/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={20} />
            </div>
          </div>
          {filters.datePreset === 'specific' && (
            <div className="flex-grow min-w-[180px]">
              <label className="text-xs font-semibold text-text-muted">Datas</label>
              <Popover className="relative z-30 mt-1">
                <Popover.Button className={`${filterInputClass} text-left flex items-center justify-between`}>
                  <span className='flex items-center gap-2 truncate'>
                    <MdCalendarToday className="text-text-muted/60" size={16} />
                    {filters.dateRange.from ? `${format(filters.dateRange.from, 'dd/MM/yyyy')} - ${filters.dateRange.to ? format(filters.dateRange.to, 'dd/MM/yyyy') : ''}` : 'Selecione...'}
                  </span>
                  <MdExpandMore className="text-text-muted/60" size={20} />
                </Popover.Button>
                <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                  <Popover.Panel className="absolute z-20 mt-1 bg-surface border border-border rounded-xl shadow-xl overflow-hidden">
                    <DayPicker mode="range" selected={filters.dateRange} onSelect={(range) => handleFilterChange('dateRange', range)} locale={ptBR} className="p-2" captionLayout="dropdown-buttons" fromYear={2020} toYear={new Date().getFullYear()} />
                  </Popover.Panel>
                </Transition>
              </Popover>
            </div>
          )}

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

        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <div className="relative w-full">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input
              type="text"
              placeholder="Buscar processos por número, descrição ou tags..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full h-12 pl-12 pr-4 text-sm border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none shadow-sm bg-surface text-text placeholder:text-text-muted transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-6 gap-4 border-b border-border">

          <div className="flex space-x-6 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveView('block')}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeView === 'block' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text'}`}
            >
              Bloco
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeView === 'table' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text'}`}
            >
              Tabela
            </button>
            <button
              onClick={() => setActiveView('kanban')}
              className={`hidden pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeView === 'kanban' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text'}`}
            >
              Kanban
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end pb-2">

            <Popover className="relative">
              <Popover.Button className="flex items-center gap-2 px-3 py-1.5 text-text-secondary font-medium text-sm transition-colors hover:bg-surface-alt rounded-lg outline-none">
                <MdSort size={18} className="text-text-muted" />
                <span>
                  Ordenar: <span className="text-accent">{
                    sortBy === 'deadline' ? 'Prazo' :
                      sortBy === 'received_date' ? 'Recebimento' : 'Número SEI'
                  }</span>
                </span>
                <MdExpandMore size={16} className="text-text-muted/60" />
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
                <Popover.Panel className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-xl border border-border z-50 p-1">
                  {[
                    { id: 'deadline', label: 'Prazo Final' },
                    { id: 'received_date', label: 'Data de Recebimento' },
                    { id: 'sei_number', label: 'Número SEI' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors ${sortBy === option.id
                        ? 'bg-accent-soft text-accent font-medium'
                        : 'text-text-secondary hover:bg-surface-alt'
                        }`}
                    >
                      {option.label}
                      {sortBy === option.id && <MdCheck size={16} className="text-accent" />}
                    </button>
                  ))}
                </Popover.Panel>
              </Transition>
            </Popover>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 text-text-muted hover:text-accent hover:bg-surface-alt rounded-lg transition-colors"
              title={sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
            >
              {sortOrder === 'asc' ? <MdArrowUpward size={18} /> : <MdArrowDownward size={18} />}
            </button>
          </div>
        </div>

        {
          isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
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
                    <div key={item.id} className="bg-surface rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full group">
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2 py-1 rounded-md bg-surface-alt text-text-secondary text-[10px] font-bold uppercase tracking-wider border border-border">
                          {item.type}
                        </span>
                        <div className="relative">
                          <button className="text-text-muted hover:text-text p-1 -mr-2">
                            <MdMoreVert size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4 flex-grow">
                        <button
                          onClick={() => openTab({
                            id: item.sei_number,
                            type: 'sei_detail',
                            title: item.sei_number
                          })}
                          className="font-medium text-text hover:text-accent hover:underline text-sm flex items-center gap-2 mb-2 text-left w-full break-all"
                        >
                          {item.sei_number} <MdLaunch size={12} />
                        </button>
                        <p className="text-text-secondary text-sm line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-auto border-t border-border pt-3 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-muted">Atribuído para:</span>
                          <span className="font-medium text-text truncate max-w-[120px]" title={item.assigned_to}>{item.assigned_to}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-muted">Prazo:</span>
                          <div className="flex items-center gap-1.5 font-medium text-text">
                            <MdCalendarToday size={14} className="text-text-muted" />
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
                    <div className="col-span-full py-12 text-center text-text-muted bg-surface rounded-xl border border-dashed border-border">
                      Nenhum processo encontrado.
                    </div>
                  )}
                </div>
              )}
              {activeView === 'kanban' && (
                <div className="bg-surface p-10 rounded-xl border border-border text-center shadow-sm">
                  <p className="text-text-muted">Visualização Kanban em desenvolvimento.</p>
                </div>
              )}
            </>
          )
        }
      </div >
    </div >
  );
}