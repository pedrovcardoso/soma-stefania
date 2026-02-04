'use client'

import React, { useState, useRef, useEffect } from 'react'
import useTabStore from '@/store/useTabStore'
import { getDistinctProcesses } from '@/services/seiService'

import {
  MdClose,
  MdHome,
  MdGridView,
  MdDescription,
  MdSearch,
  MdSettings,
  MdNotifications,
  MdBarChart,
  MdLanguage,
  MdChat,
  MdFavorite,
  MdAddToPhotos,
  MdWarning,
  MdAdd,
  MdFolder
} from 'react-icons/md'
import Modal from '@/components/ui/Modal'

const getTabIcon = (type, title) => {
  if (type === 'home') return MdHome
  if (type === 'dashboard') return MdBarChart
  if (type === 'sei_list') return MdLanguage
  if (type === 'sei_detail') return MdGridView
  if (type === 'doc_list') return MdDescription
  if (type === 'doc_detail') return MdDescription
  if (type === 'stefania') return MdChat
  if (type === 'favorites') return MdFavorite
  if (type === 'action_plans') return MdAddToPhotos
  if (type === 'settings') return MdSettings

  return MdDescription
}

const ImportProcessModal = ({ isOpen, onClose, onConfirm, initialValue = '' }) => {
  const [newSeiNumber, setNewSeiNumber] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setNewSeiNumber(initialValue);
  }, [isOpen, initialValue]);

  const handleConfirm = async () => {
    if (!newSeiNumber.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(newSeiNumber.trim());
      setNewSeiNumber('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Importar Novo Processo SEI"
      footer={
        <>
          <button
            type="button"
            disabled={!newSeiNumber.trim() || isSubmitting}
            className="px-4 py-2 text-sm font-bold text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-md disabled:opacity-50 min-w-[140px]"
            onClick={handleConfirm}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processando...</span>
              </div>
            ) : (
              'Confirmar e Editar'
            )}
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-alt rounded-lg transition-colors"
            onClick={onClose}
          >
            Cancelar
          </button>
        </>
      }
    >
      <div className="mt-2">
        <p className="text-sm text-text-secondary mb-4">
          Informe o número do processo SEI para iniciar a importação. O sistema tentará buscar as informações básicas e tags do SEI.
        </p>
        <input
          type="text"
          placeholder="Ex: 1190.01.000450/2024-12"
          value={newSeiNumber}
          onChange={(e) => setNewSeiNumber(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          className="w-full h-12 px-4 text-sm border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none bg-surface text-text"
          autoFocus
        />
      </div>
    </Modal>
  );
};

export default function Navbar() {
  const { tabs, activeTabId, switchTab, closeTab, openTab, reorderTabs } = useTabStore()

  const handleTabClick = (tabId) => {
    switchTab(tabId)
  }

  const [tabIdToClose, setTabIdToClose] = useState(null)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false)

  // Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const searchContainerRef = useRef(null)

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation()
    const tab = tabs.find(t => t.id === tabId)
    if (tab?.hasUnsavedChanges) {
      setTabIdToClose(tabId)
      setIsDiscardModalOpen(true)
    } else {
      closeTab(tabId)
    }
  }

  const confirmCloseTab = () => {
    if (tabIdToClose) {
      closeTab(tabIdToClose)
      setIsDiscardModalOpen(false)
      setTabIdToClose(null)
    }
  }

  const handleHomeClick = () => {
    switchTab('home')
  }

  const [draggedTabId, setDraggedTabId] = useState(null)
  const [dragOverTabId, setDragOverTabId] = useState(null)

  const handleDragStart = (e, tabId) => {
    setDraggedTabId(tabId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', tabId)
  }

  const handleDragOver = (e, tabId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedTabId && draggedTabId !== tabId) {
      setDragOverTabId(tabId)
    }
  }

  const handleDragLeave = () => {
    setDragOverTabId(null)
  }

  const handleDrop = (e, targetTabId) => {
    e.preventDefault()
    if (draggedTabId && draggedTabId !== targetTabId) {
      const draggedIndex = tabs.findIndex(t => t.id === draggedTabId)
      const targetIndex = tabs.findIndex(t => t.id === targetTabId)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newTabs = [...tabs]
        const [removed] = newTabs.splice(draggedIndex, 1)
        newTabs.splice(targetIndex, 0, removed)

        if (reorderTabs) reorderTabs(newTabs)
      }
    }
    setDraggedTabId(null)
    setDragOverTabId(null)
  }

  const handleDragEnd = () => {
    setDraggedTabId(null)
    setDragOverTabId(null)
  }

  // Search Logic
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setShowResults(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      // Fetch distinct processes
      // stefaniaService.getDistinctProcesses() returns the data array directly
      const processes = await getDistinctProcesses();

      const list = Array.isArray(processes) ? processes : [];

      // Filter logic: Regex digits only
      const cleanQuery = query.replace(/\D/g, ''); // Remove non-digits

      const filtered = list.filter(p => {
        if (!p.sei) return false;
        const cleanSei = p.sei.replace(/\D/g, '');
        return cleanSei.includes(cleanQuery);
      });

      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching processes:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImportConfirm = (seiNumber) => {
    openTab({
      id: `new-${seiNumber}`,
      type: 'sei_detail',
      title: 'Novo Processo',
      data: {
        isNew: true,
        seiNumber: seiNumber
      }
    });
    setIsImportModalOpen(false);
    setShowResults(false);
    setSearchQuery('');
  }

  const openProcessTab = (process) => {
    // Assuming process object has 'sei' and maybe 'id'
    // This part depends on how sei_detail expects data.
    // SeiListView passesseiNumber via handleRowClick -> openTab
    openTab({
      id: `sei-${process.sei}`,
      type: 'sei_detail',
      title: process.sei,
      data: {
        seiNumber: process.sei,
        ...process
      }
    });
    setShowResults(false);
    setSearchQuery('');
  }

  // Click outside listener for search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const isHomeActive = activeTabId === 'home'

  return (
    <nav className="bg-surface border-b border-border flex items-center h-12 px-2 gap-0 relative">
      <button
        onClick={handleHomeClick}
        className={`p-2 rounded transition-colors flex-shrink-0 mr-1 text-text-muted hover:bg-surface-alt/80`}
        aria-label="Home"
      >
        <MdHome className={`w-5 h-5 mt-0.5 ${isHomeActive ? 'text-accent' : 'text-text-muted'}`} />
      </button>
      <div className="w-px h-6 bg-border mx-1 flex-shrink-0 mt-2" />
      <div className="flex items-center flex-1 min-w-0 h-full overflow-hidden">
        {tabs.map((tab, index) => {
          const isActive = activeTabId === tab.id
          const Icon = getTabIcon(tab.type, tab.title)
          const isDragging = draggedTabId === tab.id
          const isDragOver = dragOverTabId === tab.id

          return (
            <div
              key={tab.id}
              className={`flex h-10 mt-2 transition-all duration-200 ease-in-out relative group/tab flex-shrink
                ${isActive ? 'min-w-[120px] flex-[0_1_200px]' : 'min-w-[32px] flex-[0_1_200px]'}
              `}
            >
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, tab.id)}
                onDragOver={(e) => handleDragOver(e, tab.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, tab.id)}
                onDragEnd={handleDragEnd}
                onClick={() => handleTabClick(tab.id)}
                className={`
                  flex items-center gap-0 px-3 py-2 cursor-pointer h-full w-full
                  transition-all duration-200 ease-out relative overflow-hidden
                  ${isActive
                    ? 'bg-surface-alt border-t border-l border-r border-border rounded-t-lg shadow-sm z-10'
                    : 'bg-transparent hover:bg-surface rounded-t-lg z-0'
                  }
                  ${isDragging ? 'opacity-50 cursor-move' : ''}
                  ${isDragOver ? 'border-l-2 border-accent' : ''}
                `}
                style={{
                  minHeight: '32px',
                  alignItems: 'center',
                }}
              >
                <div className="relative w-5 h-5 flex-shrink-0 flex items-center justify-center mr-2">
                  <Icon
                    className={`w-4 h-4 transition-opacity duration-200
                      ${isActive ? 'text-accent' : 'text-text-muted'}
                      group-hover/tab:opacity-0
                    `}
                  />
                  <button
                    onClick={(e) => handleCloseTab(e, tab.id)}
                    className={`absolute inset-0 flex items-center justify-center rounded transition-all duration-200
                      opacity-0 group-hover/tab:opacity-100 hover:bg-surface-alt
                      ${isActive ? 'text-text' : 'text-text-muted'}
                    `}
                    aria-label="Close tab"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <MdClose size={14} />
                  </button>
                </div>

                <span className={`text-sm truncate leading-tight flex-1 ${isActive ? 'font-medium text-text' : 'text-text-muted'}`}>
                  {tab.title}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-4 px-2">
        <div className="relative" ref={searchContainerRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar SEI"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) {
                  setShowResults(true);
                  if (searchResults.length === 0 && !isSearching) handleSearch(searchQuery);
                }
              }}
              className="pl-9 pr-8 py-1.5 text-sm border border-border rounded-lg
                       bg-surface focus:outline-none focus:ring-2 focus:ring-accent
                       focus:border-transparent w-56 text-text placeholder:text-text-muted shadow-sm"
            />
            <MdSearch
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowResults(false);
                }}
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text transition-colors p-0.5 rounded-full hover:bg-surface-alt"
              >
                <MdClose size={14} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-1 duration-200">
              <div className="max-h-[300px] overflow-y-auto p-1 text-text custom-scrollbar">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center p-6 text-text-muted gap-2">
                    <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-medium">Buscando...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((proc, idx) => (
                    <button
                      key={`${proc.sei}-${idx}`}
                      onClick={() => openProcessTab(proc)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-surface-alt rounded-lg transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-200 transition-colors">
                        <MdFolder size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text truncate group-hover:text-accent">{proc.sei}</div>
                        {proc.descricao && <div className="text-xs text-text-muted truncate">{proc.descricao}</div>}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 flex flex-col items-center justify-center text-center gap-2">
                    <p className="text-sm text-text-muted">Nenhum processo encontrado.</p>
                    <button
                      onClick={() => setIsImportModalOpen(true)}
                      className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-xs font-bold transition-colors"
                    >
                      <MdAdd size={14} /> Importar "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => openTab({ id: 'settings', type: 'settings', title: 'Configurações' })}
          className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
        >
          <MdSettings className="w-5 h-5 text-text-secondary" />
        </button>
        <button className="p-2 hover:bg-surface-alt rounded-lg transition-colors">
          <MdNotifications className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <ImportProcessModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirm={handleImportConfirm}
        initialValue={searchQuery}
      />

      <Modal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        title="Descartar Alterações"
        footer={
          <>
            <button
              onClick={confirmCloseTab}
              className="px-4 py-2 text-sm font-bold text-white bg-error hover:bg-error/90 rounded-lg shadow-sm transition-all active:scale-95"
            >
              Sim, descartar
            </button>
            <button
              onClick={() => setIsDiscardModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-text hover:bg-surface-alt rounded-lg transition-colors"
            >
              Continuar editando
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
              Você tem alterações não salvas. Tem certeza que deseja descartá-las?
            </p>
            <p className="text-xs text-text-secondary mt-2">
              Isso apagará todas as modificações feitas nessa página.
            </p>
          </div>
        </div>
      </Modal>
    </nav>
  )
}