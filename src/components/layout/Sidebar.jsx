'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import useTabStore from '@/store/useTabStore'
import useSidebarStore from '@/store/useSidebarStore'
import useHistoryStore from '@/store/useHistoryStore'
import { logout } from '@/services/authService'
import {
  MdBarChart, MdLanguage, MdDescription, MdChat, MdFavorite,
  MdAddToPhotos, MdPushPin, MdSettings, MdLogout, MdChevronLeft,
  MdChevronRight, MdMenu
} from 'react-icons/md'

const menuItems = [
  { id: 'dashboard', type: 'dashboard', title: 'Dashboard', icon: MdBarChart },
  { id: 'sei', type: 'sei_list', title: 'Processos SEI', icon: MdLanguage },
  { id: 'documents', type: 'doc_list', title: 'Documentos', icon: MdDescription },
  { id: 'stefania', type: 'stefania', title: 'StefanIA', icon: MdChat },
  { id: 'action-plans', type: 'action_plans', title: 'Planos de ação', icon: MdAddToPhotos },
]

export default function Sidebar() {
  const openTab = useTabStore((state) => state.openTab)
  const activeTabId = useTabStore((state) => state.activeTabId)

  const sidebarWidth = useSidebarStore((state) => state.sidebarWidth)
  const setSidebarWidth = useSidebarStore((state) => state.setSidebarWidth)
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const toggleCollapse = useSidebarStore((state) => state.toggleCollapse)

  const { recentAccesses, pinnedIds, togglePin } = useHistoryStore()

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

  const [maxVisibleItems, setMaxVisibleItems] = useState(0)
  const wrapperRef = useRef(null)
  const itemRef = useRef(null)
  const viewMoreRef = useRef(null)
  const sidebarRef = useRef(null)

  const [isResizing, setIsResizing] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  const calculateVisibleItems = useCallback(() => {
    if (!wrapperRef.current || isCollapsed) return

    const containerHeight = wrapperRef.current.getBoundingClientRect().height

    const itemHeight = itemRef.current
      ? itemRef.current.getBoundingClientRect().height + 2
      : 56;

    const viewMoreBtnHeight = viewMoreRef.current
      ? viewMoreRef.current.getBoundingClientRect().height + 4
      : 48;

    if (containerHeight <= 0) return

    const totalContentHeight = filteredAccesses.length * itemHeight

    if (totalContentHeight <= containerHeight) {
      setMaxVisibleItems(filteredAccesses.length)
      return
    }

    const availableSpaceForItems = containerHeight - viewMoreBtnHeight

    const maxFit = Math.max(0, Math.floor(availableSpaceForItems / itemHeight))

    setMaxVisibleItems(maxFit)
  }, [filteredAccesses.length, isCollapsed])

  useEffect(() => {
    calculateVisibleItems()
    const transitionTimeout = setTimeout(calculateVisibleItems, 310)

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(calculateVisibleItems)
    })

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current)
    }

    window.addEventListener('resize', calculateVisibleItems)

    return () => {
      clearTimeout(transitionTimeout)
      resizeObserver.disconnect()
      window.removeEventListener('resize', calculateVisibleItems)
    }
  }, [calculateVisibleItems, sidebarWidth, isCollapsed])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return
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

  const handleMenuClick = (item) => openTab({ id: item.id, type: item.type, title: item.title })
  const handleRecentClick = (access) => openTab({ id: access.id, type: access.type, title: access.title })
  const handlePinClick = (e, accessId) => { e.stopPropagation(); togglePin(accessId); }
  const handleViewMore = () => openTab({ id: 'history', type: 'history', title: 'Histórico' })
  const handleResizerMouseDown = (e) => { e.preventDefault(); e.stopPropagation(); setIsResizing(true); }
  const handleLogout = async () => { try { await logout() } catch (error) { console.error("Logout failed", error) } }
  const handleProfileClick = () => { openTab({ id: 'settings', type: 'settings', title: 'Configurações', data: { activeSection: 'profile' } }); setIsUserMenuOpen(false); }

  const visibleRecentAccesses = filteredAccesses.slice(0, maxVisibleItems)
  const hasMore = filteredAccesses.length > maxVisibleItems
  const validWidth = isCollapsed ? 64 : sidebarWidth;

  return (
    <div className={`relative flex-shrink-0 z-20 ${isResizing ? '' : 'transition-all duration-300 ease-in-out'}`} style={{ width: `${validWidth}px` }}>
      <aside
        ref={sidebarRef}
        className="h-full flex flex-col bg-surface border-r border-border"
        style={{ width: `${validWidth}px`, maxWidth: '100%' }}
      >
        <div className={`border-b border-border flex-shrink-0 bg-surface flex transition-all duration-300 ${isCollapsed ? 'flex-col items-center gap-1 py-1.5' : 'items-center justify-start px-4 h-16 gap-3'}`}>
          <button onClick={toggleCollapse} className="p-1 rounded-lg text-text-muted hover:bg-surface-alt hover:text-text transition-colors flex-shrink-0">
            <MdMenu className="w-6 h-6" />
          </button>
          {isCollapsed ? (
            <img src="/logo-mini.png" alt="SEF Logo" className="h-8 w-auto object-contain animate-in fade-in zoom-in duration-300" />
          ) : (
            <img src="/logo.png" alt="SEF Logo" className="h-7 w-auto object-contain animate-in fade-in slide-in-from-left-2 duration-300" />
          )}
        </div>

        <nav className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className={`flex-shrink-0 py-1 overflow-y-auto custom-scrollbar ${isCollapsed ? 'px-1' : 'px-2'}`} style={{ maxHeight: isCollapsed ? '100%' : '50%' }}>
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTabId === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  title={isCollapsed ? item.title : ''}
                  className={`w-full flex items-center gap-3 py-1.5 rounded-lg transition-all duration-200 min-w-0 mb-1 relative group
                    ${isCollapsed ? 'justify-center px-0' : 'text-left px-3'}
                    ${isActive ? 'bg-accent-soft text-accent font-medium' : 'text-text-secondary hover:bg-surface-alt hover:text-text'}
                    ${isActive && !isCollapsed ? 'border-l-4 border-accent' : ''}
                    ${isActive && isCollapsed ? 'bg-accent-soft' : ''}
                  `}
                >
                  {isCollapsed && isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-md" />}
                  <Icon className={`flex-shrink-0 ${isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'} w-5 h-5`} />
                  {!isCollapsed && <span className="text-sm truncate animate-in fade-in slide-in-from-left-1 duration-200">{item.title}</span>}
                </button>
              )
            })}
          </div>

          {!isCollapsed && (
            <div className={`flex-1 flex flex-col min-h-0 border-t border-border mx-2 mt-2 pt-4 animate-in fade-in duration-300`}>
              <h3 className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 flex-shrink-0">
                Acessos recentes
              </h3>
              <div ref={wrapperRef} className="flex-1 overflow-hidden relative flex flex-col">
                <div className="flex flex-col gap-0.5 h-full">
                  {visibleRecentAccesses.map((access, index) => (
                    <div
                      key={access.id}
                      ref={index === 0 ? itemRef : null}
                      className="group w-full flex items-center px-3 py-2 rounded-lg text-left hover:bg-surface-alt transition-colors min-w-0 cursor-pointer relative flex-shrink-0"
                      onClick={() => handleRecentClick(access)}
                    >
                      <div className={`flex-1 min-w-0 transition-all duration-200 ${access.isFixed ? 'pr-8' : 'pr-0 group-hover:pr-8'}`}>
                        <p className="text-sm text-text font-medium truncate">{access.title}</p>
                        <p className="text-[11px] text-text-muted truncate mt-0.5">{access.description || access.id}</p>
                      </div>
                      <button
                        onClick={(e) => handlePinClick(e, access.id)}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all
                          ${access.isFixed ? 'bg-surface-alt text-text-secondary opacity-100' : 'text-transparent group-hover:text-text-muted hover:bg-surface-alt opacity-0 group-hover:opacity-100'}`}
                      >
                        <MdPushPin className={`w-3.5 h-3.5 transform -rotate-45`} />
                      </button>
                    </div>
                  ))}
                </div>
                {hasMore && (
                  <div ref={viewMoreRef} className="mt-1 flex-shrink-0">
                    <button
                      onClick={handleViewMore}
                      className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-accent hover:bg-accent-soft transition-colors"
                    >
                      <span className="text-xs font-medium">Ver mais</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>

        <div ref={userMenuRef} className={`p-1 border-t border-border bg-surface flex-shrink-0 relative ${isCollapsed ? 'flex justify-center' : ''}`}>
          {isUserMenuOpen && (
            <div className={`absolute mb-2 bg-elevated rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.12)] border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-[100]
                ${isCollapsed ? 'left-full bottom-0 ml-2 w-56' : 'bottom-full left-2 right-2'}
            `}>
              <div className="py-1">
                {isCollapsed && (
                  <div className="px-4 py-3 border-b border-border bg-surface-alt">
                    <p className="text-sm font-semibold text-text truncate">Pedro BI</p>
                    <p className="text-xs text-text-muted truncate">pedro.cardoso@fazenda.mg.gov.br</p>
                  </div>
                )}
                <button onClick={handleProfileClick} className="w-full text-left px-4 py-3 text-sm text-text-secondary hover:bg-surface-alt flex items-center gap-3 transition-colors">
                  <MdSettings className="w-5 h-5 text-text-muted" /> Editar Perfil
                </button>
                <div className="h-px bg-gray-50 mx-2" />
                <button onClick={() => { handleLogout(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                  <MdLogout className="w-5 h-5" /> Sair da conta
                </button>
              </div>
            </div>
          )}

          <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className={`flex items-center gap-3 w-full rounded-lg transition-all duration-200 group ${isUserMenuOpen ? 'bg-surface-alt' : 'hover:bg-surface-alt'} ${isCollapsed ? 'justify-center p-1' : 'p-2'}`}>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex-shrink-0 overflow-hidden aspect-square">
              <img src="/avatar.png" alt="User" className="w-full h-full object-cover" />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-text truncate">Pedro BI</p>
                  <p className="text-xs text-text-muted truncate">pedro.cardoso@fazenda.mg.gov.br</p>
                </div>
                <MdChevronRight className={`w-5 h-5 text-text-muted flex-shrink-0 group-hover:text-text-secondary transition-transform ${isUserMenuOpen ? 'rotate-90' : ''}`} />
              </>
            )}
          </button>
        </div>
      </aside>

      {!isCollapsed && (
        <div onMouseDown={handleResizerMouseDown} className={`absolute right-0 top-0 w-1 h-full cursor-col-resize z-50 hover:bg-border transition-colors ${isResizing ? 'bg-border' : 'bg-transparent'}`} />
      )}
    </div>
  )
}