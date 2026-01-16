'use client'

import { useState } from 'react'
import useTabStore from '@/store/useTabStore'

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
  MdWarning
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

export default function Navbar() {
  const { tabs, activeTabId, switchTab, closeTab, openTab, reorderTabs } = useTabStore()

  const handleTabClick = (tabId) => {
    switchTab(tabId)
  }

  const [tabIdToClose, setTabIdToClose] = useState(null)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false)

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

  const isHomeActive = activeTabId === 'home'

  return (
    <nav className="bg-surface border-b border-border flex items-center h-12 px-2 gap-0 overflow-hidden">
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
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar"
            className="pl-9 pr-3 py-1.5 text-sm border border-border rounded-lg 
                     bg-surface focus:outline-none focus:ring-2 focus:ring-accent 
                     focus:border-transparent w-56 text-text placeholder:text-text-muted shadow-sm"
          />
          <MdSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
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