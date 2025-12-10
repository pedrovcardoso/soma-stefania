'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import useTabStore from '@/store/useTabStore'
import useSidebarStore from '@/store/useSidebarStore'
import useHistoryStore from '@/store/useHistoryStore'
import {
  MdBarChart,
  MdLanguage,
  MdDescription,
  MdChat,
  MdFavorite,
  MdAddToPhotos,
  MdPushPin
} from 'react-icons/md'

const menuItems = [
  { id: 'dashboard', title: 'Dashboard', icon: MdBarChart, path: '/dashboard' },
  { id: 'sei', title: 'Processos SEI', icon: MdLanguage, path: '/sei' },
  { id: 'documents', title: 'Documentos', icon: MdDescription, path: '/documents' },
  { id: 'stefania', title: 'StefanIA', icon: MdChat, path: '/stefania' },
  { id: 'favorites', title: 'Favoritos', icon: MdFavorite, path: '/favorites' },
  { id: 'action-plans', title: 'Planos de ação', icon: MdAddToPhotos, path: '/action-plans' },
]

const MAX_VISIBLE_RECENT = 10

export default function Sidebar() {
  const addTab = useTabStore((state) => state.addTab)
  const activeTabId = useTabStore((state) => state.activeTabId)
  const sidebarWidth = useSidebarStore((state) => state.sidebarWidth)
  const setSidebarWidth = useSidebarStore((state) => state.setSidebarWidth)
  const { historyItems, togglePin } = useHistoryStore()

  // Filter and Sort Logic
  const recentAccesses = historyItems
    .filter(item => {
      // Filter out main menu items if they appear in history (e.g. Dashboard, Favorites)
      // Only show SEI processes or Documents
      const isSei = item.path?.startsWith('/sei') || (item.id && item.id.toString().startsWith('sei-'));
      const isDoc = item.path?.startsWith('/documents');
      return isSei || isDoc;
    })
    .sort((a, b) => {
      // Pinned first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Then by date
      return new Date(b.accessedAt) - new Date(a.accessedAt);
    });
  const [visibleRecentCount, setVisibleRecentCount] = useState(MAX_VISIBLE_RECENT)
  const recentSectionRef = useRef(null)
  const sidebarRef = useRef(null)
  const resizerRef = useRef(null)
  const [hasMore, setHasMore] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return;
    const calculateVisibleItems = () => {
      if (!recentSectionRef.current) return

      const container = recentSectionRef.current
      const menuItemsEl = container.querySelector('.menu-items')
      const recentHeaderEl = container.querySelector('.recent-header')
      const recentListEl = container.querySelector('.recent-list')

      if (!menuItemsEl || !recentHeaderEl) return

      const containerHeight = container.clientHeight
      const menuHeight = menuItemsEl.scrollHeight
      const headerHeight = recentHeaderEl.clientHeight + 12
      const footerHeight = 100

      const availableHeight = containerHeight - menuHeight - headerHeight - footerHeight - 20
      const itemHeight = 50
      const maxFit = Math.max(1, Math.floor(availableHeight / itemHeight))

      const maxToShow = Math.min(MAX_VISIBLE_RECENT, maxFit, recentAccesses.length)
      setVisibleRecentCount(maxToShow)
      setHasMore(recentAccesses.length > maxToShow)
    }

    const timeoutId = setTimeout(calculateVisibleItems, 100)
    window.addEventListener('resize', calculateVisibleItems)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', calculateVisibleItems)
    }
  }, [sidebarWidth, recentAccesses])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return

      const newWidth = e.clientX
      if (newWidth >= 180 && newWidth <= 500) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, setSidebarWidth])

  const handleMenuClick = (item) => {
    addTab({
      id: item.id,
      title: item.title,
      path: item.path,
    })
  }

  const handleRecentClick = (access) => {
    addTab({
      id: access.id,
      title: access.title || access.process, // Fallback for backward compatibility
      path: access.path,
    })
  }

  const handlePinClick = (e, accessId) => {
    e.stopPropagation()
    togglePin(accessId)
  }

  const handleViewMore = () => {
    addTab({
      id: 'history',
      title: 'Histórico',
      path: '/history',
    })
  }

  const handleResizerMouseDown = (e) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const visibleRecentAccesses = mounted ? recentAccesses.slice(0, visibleRecentCount) : []

  return (
    <div className="relative flex-shrink-0" style={{ width: `${sidebarWidth}px` }}>
      <aside
        ref={sidebarRef}
        className="h-full flex flex-col overflow-hidden bg-white border-r border-gray-200"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-white">
          <Image
            src="/logo.png"
            alt="SEF Logo"
            width={120}
            height={40}
            className="mb-2"
            priority
          />
          <p className="text-xs text-gray-600 leading-tight truncate">Secretaria de Estado de Fazenda</p>
        </div>
        <nav ref={recentSectionRef} className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="menu-items flex-shrink-0 py-3 px-2 overflow-hidden">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTabId === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg 
                             text-left transition-all duration-200 min-w-0 relative
                             ${isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium truncate flex-1">{item.title}</span>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col border-t border-gray-200 mx-2 mt-4 pt-4">
            <h3 className="recent-header px-3 text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wide flex-shrink-0">
              Acessos recentes
            </h3>
            <div className="recent-list overflow-y-auto space-y-0.5 flex-1 min-h-0">
              {visibleRecentAccesses.map((access) => (
                <div
                  key={access.id}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg 
                             text-left text-gray-700 hover:bg-gray-50 transition-colors group min-w-0"
                >
                  <button
                    onClick={() => handleRecentClick(access)}
                    className="flex-1 min-w-0 pr-2 text-left"
                  >
                    <p className="text-xs font-medium truncate">{access.process}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{access.title}</p>
                  </button>
                  <button
                    onClick={(e) => handlePinClick(e, access.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                    aria-label={access.pinned ? 'Desafixar' : 'Fixar'}
                  >
                    <MdPushPin className={`w-3.5 h-3.5 transition-all ${access.pinned ? 'text-gray-600 opacity-100' : 'text-gray-300 opacity-40 group-hover:opacity-60'}`} />
                  </button>
                </div>
              ))}
              {hasMore && (
                <button
                  onClick={handleViewMore}
                  className="w-full flex items-center justify-center px-3 py-2 rounded-lg 
                             text-blue-600 hover:bg-gray-50 transition-colors mt-1"
                >
                  <span className="text-xs font-medium">Ver mais</span>
                </button>
              )}
            </div>
          </div>
        </nav>
        <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Image
              src="/avatar.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Pedro BI</p>
              <p className="text-xs text-gray-600 truncate">pedro.cardoso@fa...</p>
            </div>
          </div>
        </div>
      </aside>
      <div
        ref={resizerRef}
        onMouseDown={handleResizerMouseDown}
        className={`absolute right-0 top-0 h-full cursor-col-resize transition-all z-10 ${isResizing ? 'w-1 bg-gray-400' : 'w-0.5 bg-gray-300 hover:bg-gray-400'
          }`}
      />
    </div>
  )
}

