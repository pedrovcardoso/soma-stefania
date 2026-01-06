'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MdPerson, MdEmail, MdLockOutline } from 'react-icons/md';
import ParticleBackground from '@/components/ui/ParticleBackground';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Adicionar lógica de registro aqui
        console.log('Form data submitted:', formData);
        router.push('/login');
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-100">
            <main className="relative z-10 w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/50">

                {/* Coluna Esquerda: Formulário de Registro */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex flex-col items-center mb-8">
                        {/* Replaced next/image with standard img to resolve 'received null' error */}
                        <img
                            src="/logo.png"
                            alt="SEF Logo"
                            width={140}
                            height={46}
                            className="mb-6 drop-shadow-sm"
                        />
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Crie sua Conta</h2>
                        <p className="text-slate-500 text-sm mt-2">Junte-se à plataforma para começar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nome */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MdPerson className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Nome Completo"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="block w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none placeholder:text-slate-400"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MdEmail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                placeholder="E-mail Institucional"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="block w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none placeholder:text-slate-400"
                                required
                            />
                        </div>

                        {/* Senha */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MdLockOutline className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="Senha"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="block w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none placeholder:text-slate-400"
                                required
                            />
                        </div>

                        {/* Confirmar Senha */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MdLockOutline className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="Confirmar Senha"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="block w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-5 rounded-xl shadow-lg hover:shadow-md transition-all duration-300"
                        >
                            Registrar
                        </button>

                        <p className="text-center text-sm text-slate-500">
                            Já tem uma conta?{' '}
                            <a href="/login" className="font-semibold text-blue-600 hover:underline">
                                Faça login
                            </a>
                        </p>
                    </form>
                </div>

                {/* Coluna Direita: Animação e Identidade */}
                <div className="hidden md:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white p-12 flex-col justify-between">
                    <ParticleBackground
                        particleColor="rgba(203, 213, 225, 0.5)"
                        lineColorBase="203, 213, 225"
                    />

                    <div className="relative z-10">
                        <div className="h-1 w-12 bg-white mb-6 rounded-full"></div>
                        <h1 className="text-4xl font-black tracking-tighter leading-none mb-4">
                            SOMA
                        </h1>
                        <p className="text-slate-300 font-medium text-lg leading-relaxed max-w-sm">
                            Sistema de Orquestração de Manifestações ao TCE.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12">
                        <p className="text-slate-400 text-xs">
                            © {new Date().getFullYear()} Secretaria de Estado de Fazenda - MG
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

