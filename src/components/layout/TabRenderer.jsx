'use client'

import HomeView from '@/views/HomeView'
import SeiListView from '@/views/sei/SeiListView'
import SeiDetailView from '@/views/sei/SeiDetailView'
import HistoryView from '@/views/HistoryView'
import SettingsContainer from '@/views/settings/SettingsContainer'
import DocumentsDetailView from '@/views/sei/DocumentsDetailView'
import DocumentsView from '@/views/DocumentsView' // Kept for legacy if needed, but logic moved

const viewMap = {
  'home': HomeView,
  'sei_list': SeiListView,
  'sei_detail': SeiDetailView,
  'history': HistoryView,
  'settings': SettingsContainer,
  'doc_list': DocumentsView,
}

export default function TabRenderer({ tab }) {
  if (!tab) return null

  const ViewComponent = viewMap[tab.type]

  if (!ViewComponent) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-400">View do tipo "{tab.type}" não encontrada.</p>
      </div>
    )
  }

  return (
    <ViewComponent id={tab.id} title={tab.title} data={tab.data} />
  )
}