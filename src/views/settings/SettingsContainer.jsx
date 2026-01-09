'use client';

import { useState, useEffect } from 'react';
import useTabStore from '@/store/useTabStore';
import { MdPerson, MdSettings, MdSecurity, MdInfo } from 'react-icons/md';
import ProfileSettingsPage from '@/views/settings/profile/page';
import PreferencesSettingsPage from '@/views/settings/preferences/page';
import SecuritySettingsPage from '@/views/settings/security/page';
import AboutSettingsPage from '@/views/settings/about/page';

const settingsTabs = [
    { id: 'profile', name: 'Editar Perfil', icon: MdPerson, component: ProfileSettingsPage },
    { id: 'preferences', name: 'Preferências', icon: MdSettings, component: PreferencesSettingsPage },
    { id: 'security', name: 'Segurança', icon: MdSecurity, component: SecuritySettingsPage },
    { id: 'about', name: 'Sobre o Sistema', icon: MdInfo, component: AboutSettingsPage },
];

export default function SettingsContainer({ data = {} }) {
    const [activeTabId, setActiveTabId] = useState('profile');
    const updateTab = useTabStore(state => state.updateTab);

    useEffect(() => {
        if (data?.activeSection) {
            setActiveTabId(data.activeSection);
        }
    }, [data?.activeSection]);

    const activeTab = settingsTabs.find(t => t.id === activeTabId);
    const ActiveComponent = activeTab?.component || ProfileSettingsPage;

    useEffect(() => {
        updateTab('settings', {
            data: {
                ...data,
                subLabel: activeTab?.name
            }
        });
    }, [activeTabId, updateTab, activeTab?.name]);

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-auto px-6 pt-2 pb-6 md:px-10 md:pt-4 md:pb-10">
            <div className="max-w-7xl w-full mx-auto mb-6">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Configurações</h1>
                <p className="text-slate-500 mt-2">Gerencie suas informações, preferências e segurança</p>
            </div>

            <div className="flex-1 max-w-7xl w-full mx-auto">
                <div className="flex flex-col md:flex-row gap-8 h-full">
                    <aside className="w-full md:w-64 shrink-0">
                        <nav className="flex flex-col gap-1">
                            {settingsTabs.map((tab) => {
                                const isActive = activeTabId === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTabId(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all text-left
                                            ${isActive
                                                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                                : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                                            }`}
                                    >
                                        <tab.icon className={`text-lg ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    <main className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            <ActiveComponent />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
