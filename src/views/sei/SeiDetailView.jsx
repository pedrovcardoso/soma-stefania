'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { MdContentCopy, MdShare, MdEdit, MdOpenInNew, MdError, MdDeleteOutline, MdKeyboardArrowDown, MdDescription, MdInfoOutline } from 'react-icons/md';
import { Menu, Transition } from '@headlessui/react';
import { fetchSeiProcessDetails } from '@/services/seiService';
import ActionPlanSection from './ActionPlanSection';
import useHistoryStore from '@/store/useHistoryStore';
import StefaniaChatbot from './StefaniaChatbot';
import DocumentsDetailView from './DocumentsDetailView';

export default function SeiDetailView({ id }) {
  const [processData, setProcessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('details'); // 'details' | 'documents'

  const updateHistoryEntry = useHistoryStore(state => state.updateHistoryEntry);
  const loadedIdRef = useRef(null);

  useEffect(() => {
    if (id && id !== 'unknown' && loadedIdRef.current !== id) {
      loadedIdRef.current = id;
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchSeiProcessDetails(id);
      setProcessData(data);

      if (data && data.processo) {
        updateHistoryEntry(data.processo.sei, {
          description: data.processo.descricao
        });
      }
    } catch (err) {
      console.error("Erro ao carregar detalhes:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Carregando processo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <MdError size={32} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Erro ao carregar</h2>
        <p className="text-slate-500 mb-6 max-w-md">{error}</p>
        <button onClick={loadData} className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm">
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!processData || !processData.processo) return null;

  const { processo, tags, sei } = processData;

  const Field = ({ label, value, fullWidth = false, className = "" }) => (
    <div className={`flex flex-col ${fullWidth ? 'col-span-full' : ''} ${className}`}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 font-medium min-h-[38px] flex items-center">
        {value || <span className="text-slate-400 italic font-normal">Não informado</span>}
      </div>
    </div>
  );

  const FooterItem = ({ label, value, colorClass = "text-slate-700" }) => (
    <div className="text-center md:text-left">
      <span className="block text-[10px] text-slate-400 mb-1">{label}</span>
      <span className={`text-sm font-bold ${colorClass}`}>{value || '-'}</span>
    </div>
  );

  const TreeItem = ({ type, title, subtitle, status, isCurrent, isLast, statusColor }) => (
    <div className="relative flex gap-4">
      {!isLast && <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-slate-200" />}

      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white border-2 ${isCurrent ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-300'}`}>
        {isCurrent && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
      </div>

      <div className="flex-grow pb-8">
        <div className="flex flex-col mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
            {type}
          </span>
          <div className={`p-4 rounded-lg border flex justify-between items-start ${isCurrent ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-200'}`}>
            <div>
              <h4 className={`text-sm font-bold ${isCurrent ? 'text-blue-900' : 'text-slate-700'}`}>
                {title}
              </h4>
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
              {!isCurrent && <button className="text-[10px] font-medium text-blue-600 hover:underline mt-2">Ver detalhes</button>}
            </div>
            {status && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                {status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50/50 p-6 md:p-10 overflow-auto font-sans relative flex flex-col">
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-20 flex-grow flex flex-col">

        {/* Header Section (Always Visible) */}
        <div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {processo.sei}
                </h1>
                <button onClick={() => copyToClipboard(processo.sei)} className="text-slate-300 hover:text-blue-600 transition-colors" title="Copiar">
                  <MdContentCopy size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${processo.status.includes('Concluído') ? 'bg-green-100 text-green-700 border-green-200' :
                  processo.status.includes('Análise') ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                  {processo.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95">
                    Opções
                    <MdKeyboardArrowDown size={16} className="text-slate-400" />
                  </Menu.Button>
                </div>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button className={`${active ? 'bg-slate-50 text-blue-600' : 'text-slate-700'} group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}>
                            <MdShare className={`mr-2 h-4 w-4 ${active ? 'text-blue-500' : 'text-slate-400'}`} />
                            Compartilhar
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button className={`${active ? 'bg-slate-50 text-blue-600' : 'text-slate-700'} group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}>
                            <MdEdit className={`mr-2 h-4 w-4 ${active ? 'text-blue-500' : 'text-slate-400'}`} />
                            Editar
                          </button>
                        )}
                      </Menu.Item>
                    </div>

                    <div className="px-1 py-1">
                      {sei?.link && (
                        <Menu.Item>
                          {({ active }) => (
                            <a href={sei.link} target="_blank" rel="noreferrer" className={`${active ? 'bg-slate-50 text-blue-600' : 'text-slate-700'} group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}>
                              <MdOpenInNew className={`mr-2 h-4 w-4 ${active ? 'text-blue-500' : 'text-slate-400'}`} />
                              Abrir no SEI
                            </a>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <button className={`${active ? 'bg-red-50 text-red-600' : 'text-red-600'} group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}>
                            <MdDeleteOutline className={`mr-2 h-4 w-4 ${active ? 'text-red-600' : 'text-red-500'}`} />
                            Remover do SOMA
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => setViewMode('details')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${viewMode === 'details'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              <MdInfoOutline size={18} />
              Detalhes
            </button>
            <button
              onClick={() => setViewMode('documents')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${viewMode === 'documents'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              <MdDescription size={18} />
              Documentos
            </button>
          </div>
        </div>

        {/* Content Area */}
        {/* Content Area */}
        <div className={viewMode === 'details' ? 'block space-y-8 animate-in fade-in zoom-in-95 duration-200' : 'hidden'}>
          {/* Main Card: Dados do Processo */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-white">
              <h2 className="text-lg font-bold text-slate-800">Dados do Processo</h2>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Section 1: Basic Info */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-blue-800 uppercase tracking-wide mb-6 border-l-4 border-blue-600 pl-3">
                  Informações Básicas
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Ano de Referência" value={processo.ano_referencia} />
                    <Field label="Tipo" value={processo.tipo} />
                  </div>
                  <Field label="Descrição" value={processo.descricao} fullWidth />
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tags Associadas</label>
                    <div className="flex flex-wrap gap-2">
                      {tags.length > 0 ? tags.map(tag => (
                        <span key={tag.id_tag} className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-md text-xs font-semibold border border-cyan-100">
                          {tag.tag}
                        </span>
                      )) : (
                        <span className="text-slate-400 text-sm italic">Sem tags associadas</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100 my-8" />

              {/* Section 2: Assignment & Status */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-blue-800 uppercase tracking-wide mb-6 border-l-4 border-blue-600 pl-3">
                  Trâmite e Responsabilidade
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Atribuído a" value={processo.atribuido} />
                    <Field label="Unidade Atual" value="SEF/STE-SCAF" />
                  </div>
                  <Field label="Observações e Tramitação" value={processo.obs} fullWidth />
                </div>
              </div>

              {/* Section 3: Dates */}
              {(processo.dt_dilacao || processo.sei_dilacao || processo.dt_resposta) && (
                <div>
                  <hr className="border-slate-100 my-8" />
                  <h3 className="flex items-center gap-2 text-sm font-bold text-blue-800 uppercase tracking-wide mb-6 border-l-4 border-blue-600 pl-3">
                    Prazos e Extensões
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {processo.dt_dilacao && <Field label="Data Dilação" value={processo.dt_dilacao} />}
                    {processo.sei_dilacao && <Field label="SEI Dilação" value={processo.sei_dilacao} />}
                    {processo.dt_resposta && <Field label="Data Resposta" value={processo.dt_resposta} />}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
              <FooterItem label="Recebimento" value={processo.dt_recebimento} />
              <FooterItem label="Prazo Final" value={processo.dt_fim_prevista} colorClass="text-red-600" />
              <FooterItem label="Última Movimentação" value="01/06/2025" />
              <div className="text-right flex justify-end items-center"></div>
            </div>
          </div>

          {/* Process Tree Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-white">
              <h2 className="text-lg font-bold text-slate-800">Árvore de Processos Relacionados</h2>
            </div>
            <div className="p-6 md:p-8">
              <div className="pl-2">
                <TreeItem
                  type="Processo Originário"
                  title="1190.01.000450/2024-12"
                  subtitle="Planejamento Orçamentário 2024 (Base para o atual)"
                  status="Arquivado"
                  statusColor="bg-slate-100 text-slate-500 border-slate-200"
                />
                <TreeItem
                  type="Você está aqui"
                  title={processo.sei}
                  subtitle="Certificação de RPP e Monitoramento"
                  isCurrent={true}
                />
                <TreeItem
                  type="Apensado"
                  title="1190.01.000912/2025-01"
                  subtitle="Solicitação de Crédito Suplementar (Depende deste)"
                  status="Em Andamento"
                  statusColor="bg-blue-100 text-blue-600 border-blue-200"
                  isLast={true}
                />
              </div>
            </div>
          </div>

          {/* Action Plan Section */}
          <ActionPlanSection seiNumber={processo.sei} />
        </div>

        <div className={viewMode === 'documents' ? 'block h-full' : 'hidden'}>
          <DocumentsDetailView processId={processo.sei} />
        </div>

      </div>

      {/* Chatbot - Fixed Position, relative to viewport usually but put here for strict React hierarchy */}
      <StefaniaChatbot />

    </div>
  );
}
