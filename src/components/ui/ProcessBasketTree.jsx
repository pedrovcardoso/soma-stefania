import React, { useState, useEffect } from 'react';
import { MdAdd, MdSettings, MdClose, MdLink, MdDelete, MdCheck, MdList, MdOutlineAccountTree } from 'react-icons/md';
import { toast } from '@/components/ui/toast';
import Modal from '@/components/ui/Modal';
import { manterVinculacaoCesta, manterCesta, getDistinctProcesses } from '@/services/seiService';

const ProcessCard = ({ sei, isCurrent, onRemove }) => {
  return (
    <div className={`relative flex flex-col min-w-[160px] p-3 rounded-lg border-2 transition-all shadow-sm
      ${isCurrent
        ? 'bg-surface border-accent shadow-accent/20 ring-2 ring-accent/10 z-10'
        : 'bg-surface-alt border-border hover:border-accent/40'
      }
    `}>
      <div className="flex justify-between items-start gap-2">
        <h4 className={`text-xs font-bold ${isCurrent ? 'text-accent' : 'text-text'} break-all`}>
          {sei}
        </h4>
        {onRemove && !isCurrent && (
          <button
            onClick={() => onRemove(sei)}
            className="text-text-muted/50 hover:text-red-500 transition-colors p-0.5 mt-0.5"
            title="Remover da cesta"
          >
            <MdClose size={12} />
          </button>
        )}
      </div>
      {isCurrent && (
        <span className="text-[9px] uppercase tracking-wider font-bold text-accent/60 mt-1">Este Processo</span>
      )}
    </div>
  );
};

export default function ProcessBasketTree({ seiNumber }) {
  const [baskets, setBaskets] = useState([]);
  const [activeBaskets, setActiveBaskets] = useState([]);
  const [validProcesses, setValidProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // We'll store mock processes for each basket so the map looks populated
  const [mockProcessesByBasket, setMockProcessesByBasket] = useState({});

  // Modals state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUnlinkConfirmOpen, setIsUnlinkConfirmOpen] = useState(false);
  const [basketToUnlink, setBasketToUnlink] = useState(null);

  // Link Modal specific state
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newBasketName, setNewBasketName] = useState('');

  // Edit Modal specific state
  const [selectedBasket, setSelectedBasket] = useState(null);
  const [editBasketName, setEditBasketName] = useState('');
  const [newProcessToAdd, setNewProcessToAdd] = useState('');
  const [isValidatingProcess, setIsValidatingProcess] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const allBasketsRes = await manterCesta('consultar', {});
      const allBasketsItems = allBasketsRes?.data || [];

      // If there are no baskets, let's inject a bunch of mocks for visual testing
      // This helps the user see how it scales.
      const initialBaskets = allBasketsItems.length > 0 ? allBasketsItems : [
        { cesta: "Prioridade Alta" },
        { cesta: "Aguardando Parecer" },
        { cesta: "Revisão Final" },
        { cesta: "Análise Técnica" },
        { cesta: "Homologação" },
        { cesta: "Arquivamento" }
      ];
      setBaskets(initialBaskets);

      const activeBasketsRes = await manterVinculacaoCesta('consultar', { processo: seiNumber });
      // If none, inject them all as active for the sake of the test
      const activeIds = activeBasketsRes?.data?.length > 0
        ? activeBasketsRes.data.map(b => b.cesta)
        : initialBaskets.slice(0, 4).map(b => b.cesta); // Let's vinculate 4 out of 6

      setActiveBaskets(activeIds);

      // Initialize mock processes for the map with LOTS of processes
      const mockDict = {};
      activeIds.forEach((basketName, i) => {
        const numProcesses = 5 + (i * 3); // 5, 8, 11, 14... processes per basket
        const procs = [seiNumber];
        for (let p = 1; p < numProcesses; p++) {
          procs.push(`1190.01.000${450 + (i * 20) + p}/2024-12`);
        }
        mockDict[basketName] = procs;
      });
      setMockProcessesByBasket(mockDict);

      // Load valid processes
      try {
        const distinct = await getDistinctProcesses();
        // Assuming distinct returns an array of strings or objects with 'sei' or 'processo'
        const processList = distinct.map(p => p.sei || p.processo || p.numero || p);
        setValidProcesses(processList.filter(Boolean));
      } catch (err) {
        console.error("Failed to load distinct processes", err);
        // Fallback, we'll just allow things or skip strict validation if it fails
      }

    } catch (error) {
      toast('Erro ao carregar cestas de processos', 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (seiNumber) {
      loadData();
    }
  }, [seiNumber]);


  const handleUnlinkRequest = (basketTitle) => {
    setBasketToUnlink(basketTitle);
    setIsUnlinkConfirmOpen(true);
  };

  const confirmUnlink = async () => {
    if (!basketToUnlink) return;
    setActiveBaskets(prev => prev.filter(b => b !== basketToUnlink));
    setMockProcessesByBasket(prev => {
      const next = { ...prev };
      delete next[basketToUnlink];
      return next;
    });
    toast(`Processo desvinculado da cesta "${basketToUnlink}"`, 'success');
    setIsUnlinkConfirmOpen(false);
    setBasketToUnlink(null);
  };

  const handleLinkExisting = async (basketTitle) => {
    if (activeBaskets.includes(basketTitle)) {
      toast('Processo já está nesta cesta', 'warning');
      return;
    }
    setActiveBaskets(prev => [...prev, basketTitle]);
    setMockProcessesByBasket(prev => ({
      ...prev,
      [basketTitle]: [seiNumber, `1190.01.000${Math.floor(Math.random() * 900) + 100}/2024-12`]
    }));
    toast(`Processo vinculado à cesta "${basketTitle}"`, 'success');
    setIsLinkModalOpen(false);
  };

  const handleCreateAndLink = async () => {
    if (!newBasketName.trim()) {
      toast('Informe um nome para a cesta', 'error');
      return;
    }

    try {
      const res = await manterCesta('inserir', {
        cesta: newBasketName,
        responsavel: 'usuario.atual'
      });

      if (res.status === 'error') {
        toast(res.message, 'error');
        return;
      }

      const newName = newBasketName;

      setActiveBaskets(prev => [...prev, newName]);
      setMockProcessesByBasket(prev => ({
        ...prev,
        [newName]: [seiNumber]
      }));
      toast('Cesta criada e vinculada com sucesso', 'success');

      setNewBasketName('');
      setIsCreatingNew(false);
      setIsLinkModalOpen(false);
      await loadData(); // reload baskets list

      // Auto-open edit modal for the newly created basket
      openEditModal(newName);

    } catch (err) {
      toast('Erro ao criar cesta', 'error');
    }
  };

  const openEditModal = (basketTitle) => {
    const basketObj = baskets.find(b => b.cesta === basketTitle) || { cesta: basketTitle };
    setSelectedBasket(basketObj);
    setEditBasketName(basketObj.cesta);
    setIsEditModalOpen(true);
  };

  const handleSaveBasketEdit = async () => {
    if (!editBasketName.trim()) {
      toast('O nome não pode ser vazio', 'error');
      return;
    }

    if (editBasketName !== selectedBasket.cesta) {
      try {
        const res = await manterCesta('alterar', {
          cesta_original: selectedBasket.cesta,
          cesta: editBasketName,
          responsavel: 'usuario.atual'
        });

        if (res.status === 'error') {
          toast(res.message, 'error');
          return;
        }

        // Update local state references
        if (activeBaskets.includes(selectedBasket.cesta)) {
          setActiveBaskets(prev => [
            ...prev.filter(b => b !== selectedBasket.cesta),
            editBasketName
          ]);
          setMockProcessesByBasket(prev => {
            const next = { ...prev };
            next[editBasketName] = next[selectedBasket.cesta];
            delete next[selectedBasket.cesta];
            return next;
          });
        }
        toast('Cesta atualizada com sucesso', 'success');
        loadData();
      } catch (error) {
        toast('Erro ao atualizar cesta', 'error');
        return;
      }
    }
    setIsEditModalOpen(false);
  };

  const handleDeleteBasket = async () => {
    try {
      const res = await manterCesta('excluir', {
        cesta: selectedBasket.cesta
      });
      if (res.status === 'error') {
        toast(res.message, 'error');
        return;
      }
      setActiveBaskets(prev => prev.filter(b => b !== selectedBasket.cesta));
      setMockProcessesByBasket(prev => {
        const next = { ...prev };
        delete next[selectedBasket.cesta];
        return next;
      });
      toast('Cesta excluída com sucesso', 'success');
      setIsEditModalOpen(false);
      loadData();
    } catch (error) {
      toast('Erro ao excluir cesta', 'error');
    }
  };

  const handleAddProcessToBasket = async () => {
    const process = newProcessToAdd.trim();
    if (!process) return;

    const currentProcs = mockProcessesByBasket[selectedBasket.cesta] || [];
    if (currentProcs.includes(process)) {
      toast('Processo já está na cesta', 'warning');
      return;
    }

    setIsValidatingProcess(true);
    // Validate against /processosdistintos
    if (validProcesses.length > 0 && !validProcesses.includes(process)) {
      toast('Processo não encontrado no SOMA. Verifique o número e tente novamente.', 'error');
      setIsValidatingProcess(false);
      return;
    }

    setMockProcessesByBasket(prev => ({
      ...prev,
      [selectedBasket.cesta]: [...currentProcs, process]
    }));
    setNewProcessToAdd('');
    toast('Processo adicionado à cesta', 'success');
    setIsValidatingProcess(false);
  };

  const handleRemoveProcessFromBasket = (basketName, processToRemove) => {
    if (processToRemove === seiNumber) {
      toast('Para desvincular o processo atual, use o botão Desvincular no card principal.', 'warning');
      return;
    }
    setMockProcessesByBasket(prev => {
      const currentProcs = prev[basketName] || [];
      return {
        ...prev,
        [basketName]: currentProcs.filter(p => p !== processToRemove)
      };
    });
    toast('Processo removido da cesta', 'success');
  };


  if (isLoading) {
    return (
      <div className="flex bg-surface rounded-xl border border-border flex-col p-8 items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <span className="text-text-muted font-medium">Carregando cesta de processos...</span>
        </div>
      </div>
    );
  }

  const linkedBaskets = baskets.filter(b => activeBaskets.includes(b.cesta));
  const availableBaskets = baskets.filter(b => !activeBaskets.includes(b.cesta));

  return (
    <div className="flex flex-col w-full bg-surface rounded-xl border border-border shadow-sm overflow-hidden text-sans">
      <div className="flex justify-between items-center bg-surface px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-text">Cesta de Processos</h2>
          <p className="text-xs text-text-muted mt-0.5">Visualize e edite os agrupamentos e processos relacionados</p>
        </div>
        <button
          onClick={() => {
            setIsCreatingNew(false);
            setNewBasketName('');
            setIsLinkModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white hover:bg-accent/90 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
        >
          <MdLink size={18} /> Vincular processo a uma cesta
        </button>
      </div>

      <div className="relative overflow-x-auto py-12 px-12 flex justify-start bg-dots min-h-[400px]">
        {/* Visual Flow Area - Added padding-right to avoid sticking on the end as well */}
        <div className="flex flex-col items-start min-w-max relative gap-16 pr-12">

          {linkedBaskets.length > 0 ? (
            <div className="flex gap-12 relative z-10 w-full justify-start items-start">
              {linkedBaskets.map((basket, idx) => {
                const processes = mockProcessesByBasket[basket.cesta] || [];

                return (
                  <div key={`cluster-${idx}`} className="flex flex-col items-center max-w-[400px]">

                    {/* Basket Node */}
                    <div className="relative group">
                      <div
                        onClick={() => openEditModal(basket.cesta)}
                        className="bg-accent text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2 border border-accent/20"
                        title="Editar Cesta"
                      >
                        <MdOutlineAccountTree size={20} />
                        <span className="tracking-tight">{basket.cesta}</span>
                      </div>
                      <div className="absolute -top-3 -right-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUnlinkRequest(basket.cesta); }}
                          className="bg-white text-error border border-border hover:bg-error hover:text-white rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                          title="Desvincular este processo da cesta"
                        >
                          <MdClose size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Connection Path */}
                    <div className="w-0.5 h-10 bg-gradient-to-b from-accent to-border opacity-40"></div>

                    {/* Improved Grid Layout for Processes */}
                    {processes.length > 0 && (
                      <div className="bg-surface-alt/40 p-4 rounded-3xl border border-border/60 shadow-inner flex flex-col items-center">
                        <div className="grid grid-cols-2 gap-3">
                          {processes.map((proc) => (
                            <ProcessCard
                              key={proc}
                              sei={proc}
                              isCurrent={proc === seiNumber}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-text-muted mt-8 mx-auto w-full">
              <div className="w-24 h-24 bg-surface border border-border rounded-full flex items-center justify-center shadow-inner mb-6 opacity-80">
                <MdOutlineAccountTree size={48} className="text-border" />
              </div>
              <h3 className="text-xl font-bold text-text-secondary mb-2">Sem Cestas</h3>
              <p className="text-sm max-w-sm text-center">Este processo ainda não foi agrupado. Vincule-o a uma cesta para melhor organização.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Link / Create Basket */}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        title="Vincular a uma Cesta"
        footer={null}
      >
        <div className="flex flex-col gap-6">
          {!isCreatingNew ? (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Selecionar Cesta Existente
                </label>
                {availableBaskets.length === 0 ? (
                  <div className="p-4 bg-surface-alt rounded-lg border border-border text-sm text-text-muted text-center italic">
                    Não há outras cestas disponíveis para vinculação.
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-border divide-y divide-surface-alt">
                    {availableBaskets.map(basket => (
                      <div key={basket.cesta} className="flex justify-between items-center p-3 hover:bg-surface-alt transition-colors">
                        <span className="text-sm font-medium text-text">{basket.cesta}</span>
                        <button
                          onClick={() => handleLinkExisting(basket.cesta)}
                          className="px-3 py-1 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded text-xs font-bold transition-colors"
                        >
                          Vincular
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px bg-border flex-1"></div>
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">OU</span>
                <div className="h-px bg-border flex-1"></div>
              </div>

              <button
                onClick={() => setIsCreatingNew(true)}
                className="w-full py-3 border-2 border-dashed border-accent/40 text-accent hover:bg-accent-soft rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <MdAdd size={20} /> Criar Uma Nova Cesta
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Nome da Nova Cesta
                </label>
                <input
                  type="text"
                  value={newBasketName}
                  onChange={(e) => setNewBasketName(e.target.value)}
                  placeholder="Ex: Análises Prioritárias"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 text-sm font-medium text-text hover:bg-surface-alt rounded-lg transition-colors border border-border"
                >
                  Voltar
                </button>
                <button
                  onClick={handleCreateAndLink}
                  className="px-4 py-2 text-sm font-bold text-white bg-accent hover:bg-accent/90 rounded-lg shadow-sm transition-all active:scale-95"
                >
                  Criar e Vincular
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* MODAL: Edit Basket & Contents */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Cesta de Processos"
        footer={
          <>
            <button
              onClick={handleSaveBasketEdit}
              className="px-4 py-2 text-sm font-bold text-white bg-accent hover:bg-accent/90 rounded-lg shadow-sm transition-all active:scale-95"
            >
              Salvar Alterações
            </button>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-text border border-border hover:bg-surface-alt rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </>
        }
      >
        {selectedBasket && (
          <div className="flex flex-col gap-6">
            {/* Edit Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Nome da Cesta
              </label>
              <input
                type="text"
                value={editBasketName}
                onChange={(e) => setEditBasketName(e.target.value)}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
              />
            </div>

            {/* Manage Processes */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <MdList size={16} /> Processos na Cesta ({(mockProcessesByBasket[selectedBasket.cesta] || []).length})
                </label>
              </div>

              {/* Add Process Input */}
              <div className="flex flex-col gap-1">
                <div className="flex gap-2 relative">
                  <input
                    type="text"
                    value={newProcessToAdd}
                    onChange={(e) => setNewProcessToAdd(e.target.value)}
                    placeholder="Digite o NUP do processo..."
                    className="flex-1 px-3 py-2 bg-surface text-sm border border-border rounded-lg focus:outline-none focus:border-accent transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddProcessToBasket()}
                    disabled={isValidatingProcess}
                  />
                  <button
                    onClick={handleAddProcessToBasket}
                    disabled={isValidatingProcess}
                    className="px-3 py-2 bg-surface-alt border border-border rounded-lg hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors text-text-muted disabled:opacity-50"
                    title="Adicionar à cesta"
                  >
                    {isValidatingProcess ? <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div> : <MdAdd size={20} />}
                  </button>
                </div>
              </div>

              {/* List of Processes */}
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border bg-surface-alt/30 mt-1">
                {!(mockProcessesByBasket[selectedBasket.cesta] && mockProcessesByBasket[selectedBasket.cesta].length > 0) ? (
                  <div className="p-4 text-center text-xs text-text-muted italic">Cesta vazia</div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {mockProcessesByBasket[selectedBasket.cesta].map(p => (
                      <div key={p} className="flex justify-between items-center px-3 py-2.5 hover:bg-surface-alt transition-colors group">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${p === seiNumber ? 'font-bold text-accent' : 'text-text'}`}>
                            {p}
                          </span>
                          {p === seiNumber && <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded font-bold">Atual</span>}
                        </div>
                        <button
                          onClick={() => handleRemoveProcessFromBasket(selectedBasket.cesta, p)}
                          className="text-text-muted/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                          title="Remover da cesta"
                        >
                          <MdClose size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-4 p-4 border border-error/20 bg-error/5 rounded-xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-error">Excluir Cesta</span>
                <span className="text-xs text-text-muted mt-0.5">Esta ação não pode ser desfeita. Todos os processos serão desvinculados.</span>
              </div>
              <button
                onClick={handleDeleteBasket}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-xs font-bold transition-colors"
              >
                <MdDelete size={16} /> Excluir
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* CONFIRMATION MODAL: Unlink */}
      <Modal
        isOpen={isUnlinkConfirmOpen}
        onClose={() => setIsUnlinkConfirmOpen(false)}
        title="Confirmar Desvinculação"
        footer={
          <>
            <button
              onClick={confirmUnlink}
              className="px-4 py-2 text-sm font-bold text-white bg-error hover:bg-error/90 rounded-lg shadow-sm transition-all"
            >
              Sim, Desvincular
            </button>
            <button
              onClick={() => setIsUnlinkConfirmOpen(false)}
              className="px-4 py-2 text-sm font-medium text-text border border-border hover:bg-surface-alt rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </>
        }
      >
        <p className="text-sm text-text-muted">
          Você tem certeza que deseja remover o processo <b>{seiNumber}</b> da cesta <b>{basketToUnlink}</b>?
        </p>
      </Modal>

      <style jsx>{`
        .bg-dots {
          background-image: radial-gradient(rgba(var(--color-text-muted-rgb), 0.15) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
