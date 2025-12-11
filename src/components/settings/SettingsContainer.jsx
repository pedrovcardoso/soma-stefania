'use client';

import { useState } from 'react';
import { MdPerson, MdSettings, MdSecurity, MdInfo } from 'react-icons/md';
import ProfileSettingsPage from '@/app/(main)/settings/profile/page';
import PreferencesSettingsPage from '@/app/(main)/settings/preferences/page';
import SecuritySettingsPage from '@/app/(main)/settings/security/page';
import AboutSettingsPage from '@/app/(main)/settings/about/page';

const settingsTabs = [
    { id: 'profile', name: 'Editar Perfil', icon: MdPerson, component: ProfileSettingsPage },
    { id: 'preferences', name: 'Preferências', icon: MdSettings, component: PreferencesSettingsPage },
    { id: 'security', name: 'Segurança', icon: MdSecurity, component: SecuritySettingsPage },
    { id: 'about', name: 'Sobre o Sistema', icon: MdInfo, component: AboutSettingsPage },
];

export default function SettingsContainer() {
    const [activeTabId, setActiveTabId] = useState('profile');

    const ActiveComponent = settingsTabs.find(t => t.id === activeTabId)?.component || ProfileSettingsPage;

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6">
                <h1 className="text-2xl font-bold text-slate-800">Configs</h1>
                <p className="text-slate-500 mt-1">Gerencie suas configurações pessoais e preferências do sistema</p>
            </div>

            <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 h-full">
                    {/* Sidebar Navigation */}
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

                    {/* Main Content Area */}
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
