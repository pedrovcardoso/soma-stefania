'use client';

import { useState, useEffect } from 'react';
import { MdFormatSize, MdPalette } from 'react-icons/md';
import useThemeStore from '@/store/useThemeStore';

export default function PreferencesSettingsPage() {
    const {
        theme,
        setTheme,
        fontFamily,
        setFontFamily,
        fontSizeScale: initialFontSizeScale,
        setFontSizeScale
    } = useThemeStore();

    const [localFontSizeScale, setLocalFontSizeScale] = useState(initialFontSizeScale);

    // Debounce font size updates to store
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFontSizeScale(localFontSizeScale);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [localFontSizeScale, setFontSizeScale]);

    // Keep local state in sync if store changes externally
    useEffect(() => {
        setLocalFontSizeScale(initialFontSizeScale);
    }, [initialFontSizeScale]);

    const handleSliderChange = (e) => {
        setLocalFontSizeScale(parseFloat(e.target.value));
    };

    const fontOptions = [
        { name: 'Inter', family: 'var(--font-inter), sans-serif' },
        { name: 'Roboto', family: 'var(--font-roboto), sans-serif' },
        { name: 'Segoe UI', family: '"Segoe UI", system-ui, -apple-system, sans-serif' },
        { name: 'Serif', family: 'Georgia, serif' },
        { name: 'Mono', family: 'monospace' }
    ];

    const themes = [
        { id: 'light', name: 'Claro', bg: 'bg-white', text: 'bg-slate-800', border: 'border-slate-200', category: 'Clássico' },
        { id: 'dark', name: 'Escuro', bg: 'bg-[#1e1e1e]', text: 'bg-[#d4d4d4]', border: 'border-[#3e3e42]', category: 'Clássico' },
        { id: 'dracula', name: 'Dracula', bg: 'bg-[#282a36]', text: 'bg-[#f8f8f2]', border: 'border-[#44475a]', category: 'Cores' },
        { id: 'hc', name: 'Alto Contraste', bg: 'bg-black', text: 'bg-yellow-400', border: 'border-white', category: 'Clássico' },
        { id: 'pink', name: 'Rosa', bg: 'bg-pink-50', text: 'bg-pink-600', border: 'border-pink-200', category: 'Cores' },
        { id: 'green', name: 'Verde', bg: 'bg-green-50', text: 'bg-green-600', border: 'border-green-200', category: 'Cores' }
    ];

    const groupedThemes = {
        'Clássico': themes.filter(t => t.category === 'Clássico'),
        'Cores': themes.filter(t => t.category === 'Cores'),
    };

    return (
        <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-text mb-6 pb-4 border-b border-border">
                Preferências de Visualização
            </h2>

            <div className="flex flex-col gap-10">
                {/* Theme Section (Moved to Top) */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <MdPalette className="text-accent text-xl" />
                        <h3 className="text-base font-medium text-text">Tema do Sistema</h3>
                    </div>

                    <div className="space-y-6">
                        {Object.entries(groupedThemes).map(([category, categoryThemes]) => (
                            <div key={category}>
                                <h4 className="text-sm font-medium text-text-secondary mb-3">{category}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {categoryThemes.map((t) => (
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
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <MdFormatSize className="text-accent text-xl" />
                        <h3 className="text-base font-medium text-text">Tipografia</h3>
                    </div>

                    <div className="bg-surface-alt border border-border rounded-lg p-6 flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Fonte do Sistema</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {fontOptions.map((font) => (
                                    <button
                                        key={font.name}
                                        onClick={() => setFontFamily(font.name)}
                                        className={`px-4 py-2 border rounded-lg text-sm font-medium text-left transition-all hover:bg-surface
                                            ${fontFamily === font.name
                                                ? 'bg-surface border-accent text-accent shadow-sm ring-1 ring-accent'
                                                : 'bg-surface-alt border-border text-text-muted hover:border-text-secondary'
                                            }`}
                                    >
                                        <span style={{ fontFamily: font.family }}>{font.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-border" />

                        <div>
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <span className="text-sm font-medium text-text-secondary">Tamanho da Fonte</span>
                                <span className="text-xs text-text-muted bg-surface border border-border px-2 py-1 rounded">
                                    {Math.round(localFontSizeScale * 100)}%
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-xs text-text-muted font-medium">Aa</span>
                                <input
                                    type="range"
                                    min="0.8"
                                    max="1.2"
                                    step="0.05"
                                    value={localFontSizeScale}
                                    onChange={handleSliderChange}
                                    className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent hover:accent-accent-700"
                                />
                                <span className="text-lg text-text-muted font-medium">Aa</span>
                            </div>

                            <div className="mt-4 p-4 bg-surface rounded-lg border border-border">
                                <p className="text-text text-sm" style={{ fontFamily: fontOptions.find(f => f.name === fontFamily)?.family }}>
                                    Exemplo de texto com a tipografia selecionada. A rápida raposa marrom pula sobre o cão preguiçoso.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-6 border-t border-border text-xs text-text-muted">
                    * Alterações são salvas automaticamente
                </div>
            </div>
        </div>
    );
}
