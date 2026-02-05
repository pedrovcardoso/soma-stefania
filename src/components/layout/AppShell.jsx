'use client'

import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Breadcrumb from './Breadcrumb'
import TabRenderer from './TabRenderer'
import HomeView from '@/views/HomeView'
import useTabStore from '@/store/useTabStore'
import useThemeStore from '@/store/useThemeStore'
import ToastContainer from '@/components/ui/toast'

const SimpleLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface-alt">
      <p className="text-sm font-semibold text-text-muted uppercase tracking-widest animate-pulse">
        Carregando conteúdo...
      </p>
    </div>
  )
}

export default function AppShell() {
  const { tabs, activeTabId } = useTabStore()
  const { theme } = useThemeStore()
  const [toasts, setToasts] = useState([]);
  const [isClient, setIsClient] = useState(false)

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handleToastEvent = (e) => {
      const { message, variant } = e.detail;
      const id = Math.random().toString(36).substring(2, 9);
      const timestamp = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      setToasts((prev) => [...prev, { id, message, variant, timestamp }]);
    };

    window.addEventListener('app-toast', handleToastEvent);
    return () => window.removeEventListener('app-toast', handleToastEvent);
  }, []);

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [])

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
        <div className="flex-1 flex flex-col min-w-0 relative z-0">
          <Navbar />
          <Breadcrumb />
          <div className="flex-1 overflow-hidden relative bg-surface-alt">
            <div className={`absolute inset-0 overflow-auto bg-surface-alt transition-opacity duration-200 ${activeTabId === 'home' ? 'z-10 opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <HomeView />
            </div>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`absolute inset-0 overflow-hidden flex flex-col bg-surface transition-opacity duration-200 ${activeTabId === tab.id ? 'z-10 opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <div className={`h-full w-full ${activeTabId === tab.id ? 'block' : 'hidden'}`}>
                  <TabRenderer tab={tab} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}