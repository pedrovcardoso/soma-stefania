'use client';

import { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import { MdSearch, MdFilterList, MdCheck, MdArrowUpward, MdArrowDownward, MdDragIndicator, MdRefresh, MdChevronLeft, MdChevronRight, MdFirstPage, MdLastPage, MdKeyboardArrowDown } from 'react-icons/md';
import { Popover, Transition } from '@headlessui/react';
import SearchableList from './SearchableList';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function SmartTable({ data = [], columns = [], className = '' }) {
    const [tableColumns, setTableColumns] = useState(columns);
    const [activeFilters, setActiveFilters] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [columnWidths, setColumnWidths] = useState({});
    const [tableWidth, setTableWidth] = useState('100%');

    const tableRef = useRef(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const resizingRef = useRef(null);
    const [resizingKey, setResizingKey] = useState(null);

    const draggingRef = useRef(null);
    const [dragTarget, setDragTarget] = useState({ key: null, side: null });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOrder, setDragOrder] = useState(columns.map(c => c.key));

    useEffect(() => {
        setTableColumns(columns);
        setDragOrder(columns.map(c => c.key));
    }, [columns]);
    const getUniqueValues = (key) => {
        const values = new Set();
        data.forEach(item => {
            const val = item[key];
            if (Array.isArray(val)) {
                val.forEach(v => values.add(v));
            } else if (val !== null && val !== undefined) {
                values.add(String(val));
            }
        });
        return Array.from(values).sort();
    };

    const handleFilterChange = (key, value, checked) => {
        setActiveFilters(prev => {
            const current = prev[key] || [];
            const updated = checked
                ? [...current, value]
                : current.filter(v => v !== value);

            const newFilters = { ...prev, [key]: updated };
            if (updated.length === 0) delete newFilters[key];
            return newFilters;
        });
    };

    const handleSort = (key) => {
        setSortConfig(current => {
            if (current.key === key) {
                if (current.direction === 'asc') return { key, direction: 'desc' };
                if (current.direction === 'desc') return { key: null, direction: 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const processedData = useMemo(() => {
        let result = [...data];

        Object.keys(activeFilters).forEach(key => {
            const requiredValues = activeFilters[key];
            if (requiredValues.length === 0) return;

            result = result.filter(row => {
                const val = row[key];
                if (Array.isArray(val)) {
                    return val.some(v => requiredValues.includes(String(v)));
                }
                return requiredValues.includes(String(val));
            });
        });

        if (sortConfig.key) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, activeFilters, sortConfig]);

    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return processedData.slice(start, start + itemsPerPage);
    }, [processedData, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilters, sortConfig, itemsPerPage]);

    const paginationRange = useMemo(() => {
        const siblingCount = 1;
        const totalPageNumbers = siblingCount + 5;

        if (totalPages <= totalPageNumbers) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, 'DOTS', totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
            return [firstPageIndex, 'DOTS', ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
            return [firstPageIndex, 'DOTS', ...middleRange, 'DOTS', lastPageIndex];
        }

        return [];
    }, [totalPages, currentPage]);

    const startResizing = (e, key) => {
        e.preventDefault();
        e.stopPropagation();

        const table = tableRef.current;
        const th = e.target.closest('th');
        if (!table || !th) return;

        const startX = e.pageX;
        const startWidth = th.offsetWidth;
        const startTableWidth = table.offsetWidth;

        resizingRef.current = { key, startX, startWidth, startTableWidth };
        setResizingKey(key);

        const onMouseMove = (moveEvent) => {
            if (!resizingRef.current) return;
            const { startX, startWidth, startTableWidth } = resizingRef.current;
            const deltaX = moveEvent.pageX - startX;

            const newColWidth = Math.max(80, startWidth + deltaX);

            setColumnWidths(prev => ({
                ...prev,
                [key]: newColWidth
            }));

            setTableWidth(`${startTableWidth + deltaX}px`);
        };

        const onMouseUp = () => {
            resizingRef.current = null;
            setResizingKey(null);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const handleDragStart = (e, key) => {
        if (resizingRef.current) {
            e.preventDefault();
            return;
        }

        draggingRef.current = key;
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, key) => {
        e.preventDefault();
        if (draggingRef.current === key) {
            setDragTarget({ key: null, side: null });
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const midpoint = (rect.left + rect.right) / 2;
        const side = e.clientX < midpoint ? 'left' : 'right';

        setDragTarget({ key, side });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const draggedKey = draggingRef.current;
        const { key: targetKey, side } = dragTarget;

        if (draggedKey && targetKey && draggedKey !== targetKey) {
            const oldIndex = dragOrder.indexOf(draggedKey);
            let newIndex = dragOrder.indexOf(targetKey);

            if (side === 'right') newIndex += 1;

            if (oldIndex < newIndex) newIndex -= 1;

            const newOrder = [...dragOrder];
            newOrder.splice(oldIndex, 1);
            newOrder.splice(newIndex, 0, draggedKey);
            setDragOrder(newOrder);
        }

        handleDragEnd();
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setDragTarget({ key: null, side: null });
        draggingRef.current = null;
    };

    const orderedColumns = useMemo(() => {
        return dragOrder.map(key => tableColumns.find(c => c.key === key)).filter(Boolean);
    }, [dragOrder, tableColumns]);

    return (
        <div className={`border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col ${className}`}>
            <div className="overflow-x-auto custom-scrollbar relative w-full min-h-[400px]">
                <table
                    ref={tableRef}
                    className="text-left border-collapse"
                    style={{ tableLayout: 'fixed', width: tableWidth, minWidth: '100%' }}
                >
                    <thead className="bg-slate-50 sticky top-0 z-20 shadow-sm border-b border-slate-200">
                        <tr>
                            {orderedColumns.map((col, index) => {
                                const uniqueValues = getUniqueValues(col.key);
                                const isFiltered = activeFilters[col.key]?.length > 0;
                                const isResizingThis = resizingKey === col.key;

                                const isDragOver = dragTarget.key === col.key;
                                const dragSide = dragTarget.side;

                                return (
                                    <th
                                        key={col.key}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, col.key)}
                                        onDragOver={(e) => handleDragOver(e, col.key)}
                                        onDrop={handleDrop}
                                        onDragEnd={handleDragEnd}
                                        style={{ width: columnWidths[col.key] || col.width ? `${columnWidths[col.key] || col.width}px` : undefined }}
                                        className="relative px-3 py-3 text-xs font-semibold text-slate-500 tracking-wider group select-none hover:bg-slate-100/50 transition-colors"
                                    >
                                        {isDragOver && (
                                            <div
                                                className={`absolute top-0 bottom-0 w-1 bg-slate-300 z-50 pointer-events-none ${dragSide === 'left' ? 'left-0' : 'right-0'}`}
                                            />
                                        )}
                                        <div className={`flex items-center gap-2 ${col.key === 'actions' ? 'justify-center' : 'justify-between'}`}>
                                            <div className={`flex items-center gap-2 overflow-hidden cursor-pointer ${col.key === 'actions' ? '' : 'flex-1'}`} onClick={() => handleSort(col.key)}>
                                                <span className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                                                    <MdDragIndicator className="text-slate-300 opacity-0 group-hover:opacity-100" />
                                                </span>
                                                <span className="truncate">{col.label}</span>
                                                {sortConfig.key === col.key && (
                                                    <span className="text-blue-600">
                                                        {sortConfig.direction === 'asc' ? <MdArrowUpward size={14} /> : <MdArrowDownward size={14} />}
                                                    </span>
                                                )}
                                            </div>

                                            {col.key !== 'actions' && (
                                                <Popover className="relative">
                                                    {({ open }) => (
                                                        <>
                                                            <Popover.Button className={`p-1 rounded-full hover:bg-slate-200 outline-none transition-colors ${open || (isFiltered && activeFilters[col.key]?.length < uniqueValues.length) ? 'text-blue-600 bg-blue-50' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`}>
                                                                <MdFilterList size={16} />
                                                            </Popover.Button>
                                                            <Transition
                                                                as={Fragment}
                                                                enter="transition ease-out duration-100"
                                                                enterFrom="transform opacity-0 scale-95"
                                                                enterTo="transform opacity-100 scale-100"
                                                                leave="transition ease-in duration-75"
                                                                leaveFrom="transform opacity-100 scale-100"
                                                                leaveTo="transform opacity-0 scale-95"
                                                            >
                                                                <Popover.Panel className={`absolute mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 ring-1 ring-black ring-opacity-5 focus:outline-none z-[100] overflow-hidden ${index === 0 ? 'left-0' : 'right-0'}`}>
                                                                    <SearchableList
                                                                        options={uniqueValues}
                                                                        selected={activeFilters[col.key] || []}
                                                                        onChange={(newVals) => {
                                                                            setActiveFilters(prev => {
                                                                                const newFilters = { ...prev, [col.key]: newVals };
                                                                                if (newVals.length === 0) delete newFilters[col.key];
                                                                                return newFilters;
                                                                            });
                                                                        }}
                                                                        enableSelectAll={true}
                                                                    />
                                                                </Popover.Panel>
                                                            </Transition>
                                                        </>
                                                    )}
                                                </Popover>
                                            )}
                                        </div>

                                        {col.key !== 'actions' && index < orderedColumns.length - 1 && (
                                            <div
                                                className="absolute right-[-8px] top-0 bottom-0 w-4 cursor-col-resize z-30 group/resizer flex justify-center"
                                                onMouseDown={(e) => startResizing(e, col.key)}
                                            >
                                                <div className={`w-[1px] h-full transition-colors ${isResizingThis
                                                    ? 'bg-blue-500 text-blue-500'
                                                    : 'bg-slate-300 opacity-0 group-hover/resizer:opacity-100'
                                                    }`} />
                                            </div>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {paginatedData.length > 0 ? paginatedData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-slate-100 transition-colors">
                                {orderedColumns.map(col => (
                                    <td key={col.key} className="px-4 py-3 text-sm text-slate-600 border-b border-slate-50 truncate" title={typeof row[col.key] === 'string' ? row[col.key] : ''} >
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={orderedColumns.length} className="px-6 py-10 text-center text-slate-500 italic">
                                    Nenhum dado encontrado com os filtros atuais.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">

                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Exibir:</span>
                        <Popover className="relative">
                            <Popover.Button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95">
                                <span>{itemsPerPage}</span>
                                <MdKeyboardArrowDown className="text-slate-400" size={16} />
                            </Popover.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95 translate-y-2"
                                enterTo="transform opacity-100 scale-100 translate-y-0"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100 translate-y-0"
                                leaveTo="transform opacity-0 scale-95 translate-y-2"
                            >
                                <Popover.Panel className="absolute bottom-full left-0 mb-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 ring-1 ring-black ring-opacity-5 focus:outline-none z-[100] p-1.5 flex flex-col gap-0.5 origin-bottom-left">
                                    <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                                        Linhas por página
                                    </div>

                                    {[5, 10, 15, 20, 50, 100].map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setItemsPerPage(size)}
                                            className={`flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-xs transition-colors ${itemsPerPage === size
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            <span>{size}</span>
                                            {itemsPerPage === size && <MdCheck size={14} className="text-blue-600" />}
                                        </button>
                                    ))}

                                    <div className="h-px bg-slate-100 my-1 mx-1" />

                                    <div className="px-2 py-1">
                                        <div className="text-[10px] text-slate-400 mb-1">Personalizado</div>
                                        <input
                                            type="number"
                                            min="1"
                                            max="1000"
                                            placeholder="..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const val = parseInt(e.target.value);
                                                    if (val > 0) {
                                                        setItemsPerPage(val);
                                                        e.target.value = '';
                                                    }
                                                }
                                            }}
                                            className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </Popover>
                    </div>
                    <span>
                        {Math.min(processedData.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(processedData.length, currentPage * itemsPerPage)} de {processedData.length} registros
                    </span>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center gap-4">
                        {paginationRange.includes('DOTS') && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>Ir para:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max={totalPages}
                                    className="w-10 px-1 py-0.5 border border-slate-200 rounded text-center text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = parseInt(e.target.value);
                                            if (val >= 1 && val <= totalPages) {
                                                setCurrentPage(val);
                                                e.target.value = '';
                                                e.target.blur();
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-500"
                                title="Primeira página"
                            >
                                <MdFirstPage size={20} />
                            </button>

                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-500"
                                title="Página anterior"
                            >
                                <MdChevronLeft size={20} />
                            </button>

                            {paginationRange.map((pageNumber, i) => {
                                if (pageNumber === 'DOTS') {
                                    return <span key={i} className="px-2 text-slate-400 select-none">...</span>;
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-all ${currentPage === pageNumber
                                            ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600'
                                            : 'text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-500"
                                title="Próxima página"
                            >
                                <MdChevronRight size={20} />
                            </button>

                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-500"
                                title="Última página"
                            >
                                <MdLastPage size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
