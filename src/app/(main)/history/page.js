'use client';

import React, { useState, useMemo, Fragment } from 'react';
import useTabStore from '@/store/useTabStore';
import useHistoryStore from '@/store/useHistoryStore';
import FilterPanel from '@/components/ui/FilterPanel';

// --- DEPENDÊNCIAS ---
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, subWeeks, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Menu, Popover, Transition } from '@headlessui/react';

// --- ÍCONES ---
import {
  MdSearch, MdClose, MdBarChart, MdLanguage, MdDescription,
  MdDeleteSweep, MdHistory, MdFilterList, MdMoreVert, MdCalendarToday,
  MdExpandMore, MdRefresh, MdPushPin, MdLaunch, MdShare, MdFavorite, MdFavoriteBorder
} from 'react-icons/md';

// --- HELPERS ---
const PAGE_TYPES = {
  // CORRIGIDO: Ícones agora são monocromáticos
  dashboard: { label: 'Dashboard', icon: <MdBarChart className="text-slate-500" /> },
  sei: { label: 'Processos SEI', icon: <MdLanguage className="text-slate-500" /> },
  documents: { label: 'Documentos', icon: <MdDescription className="text-slate-500" /> },
  default: { label: 'Outro', icon: <MdHistory className="text-slate-500" /> },
};
const getPageInfo = (path) => {
  if (path.startsWith('/dashboard')) return PAGE_TYPES.dashboard;
  if (path.startsWith('/sei')) return PAGE_TYPES.sei;
  if (path.startsWith('/documents')) return PAGE_TYPES.documents;
  return PAGE_TYPES.default;
};
const formatFullDateTime = (date) => new Date(date).toLocaleString('pt-BR', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
});
const normalizeText = (text) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function HistoryPage() {
  const addTab = useTabStore((state) => state.addTab);
  const { historyItems, removeFromHistory, togglePin, toggleFavorite, clearHistory } = useHistoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    pageType: 'all',
    datePreset: 'all',
    dateRange: { from: undefined, to: undefined },
    isPinned: false,
    isFavorited: false,
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
  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => {
    setFilters({ pageType: 'all', datePreset: 'all', dateRange: { from: undefined, to: undefined }, isPinned: false, isFavorited: false });
    setSearchTerm('');
  };

  const handleAccessClick = (access) => addTab({ id: access.id, title: access.title, path: access.path || `/sei/${access.id}` });
  const handleDeleteItem = (idToDelete) => removeFromHistory(idToDelete);
  const handleTogglePin = (idToToggle) => togglePin(idToToggle);
  const handleToggleFavorite = (idToToggle) => toggleFavorite(idToToggle);
  const handleShare = (process) => alert(`Compartilhar: ${process}\n(Funcionalidade pendente)`);

  const handleClearHistory = (period) => {
    clearHistory(period);
  };

  const groupedHistory = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);
    const filtered = historyItems.filter(item => {
      const searchMatch = !normalizedSearch || normalizeText(item.process).includes(normalizedSearch) || normalizeText(item.title).includes(normalizedSearch);
      const itemType = (item.path || '').split('/')[1] || 'default';
      const pageTypeMatch = filters.pageType === 'all' || itemType === filters.pageType;
      const pinnedMatch = !filters.isPinned || item.pinned;
      const favoritedMatch = !filters.isFavorited || item.favorited;
      const dateMatch = (!filters.dateRange.from || new Date(item.accessedAt) >= filters.dateRange.from) && (!filters.dateRange.to || new Date(item.accessedAt) <= endOfDay(filters.dateRange.to));
      return searchMatch && pageTypeMatch && pinnedMatch && favoritedMatch && dateMatch;
    });
    const groups = { 'Hoje': [], 'Ontem': [], 'Esta Semana': [], 'Mais Antigo': [] };
    const today = startOfDay(new Date()); const yesterday = startOfDay(subDays(new Date(), 1)); const thisWeekStart = startOfWeek(new Date(), { locale: ptBR });
    for (const item of filtered) {
      const itemDate = new Date(item.accessedAt);
      if (itemDate >= today) groups['Hoje'].push(item);
      else if (itemDate >= yesterday) groups['Ontem'].push(item);
      else if (itemDate >= thisWeekStart) groups['Esta Semana'].push(item);
      else groups['Mais Antigo'].push(item);
    }
    return groups;
  }, [historyItems, searchTerm, filters]);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-50 min-h-full font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Histórico de Atividades</h1>
          <p className="text-slate-500 mt-2">Revise, filtre e acesse rapidamente suas atividades recentes.</p>
        </header>

        <FilterPanel onClear={clearFilters}>
          <div className="flex-grow min-w-[180px]"><label className="text-xs font-semibold text-slate-500">Filtrar por Tipo</label><div className="relative mt-1">
            <select value={filters.pageType} onChange={(e) => handleFilterChange('pageType', e.target.value)} className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 appearance-none pr-8 bg-slate-50 outline-none"><option value="all">Todos os tipos</option><option value="dashboard">Dashboard</option><option value="sei">Processos SEI</option><option value="documents">Documentos</option></select>
            <MdExpandMore className="text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div></div>
          <div className="flex-grow min-w-[180px]"><label className="text-xs font-semibold text-slate-500">Filtrar por Período</label><div className="relative mt-1">
            <select value={filters.datePreset} onChange={(e) => handleDatePresetChange(e.target.value)} className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 appearance-none pr-8 bg-slate-50 outline-none"><option value="all">Qualquer data</option><option value="today">Hoje</option><option value="thisWeek">Esta Semana</option><option value="lastWeek">Semana Passada</option><option value="thisMonth">Este Mês</option><option value="lastMonth">Mês Passado</option><option value="specific">Período Específico...</option></select>
            <MdExpandMore className="text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div></div>
          {filters.datePreset === 'specific' && (<div className="flex-grow min-w-[180px]"><label className="text-xs font-semibold text-slate-500">Datas</label><Popover className="relative mt-1">
            <Popover.Button className="w-full flex items-center justify-between p-2 text-sm text-left bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"><span className='flex items-center gap-2 text-slate-700'><MdCalendarToday className="text-slate-400" />{filters.dateRange.from ? `${format(filters.dateRange.from, 'dd/MM/yy')} - ${filters.dateRange.to ? format(filters.dateRange.to, 'dd/MM/yy') : ''}` : 'Selecione...'}</span><MdExpandMore className="text-slate-400" /></Popover.Button>
            <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1"><Popover.Panel className="absolute z-20 mt-1 bg-white border rounded-md shadow-lg"><DayPicker mode="range" selected={filters.dateRange} onSelect={(range) => handleFilterChange('dateRange', range)} locale={ptBR} className="p-2" captionLayout="dropdown-buttons" fromYear={2020} toYear={new Date().getFullYear()} /></Popover.Panel></Transition>
          </Popover></div>)}
          <div className="flex items-center gap-4">
            <label htmlFor="isPinnedFilter" className="flex items-center gap-2 p-2 border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50 transition-colors"><input id="isPinnedFilter" type="checkbox" checked={filters.isPinned} onChange={(e) => handleFilterChange('isPinned', e.target.checked)} className="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500" /><span className="text-sm text-slate-700">Somente fixado no histórico</span></label>
            <label htmlFor="isFavoritedFilter" className="flex items-center gap-2 p-2 border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50 transition-colors"><input id="isFavoritedFilter" type="checkbox" checked={filters.isFavorited} onChange={(e) => handleFilterChange('isFavorited', e.target.checked)} className="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500" /><span className="text-sm text-slate-700">Somente favoritos</span></label>
          </div>
        </FilterPanel>

        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <div className="relative w-full"><MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="Buscar no histórico por nome ou título..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
          <Menu as="div" className="relative w-full sm:w-auto"><Menu.Button className="w-full flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"><MdDeleteSweep size={18} /><span>Limpar Histórico</span><MdExpandMore /></Menu.Button>
            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-slate-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"><div className="px-1 py-1"><Menu.Item><button onClick={() => handleClearHistory('day')} className='group flex rounded-md items-center w-full px-2 py-2 text-sm text-slate-700 hover:bg-slate-100'>Limpar hoje</button></Menu.Item><Menu.Item><button onClick={() => handleClearHistory('week')} className='group flex rounded-md items-center w-full px-2 py-2 text-sm text-slate-700 hover:bg-slate-100'>Limpar última semana</button></Menu.Item><Menu.Item><button onClick={() => handleClearHistory('month')} className='group flex rounded-md items-center w-full px-2 py-2 text-sm text-slate-700 hover:bg-slate-100'>Limpar último mês</button></Menu.Item></div><div className="px-1 py-1"><Menu.Item><button onClick={() => handleClearHistory('all')} className='group flex rounded-md items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50'>Limpar todo o histórico</button></Menu.Item></div></Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedHistory).map(([groupName, items]) => items.length > 0 && (
            <section key={groupName}><h2 className="text-sm font-bold uppercase text-slate-500 tracking-wider pb-2 border-b-2 border-slate-200 mb-4">{groupName}</h2><ul>{items.map(access => (
              <li key={access.id} className="relative py-3 group"><div className="absolute top-5 left-4 -ml-px h-full w-0.5 bg-slate-200"></div><div className="relative flex items-center space-x-4">
                <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full ring-4 ring-slate-50">{React.cloneElement(getPageInfo(access.path || '').icon, { size: 20 })}</div>
                <div className="flex-1 min-w-0 bg-white p-4 rounded-lg border border-slate-200 shadow-sm group-hover:border-blue-300 transition-all"><div className="flex justify-between items-center gap-2">
                  <div className="flex-1 min-w-0"><p className="text-xs text-slate-500 mb-1">{formatFullDateTime(access.accessedAt)}</p><button onClick={() => handleAccessClick(access)} className="text-left w-full"><h3 className="text-md font-semibold text-slate-800 hover:underline underline-offset-2 truncate">{access.process}</h3></button><p className="text-sm text-slate-600 mt-1 truncate">{access.title}</p></div>
                  <div className="flex items-center flex-shrink-0">
                    {/* CORRIGIDO: Tamanho e rotação do pin */}
                    <button onClick={() => handleTogglePin(access.id)} title={access.pinned ? 'Desafixar do histórico' : 'Fixar no histórico'} className="p-1.5"><MdPushPin className={`w-4 h-4 rotate-45 transition-all ${access.pinned ? 'text-slate-600 opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-80'}`} /></button>
                    <Menu as="div" className="relative"><Menu.Button className="p-1.5 text-slate-500 rounded-full hover:bg-slate-100"><MdMoreVert size={20} /></Menu.Button>
                      <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20"><div className="p-1">
                          <Menu.Item>{({ active }) => (<button onClick={() => handleAccessClick(access)} className={`${active ? 'bg-slate-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-700`}><MdLaunch className="mr-2" /> Acessar</button>)}</Menu.Item>
                          <Menu.Item>{({ active }) => (<button onClick={() => handleShare(access.process)} className={`${active ? 'bg-slate-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-700`}><MdShare className="mr-2" /> Compartilhar</button>)}</Menu.Item>
                          <Menu.Item>{({ active }) => (<button onClick={() => handleToggleFavorite(access.id)} className={`${active ? 'bg-slate-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-700`}>{access.favorited ? <MdFavorite className="mr-2" /> : <MdFavoriteBorder className="mr-2" />} {access.favorited ? 'Remover dos favoritos' : 'Favoritar'}</button>)}</Menu.Item>
                          <Menu.Item>{({ active }) => (<button onClick={() => handleDeleteItem(access.id)} className={`${active ? 'bg-slate-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-700`}><MdClose className="mr-2" /> Excluir</button>)}</Menu.Item>
                        </div></Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div></div>
              </div></li>
            ))}</ul></section>
          ))}
          {Object.values(groupedHistory).every(g => g.length === 0) && (<div className="text-center py-16"><h3 className="text-lg font-semibold text-slate-800">Nenhum resultado encontrado</h3><p className="mt-1 text-sm text-slate-500">Ajuste os filtros ou o termo de busca.</p></div>)}
        </div>
      </div>
    </div>
  );
}