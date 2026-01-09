'use client';

import { useState } from 'react';
import { MdFormatSize, MdPalette } from 'react-icons/md';

export default function PreferencesSettingsPage() {
    const [theme, setTheme] = useState('light');
    const [fontSize, setFontSize] = useState('normal');
    const [fontFamily, setFontFamily] = useState('Inter');

    return (
        <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                Preferências de Visualização
            </h2>

            <div className="flex flex-col gap-10">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <MdFormatSize className="text-blue-600 text-xl" />
                        <h3 className="text-base font-medium text-slate-800">Tipografia</h3>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Fonte do Sistema</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {['Inter', 'Roboto', 'System UI'].map((font) => (
                                    <button
                                        key={font}
                                        onClick={() => setFontFamily(font)}
                                        className={`px-4 py-2 border rounded-lg text-sm font-medium text-left transition-all hover:bg-white
                                            ${fontFamily === font
                                                ? 'bg-white border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500'
                                                : 'bg-slate-100/50 border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        {font}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-slate-200" />

                        <div>
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <span className="text-xs text-slate-500 font-medium">Tamanho da Fonte - Pequeno</span>
                                <div className="flex-1 flex gap-2">
                                    {['small', 'normal', 'large', 'xl'].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setFontSize(size)}
                                            className={`flex-1 py-2 rounded-md transition-all text-sm font-medium border
                                                ${fontSize === size
                                                    ? 'bg-white border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            Aa
                                            {size === 'large' && '+'}
                                            {size === 'xl' && '++'}
                                        </button>
                                    ))}
                                </div>
                                <span className="text-lg text-slate-500 font-medium">Grande</span>
                            </div>
                            <p className="text-center text-slate-500 text-sm">
                                Exemplo de texto com o tamanho selecionado. A rápida raposa marrom pula sobre o cão preguiçoso.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <MdPalette className="text-blue-600 text-xl" />
                        <h3 className="text-base font-medium text-slate-800">Tema do Sistema</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => setTheme('light')}
                            className={`group relative flex flex-col items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                                ${theme === 'light' ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:bg-slate-50'}`}
                        >
                            <div className="w-full aspect-video rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden p-2">
                                <div className="space-y-1.5 opacity-80">
                                    <div className="h-2 w-1/3 bg-slate-800 rounded-sm"></div>
                                    <div className="h-1.5 w-full bg-slate-200 rounded-sm"></div>
                                    <div className="h-1.5 w-2/3 bg-slate-200 rounded-sm"></div>
                                </div>
                            </div>
                            <span className={`text-sm font-medium ${theme === 'light' ? 'text-blue-700' : 'text-slate-600'}`}>Claro</span>
                        </button>

                        <button
                            onClick={() => setTheme('dark')}
                            className={`group relative flex flex-col items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                                ${theme === 'dark' ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:bg-slate-50'}`}
                        >
                            <div className="w-full aspect-video rounded-lg bg-slate-900 border border-slate-700 shadow-sm overflow-hidden p-2">
                                <div className="space-y-1.5 opacity-80">
                                    <div className="h-2 w-1/3 bg-slate-200 rounded-sm"></div>
                                    <div className="h-1.5 w-full bg-slate-700 rounded-sm"></div>
                                    <div className="h-1.5 w-2/3 bg-slate-700 rounded-sm"></div>
                                </div>
                            </div>
                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-700' : 'text-slate-600'}`}>Escuro</span>
                        </button>

                        <button
                            onClick={() => setTheme('contrast')}
                            className={`group relative flex flex-col items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                                ${theme === 'contrast' ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:bg-slate-50'}`}
                        >
                            <div className="w-full aspect-video rounded-lg bg-black border border-white shadow-sm overflow-hidden p-2">
                                <div className="space-y-1.5 opacity-100">
                                    <div className="h-2 w-1/3 bg-yellow-400 rounded-sm"></div>
                                    <div className="h-1.5 w-full bg-white rounded-sm"></div>
                                    <div className="h-1.5 w-2/3 bg-white rounded-sm"></div>
                                </div>
                            </div>
                            <span className={`text-sm font-medium ${theme === 'contrast' ? 'text-blue-700' : 'text-slate-600'}`}>Alto Contraste</span>
                        </button>

                        <button
                            onClick={() => setTheme('pink-green')}
                            className={`group relative flex flex-col items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                                ${theme === 'pink-green' ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:bg-slate-50'}`}
                        >
                            <div className="w-full aspect-video rounded-lg bg-green-50 border border-pink-200 shadow-sm overflow-hidden p-2">
                                <div className="space-y-1.5 opacity-80">
                                    <div className="h-2 w-1/3 bg-green-800 rounded-sm"></div>
                                    <div className="h-1.5 w-full bg-pink-100 rounded-sm"></div>
                                    <div className="h-1.5 w-2/3 bg-pink-100 rounded-sm"></div>
                                </div>
                            </div>
                            <span className={`text-sm font-medium ${theme === 'pink-green' ? 'text-blue-700' : 'text-slate-600'}`}>Verde e Rosa</span>
                        </button>
                    </div>
                </section>

                <div className="flex justify-end pt-6 border-t border-slate-100 text-xs text-slate-400">
                    * Alterações são salvas automaticamente
                </div>
            </div>
        </div>
    );
}
