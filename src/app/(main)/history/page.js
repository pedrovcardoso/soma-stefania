'use client'

import { mockRecentAccesses } from '@/services/mockData'
import useTabStore from '@/store/useTabStore'


export default function HistoryPage() {
  const addTab = useTabStore((state) => state.addTab)

  const handleAccessClick = (access) => {
    addTab({
      id: `sei-${access.id}`,
      title: access.process,
      path: `/sei/${access.process}`,
    })
  }

  return (
    <div className="p-8 bg-gray-100 min-h-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Histórico</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Acessos Recentes</h2>
        <div className="space-y-2">
          {mockRecentAccesses.map((access) => (
            <button
              key={access.id}
              onClick={() => handleAccessClick(access)}
              className="w-full flex items-center justify-between p-4 rounded-lg 
                         text-left text-gray-700 hover:bg-gray-100 transition-colors 
                         border border-gray-200 group"
            >
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium truncate">{access.process}</p>
                <p className="text-xs text-gray-500 truncate mt-1">{access.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(access.accessedAt).toLocaleString('pt-BR')}
                </p>
              </div>
              {access.pinned && (
                <span className="material-symbols-outlined w-4 h-4 text-gray-600 flex-shrink-0">push_pin</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

