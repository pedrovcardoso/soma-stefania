'use client';

import { useState, useMemo } from 'react';
import { MdLock, MdVisibility, MdVisibilityOff, MdShield } from 'react-icons/md';
import zxcvbn from 'zxcvbn';

export default function SecuritySettingsPage() {
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const toggleVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const passwordStrength = useMemo(() => {
        if (!passwords.new) return { score: -1, label: '', color: 'bg-border' };

        const result = zxcvbn(passwords.new);
        let score = result.score; // 0-4

        // Penalty for simple character repetition (e.g., '1111111', 'aaaaaaa')
        const isRepeated = /^(.)\1+$/.test(passwords.new);
        if (isRepeated) {
            score = 0;
        }

        const labels = ['Muito Fraca', 'Fraca', 'Média', 'Forte', 'Muito Forte'];
        const colors = ['bg-error', 'bg-error', 'bg-warning', 'bg-success', 'bg-success'];

        return {
            score,
            label: labels[score],
            color: colors[score]
        };
    }, [passwords.new]);

    return (
        <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-text mb-6 pb-4 border-b border-border">
                Segurança e Senha
            </h2>

            <div className="bg-accent-soft border border-accent/20 rounded-lg p-4 mb-8 flex gap-3">
                <MdShield className="text-accent text-xl flex-shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-sm font-semibold text-accent/80">Dica de Segurança</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        Use uma senha forte com pelo menos 8 caracteres, combinando letras maiúsculas, minúsculas, números e símbolos especiais. Nunca compartilhe sua senha com terceiros.
                    </p>
                </div>
            </div>

            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        Senha Atual
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword.current ? "text" : "password"}
                            name="current"
                            value={passwords.current}
                            onChange={handleChange}
                            className="w-full pl-10 pr-10 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                            placeholder="Digite sua senha atual"
                        />
                        <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                        <button
                            type="button"
                            onClick={() => toggleVisibility('current')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                        >
                            {showPassword.current ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Nova Senha
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword.new ? "text" : "password"}
                                name="new"
                                value={passwords.new}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                placeholder="Nova senha"
                            />
                            <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                            <button
                                type="button"
                                onClick={() => toggleVisibility('new')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                            >
                                {showPassword.new ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Confirmar Nova Senha
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                name="confirm"
                                value={passwords.confirm}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                placeholder="Repita a nova senha"
                            />
                            <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                            <button
                                type="button"
                                onClick={() => toggleVisibility('confirm')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                            >
                                {showPassword.confirm ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {passwords.new && (
                    <div className="space-y-2">
                        <div className="flex gap-1 h-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-full ${i <= passwordStrength.score ? passwordStrength.color : 'bg-border'}`}
                                ></div>
                            ))}
                        </div>
                        <p className="text-xs text-text-muted">Força da senha: <span className={`${passwordStrength.color.replace('bg-', 'text-')} font-medium`}>{passwordStrength.label}</span></p>
                    </div>
                )}


                <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-2">
                    <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-alt rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-accent-contrast bg-accent hover:bg-accent/90 rounded-lg shadow-sm transition-colors">
                        Alterar Senha
                    </button>
                </div>
            </form>
        </div>
    );
}
