'use client';

import React from 'react';
import { MdChevronRight, MdHome, MdLanguage, MdDescription, MdHistory, MdSettings, MdBarChart, MdChat, MdFavorite, MdAddToPhotos, MdGridView } from 'react-icons/md';
import useTabStore from '@/store/useTabStore';

const getTabIcon = (type) => {
    switch (type) {
        case 'home': return <MdHome size={14} />;
        case 'dashboard': return <MdBarChart size={14} />;
        case 'sei_list': return <MdLanguage size={14} />;
        case 'sei_detail': return <MdLanguage size={14} />; // Using MdLanguage as category icon
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
    const { tabs, activeTabId, switchTab, openTab } = useTabStore();
    const activeTab = tabs.find(t => t.id === activeTabId);

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
                isLast: activeTab.title === category.label && !activeTab.data?.subLabel
            });
        }

        if (activeTab.title && activeTab.title !== category?.label) {
            breadcrumbs.push({
                id: activeTabId,
                label: activeTab.title,
                isLast: !activeTab.data?.subLabel
            });
        }

        if (activeTab.data?.subLabel) {
            breadcrumbs.push({
                id: 'sub-label',
                label: activeTab.data.subLabel,
                isLast: true
            });
        }
    }

    return (
        <nav className="flex items-center space-x-2 px-4 py-2 bg-white border-b border-slate-200 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.id + index}>
                    {index > 0 && <MdChevronRight size={14} className="text-slate-300" />}
                    <div
                        className={`flex items-center gap-1.5 ${crumb.onClick ? 'hover:text-blue-600 cursor-pointer transition-colors' : ''} ${crumb.isLast ? 'text-slate-900 font-bold' : ''}`}
                        onClick={crumb.onClick}
                    >
                        {crumb.icon}
                        <span>{crumb.label}</span>
                    </div>
                </React.Fragment>
            ))}
        </nav>
    );
}
