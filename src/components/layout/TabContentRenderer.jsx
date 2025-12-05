'use client'

import dynamic from 'next/dynamic'
import HomePage from '@/app/(main)/home/page'
import DashboardPage from '@/app/(main)/dashboard/page'
import HistoryPage from '@/app/(main)/history/page'
import StefaniaPage from '@/app/(main)/stefania/page'
import SeiPage from '@/app/(main)/sei/page'
import DocumentsPage from '@/app/(main)/documents/page'
import SettingsPage from '@/app/(main)/settings/page'
import FavoritesPage from '@/app/(main)/favorites/page'
import ActionPlansPage from '@/app/(main)/action-plans/page'

const SeiDetailPage = dynamic(() => import('@/app/(main)/sei/[id]/page'), {
  ssr: false,
})

const DocumentsDetailPage = dynamic(() => import('@/app/(main)/documents/[id]/page'), {
  ssr: false,
})

export default function TabContentRenderer({ tab }) {
  const pathParts = tab.path.split('/').filter(Boolean)
  
  if (tab.path === '/home') {
    return <HomePage />
  }
  if (tab.path === '/dashboard') {
    return <DashboardPage />
  }
  if (tab.path === '/history') {
    return <HistoryPage />
  }
  if (tab.path === '/stefania') {
    return <StefaniaPage />
  }
  if (tab.path === '/sei' && pathParts.length === 1) {
    return <SeiPage />
  }
  if (tab.path.startsWith('/sei/') && pathParts.length === 2) {
    return <SeiDetailPage params={{ id: pathParts[1] }} />
  }
  if (tab.path === '/documents' && pathParts.length === 1) {
    return <DocumentsPage />
  }
  if (tab.path.startsWith('/documents/') && pathParts.length === 2) {
    return <DocumentsDetailPage params={{ id: pathParts[1] }} />
  }
  if (tab.path === '/favorites') {
    return <FavoritesPage />
  }
  if (tab.path === '/action-plans') {
    return <ActionPlansPage />
  }
  if (tab.path === '/settings') {
    return <SettingsPage />
  }
  
  return (
    <div className="p-8 bg-gray-100">
      <p className="text-gray-600">Página não encontrada</p>
    </div>
  )
}

