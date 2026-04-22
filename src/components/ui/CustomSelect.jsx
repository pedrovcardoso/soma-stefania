'use client';

import { useState, useEffect, useRef } from 'react';
import { MdExpandMore, MdClose } from 'react-icons/md';
import SearchableList from './SearchableList';

export default function CustomSelect({
    label,
    options = [],
    value = [],
    onChange,
    placeholder = 'Selecione...',
    multiple = true,
    shouldGroup = true,
    showSearch = true,
    showSelectAll = false,
    showClear = false,
    surfaceColor,
    textColor,
    accentColor,
    isLoading = false,
    creatable = false,
    onCreateOption
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const normalizedValue = multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleValueChange = (newValue) => {
        if (!multiple) {
            const selectedValue = Array.isArray(newValue) ? newValue[newValue.length - 1] : newValue;
            onChange(selectedValue);
            setIsOpen(false);
        } else {
            onChange(newValue);
        }
    };

    const removeBadge = (valToRemove, e) => {
        e.stopPropagation();
        onChange(normalizedValue.filter(v => v !== valToRemove));
    };

    const customStyles = {
        '--custom-surface': surfaceColor || 'var(--surface-alt)',
        '--custom-text': textColor || 'inherit',
        '--custom-accent': accentColor || 'var(--accent)',
    };

    return (
        <div className="w-full flex flex-col gap-1.5" ref={containerRef} style={customStyles}>
            {label && (
                <label className="text-xs font-semibold text-text-muted mb-1 flex items-center gap-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <div
                    className={`
                        relative w-full h-[42px] border rounded-xl cursor-pointer
                        flex items-center justify-between px-4 py-2 text-sm transition-all duration-200
                        ${isOpen
                            ? 'border-accent shadow-[0_0_0_3px_rgba(var(--accent-rgb),0.1)] bg-surface'
                            : 'border-border bg-surface hover:border-text-muted/40 hover:bg-gray-50 shadow-sm'
                        }
                    `}
                    style={{
                        backgroundColor: surfaceColor || undefined,
                        color: textColor || 'inherit'
                    }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center gap-2 w-full overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center w-full">
                            <div className="h-4 w-28 bg-slate-200 animate-pulse rounded" />
                        </div>
                    ) : normalizedValue.length === 0 ? (
                            <span className="text-text-muted/70 truncate">{placeholder}</span>
                        ) : multiple && shouldGroup && normalizedValue.length > 1 ? (
                            <div className="flex items-center gap-2">
                                <span className="bg-accent text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tight">
                                    {normalizedValue.length} selecionados
                                </span>
                            </div>
                        ) : (
                            <span className="text-text truncate leading-none">
                                {multiple && !shouldGroup ? normalizedValue.join(', ') : normalizedValue[0]}
                            </span>
                        )}
                    </div>

                    <MdExpandMore
                        className={`text-text-muted/50 transition-transform duration-300 shrink-0 ml-2 ${isOpen ? 'rotate-180 text-accent' : ''}`}
                        size={22}
                    />
                </div>

                {/* Dropdown Menu - Mantenha sua lógica do SearchableList, mas use rounded-xl para bater com o input */}
                {isOpen && (
                    <div className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <SearchableList
                            options={options}
                            selected={normalizedValue}
                            onChange={handleValueChange}
                            multiple={multiple}
                            showSearch={showSearch}
                            showSelectAll={showSelectAll}
                            showClear={showClear}
                            surfaceColor={surfaceColor}
                            textColor={textColor}
                            accentColor={accentColor}
                            isLoading={isLoading}
                            creatable={creatable}
                            onCreateOption={(newOpt) => {
                                if (onCreateOption) {
                                    onCreateOption(newOpt);
                                } else {
                                    handleValueChange(multiple ? [...normalizedValue, newOpt] : [newOpt]);
                                }
                                setIsOpen(false);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}