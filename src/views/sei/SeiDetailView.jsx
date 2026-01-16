'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { MdContentCopy, MdShare, MdEdit, MdOpenInNew, MdError, MdDeleteOutline, MdKeyboardArrowDown, MdDescription, MdInfoOutline } from 'react-icons/md';
import { Menu, Transition } from '@headlessui/react';
import useTabStore from '@/store/useTabStore';
import ActionPlanSection from './ActionPlanSection';
import useHistoryStore from '@/store/useHistoryStore';
import StefaniaChatbot from './StefaniaChatbot';
import DocumentsDetailView from './DocumentsDetailView';
import SeiEditView from './SeiEditView';
import { toast } from '@/components/ui/toast';
import { fetchSeiProcessDetails, manterProcesso, prepararImportacao } from '@/services/seiService';
import Modal from '@/components/ui/Modal';
import { MdWarning } from 'react-icons/md';

export default function SeiDetailView({ id, lastReload, data: tabData }) {
  const [processData, setProcessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('details');
  const [isEditing, setIsEditing] = useState(tabData?.isNew || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);
  const updateTab = useTabStore(state => state.updateTab);
  const closeTab = useTabStore(state => state.closeTab);

  const isNew = tabData?.isNew;
  const updateHistoryEntry = useHistoryStore(state => state.updateHistoryEntry);
  const addToHistory = useHistoryStore(state => state.addToHistory);

  useEffect(() => {
    const newSubLabel = isEditing ? (isNew ? 'Novo Processo' : 'Edição') : (viewMode === 'details' ? 'Detalhes' : 'Documentos');

    if (tabData?.subLabel !== newSubLabel) {
      updateTab(id, {
        data: {
          ...tabData,
          subLabel: newSubLabel
        }
      });
    }
  }, [id, viewMode, isEditing, updateTab, isNew, tabData?.subLabel]);

  const handleSave = async (newData) => {
    setIsSaving(true);
    try {
      const operacao = isNew ? 'inserir' : 'alterar';
      await manterProcesso(operacao, newData);

      toast(`Processo ${operacao === 'inserir' ? 'criado' : 'atualizado'} com sucesso!`, 'success');

      setProcessData(prev => ({ ...prev, ...newData }));
      setIsEditing(false);
      updateTab(id, { hasUnsavedChanges: false });

      if (isNew) {
        updateTab(id, {
          id: newData.sei,
          title: newData.sei,
          data: { ...tabData, isNew: false, seiNumber: newData.sei }
        });

        addToHistory({
          id: newData.sei,
          type: 'sei_detail',
          title: newData.sei,
          description: newData.descricao
        });
      } else {
        updateHistoryEntry(newData.sei, {
          description: newData.descricao
        });
      }
    } catch (err) {
      toast(`Erro ao salvar: ${err.message || 'Erro desconhecido'}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeletingLoading(true);
    try {
      await manterProcesso('excluir', { sei: processData.sei });
      toast('Processo removido com sucesso!', 'success');
      setIsDeleting(false);
      closeTab(id);
    } catch (err) {
      toast(`Erro ao remover: ${err.message || 'Erro desconhecido'}`, 'error');
    } finally {
      setIsDeletingLoading(false);
    }
  };

  const handleCancel = () => {
    updateTab(id, { hasUnsavedChanges: false });
    if (isNew) {
      closeTab(id);
    } else {
      setIsEditing(false);
    }
  };


  useEffect(() => {
    if (id && id !== 'unknown') {
      loadData();
    }
  }, [id, lastReload]);

  const loadData = async () => {
    setLoading(true);
    try {
      let data;
      if (isNew && tabData?.seiNumber) {
        const importedData = await prepararImportacao(tabData.seiNumber);
        data = {
          ...importedData,
          isNew: true,
          seiNumber: tabData.seiNumber
        };
      } else {
        data = await fetchSeiProcessDetails(id);
      }

      setProcessData(data);

      if (data && data.sei && !isNew) {
        updateHistoryEntry(data.sei, {
          description: data.descricao
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
      <div className="h-full flex items-center justify-center bg-surface-alt">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted text-sm font-medium">Carregando processo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-surface-alt p-6 text-center">
        <div className="bg-error/10 p-4 rounded-full mb-4">
          <MdError size={32} className="text-error" />
        </div>
        <h2 className="text-lg font-bold text-text mb-2">Erro ao carregar</h2>
        <p className="text-text-muted mb-6 max-w-md">{error}</p>
        <button onClick={loadData} className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface-alt shadow-sm text-text">
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!processData || !processData.sei) return null;

  const { sei, status, ano_referencia, tipo, descricao, tags, atribuido, unidade_atual, observacoes_tramitacao, data_dilacao, sei_dilacao, data_resposta, recebimento, prazo_final, ultima_movimentacao, link_acesso, interessados, assuntos, especificacao, procedimentos_relacionados, procedimentos_anexados } = processData;

  const Field = ({ label, value, fullWidth = false, className = "" }) => (
    <div className={`flex flex-col ${fullWidth ? 'col-span-full' : ''} ${className}`}>
      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">{label}</label>
      <div className="w-full bg-surface-alt border border-border rounded px-3 py-2 text-sm text-text-secondary font-medium min-h-[38px] whitespace-pre-wrap">
        {value || <span className="text-text-muted italic font-normal">Não informado</span>}
      </div>
    </div>
  );

  const FooterItem = ({ label, value, colorClass = "text-slate-700" }) => (
    <div className="text-center md:text-left">
      <span className="block text-[10px] text-text-muted mb-1">{label}</span>
      <span className={`text-sm font-bold ${colorClass}`}>{value || '-'}</span>
    </div>
  );

  const TreeItem = ({ type, title, subtitle, status, isCurrent, isLast, statusColor }) => (
    <div className="relative flex gap-4">
      {!isLast && <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-border" />}

      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-surface border-2 ${isCurrent ? 'border-accent ring-2 ring-accent-soft' : 'border-border'}`}>
        {isCurrent && <div className="w-3 h-3 bg-accent rounded-full" />}
      </div>

      <div className="flex-grow pb-8">
        <div className="flex flex-col mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isCurrent ? 'text-accent' : 'text-text-muted'}`}>
            {type}
          </span>
          <div className={`p-4 rounded-lg border flex justify-between items-start ${isCurrent ? 'bg-accent-soft border-accent/20' : 'bg-surface border-border'}`}>
            <div>
              <h4 className={`text-sm font-bold ${isCurrent ? 'text-accent' : 'text-text'}`}>
                {title}
              </h4>
              <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
              {!isCurrent && <button className="text-[10px] font-medium text-accent hover:underline mt-2">Ver detalhes</button>}
            </div>
            {status && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor || "bg-surface-alt text-text-muted border-border"}`}>
                {status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const StatusLogic = status.includes('Concluído') ? 'bg-green-100 text-green-700 border-green-200' :
    status.includes('Análise') ? 'bg-amber-100 text-amber-700 border-amber-200' :
      'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="h-full bg-surface-alt px-6 pt-2 pb-6 md:px-10 md:pt-4 md:pb-10 overflow-auto font-sans relative flex flex-col">
      <div className="max-w-7xl mx-auto w-full space-y-6 pb-20 flex-grow flex flex-col">

        {isEditing ? (
          <SeiEditView
            tabId={id}
            data={processData}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        ) : (
          <>
            <div>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-extrabold text-text tracking-tight">
                      {sei}
                    </h1>
                    <button onClick={() => copyToClipboard(sei)} className="text-text-muted/40 hover:text-accent transition-colors" title="Copiar">
                      <MdContentCopy size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${StatusLogic}`}>
                      {status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border hover:bg-surface-alt text-text text-sm font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/20 active:scale-95">
                        Opções
                        <MdKeyboardArrowDown size={16} className="text-text-muted" />
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
                              <button className={`${active ? 'bg-surface-alt text-accent' : 'text-text'} group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}>
                                <MdShare className={`mr-2 h-4 w-4 ${active ? 'text-accent' : 'text-text-muted'}`} />
                                Compartilhar
                              </button>
                            )}
                          </Menu.Item>
                        </div>

                        <div className="px-1 py-1">
                          {link_acesso && (
                            <Menu.Item>
                              {({ active }) => (
                                <a href={link_acesso} target="_blank" rel="noreferrer" className={`${active ? 'bg-surface-alt text-accent' : 'text-text'} group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}>
                                  <MdOpenInNew className={`mr-2 h-4 w-4 ${active ? 'text-accent' : 'text-text-muted'}`} />
                                  Abrir no SEI
                                </a>
                              )}
                            </Menu.Item>
                          )}
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setIsDeleting(true)}
                                className={`${active ? 'bg-red-50 text-red-600' : 'text-red-600'} group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors`}
                              >
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

              <div className="flex border-b border-border mb-6">
                <button
                  onClick={() => setViewMode('details')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${viewMode === 'details'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-secondary hover:text-text hover:border-border'
                    }`}
                >
                  <MdInfoOutline size={18} />
                  Detalhes
                </button>
                <button
                  onClick={() => setViewMode('documents')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${viewMode === 'documents'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-secondary hover:text-text hover:border-border'
                    }`}
                >
                  <MdDescription size={18} />
                  Documentos
                </button>
              </div>
            </div>

            <div className={viewMode === 'details' ? 'block space-y-8 animate-in fade-in zoom-in-95 duration-200' : 'hidden'}>
              <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
                  <h2 className="text-lg font-bold text-text">Dados do Processo</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent bg-accent-soft hover:bg-accent/20 rounded-md transition-colors"
                    >
                      <MdEdit className="text-base" />
                      Editar
                    </button>
                  )}
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-accent uppercase tracking-wide mb-6 border-l-4 border-accent pl-3">
                      Informações Básicas
                    </h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Ano de Referência" value={ano_referencia} />
                        <Field label="Tipo" value={tipo} />
                      </div>
                      <Field label="Descrição" value={descricao} fullWidth />
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Tags Associadas</label>
                        <div className="flex flex-wrap gap-2">
                          {tags.length > 0 ? tags.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-accent-soft text-accent rounded-md text-xs font-semibold border border-accent/20">
                              {tag}
                            </span>
                          )) : (
                            <span className="text-text-muted text-sm italic">Sem tags associadas</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-border my-8" />

                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-accent uppercase tracking-wide mb-6 border-l-4 border-accent pl-3">
                      Trâmite e Responsabilidade
                    </h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Atribuído a" value={atribuido} />
                        <Field label="Unidade Atual" value={unidade_atual} />
                      </div>
                      <Field label="Observações e Tramitação" value={observacoes_tramitacao} fullWidth />
                    </div>
                  </div>

                  {(procedimentos_relacionados?.length > 0 || procedimentos_anexados?.length > 0) && (
                    <div>
                      <hr className="border-border my-8" />
                      <h3 className="flex items-center gap-2 text-sm font-bold text-accent uppercase tracking-wide mb-6 border-l-4 border-accent pl-3">
                        Processos Relacionados / Anexados no SEI
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {procedimentos_relacionados?.map((proc, idx) => (
                          <div key={`rel-${idx}`} className="px-3 py-1.5 bg-surface-alt border border-border rounded-md flex flex-col justify-center max-w-xs">
                            <span className="text-sm text-text-secondary">
                              {proc.formatado}
                            </span>
                            <span className="text-[11px] text-text-muted line-clamp-1">
                              {proc.tipo || 'RELACIONADO'}
                            </span>
                          </div>
                        ))}
                        {procedimentos_anexados?.map((proc, idx) => (
                          <div key={`anex-${idx}`} className="px-3 py-1.5 bg-surface-alt border border-border rounded-md flex flex-col justify-center max-w-xs">
                            <span className="text-sm text-text-secondary">
                              {proc.formatado}
                            </span>
                            <span className="text-[11px] text-text-muted line-clamp-1">
                              ANEXADO {proc.tipo ? `• ${proc.tipo}` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(data_dilacao || sei_dilacao || data_resposta) && (
                    <div>
                      <hr className="border-border my-8" />
                      <h3 className="flex items-center gap-2 text-sm font-bold text-accent uppercase tracking-wide mb-6 border-l-4 border-accent pl-3">
                        Prazos e Extensões
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data_dilacao && <Field label="Data Dilação" value={data_dilacao} />}
                        {sei_dilacao && <Field label="SEI Dilação" value={sei_dilacao} />}
                        {data_resposta && <Field label="Data Resposta" value={data_resposta} />}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-surface-alt/50 px-6 py-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FooterItem label="Recebimento" value={recebimento} />
                  <FooterItem label="Prazo Final" value={prazo_final} colorClass="text-error" />
                  <FooterItem label="Última Movimentação" value={ultima_movimentacao} />
                  <div className="text-right flex justify-end items-center"></div>
                </div>
              </div>

              <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-surface">
                  <h2 className="text-lg font-bold text-text">Árvore de Processos Relacionados</h2>
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
                      title={sei}
                      subtitle={descricao}
                      isCurrent={true}
                    />
                    <TreeItem
                      type="Apensado"
                      title="1190.01.000912/2025-01"
                      subtitle="Solicitação de Crédito Suplementar (Depende deste)"
                      status="Em Andamento"
                      statusColor="bg-accent-soft text-accent border-accent/20"
                      isLast={true}
                    />
                  </div>
                </div>
              </div>

              <ActionPlanSection seiNumber={sei} />
            </div>

            <div className={viewMode === 'documents' ? 'block h-full' : 'hidden'}>
              <DocumentsDetailView processId={sei} />
            </div>

            {viewMode !== 'documents' && <StefaniaChatbot processCode={sei} />}
          </>
        )}

      </div>
      <Modal
        isOpen={isDeleting}
        onClose={() => !isDeletingLoading && setIsDeleting(false)}
        title="Remover do SOMA"
        footer={
          <>
            <button
              onClick={handleDelete}
              disabled={isDeletingLoading}
              className="px-4 py-2 text-sm font-bold text-white bg-error hover:bg-error/90 rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {isDeletingLoading ? 'Removendo...' : 'Sim, remover'}
            </button>
            <button
              onClick={() => setIsDeleting(false)}
              disabled={isDeletingLoading}
              className="px-4 py-2 text-sm font-medium text-text hover:bg-surface-alt rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </>
        }
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-error/10 rounded-full text-error shrink-0">
            <MdWarning size={24} />
          </div>
          <div>
            <p className="text-sm text-text">
              Tem certeza que deseja remover o processo <span className="font-bold">{processData.sei}</span> do sistema SOMA?
            </p>
            <p className="text-xs text-text-secondary mt-2">
              Esta ação removerá o vínculo do processo com o sistema, mas não afetará o processo original no SEI.
            </p>
          </div>
        </div>
      </Modal>
    </div >
  );
}
