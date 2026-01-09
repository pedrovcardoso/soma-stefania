'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
            {label && <label className="text-xs font-semibold text-slate-500 mb-1 block">{label}</label>}

            <div className="relative">
                <div
                    className={`
            relative w-full min-h-[42px] bg-slate-50 border rounded-md cursor-pointer 
            flex items-center justify-between py-1.5 pl-2 pr-8 text-sm transition-all
            ${isOpen ? 'ring-2 ring-blue-500 border-transparent bg-white' : 'border-slate-300 hover:border-slate-400'}
          `}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex flex-wrap gap-1.5 w-full">
                        {value.length === 0 ? (
                            <span className="text-slate-500 px-1">{placeholder}</span>
                        ) : value.length > 2 ? (
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium animate-fadeIn">
                                Seleções múltiplas ({value.length})
                            </span>
                        ) : (
                            value.map(val => (
                                <span
                                    key={val}
                                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium animate-fadeIn"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {val}
                                    <button
                                        onClick={(e) => removeValue(val, e)}
                                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                    >
                                        <MdClose size={12} />
                                    </button>
                                </span>
                            ))
                        )}
                    </div>

                    <MdExpandMore
                        className={`absolute right-2 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        size={20}
                    />
                </div>

                {isOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden animate-scaleIn origin-top">
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
