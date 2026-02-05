'use client';

import { useState, useEffect, useRef } from 'react';
import { MdExpandMore, MdClose } from 'react-icons/md';
import SearchableList from './SearchableList';

/**
 * CustomSelect Component
 * 
 * @param {string} label - Input label
 * @param {Array} options - List of selectable options
 * @param {Array|string} value - Selected value(s)
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} multiple - If true, allows multi-selection (default: true)
 * @param {boolean} shouldGroup - If true, groups multi-selection (default: true)
 * @param {boolean} showSearch - If true, shows search box (default: true)
 * @param {boolean} showSelectAll - If true, shows "Selecionar tudo" in footer
 * @param {boolean} showClear - If true, shows "Limpar" in footer
 * @param {string} surfaceColor - Custom surface color (CSS value)
 * @param {string} textColor - Custom text color (CSS value)
 * @param {string} accentColor - Custom accent color (CSS value)
 */
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
    isLoading = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Normalize value to array for easier internal handling if multiple is true
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
            // For single selection, newValue is typically an array with one item from SearchableList
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
        <div className="w-full" ref={containerRef} style={customStyles}>
            {label && (
                <label className="text-xs font-semibold text-text-muted mb-1 flex items-center gap-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <div
                    className={`
                        relative w-full min-h-[42px] border rounded-lg cursor-pointer 
                        flex items-center justify-between px-3 py-1.5 text-sm transition-all
                        border-border hover:border-text-muted/50
                    `}
                    style={{
                        backgroundColor: surfaceColor || 'var(--surface-alt)',
                        color: textColor || 'inherit'
                    }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center gap-1.5 w-full overflow-hidden flex-wrap">
                        {isLoading ? (
                            <div className="flex items-center w-full py-2">
                                <div className="h-4 w-3/4 rounded-md skeleton-shimmer shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] opacity-90"></div>
                            </div>
                        ) : normalizedValue.length === 0 ? (
                            <span className="text-text-muted/60 truncate">{placeholder}</span>
                        ) : multiple && shouldGroup && normalizedValue.length > 1 ? (
                            <span className="bg-accent-soft text-accent px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap">
                                {normalizedValue.length} selecionados
                            </span>
                        ) : multiple && !shouldGroup ? (
                            normalizedValue.map(val => (
                                <span
                                    key={val}
                                    onClick={(e) => removeBadge(val, e)}
                                    className="relative text-text pl-2 pr-2 hover:pr-5 py-0.5 rounded text-[11px] font-medium flex items-center whitespace-nowrap transition-all after:content-['\00d7'] after:absolute after:right-1.5 after:text-[14px] after:leading-none after:opacity-0 hover:after:opacity-100"
                                    style={{
                                        color: textColor,
                                        backgroundColor: 'color-mix(in srgb, currentColor 8%, transparent)',
                                    }}
                                >
                                    {val}
                                </span>
                            ))
                        ) : (
                            <span className="text-text truncate font-medium" style={{ color: textColor }}>
                                {normalizedValue[0]}
                            </span>
                        )}
                    </div>

                    <MdExpandMore
                        className={`text-text-muted/60 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`}
                        size={20}
                        style={{ color: textColor ? `${textColor}99` : undefined }}
                    />
                </div>

                {isOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-scaleIn origin-top">
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
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
