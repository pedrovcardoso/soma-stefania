'use client';

import { useState, useEffect } from 'react';
import { MdContentCopy, MdShare, MdEdit, MdOpenInNew, MdError } from 'react-icons/md';
import { fetchSeiProcessDetails } from '@/services/seiService';
import ActionPlanSection from './ActionPlanSection';
import useHistoryStore from '@/store/useHistoryStore';

export default function SeiDetailView({ id }) {
  const [processData, setProcessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const addToHistory = useHistoryStore((state) => state.addToHistory);

  useEffect(() => {
    if (id && id !== 'unknown') {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchSeiProcessDetails(id);
      setProcessData(data);

      if (data && data.processo) {
        const historyItem = {
          id: data.processo.sei,
          type: 'sei_detail',
          title: data.processo.sei,
          description: data.processo.descricao
        };

        addToHistory(historyItem);
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
    <div className="h-full bg-gray-50/50 p-6 md:p-10 overflow-auto font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Section */}
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
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors">
                <MdShare size={16} /> Compartilhar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                <MdEdit size={16} /> Editar
              </button>
              {sei?.link && (
                <a
                  href={sei.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                  <MdOpenInNew size={16} /> Abrir no SEI
                </a>
              )}
            </div>
          </div>
        </div>

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
    </div>
  );
}