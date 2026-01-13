'use client';

import { MdFormatSize, MdPalette } from 'react-icons/md';
import useThemeStore from '@/store/useThemeStore';

export default function PreferencesSettingsPage() {
    const { theme, setTheme } = useThemeStore();
    const fontSize = 'normal';
    const fontFamily = 'Inter';

    return (
        <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-text mb-6 pb-4 border-b border-border">
                Preferências de Visualização
            </h2>

            <div className="flex flex-col gap-10">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <MdFormatSize className="text-accent text-xl" />
                        <h3 className="text-base font-medium text-text">Tipografia</h3>
                    </div>

                    <div className="bg-surface-alt border border-border rounded-lg p-6 flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Fonte do Sistema</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {['Inter', 'Roboto', 'System UI'].map((font) => (
                                    <button
                                        key={font}
                                        className={`px-4 py-2 border rounded-lg text-sm font-medium text-left transition-all hover:bg-surface
                                            ${fontFamily === font
                                                ? 'bg-surface border-accent text-accent shadow-sm ring-1 ring-accent'
                                                : 'bg-surface-alt border-border text-text-muted hover:border-text-secondary'
                                            }`}
                                    >
                                        {font}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-border" />

                        <div>
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <span className="text-xs text-text-muted font-medium">Tamanho da Fonte - Pequeno</span>
                                <div className="flex-1 flex gap-2">
                                    {['small', 'normal', 'large', 'xl'].map((size) => (
                                        <button
                                            key={size}
                                            className={`flex-1 py-2 rounded-md transition-all text-sm font-medium border
                                                ${fontSize === size
                                                    ? 'bg-surface border-accent text-accent shadow-sm ring-1 ring-accent'
                                                    : 'bg-surface border-border text-text-muted hover:border-text-secondary'
                                                }`}
                                        >
                                            Aa
                                            {size === 'large' && '+'}
                                            {size === 'xl' && '++'}
                                        </button>
                                    ))}
                                </div>
                                <span className="text-lg text-text-muted font-medium">Grande</span>
                            </div>
                            <p className="text-center text-text-muted text-sm">
                                Exemplo de texto com o tamanho selecionado. A rápida raposa marrom pula sobre o cão preguiçoso.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <MdPalette className="text-accent text-xl" />
                        <h3 className="text-base font-medium text-text">Tema do Sistema</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { id: 'light', name: 'Claro', bg: 'bg-white', text: 'bg-slate-800', border: 'border-slate-200' },
                            { id: 'dark', name: 'Escuro', bg: 'bg-[#1e1e1e]', text: 'bg-[#d4d4d4]', border: 'border-[#3e3e42]' },
                            { id: 'dracula', name: 'Dracula', bg: 'bg-[#282a36]', text: 'bg-[#f8f8f2]', border: 'border-[#44475a]' },
                            { id: 'hc', name: 'Alto Contraste', bg: 'bg-black', text: 'bg-yellow-400', border: 'border-white' },
                            { id: 'pink', name: 'Rosa', bg: 'bg-pink-50', text: 'bg-pink-600', border: 'border-pink-200' },
                            { id: 'green', name: 'Verde', bg: 'bg-green-50', text: 'bg-green-600', border: 'border-green-200' }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`group relative flex flex-col items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                                    ${theme === t.id ? 'border-accent bg-accent/5' : 'border-transparent hover:bg-surface-alt'}`}
                            >
                                <div className={`w-full aspect-video rounded-lg ${t.bg} border ${t.border} shadow-sm overflow-hidden p-2`}>
                                    <div className="space-y-1.5 opacity-80">
                                        <div className={`h-2 w-1/3 ${t.text} rounded-sm`}></div>
                                        <div className={`h-1.5 w-full ${t.id === 'light' ? 'bg-slate-200' : 'bg-slate-700'} rounded-sm`}></div>
                                        <div className={`h-1.5 w-2/3 ${t.id === 'light' ? 'bg-slate-200' : 'bg-slate-700'} rounded-sm`}></div>
                                    </div>
                                </div>
                                <span className={`text-sm font-medium ${theme === t.id ? 'text-accent' : 'text-text-secondary'}`}>{t.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end pt-6 border-t border-border text-xs text-text-muted">
                    * Alterações são salvas automaticamente
                </div>
            </div>
        </div>
    );
}
