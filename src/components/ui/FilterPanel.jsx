'use client';
import { MdFilterList, MdRefresh } from 'react-icons/md';

export default function FilterPanel({ title = "PAINEL DE FILTROS", onClear, children, className = "" }) {
    return (
        <div className={`bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm mb-8 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <MdFilterList />{title}
                </h2>
                {onClear && (
                    <button onClick={onClear} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
                        <MdRefresh size={16} /> Limpar
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-4 items-end">
                {children}
            </div>
        </div>
    );
}
