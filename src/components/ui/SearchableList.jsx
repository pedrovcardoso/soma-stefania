'use client';

import { useState, useMemo } from 'react';
import { MdSearch, MdRefresh } from 'react-icons/md';

export default function SearchableList({
    options = [],
    selected = [],
    onChange,
    placeholder = 'Pesquisar...',
    enableSelectAll = false
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const normalizeText = (text) => {
        if (!text) return '';
        return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const filteredOptions = useMemo(() => {
        let result = options;
        if (searchTerm) {
            const normalizedSearch = normalizeText(searchTerm);
            result = options.filter(option =>
                normalizeText(option).includes(normalizedSearch)
            );
        }
        return [...result].sort((a, b) => {
            const aSelected = selected.includes(a);
            const bSelected = selected.includes(b);
            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return a.localeCompare(b);
        });
    }, [options, searchTerm, selected]);

    const toggleOption = (option) => {
        const newSelected = selected.includes(option)
            ? selected.filter(v => v !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    const handleSelectAll = () => {
        onChange(options);
    };

    const handleClear = () => {
        onChange([]);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-2 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
                <div className="relative">
                    <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow"
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                    />
                </div>
            </div>

            <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map(option => {
                        const isSelected = selected.includes(option);
                        return (
                            <div
                                key={option}
                                onClick={() => toggleOption(option)}
                                className={`
                                    px-3 py-2 text-sm rounded cursor-pointer transition-colors flex items-center justify-between
                                    ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}
                                `}
                            >
                                <span className="truncate">{option}</span>
                                {isSelected && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>}
                            </div>
                        );
                    })
                ) : (
                    <div className="py-3 px-2 text-center text-slate-400 text-sm">
                        Nenhum resultado encontrado.
                    </div>
                )}
            </div>

            <div className="bg-slate-50 border-t border-slate-100 px-3 py-2 text-xs text-slate-500 flex justify-between items-center gap-3 shrink-0">
                <button
                    onClick={(e) => { e.stopPropagation(); handleSelectAll(); }}
                    className="font-medium text-slate-500 hover:text-blue-600 transition-colors hover:bg-blue-50 px-2 py-1 rounded"
                    title="Selecionar todos os itens listados"
                >
                    Selecionar Todos
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); handleClear(); }}
                    disabled={selected.length === 0}
                    className={`flex items-center gap-1 transition-colors px-2 py-1 rounded ${selected.length === 0
                        ? 'opacity-50 cursor-not-allowed text-slate-400'
                        : 'hover:text-red-600 text-slate-500 hover:bg-red-50'
                        }`}
                    title="Limpar seleção atual"
                >
                    <MdRefresh size={14} />
                    Limpar
                </button>
            </div>
        </div>
    );
}
