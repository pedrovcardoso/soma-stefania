'use client';

import { useState, useEffect, Fragment } from 'react';
import { MdSearch, MdMoreVert, MdLaunch, MdCalendarToday, MdExpandMore } from 'react-icons/md';
import FilterPanel from '@/components/ui/FilterPanel';
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
  const [activeView, setActiveView] = useState('table');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const addTab = useTabStore((state) => state.addTab);

  // Estados de Filtro
  const [filters, setFilters] = useState({
    year: '',
    type: '',
    status: '',
    search: '',
    datePreset: 'all',
    dateRange: { from: undefined, to: undefined }
  });

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
    setFilters({ year: '', type: '', status: '', search: '', datePreset: 'all', dateRange: { from: undefined, to: undefined } });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Filtragem (simulada no client-side para este exemplo)
  const filteredData = data.filter(item => {
    const matchYear = !filters.year || item.ref_year.toString() === filters.year;
    const matchType = !filters.type || item.type === filters.type;
    const matchStatus = !filters.status || item.status === filters.status;
    const matchSearch = !filters.search ||
      item.sei_number.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchDate = (!filters.dateRange.from || new Date(item.deadline) >= filters.dateRange.from) &&
      (!filters.dateRange.to || new Date(item.deadline) <= endOfDay(filters.dateRange.to));

    return matchYear && matchType && matchStatus && matchSearch && matchDate;
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

          {/* Filtro por Tipo */}
          <div className="flex-grow min-w-[180px]">
            <label className="text-xs font-semibold text-slate-500">Tipo</label>
            <div className="relative mt-1">
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 appearance-none bg-slate-50 outline-none pr-8"
              >
                <option value="">Todos os tipos</option>
                <option value="Prestação de Contas">Prestação de Contas</option>
                <option value="Diligência">Diligência</option>
                <option value="Auditoria">Auditoria</option>
                <option value="Acompanhamento especial">Acompanhamento especial</option>
              </select>
              <MdExpandMore className="text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Filtro por Status */}
          <div className="flex-grow min-w-[180px]">
            <label className="text-xs font-semibold text-slate-500">Status</label>
            <div className="relative mt-1">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 appearance-none bg-slate-50 outline-none pr-8"
              >
                <option value="">Todos os status</option>
                <option value="Acompanhamento especial">Acompanhamento especial</option>
                <option value="Aguarda resposta">Aguarda resposta</option>
                <option value="Finalizado e Concluído">Finalizado e Concluído</option>
              </select>
              <MdExpandMore className="text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>



          {/* Filtro por Prazo (Data) */}
          <div className="flex-grow min-w-[180px]">
            <label className="text-xs font-semibold text-slate-500">Filtrar por Prazo</label>
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
              <Popover className="relative mt-1">
                <Popover.Button className="w-full flex items-center justify-between p-2 text-sm text-left bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
                  <span className='flex items-center gap-2 text-slate-700'>
                    <MdCalendarToday className="text-slate-400" />
                    {filters.dateRange.from ? `${format(filters.dateRange.from, 'dd/MM/yy')} - ${filters.dateRange.to ? format(filters.dateRange.to, 'dd/MM/yy') : ''}` : 'Selecione...'}
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

        {/* View Tabs */}
        <div className="flex border-b border-slate-200 mb-6 space-x-6">
          <button
            onClick={() => setActiveView('table')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeView === 'table' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Tabela
          </button>
          <button
            onClick={() => setActiveView('kanban')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeView === 'kanban' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Kanban
          </button>
          <button
            onClick={() => setActiveView('block')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeView === 'block' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Bloco
          </button>
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
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 font-semibold text-slate-700">Processo</th>
                          <th className="px-6 py-4 font-semibold text-slate-700">Descrição</th>
                          <th className="px-6 py-4 font-semibold text-slate-700">Atribuído para</th>
                          <th className="px-6 py-4 font-semibold text-slate-700">Prazo Final</th>
                          <th className="px-6 py-4 font-semibold text-slate-700">Tags</th>
                          <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                          <th className="px-6 py-4 font-semibold text-slate-700 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredData.length > 0 ? filteredData.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">

                            {/* Processo */}
                            <td className="px-6 py-4 align-top">
                              <div className="flex flex-col">
                                <button
                                  onClick={() => addTab({
                                    id: `sei-${row.id}`,
                                    title: row.sei_number,
                                    path: `/sei/${row.id}`
                                  })}
                                  className="font-bold text-blue-600 hover:text-blue-800 hover:underline font-mono text-xs flex items-center gap-1 w-fit text-left"
                                >
                                  {row.sei_number} <MdLaunch size={10} />
                                </button>
                                <span className="text-xs text-slate-400 mt-0.5">{row.type}</span>
                              </div>
                            </td>

                            {/* Descrição */}
                            <td className="px-6 py-4 align-top max-w-xs">
                              <p className="text-slate-600 line-clamp-2">{row.description}</p>
                            </td>

                            {/* Atribuído */}
                            <td className="px-6 py-4 align-top">
                              <span className="text-slate-700 font-medium text-sm">{row.assigned_to}</span>
                            </td>

                            {/* Prazo */}
                            <td className="px-6 py-4 align-top">
                              <div className="flex items-center gap-2 text-slate-600">
                                <MdCalendarToday size={14} className="text-slate-400" />
                                <span>{new Date(row.deadline).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </td>

                            {/* Tags */}
                            <td className="px-6 py-4 align-top">
                              <div className="flex flex-wrap gap-1">
                                {row.tags.map(tag => (
                                  <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200 uppercase tracking-wide">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4 align-top">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusColor(row.status)}`}>
                                {row.status}
                              </span>
                            </td>

                            {/* Ações */}
                            <td className="px-6 py-4 align-top text-right">
                              <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                                <MdMoreVert size={20} />
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                              Nenhum processo encontrado com os filtros selecionados.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeView !== 'table' && (
                <div className="bg-white p-10 rounded-xl border border-slate-200/80 text-center shadow-sm">
                  <p className="text-slate-400">Visualização em desenvolvimento.</p>
                </div>
              )}
            </>
          )
        }
      </div >
    </div >
  );
}
