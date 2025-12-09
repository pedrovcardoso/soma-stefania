'use client'

import { Suspense, useEffect } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import TabViewer from './TabViewer'
import TabContentRenderer from './TabContentRenderer'
import HomePage from '@/app/(main)/home/page'
import useTabStore from '@/store/useTabStore'
import useThemeStore from '@/store/useThemeStore'

export default function AppShell({ children }) {
  const { tabs, activeTabId } = useTabStore()
  const { currentTheme } = useThemeStore()
  const showHome = tabs.length === 0 || activeTabId === null

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      Object.entries(currentTheme).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })

      // Enforce Static URL
      const enforceStaticUrl = () => {
        if (window.location.pathname !== '/main' && !window.location.pathname.includes('/login')) {
          window.history.replaceState(null, '', '/main');
        }
      };

      enforceStaticUrl();
      // Listen for updates (though replaceState doesn't trigger popstate, we mainly care about initial load and tab switches if they caused route changes)
    }
  }, [currentTheme, activeTabId])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Navbar />
          <div className="flex-1 overflow-hidden relative">
            {showHome && (
              <div className="absolute inset-0 tab-content-visible">
                <HomePage />
              </div>
            )}
            {tabs.map((tab) => (
              <TabViewer key={tab.id} tabId={tab.id}>
                <Suspense fallback={
                  <div className="p-8">
                    <p className="text-text-secondary">Carregando...</p>
                  </div>
                }>
                  <TabContentRenderer tab={tab} />
                </Suspense>
              </TabViewer>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

