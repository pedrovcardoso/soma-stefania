'use client';

import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { MdAccessibility, MdTextFormat, MdColorLens, MdClose, MdCheck, MdRefresh } from 'react-icons/md';
import useThemeStore from '@/store/useThemeStore';

export default function AccessibilityMenu({ className = '' }) {
    const {
        theme,
        setTheme,
        fontFamily,
        setFontFamily,
        fontSizeScale,
        setFontSizeScale,
        vLibrasActive,
        setVLibrasActive
    } = useThemeStore();

    const toggleDyslexicFont = () => {
        if (fontFamily === 'OpenDyslexic') {
            setFontFamily('Inter'); // Revert to default
        } else {
            setFontFamily('OpenDyslexic');
        }
    };

    const themes = [
        { id: 'hc', name: 'Alto Contraste', bg: 'bg-black', text: 'bg-yellow-400', border: 'border-white' },
        { id: 'protanopia', name: 'Protanopia', bg: 'bg-white', text: 'bg-slate-800', border: 'border-slate-200' },
        { id: 'deuteranopia', name: 'Deuteranopia', bg: 'bg-white', text: 'bg-slate-800', border: 'border-slate-200' },
        { id: 'tritanopia', name: 'Tritanopia', bg: 'bg-[#fffafa]', text: 'bg-slate-800', border: 'border-slate-200' },
        { id: 'achromatopsia', name: 'Achromatopsia', bg: 'bg-white', text: 'bg-black', border: 'border-slate-200' }
    ];

    return (
        <Popover className={`relative ${className}`}>
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`
                            relative h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50
                            ${open
                                ? 'bg-accent text-white shadow-lg shadow-accent/20 scale-105'
                                : 'bg-accent text-white shadow-md hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 active:scale-95'
                            }
                        `}
                        aria-label="Menu de Acessibilidade"
                    >
                        <MdAccessibility className="w-5 h-5" />
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute right-0 z-[999999] mt-3 w-[22rem] origin-top-right rounded-2xl bg-surface border border-border shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                            <div className="p-5 space-y-4 custom-scrollbar max-h-[85vh] overflow-y-auto">

                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-border pb-3">
                                    <h3 className="text-sm font-bold text-text flex items-center gap-2 uppercase tracking-wider">
                                        <MdAccessibility className="text-accent w-5 h-5" />
                                        Acessibilidade
                                    </h3>
                                </div>

                                {/* Font Size */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
                                            <MdTextFormat className="w-4 h-4" />
                                            <span>Tamanho da Fonte</span>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                                            {Math.round(fontSizeScale * 100)}%
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-text-muted font-medium">A-</span>
                                        <input
                                            type="range"
                                            min="1.0"
                                            max="1.5"
                                            step="0.05"
                                            value={fontSizeScale}
                                            onChange={(e) => setFontSizeScale(parseFloat(e.target.value))}
                                            className="flex-1 h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                                        />
                                        <span className="text-lg text-text-muted font-bold">A+</span>
                                    </div>
                                </div>

                                {/* Dyslexia Font */}
                                <div className="space-y-2 pt-4 border-t border-border/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-text-secondary">Fonte para Dislexia</span>
                                            <span className="text-[10px] text-text-muted">Melhora a legibilidade</span>
                                        </div>
                                        <button
                                            onClick={toggleDyslexicFont}
                                            className={`group relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none border-2 ${fontFamily === 'OpenDyslexic' ? 'bg-accent border-accent shadow-md shadow-accent/20' : 'bg-accent border-accent'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm ${fontFamily === 'OpenDyslexic' ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            >
                                                {fontFamily === 'OpenDyslexic' && (
                                                    <MdCheck className="w-3 h-3 text-accent absolute inset-0 m-auto" />
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                    <div className={`p-2 rounded-xl border border-border bg-surface-alt transition-all ${fontFamily === 'OpenDyslexic' ? 'ring-1 ring-accent/30 border-accent/30' : ''}`}>
                                        <p className={`text-xs text-text leading-relaxed font-opendyslexic`}>
                                            Exemplo de leitura com a fonte aplicada.
                                        </p>
                                    </div>
                                </div>

                                {/* VLibras Toggle */}
                                <div className="space-y-4 pt-4 border-t border-border/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                                <span className="text-xs font-bold">LB</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-text-secondary">Libras</span>
                                                <span className="text-[10px] text-text-muted">Tradução em tempo real</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setVLibrasActive(!vLibrasActive)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none border-2 ${vLibrasActive ? 'bg-accent border-accent shadow-md shadow-accent/20' : 'bg-accent border-accent'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm ${vLibrasActive ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            >
                                                {vLibrasActive && (
                                                    <MdCheck className="w-3 h-3 text-accent absolute inset-0 m-auto" />
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Color Themes - Skeleton View */}
                                <div className="space-y-4 pt-4 border-t border-border/50">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary mb-3">
                                        <MdColorLens className="w-4 h-4" />
                                        <span>Temas de Cores</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {themes.map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setTheme(t.id)}
                                                className={`group relative flex flex-col gap-2 p-2 rounded-xl border-2 transition-all
                                                    ${theme === t.id ? 'border-accent bg-accent/5' : 'border-transparent hover:bg-surface-alt'}`}
                                            >
                                                <div className={`w-full aspect-[2/1] rounded-lg ${t.bg} border ${t.border} shadow-sm overflow-hidden p-1.5 flex flex-col gap-1`}>
                                                    <div className={`h-1.5 w-1/3 ${t.text} rounded-full`}></div>
                                                    <div className={`h-1 w-full opacity-30 ${t.text} rounded-full`}></div>
                                                    <div className={`h-1 w-2/3 opacity-30 ${t.text} rounded-full`}></div>
                                                </div>
                                                <span className={`text-[10px] font-bold text-center ${theme === t.id ? 'text-accent' : 'text-text-secondary'}`}>{t.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>
                            <div className="p-4 bg-surface-alt border-t border-border rounded-b-2xl">
                                <button
                                    onClick={() => useThemeStore.getState().resetTheme()}
                                    className="w-full py-2.5 text-xs font-bold text-accent hover:bg-accent/10 rounded-xl transition-all border border-accent/20 flex items-center justify-center gap-2 active:scale-95 group"
                                >
                                    <MdRefresh size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                                    Redefinir para o Padrão
                                </button>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
