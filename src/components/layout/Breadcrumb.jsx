'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MdChevronRight, MdHome, MdLanguage, MdDescription, MdHistory, MdSettings, MdBarChart, MdChat, MdFavorite, MdAddToPhotos, MdGridView, MdRefresh } from 'react-icons/md';
import useTabStore from '@/store/useTabStore';

const getTabIcon = (type) => {
    switch (type) {
        case 'home': return <MdHome size={14} />;
        case 'dashboard': return <MdBarChart size={14} />;
        case 'sei_list': return <MdLanguage size={14} />;
        case 'sei_detail': return <MdLanguage size={14} />;
        case 'doc_list': return <MdDescription size={14} />;
        case 'doc_detail': return <MdDescription size={14} />;
        case 'stefania': return <MdChat size={14} />;
        case 'favorites': return <MdFavorite size={14} />;
        case 'action_plans': return <MdAddToPhotos size={14} />;
        case 'settings': return <MdSettings size={14} />;
        case 'history': return <MdHistory size={14} />;
        default: return <MdDescription size={14} />;
    }
};

const getCategoryInfo = (type) => {
    if (type.startsWith('sei')) return { label: 'Processos SEI', id: 'sei', type: 'sei_list' };
    if (type.startsWith('doc')) return { label: 'Documentos', id: 'documents', type: 'doc_list' };
    if (type.startsWith('settings')) return { label: 'Configurações', id: 'settings', type: 'settings' };
    if (type === 'history') return { label: 'Histórico', id: 'history', type: 'history' };
    if (type === 'dashboard') return { label: 'Dashboard', id: 'dashboard', type: 'dashboard' };
    if (type === 'stefania') return { label: 'StefanIA', id: 'stefania', type: 'stefania' };
    if (type === 'action_plans') return { label: 'Planos de Ação', id: 'action-plans', type: 'action_plans' };
    return null;
};

export default function Breadcrumb() {
    const { tabs, activeTabId, switchTab, openTab, reloadTab } = useTabStore();
    const activeTab = tabs.find(t => t.id === activeTabId);

    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    const getCurrentUrl = () => {
        const prefix = '/main';
        if (activeTabId === 'home') return `${prefix}/inicio`;
        if (!activeTab) return `${prefix}/inicio`;

        switch (activeTab.type) {
            case 'sei_list': return `${prefix}/processos_sei`;
            case 'sei_detail': return `${prefix}/processos_sei/${activeTab.id}`;
            case 'doc_list': return `${prefix}/documentos`;
            case 'history': return `${prefix}/historico`;
            case 'settings': return `${prefix}/configuracoes`;
            case 'dashboard': return `${prefix}/dashboard`;
            case 'stefania': return `${prefix}/stefania`;
            case 'favorites': return `${prefix}/favoritos`;
            case 'action_plans': return `${prefix}/planos-de-acao`;
            default: return `${prefix}/${activeTab.type}/${activeTab.id}`;
        }
    };

    const navigateToUrl = (url) => {
        const normalized = url.trim().toLowerCase();
        const path = normalized.startsWith('/') ? normalized : `/${normalized}`;

        // Remove trailing slash if any
        const cleanPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;

        if (cleanPath === '/main/inicio' || cleanPath === '/main' || cleanPath === '/') return switchTab('home');

        if (cleanPath === '/main/processos_sei') return openTab({ id: 'sei', type: 'sei_list', title: 'Processos SEI' });

        const seiMatch = cleanPath.match(/^\/main\/processos_sei\/(.+)$/);
        if (seiMatch) return openTab({ id: seiMatch[1], type: 'sei_detail', title: seiMatch[1] });

        if (cleanPath === '/main/historico') return openTab({ id: 'history', type: 'history', title: 'Histórico' });
        if (cleanPath === '/main/configuracoes') return openTab({ id: 'settings', type: 'settings', title: 'Configurações' });
        if (cleanPath === '/main/documentos') return openTab({ id: 'documents', type: 'doc_list', title: 'Documentos' });
        if (cleanPath === '/main/dashboard') return openTab({ id: 'dashboard', type: 'dashboard', title: 'Dashboard' });
        if (cleanPath === '/main/stefania') return openTab({ id: 'stefania', type: 'stefania', title: 'StefanIA' });
        if (cleanPath === '/main/favoritos') return openTab({ id: 'favorites', type: 'favorites', title: 'Favoritos' });
        if (cleanPath === '/main/planos-de-acao') return openTab({ id: 'action-plans', type: 'action_plans', title: 'Planos de Ação' });

        return false;
    };

    const handleHomeClick = () => {
        switchTab('home');
    };

    const handleCategoryClick = (category) => {
        if (!category) return;
        openTab({
            id: category.id,
            type: category.type,
            title: category.label
        });
    };

    const breadcrumbs = [];

    // Permanent Home root
    breadcrumbs.push({
        id: 'home',
        label: 'Início',
        icon: <MdHome size={14} />,
        onClick: handleHomeClick,
        isLast: activeTabId === 'home'
    });

    if (activeTabId !== 'home' && activeTab) {
        const category = getCategoryInfo(activeTab.type);

        if (category) {
            breadcrumbs.push({
                id: 'category',
                label: category.label,
                icon: getTabIcon(category.type),
                onClick: activeTab.title !== category.label ? () => handleCategoryClick(category) : null,
                isLast: activeTab.title === category.label,
                subLabel: activeTab.title === category.label ? activeTab.data?.subLabel : null
            });
        }

        if (activeTab.title && activeTab.title !== category?.label) {
            breadcrumbs.push({
                id: activeTabId,
                label: activeTab.title,
                subLabel: activeTab.data?.subLabel,
                isLast: true
            });
        }
    }

    const enterEditMode = () => {
        setInputValue(getCurrentUrl());
        setIsEditing(true);
    };

    const handleSubmit = () => {
        const success = navigateToUrl(inputValue);
        setIsEditing(false);
    };

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    return (
        <nav
            className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 cursor-text"
            onClick={(e) => {
                if (e.target.closest('button') || e.target.closest('.crumb-link')) return;
                enterEditMode();
            }}
        >
            <div className="flex items-center flex-grow overflow-hidden">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSubmit();
                            if (e.key === 'Escape') setIsEditing(false);
                        }}
                        onBlur={() => setIsEditing(false)}
                        className="w-full h-6 text-[11px] font-medium text-blue-600 bg-blue-50/50 border border-blue-200 rounded px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        spellCheck={false}
                    />
                ) : (
                    <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.id + index}>
                                {index > 0 && <MdChevronRight size={14} className="text-slate-300 flex-shrink-0" />}
                                <div
                                    className={`flex items-center gap-1.5 flex-shrink-0 ${crumb.onClick ? 'hover:text-blue-600 cursor-pointer transition-colors crumb-link' : ''} ${crumb.isLast ? 'text-slate-900 font-bold' : ''}`}
                                    onClick={(e) => {
                                        if (crumb.onClick) {
                                            e.stopPropagation();
                                            crumb.onClick();
                                        }
                                    }}
                                >
                                    {crumb.icon}
                                    <span className="truncate max-w-[200px] md:max-w-xs">{crumb.label}</span>
                                    {crumb.subLabel && (
                                        <span className="text-[10px] text-slate-400 font-normal lowercase bg-slate-100 px-1.5 py-0.5 rounded ml-1">
                                            {crumb.subLabel}
                                        </span>
                                    )}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>

            {activeTabId !== 'home' && !isEditing && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        reloadTab(activeTabId);
                    }}
                    className="p-1 hover:bg-slate-100 rounded-full transition-all duration-200 active:rotate-180 group ml-2 flex-shrink-0"
                    title="Atualizar dados"
                >
                    <MdRefresh size={16} className="text-slate-400 group-hover:text-blue-600" />
                </button>
            )}
        </nav>
    );
}
