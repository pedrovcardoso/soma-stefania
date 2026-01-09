'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MdPerson, MdSettings, MdSecurity, MdInfo } from 'react-icons/md';

const settingsTabs = [
    { name: 'Editar Perfil', href: '/settings/profile', icon: MdPerson },
    { name: 'Preferências', href: '/settings/preferences', icon: MdSettings },
    { name: 'Segurança', href: '/settings/security', icon: MdSecurity },
    { name: 'Sobre o Sistema', href: '/settings/about', icon: MdInfo },
];

export default function SettingsLayout({ children }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-surface-alt">
            <div className="bg-surface border-b border-border px-8 py-6">
                <h1 className="text-2xl font-bold text-text">Configs</h1>
                <p className="text-text-muted mt-1">Gerencie suas configurações pessoais e preferências do sistema</p>
            </div>

            <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8 h-full">
                    <aside className="w-full md:w-64 shrink-0">
                        <nav className="flex flex-col gap-1">
                            {settingsTabs.map((tab) => {
                                const isActive = pathname === tab.href;
                                return (
                                    <Link
                                        key={tab.href}
                                        href={tab.href}
                                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all
                                            ${isActive
                                                ? 'bg-accent-soft text-accent shadow-sm ring-1 ring-accent/20'
                                                : 'text-text-secondary hover:bg-surface hover:text-text hover:shadow-sm'
                                            }`}
                                    >
                                        <tab.icon className={`text-lg ${isActive ? 'text-accent' : 'text-text-muted'}`} />
                                        {tab.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <main className="flex-1 bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                        <div className="h-full overflow-y-auto custom-scrollbar p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
