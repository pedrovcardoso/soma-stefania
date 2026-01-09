'use client';

import { useState } from 'react';
import { MdCameraAlt, MdEdit } from 'react-icons/md';

export default function ProfileSettingsPage() {
    const [formData, setFormData] = useState({
        name: 'Stefania User',
        socialName: 'Stefania',
        unit: 'Coordenação de Sistemas',
        email: 'stefania.user@sef.mg.gov.br'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-text mb-6 pb-4 border-b border-border">
                Informações Pessoais
            </h2>

            <div className="flex flex-col gap-8">
                <div className="flex items-start gap-6">
                    <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-surface-alt border-4 border-surface shadow-md overflow-hidden flex items-center justify-center">
                            <span className="text-2xl font-bold text-text-muted">ST</span>
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <MdCameraAlt className="text-white text-xl" />
                        </div>
                    </div>
                    <div className="pt-2">
                        <h3 className="text-sm font-medium text-text">Foto de Perfil</h3>
                        <p className="text-xs text-text-muted mt-1 mb-3">
                            Formatos permitidos: JPG, PNG. Tamanho máx: 1MB.
                        </p>
                        <button className="text-xs font-medium text-accent hover:underline">
                            Alterar foto
                        </button>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Nome Social
                            </label>
                            <input
                                type="text"
                                name="socialName"
                                value={formData.socialName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Unidade / Setor
                            </label>
                            <input
                                type="text"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Email Institucional
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-3 py-2 bg-surface-alt border border-border rounded-lg text-sm text-text-muted cursor-not-allowed"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-warning bg-warning/10 px-2 py-0.5 rounded-full font-medium border border-warning/20">
                                Não editável
                            </span>
                        </div>
                        <p className="text-xs text-text-muted mt-1">
                            Para alterar seu email, entre em contato com o suporte de TI.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-2">
                    <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-alt rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-lg shadow-sm transition-colors">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}
