'use client'

import useThemeStore from '@/store/useThemeStore'
import { useState } from 'react'

export default function SettingsPage() {
  const { currentTheme, updateThemeProperty, resetTheme, exportTheme, importTheme } = useThemeStore()
  const [importValue, setImportValue] = useState('')

  const handleImport = () => {
    importTheme(importValue)
    setImportValue('')
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Configurações</h1>
      
      <div className="space-y-6">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4 text-text">Perfil</h2>
          <p className="text-text-secondary">Configurações de perfil serão implementadas aqui.</p>
        </div>

        <div className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4 text-text">Tema</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text">
                Cor Primária
              </label>
              <input
                type="color"
                value={currentTheme['--color-primary']}
                onChange={(e) => updateThemeProperty('--color-primary', e.target.value)}
                className="w-20 h-10 rounded border border-border cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text">
                Cor de Fundo
              </label>
              <input
                type="color"
                value={currentTheme['--color-background']}
                onChange={(e) => updateThemeProperty('--color-background', e.target.value)}
                className="w-20 h-10 rounded border border-border cursor-pointer"
              />
            </div>
            <button
              onClick={resetTheme}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition-colors"
            >
              Resetar Tema
            </button>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4 text-text">Importar/Exportar Tema</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text">
                Exportar Tema
              </label>
              <textarea
                readOnly
                value={exportTheme()}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-sm font-mono"
                rows="10"
              />
              <button
                onClick={() => navigator.clipboard.writeText(exportTheme())}
                className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Copiar JSON
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text">
                Importar Tema (JSON)
              </label>
              <textarea
                value={importValue}
                onChange={(e) => setImportValue(e.target.value)}
                placeholder="Cole o JSON do tema aqui..."
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-sm font-mono"
                rows="10"
              />
              <button
                onClick={handleImport}
                className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Importar Tema
              </button>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4 text-text">Sistema</h2>
          <p className="text-text-secondary">Versão: 0.2.0</p>
        </div>
      </div>
    </div>
  )
}

