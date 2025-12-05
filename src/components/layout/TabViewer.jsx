'use client'

import useTabStore from '@/store/useTabStore'

export default function TabViewer({ children, tabId }) {
  const activeTabId = useTabStore((state) => state.activeTabId)
  const isActive = activeTabId === tabId

  return (
    <div 
      className={`absolute inset-0 ${isActive ? 'tab-content-visible' : 'tab-content-hidden'}`}
    >
      {children}
    </div>
  )
}

