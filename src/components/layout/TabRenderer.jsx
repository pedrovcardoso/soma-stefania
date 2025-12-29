'use client'

import useTabStore from '@/store/useTabStore'
import HomeView from '@/views/HomeView'
import SeiListView from '@/views/sei/SeiListView'
import SeiDetailView from '@/views/sei/SeiDetailView'
import HistoryView from '@/views/HistoryView'
import SettingsContainer from '@/views/settings/SettingsContainer'
import DocumentsView from '@/views/DocumentsView'

const viewMap = {
  'home': HomeView,
  'sei_list': SeiListView,
  'sei_detail': SeiDetailView,
  'history': HistoryView,
  'settings': SettingsContainer,
  'doc_list': DocumentsView,
}

export default function TabRenderer() {
  const { tabs, activeTabId } = useTabStore()

  return (
    <div className="h-full w-full relative">
      {/* Home View: Sempre presente, visível apenas se activeTabId for 'home' */}
      <div className={activeTabId === 'home' ? 'tab-content-visible' : 'tab-content-hidden'}>
        <HomeView />
      </div>

      {/* Renderização Dinâmica das Abas Persistentes */}
      {tabs.map((tab) => {
        const ViewComponent = viewMap[tab.type]

        if (!ViewComponent) {
          return (
            <div key={tab.id} className={activeTabId === tab.id ? 'tab-content-visible' : 'tab-content-hidden'}>
              <div className="p-10 text-center">
                <p className="text-slate-400">View do tipo "{tab.type}" não encontrada.</p>
              </div>
            </div>
          )
        }

        return (
          <div
            key={tab.id}
            className={activeTabId === tab.id ? 'tab-content-visible' : 'tab-content-hidden'}
          >
            <ViewComponent id={tab.id} title={tab.title} data={tab.data} />
          </div>
        )
      })}
    </div>
  )
}