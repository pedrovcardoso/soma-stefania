'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MdVisibility, MdVisibilityOff, MdLockOutline, MdEmail } from 'react-icons/md';
import ToastContainer from '@/components/ui/Toast';
import { login } from '@/services/authService';

export default function LoginPage() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const addToast = (message, variant = 'info') => {
        const now = new Date();
        const datePart = now.toLocaleDateString('pt-BR');
        const timePart = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const newToast = {
            id: Math.random().toString(36).substring(2) + Date.now().toString(36),
            message,
            variant,
            timestamp: `${datePart} ${timePart}`
        };
        setToasts(prevToasts => [newToast, ...prevToasts]);
    };

    const removeToast = (id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email || !email.includes('@')) {
            addToast('Por favor, insira um e-mail válido.', 'error');
            setIsLoading(false);
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            addToast('Login bem-sucedido! Redirecionando...', 'success');
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } else {
            addToast(result.error, 'error');
            setIsLoading(false);
        }
    };

    const handleForgotPassword = (event) => {
        event.preventDefault();
        addToast('Instruções foram enviadas para o seu e-mail.', 'info');
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">

            {/* --- BACKGROUND ANIMATION --- */}
            <style jsx global>{`
                @keyframes gradient-flow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-flow {
                    background-size: 200% 200%;
                    animation: gradient-flow 15s ease infinite;
                }
                .bg-grid-pattern {
                    background-image: radial-gradient(#94a3b8 1px, transparent 1px);
                    background-size: 30px 30px;
                }
            `}</style>

            {/* Animated Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 animate-gradient-flow z-0" />

            {/* Grid Texture Layer */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] z-0 pointer-events-none" />

            {/* --- LOGIN CARD --- */}
            <main className="relative z-10 w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/50">

                {/* ESQUERDA: Formulário */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                    <div className="flex flex-col items-center mb-8">
                        <Image
                            src="/logo.png"
                            alt="SEF Logo"
                            width={140}
                            height={46}
                            priority
                            className="mb-6 drop-shadow-sm"
                        />
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Bem-vindo de volta</h2>
                        <p className="text-slate-500 text-sm mt-2">Acesse sua conta para continuar</p>
                    </div>

                    <form id="login-form" className="space-y-5" onSubmit={handleLogin} noValidate>
                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">E-mail Institucional</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MdEmail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="seu.email@fazenda.mg.gov.br"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none placeholder:text-slate-400"
                                    tabIndex="1"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label htmlFor="password" className="block text-xs font-bold uppercase text-slate-500 tracking-wider">Senha</label>
                                <button type="button" onClick={handleForgotPassword} className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline" tabIndex="4">
                                    Esqueceu a senha?
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MdLockOutline className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    className="block w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none placeholder:text-slate-400"
                                    tabIndex="2"
                                />
                                <button
                                    type="button"
                                    onMouseDown={() => setPasswordVisible(true)}
                                    onMouseUp={() => setPasswordVisible(false)}
                                    onMouseLeave={() => setPasswordVisible(false)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    tabIndex="-1"
                                >
                                    {passwordVisible ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            tabIndex="3">
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Acessando...
                                </span>
                            ) : 'Entrar no Sistema'}
                        </button>
                    </form>
                </div>

                {/* DIREITA: Marca e Identidade */}
                <div className="w-full md:w-1/2 relative overflow-hidden bg-slate-900 text-white p-12 flex flex-col justify-between">
                    {/* Background do Painel Direito */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-800 z-0"></div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] z-0"></div>

                    {/* Efeito Glassy Decorative */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                    <div className="relative z-10">
                        <div className="h-1 w-12 bg-blue-500 mb-6 rounded-full"></div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4">
                            SOMA
                        </h1>
                        <p className="text-blue-200 font-medium text-lg leading-relaxed max-w-sm">
                            Sistema de Orquestração de Manifestações ao TCE
                        </p>
                    </div>

                    <div className="relative z-10 mt-12">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                            <h3 className="font-bold text-white mb-2 text-lg">
                                Primeiro Acesso?
                            </h3>
                            <p className="text-blue-50 text-sm leading-relaxed">
                                Caso seja o seu primeiro acesso, procure a página de registro para realizar seu cadastro e liberar suas credenciais.
                            </p>
                        </div>
                        <p className="text-blue-200/60 text-xs mt-6 text-center md:text-left">
                            © {new Date().getFullYear()} Secretaria de Estado de Fazenda - MG
                        </p>
                    </div>
                </div>
            </main>

            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
}