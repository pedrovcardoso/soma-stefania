'use client';

import { useState } from 'react';
import { MdSearch, MdCheck } from 'react-icons/md';

export default function SearchableList({
    options = [],
    selected = [],
    onChange,
    placeholder = 'Pesquisar...',
    enableSelectAll = false
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOptions = options.filter(option =>
        String(option).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (option) => {
        const isSelected = selected.includes(option);
        if (isSelected) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const handleSelectAll = (e) => {
        e.stopPropagation();
        if (selected.length === options.length) {
            onChange([]);
        } else {
            onChange([...options]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-surface max-h-[350px]">
            <div className="p-3 border-b border-border bg-surface-alt/50 sticky top-0 z-10">
                <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-surface text-text placeholder:text-text-muted"
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                    />
                </div>
            </div>

            <div className="overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {enableSelectAll && options.length > 0 && (
                    <div
                        onClick={handleSelectAll}
                        className="px-3 py-2 text-xs font-bold text-accent uppercase tracking-wider cursor-pointer hover:bg-accent-soft rounded-lg mb-1 flex items-center justify-between transition-colors"
                    >
                        <span>{selected.length === options.length ? 'DESELECIONAR TUDO' : 'SELECIONAR TUDO'}</span>
                        {selected.length === options.length && <MdCheck size={14} />}
                    </div>
                )}

                {filteredOptions.length > 0 ? (
                    filteredOptions.map(option => {
                        const isSelected = selected.includes(option);
                        return (
                            <div
                                key={option}
                                onClick={() => toggleOption(option)}
                                className={`
                                    px-3 py-2 text-sm rounded-lg cursor-pointer transition-all flex items-center justify-between mb-0.5
                                    ${isSelected
                                        ? 'bg-accent-soft text-accent font-semibold shadow-sm'
                                        : 'text-text hover:bg-surface-alt hover:translate-x-1'}
                                `}
                            >
                                <span className="truncate">{option}</span>
                                {isSelected && <MdCheck className="shrink-0 ml-2" size={14} />}
                            </div>
                        );
                    })
                ) : (
                    <div className="px-4 py-8 text-center text-text-muted text-xs italic">
                        Nenhum resultado encontrado
                    </div>
                )}
            </div>
        </div>
    );
}
