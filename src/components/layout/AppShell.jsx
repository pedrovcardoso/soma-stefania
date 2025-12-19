'use client'

import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import TabRenderer from './TabRenderer'
import HomeView from '@/views/HomeView'
import useTabStore from '@/store/useTabStore'
import useThemeStore from '@/store/useThemeStore'

const SimpleLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50">
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
        Carregando conteúdo...
      </p>
    </div>
  )
}

export default function AppShell() {
  const { tabs, activeTabId } = useTabStore()
  const { currentTheme } = useThemeStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      Object.entries(currentTheme).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    }
  }, [currentTheme])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const enforceStaticUrl = () => {
        if (window.location.pathname !== '/main' && !window.location.pathname.includes('/login')) {
          window.history.replaceState(null, '', '/main')
        }
      }
      enforceStaticUrl()
    }
  }, [])

  if (!isClient) {
    return <SimpleLoader />
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden animate-in fade-in duration-300">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Navbar />
          <div className="flex-1 overflow-hidden relative bg-slate-50">
            <div className={`absolute inset-0 overflow-auto bg-slate-50 transition-opacity duration-200 ${activeTabId === 'home' ? 'z-10 opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <HomeView />
            </div>
            {tabs.map((tab) => (
              <div 
                key={tab.id} 
                className={`absolute inset-0 overflow-hidden flex flex-col bg-white transition-opacity duration-200 ${activeTabId === tab.id ? 'z-10 opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <div className={`h-full w-full ${activeTabId === tab.id ? 'block' : 'hidden'}`}>
                  <TabRenderer tab={tab} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}