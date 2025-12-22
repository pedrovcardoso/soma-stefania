'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
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
  MdPushPin,
  MdSettings,
  MdLogout,
  MdExpandLess,
  MdExpandMore
} from 'react-icons/md'

const menuItems = [
  { id: 'dashboard', type: 'dashboard', title: 'Dashboard', icon: MdBarChart },
  { id: 'sei', type: 'sei_list', title: 'Processos SEI', icon: MdLanguage },
  { id: 'documents', type: 'doc_list', title: 'Documentos', icon: MdDescription },
  { id: 'stefania', type: 'stefania', title: 'StefanIA', icon: MdChat },
  { id: 'favorites', type: 'favorites', title: 'Favoritos', icon: MdFavorite },
  { id: 'action-plans', type: 'action_plans', title: 'Planos de ação', icon: MdAddToPhotos },
]

export default function Sidebar() {
  const openTab = useTabStore((state) => state.openTab)
  const activeTabId = useTabStore((state) => state.activeTabId)

  // Store checks
  const sidebarWidth = useSidebarStore((state) => state.sidebarWidth)
  const setSidebarWidth = useSidebarStore((state) => state.setSidebarWidth)

  const { recentAccesses, pinnedIds, togglePin } = useHistoryStore()

  // --- Logic for Visible Accesses (Preserved) ---
  const visibleAccesses = useMemo(() => {
    const uniqueMap = new Map();
    for (const item of recentAccesses) {
      if ((item.type === 'sei_detail' || item.type === 'doc_detail') && !uniqueMap.has(item.contentId)) {
        uniqueMap.set(item.contentId, {
          ...item,
          id: item.contentId,
          isFixed: pinnedIds.includes(item.contentId)
        });
      }
    }
    const uniqueList = Array.from(uniqueMap.values());
    return uniqueList.sort((a, b) => {
      if (a.isFixed && !b.isFixed) return -1;
      if (!a.isFixed && b.isFixed) return 1;
      return b.timestamp - a.timestamp;
    });
  }, [recentAccesses, pinnedIds]);

  const filteredAccesses = visibleAccesses;

  // --- Resize State & Refs ---
  const [maxVisibleItems, setMaxVisibleItems] = useState(0)
  const wrapperRef = useRef(null)
  const sidebarRef = useRef(null)
  const [isResizing, setIsResizing] = useState(false)

  // --- User Menu State ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  // --- Resize Calculation Logic ---
  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!wrapperRef.current) return

      const containerHeight = wrapperRef.current.clientHeight
      const itemHeight = 52 // Approx height of one item (36px text + padding)
      const viewMoreBtnHeight = 44 // Height of "Ver mais" button

      if (containerHeight <= 0) return

      const totalItemsHeight = filteredAccesses.length * itemHeight

      if (totalItemsHeight <= containerHeight) {
        setMaxVisibleItems(filteredAccesses.length)
      } else {
        const spaceForItems = containerHeight - viewMoreBtnHeight
        // Ensure at least 0 item shows
        const maxFit = Math.max(0, Math.floor(spaceForItems / itemHeight))
        setMaxVisibleItems(maxFit)
      }
    }

    // Initial calculation
    calculateVisibleItems()

    const observer = new ResizeObserver(calculateVisibleItems)
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current)
    }

    window.addEventListener('resize', calculateVisibleItems)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', calculateVisibleItems)
    }
  }, [filteredAccesses.length, sidebarWidth])

  // --- Sidebar Resizing Logic ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return

      // Limit width between 220 and 480
      const newWidth = Math.max(220, Math.min(480, e.clientX))
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
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
    }
  }, [isResizing, setSidebarWidth])

  // --- Click Outside User Menu ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])


  // --- Handlers ---
  const handleMenuClick = (item) => {
    openTab({ id: item.id, type: item.type, title: item.title })
  }

  const handleRecentClick = (access) => {
    openTab({ id: access.id, type: access.type, title: access.title })
  }

  const handlePinClick = (e, accessId) => {
    e.stopPropagation()
    togglePin(accessId)
  }

  const handleViewMore = () => {
    openTab({ id: 'history', type: 'history', title: 'Histórico' })
  }

  const handleResizerMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
  }

  const visibleRecentAccesses = filteredAccesses.slice(0, maxVisibleItems)
  const hasMore = filteredAccesses.length > maxVisibleItems

  return (
    <div className="relative flex-shrink-0 z-20" style={{ width: `${sidebarWidth}px` }}>
      <aside
        ref={sidebarRef}
        className="h-full flex flex-col bg-white border-r border-gray-200 overflow-hidden"
        style={{ width: `${sidebarWidth}px`, maxWidth: '100%' }}
      >
        {/* LOGO */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-white">
          <img
            src="/logo.png"
            alt="SEF Logo"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* NAVIGATION Area (Flex Grow) */}
        <nav className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Fixed Menu Items */}
          <div className="flex-shrink-0 py-3 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTabId === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
                               text-left transition-all duration-200 min-w-0 mb-1
                               ${isActive
                      ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                    }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  <span className="text-sm truncate">{item.title}</span>
                </button>
              )
            })}
          </div>

          {/* Recent Access Section (Grows to fill space) */}
          <div className="flex-1 flex flex-col min-h-0 border-t border-gray-100 mx-2 mt-2 pt-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex-shrink-0">
              Acessos recentes
            </h3>

            {/* Wrapper for list measurement - Fills remaining space */}
            <div ref={wrapperRef} className="flex-1 overflow-hidden relative">
              <div className="flex flex-col gap-0.5">
                {visibleRecentAccesses.map((access) => (
                  <div
                    key={access.id}
                    className="group w-full flex items-center justify-between px-3 py-2 rounded-lg 
                                    text-left hover:bg-gray-50 transition-colors min-w-0 cursor-pointer"
                    onClick={() => handleRecentClick(access)}
                  >
                    {/* Text Container */}
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-sm text-gray-700 font-medium truncate">
                        {access.title}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {access.description || access.id}
                      </p>
                    </div>

                    {/* Pin Button */}
                    <button
                      onClick={(e) => handlePinClick(e, access.id)}
                      className={`p-1.5 rounded-md transition-all flex-shrink-0 
                                      ${access.isFixed ? 'bg-gray-100 text-gray-600 opacity-100' : 'text-transparent group-hover:text-gray-300 hover:bg-gray-100 opacity-0 group-hover:opacity-100'}`}
                    >
                      <MdPushPin className={`w-3.5 h-3.5 transform -rotate-45`} />
                    </button>
                  </div>
                ))}
              </div>

              {hasMore && (
                <button
                  onClick={handleViewMore}
                  className="w-full mt-1 flex items-center justify-center px-3 py-2 rounded-lg 
                                    text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0"
                >
                  <span className="text-xs font-medium">Ver mais</span>
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* USER PROFILE - Fixed at Bottom */}
        <div ref={userMenuRef} className="p-3 border-t border-gray-200 bg-white flex-shrink-0 relative">
          {/* Popover Menu - Positioned nicely above */}
          {isUserMenuOpen && (
            <div className="absolute bottom-full left-2 right-2 mb-2 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
              <div className="py-1">
                <button
                  onClick={() => { /* Navigate to settings */ setIsUserMenuOpen(false) }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <MdSettings className="w-5 h-5 text-gray-400" />
                  Editar Perfil
                </button>
                <div className="h-px bg-gray-50 mx-2" />
                <button
                  onClick={() => { /* Logout logic */ setIsUserMenuOpen(false) }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <MdLogout className="w-5 h-5" />
                  Sair da conta
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all duration-200
                           ${isUserMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <img
              src="/avatar.png"
              alt="User"
              className="w-9 h-9 rounded-full object-cover border border-gray-200 flex-shrink-0"
            />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-gray-900 truncate">Pedro BI</p>
              <p className="text-xs text-gray-500 truncate">pedro.cardoso@fazenda.mg.gov.br</p>
            </div>
            {isUserMenuOpen ? (
              <MdExpandMore className="w-5 h-5 text-gray-400 flex-shrink-0" />
            ) : (
              <MdExpandLess className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
          </button>
        </div>
      </aside>

      {/* Resizer Handle */}
      <div
        onMouseDown={handleResizerMouseDown}
        className={`absolute right-0 top-0 w-1 h-full cursor-col-resize z-50 hover:bg-blue-400 transition-colors
                   ${isResizing ? 'bg-blue-500' : 'bg-transparent'}`}
      />
    </div>
  )
}