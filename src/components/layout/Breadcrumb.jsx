'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MdChevronRight, MdHome, MdLanguage, MdDescription, MdHistory, MdSettings, MdBarChart, MdChat, MdFavorite, MdAddToPhotos, MdGridView, MdRefresh } from 'react-icons/md';
import useTabStore from '@/store/useTabStore';
import useHistoryStore from '@/store/useHistoryStore';

import { toast } from '@/components/ui/toast';
import { getDistinctProcesses } from '@/services/seiService';

const STATIC_PATHS = [
    '/main/inicio',
    '/main/processos_sei',
    '/main/documentos',
    '/main/historico',
    '/main/configuracoes',
    '/main/dashboard',
    '/main/stefania',
    '/main/favoritos',
    '/main/planos-de-acao'
];

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
    const { recentAccesses } = useHistoryStore();
    const activeTab = tabs.find(t => t.id === activeTabId);

    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isValidatingSei, setIsValidatingSei] = useState(false);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

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

    const navigateToUrl = async (url) => {
        const normalized = url.trim().toLowerCase();
        const path = normalized.startsWith('/') ? normalized : `/${normalized}`;

        const cleanPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;

        if (cleanPath === '/main/inicio' || cleanPath === '/main' || cleanPath === '/') {
            switchTab('home');
            return true;
        }

        if (cleanPath === '/main/processos_sei') {
            openTab({ id: 'sei', type: 'sei_list', title: 'Processos SEI' });
            return true;
        }

        // Detect SEI number either via path or if the input is purely numeric/separators
        const rawDigits = normalized.replace(/\D/g, '');
        const seiMatch = cleanPath.match(/^\/main\/processos_sei\/(.+)$/i);

        let targetDigits = null;

        if (seiMatch) {
            targetDigits = seiMatch[1].replace(/\D/g, '');
        } else if (rawDigits.length > 0) {
            targetDigits = rawDigits;
        }

        if (targetDigits) {
            setIsValidatingSei(true);
            try {
                const processes = await getDistinctProcesses();

                const foundProcess = processes.find(p => {
                    const dbDigits = (p.sei || p.numero || '').toString().replace(/\D/g, '');
                    return dbDigits === targetDigits;
                });

                if (foundProcess) {
                    const finalSei = foundProcess.sei || foundProcess.numero;
                    openTab({ id: finalSei, type: 'sei_detail', title: finalSei });
                    setIsValidatingSei(false);
                    return true;
                } else {
                    toast(`Processo SEI não encontrado.`, 'error');
                    setIsValidatingSei(false);
                    return false;
                }
            } catch (error) {
                console.error("Erro ao validar SEI:", error);
                toast(`Erro ao validar o processo.`, 'error');
                setIsValidatingSei(false);
                return false;
            }
        }

        if (cleanPath === '/main/historico') {
            openTab({ id: 'history', type: 'history', title: 'Histórico' });
            return true;
        }
        if (cleanPath === '/main/configuracoes') {
            openTab({ id: 'settings', type: 'settings', title: 'Configurações' });
            return true;
        }
        if (cleanPath === '/main/documentos') {
            openTab({ id: 'documents', type: 'doc_list', title: 'Documentos' });
            return true;
        }
        if (cleanPath === '/main/dashboard') {
            openTab({ id: 'dashboard', type: 'dashboard', title: 'Dashboard' });
            return true;
        }
        if (cleanPath === '/main/stefania') {
            openTab({ id: 'stefania', type: 'stefania', title: 'StefanIA' });
            return true;
        }
        if (cleanPath === '/main/favoritos') {
            openTab({ id: 'favorites', type: 'favorites', title: 'Favoritos' });
            return true;
        }
        if (cleanPath === '/main/planos-de-acao') {
            openTab({ id: 'action-plans', type: 'action_plans', title: 'Planos de Ação' });
            return true;
        }

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
        setShowSuggestions(true);
    };

    const handleSubmit = async (val = inputValue) => {
        const success = await navigateToUrl(val);
        if (success) {
            setIsEditing(false);
            setShowSuggestions(false);
        } else {
            // Fallback to current URL and close edit mode
            setInputValue(getCurrentUrl());
            setIsEditing(false);
            setShowSuggestions(false);
        }
    };

    const getSuggestionPool = (query = '') => {
        const normalizedQuery = query.toLowerCase();
        let pool = [];

        // 1. Static Paths (System Hubs)
        STATIC_PATHS.forEach(path => {
            pool.push({ label: path.split('/').pop().replace(/-/g, ' '), value: path, type: 'path' });
        });

        // 2. Open Tabs (Interactive Context)
        tabs.forEach(tab => {
            if (tab.id === activeTabId) return;
            const prefix = '/main';
            let path = '';
            switch (tab.type) {
                case 'sei_list': path = `${prefix}/processos_sei`; break;
                case 'sei_detail': path = `${prefix}/processos_sei/${tab.id}`; break;
                case 'doc_list': path = `${prefix}/documentos`; break;
                case 'history': path = `${prefix}/historico`; break;
                case 'settings': path = `${prefix}/configuracoes`; break;
                case 'dashboard': path = `${prefix}/dashboard`; break;
                case 'stefania': path = `${prefix}/stefania`; break;
                case 'favorites': path = `${prefix}/favoritos`; break;
                case 'action_plans': path = `${prefix}/planos-de-acao`; break;
                default: path = `${prefix}/${tab.type}/${tab.id}`;
            }
            if (path) pool.push({ label: tab.title, value: path, type: 'history' });
        });

        // 3. Recent History (Recent Accesses)
        recentAccesses.forEach(item => {
            const prefix = '/main';
            let path = '';
            if (item.type === 'sei_detail') path = `${prefix}/processos_sei/${item.contentId}`;
            else if (item.type === 'doc_detail') path = `${prefix}/documentos/${item.contentId}`;

            if (path) {
                pool.push({
                    label: item.title,
                    value: path,
                    type: item.type === 'sei_detail' ? 'process_history' : 'history'
                });
            }
        });

        // Smart Filtering
        let filtered = pool.filter(item =>
            item.value.toLowerCase().includes(normalizedQuery) ||
            item.label.toLowerCase().includes(normalizedQuery)
        );

        // Limit results and ensure uniqueness by value
        const uniqueFiltered = Array.from(new Map(filtered.map(item => [item.value, item])).values());

        return uniqueFiltered.slice(0, 10);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setSelectedIndex(0);

        const suggestionsPool = getSuggestionPool(value);
        setSuggestions(suggestionsPool);
        setShowSuggestions(true);
    };

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
            // Show suggestions immediately on enter edit mode
            const current = getCurrentUrl();
            setInputValue(current);
            setSuggestions(getSuggestionPool(current));
            setShowSuggestions(true);
        }
    }, [isEditing]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getSuggestionIcon = (type) => {
        switch (type) {
            case 'history': return <MdHistory size={14} />;
            case 'process_history': return <MdRefresh size={14} />;
            case 'process': return <MdLanguage size={14} />;
            default: return <MdGridView size={14} />;
        }
    };

    return (
        <nav
            className={`flex items-center justify-between px-4 py-2 bg-surface-alt border-b border-border cursor-text relative h-10 ${isEditing ? 'z-50' : 'z-10'}`}
            onClick={(e) => {
                if (e.target.closest('button') || e.target.closest('.crumb-link') || e.target.closest('.suggestions-container')) return;
                enterEditMode();
            }}
        >
            <div className="flex items-center flex-grow relative">
                {isEditing ? (
                    <div className="w-full relative px-1">
                        <div className="flex items-center w-full group relative">
                            {isValidatingSei ? (
                                <div className="absolute left-4 z-10 w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <MdLanguage size={16} className="absolute left-4 text-accent z-10 transition-transform group-focus-within:scale-110" />
                            )}
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (showSuggestions && suggestions[selectedIndex]) {
                                            const selectedValue = suggestions[selectedIndex].value;
                                            setInputValue(selectedValue);
                                            handleSubmit(selectedValue);
                                        } else {
                                            handleSubmit();
                                        }
                                    } else if (e.key === 'Escape') {
                                        setInputValue(getCurrentUrl());
                                        setIsEditing(false);
                                        setShowSuggestions(false);
                                        inputRef.current?.blur();
                                    } else if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        if (suggestions.length > 0) {
                                            setSelectedIndex(prev => (prev + 1) % suggestions.length);
                                        }
                                    } else if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        if (suggestions.length > 0) {
                                            setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
                                        }
                                    }
                                }}
                                onBlur={() => {
                                    setTimeout(() => {
                                        if (!showSuggestions) {
                                            setInputValue(getCurrentUrl());
                                            setIsEditing(false);
                                        }
                                    }, 200);
                                }}
                                onFocus={() => {
                                    if (!showSuggestions) setShowSuggestions(true);
                                }}
                                className={`w-full h-8 pl-10 pr-4 text-xs font-medium text-accent bg-surface border-2 border-accent rounded-full focus:outline-none shadow-lg shadow-accent/5 ring-4 ring-accent/5 transition-all ${isValidatingSei ? 'opacity-70 pointer-events-none' : ''}`}
                                spellCheck={false}
                            />
                        </div>
                        {showSuggestions && suggestions.length > 0 && (
                            <div
                                ref={suggestionsRef}
                                className="absolute top-[calc(100%+8px)] left-0 w-full bg-surface border border-border rounded-xl shadow-lg z-[999] suggestions-container overflow-hidden"
                            >
                                <div className="py-1 flex flex-col max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={suggestion.value + index}
                                            className={`px-3 py-2 text-[11px] cursor-pointer transition-all flex items-center justify-between group ${index === selectedIndex ? 'bg-surface-alt text-accent' : 'hover:bg-surface-alt/50 text-text-muted'
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setInputValue(suggestion.value);
                                                handleSubmit(suggestion.value);
                                            }}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`p-1.5 rounded-lg transition-colors ${index === selectedIndex ? 'bg-accent/5 text-accent' : 'bg-surface-alt text-text-muted/40'}`}>
                                                    {getSuggestionIcon(suggestion.type)}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className={`font-semibold truncate text-[11px] ${index === selectedIndex ? 'text-accent' : 'text-text'}`}>
                                                        {suggestion.label}
                                                    </span>
                                                    <span className={`text-[10px] truncate ${index === selectedIndex ? 'text-accent/50' : 'text-text-muted/60'}`}>
                                                        {suggestion.value}
                                                    </span>
                                                </div>
                                            </div>
                                            {index === selectedIndex && (
                                                <div className="flex items-center gap-2 text-accent/30 mr-1">
                                                    <span className="text-[8px] font-bold tracking-tight px-1 py-0.5 border border-accent/10 rounded">ENTER</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 text-[11px] font-medium text-text-muted uppercase tracking-wider h-full overflow-hidden">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.id + index}>
                                {index > 0 && <MdChevronRight size={14} className="text-text-muted opacity-50 flex-shrink-0" />}
                                <div
                                    className={`flex items-center gap-1.5 flex-shrink-0 ${crumb.onClick ? 'hover:text-accent cursor-pointer transition-colors crumb-link' : ''} ${crumb.isLast ? 'text-text font-bold' : ''}`}
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
                                        <span className="text-[10px] text-text-muted font-normal lowercase bg-surface-alt px-1.5 py-0.5 rounded ml-1 border border-border">
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
                    className="p-1 hover:bg-surface-alt rounded-full transition-all duration-200 active:rotate-180 group ml-2 flex-shrink-0"
                    title="Atualizar dados"
                >
                    <MdRefresh size={16} className="text-text-muted group-hover:text-accent" />
                </button>
            )}
        </nav>
    );
}

