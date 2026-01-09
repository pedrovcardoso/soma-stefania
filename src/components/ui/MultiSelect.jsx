'use client';

import { useState, useEffect, useRef } from 'react';
import { MdClose, MdExpandMore } from 'react-icons/md';
import SearchableList from './SearchableList';

export default function MultiSelect({
    label,
    options = [],
    value = [],
    onChange,
    placeholder = 'Selecione...'
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const removeValue = (valToRemove, e) => {
        e.stopPropagation();
        onChange(value.filter(v => v !== valToRemove));
    };

    return (
        <div className="w-full" ref={containerRef}>
            {label && <label className="text-xs font-semibold text-text-muted mb-1 flex items-center gap-1">{label}</label>}

            <div className="relative">
                <div
                    className={`
            relative w-full h-[42px] bg-surface-alt border rounded-lg cursor-pointer 
            flex items-center justify-between px-3 text-sm transition-all
            ${isOpen ? 'ring-2 ring-accent/20 border-accent bg-surface' : 'border-border hover:border-text-muted/50'}
          `}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center gap-1.5 w-full overflow-hidden">
                        {value.length === 0 ? (
                            <span className="text-text-muted/60 truncate">{placeholder}</span>
                        ) : value.length > 1 ? (
                            <span className="bg-accent-soft text-accent px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap">
                                {value.length} SELECIONADOS
                            </span>
                        ) : (
                            <span className="text-text truncate font-medium">
                                {value[0]}
                            </span>
                        )}
                    </div>

                    <MdExpandMore
                        className={`text-text-muted/60 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                        size={20}
                    />
                </div>

                {isOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-scaleIn origin-top">
                        <SearchableList
                            options={options}
                            selected={value}
                            onChange={onChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
