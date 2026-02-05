'use client';

import { useState } from 'react';
import { MdSearch, MdCheck } from 'react-icons/md';

export default function SearchableList({
    options = [],
    selected = [],
    onChange,
    placeholder = 'Pesquisar...',
    multiple = true,
    showSearch = true,
    showSelectAll = false,
    showClear = false,
    surfaceColor,
    textColor,
    accentColor,
    isLoading = false
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOptions = options.filter(option =>
        String(option).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (option) => {
        if (!multiple) {
            onChange([option]);
            return;
        }

        const isSelected = selected.includes(option);
        if (isSelected) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const handleSelectAll = (e) => {
        e.stopPropagation();
        onChange([...options]);
    };

    const handleClearSelection = (e) => {
        e.stopPropagation();
        onChange([]);
    };

    const customStyles = {
        '--custom-surface': surfaceColor || 'var(--surface)',
        '--custom-text': textColor || 'var(--text)',
        '--custom-accent': accentColor || 'var(--accent)',
    };

    return (
        <div
            className="flex flex-col h-full bg-surface max-h-[350px]"
            style={customStyles}
        >
            {showSearch && (
                <div className="p-3 border-b border-border bg-surface-alt/50 sticky top-0 z-10" style={{ backgroundColor: surfaceColor ? `${surfaceColor}1a` : undefined }}>
                    <div className="relative">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-surface text-text placeholder:text-text-muted"
                            style={{
                                backgroundColor: surfaceColor,
                                color: textColor,
                                borderColor: accentColor ? `${accentColor}40` : undefined
                            }}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                </div>
            )}

            <div className="overflow-y-auto p-1.5 custom-scrollbar scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {isLoading ? (
                    <div className="px-4 py-8 text-center text-text-muted text-xs italic flex flex-col items-center gap-2 font-normal normal-case">
                        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                        Carregando opções...
                    </div>
                ) : filteredOptions.length > 0 ? (
                    filteredOptions.map(option => {
                        const isSelected = selected.includes(option);
                        return (
                            <div
                                key={option}
                                onClick={() => toggleOption(option)}
                                className={`
                                    px-3 py-2 text-sm rounded-lg cursor-pointer transition-all flex items-center justify-between mb-0.5 font-normal normal-case
                                    ${isSelected
                                        ? 'bg-accent-soft text-accent shadow-sm'
                                        : 'text-text hover:bg-surface-alt hover:translate-x-1'}
                                `}
                                style={isSelected ? {
                                    backgroundColor: accentColor ? `${accentColor}1a` : undefined,
                                    color: accentColor
                                } : {
                                    color: textColor
                                }}
                            >
                                <span className="truncate">{option}</span>
                                {isSelected && <MdCheck className="shrink-0 ml-2" size={14} style={{ color: accentColor }} />}
                            </div>
                        );
                    })
                ) : (
                    <div className="px-4 py-8 text-center text-text-muted text-xs italic font-normal normal-case">
                        Nenhum resultado encontrado
                    </div>
                )}
            </div>

            {(showSelectAll || showClear) && multiple && (
                <div className="p-3 border-t border-border bg-surface-alt/30 flex justify-between gap-2">
                    {showSelectAll ? (
                        <button
                            onClick={handleSelectAll}
                            className="text-[10px] font-medium text-text-muted hover:text-accent tracking-wider transition-colors normal-case"
                            style={{ color: textColor ? `${textColor}99` : undefined }}
                        >
                            Selecionar tudo
                        </button>
                    ) : <div />}

                    {showClear && (
                        <button
                            onClick={handleClearSelection}
                            className="text-[10px] font-medium text-text-muted hover:text-red-500 tracking-wider transition-colors normal-case"
                            style={{ color: textColor ? `${textColor}99` : undefined }}
                        >
                            Limpar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
