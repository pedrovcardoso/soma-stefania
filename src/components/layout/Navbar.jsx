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
  MdAddToPhotos
} from 'react-icons/md'

const getTabIcon = (type, title) => {
  // Mapeamento baseado no 'type' da arquitetura SOMA
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

  return MdDescription // Ícone padrão (Documento)
}

export default function Navbar() {
  // 'addTab' renomeado para 'openTab' conforme a Store
  // 'reorderTabs' deve ser adicionado ao Store para o D&D funcionar
  const { tabs, activeTabId, switchTab, closeTab, openTab, reorderTabs } = useTabStore()

  const handleTabClick = (tabId) => {
    switchTab(tabId)
  }

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation()
    closeTab(tabId)
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

        // Verifica se a função existe na store antes de chamar
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

  // Define se a Home está ativa
  const isHomeActive = activeTabId === 'home'

  return (
    <nav className="bg-white border-b border-gray-200 flex items-center h-12 px-2 gap-0 overflow-hidden">
      <button
        onClick={handleHomeClick}
        className={`p-2 rounded transition-colors flex-shrink-0 mr-1 text-gray-600 hover:bg-gray-100'`}
        aria-label="Home"
      >
        <MdHome className={`w-5 h-5 mt-0.5 ${isHomeActive ? 'text-blue-700' : 'text-gray-600'}`} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0 mt-2" />
      <div className="flex items-center flex-1 min-w-0 h-full overflow-hidden">
        {tabs.map((tab, index) => {
          const isActive = activeTabId === tab.id
          // Passamos tab.type em vez de tab.path
          const Icon = getTabIcon(tab.type, tab.title)
          const isLast = index === tabs.length - 1
          const isDragging = draggedTabId === tab.id
          const isDragOver = dragOverTabId === tab.id
          const prevTab = index > 0 ? tabs[index - 1] : null
          const prevTabIsActive = prevTab ? activeTabId === prevTab.id : false

          return (
            <div
              key={tab.id}
              className={`flex h-10 mt-2 transition-all duration-200 ease-in-out relative group/tab flex-shrink
                ${isActive ? 'min-w-[120px] flex-[0_1_200px]' : 'min-w-[32px] flex-[0_1_200px]'}
              `}
            >
              {!isActive && !prevTabIsActive && index > 0 && (
                <div className="w-px h-6 bg-gray-300 absolute left-0 top-1/2 -translate-y-1/2 z-0" />
              )}
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
                    ? 'bg-white border-t border-l border-r border-gray-200 shadow-sm tab-active z-10'
                    : 'bg-transparent hover:bg-gray-100 rounded-t-lg z-0'
                  }
                  ${isDragging ? 'opacity-50 cursor-move' : ''}
                  ${isDragOver ? 'border-l-2 border-blue-500' : ''}
                `}
                style={{
                  minHeight: '32px',
                  alignItems: 'center',
                }}
              >
                {/* Icon Container */}
                <div className="relative w-5 h-5 flex-shrink-0 flex items-center justify-center mr-2">
                  <Icon
                    className={`w-4 h-4 transition-opacity duration-200
                      ${isActive ? 'text-blue-800' : 'text-gray-500'}
                      group-hover/tab:opacity-0
                    `}
                  />
                  {/* Close button that always overlays icon on hover for any tab */}
                  <button
                    onClick={(e) => handleCloseTab(e, tab.id)}
                    className={`absolute inset-0 flex items-center justify-center rounded transition-all duration-200
                      opacity-0 group-hover/tab:opacity-100 hover:bg-gray-200/80
                      ${isActive ? 'text-gray-600' : 'text-gray-400'}
                    `}
                    aria-label="Close tab"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <MdClose size={14} />
                  </button>
                </div>

                <span className={`text-sm truncate leading-tight flex-1 ${isActive ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                  {tab.title}
                </span>
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
            className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg 
                     bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 
                     focus:border-transparent w-56"
          />
          <MdSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <button
          onClick={() => openTab({ id: 'settings', type: 'settings', title: 'Configurações' })}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <MdSettings className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
          <MdNotifications className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </nav>
  )
}