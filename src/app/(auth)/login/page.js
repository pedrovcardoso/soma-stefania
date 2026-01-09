'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdVisibility, MdVisibilityOff, MdLockOutline, MdEmail } from 'react-icons/md';
import ToastContainer from '@/components/ui/toast';
import { login } from '@/services/authService';
import ParticleBackground from '@/components/ui/ParticleBackground';

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
                router.push('/home');
            }, 1000);
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
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-100">
            <main className="relative z-10 w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/50">

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex flex-col items-center mb-8">
                        <img
                            src="/logo.png"
                            alt="SEF Logo"
                            width={120}
                            height={40}
                            className="mb-2"
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
                                    tabIndex={1}
                                    className="block w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label htmlFor="password" className="block text-xs font-bold uppercase text-slate-500 tracking-wider">Senha</label>
                                <button type="button" onClick={handleForgotPassword} tabIndex={4} className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
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
                                    tabIndex={2}
                                    className="block w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none placeholder:text-slate-400"
                                />
                                <button
                                    type="button"
                                    onMouseDown={() => setPasswordVisible(true)}
                                    onMouseUp={() => setPasswordVisible(false)}
                                    onMouseLeave={() => setPasswordVisible(false)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {passwordVisible ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            tabIndex={3}
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? 'Acessando...' : 'Entrar no Sistema'}
                        </button>

                        <p className="text-center text-sm text-slate-500">
                            Não tem uma conta?{' '}
                            <a href="/register" tabIndex={5} className="font-semibold text-blue-600 hover:underline">
                                Registre-se
                            </a>
                        </p>
                    </form>
                </div>

                <div className="hidden md:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white p-12 flex-col justify-between">
                    <ParticleBackground
                        particleColor="rgba(203, 213, 225, 0.5)"
                        lineColorBase="203, 213, 225"
                    />

                    <div className="relative z-10">
                        <div className="h-1 w-12 bg-white mb-6 rounded-full"></div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4">
                            SOMA
                        </h1>
                        <p className="text-slate-300 font-medium text-lg leading-relaxed max-w-sm">
                            Sistema de Orquestração de Manifestações ao TCE
                        </p>
                    </div>

                    <div className="relative z-10 mt-12">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                            <h3 className="font-bold text-white mb-2 text-lg">
                                Primeiro Acesso?
                            </h3>
                            <p className="text-slate-200 text-sm leading-relaxed">
                                Caso seja o seu primeiro acesso, procure a página de registro para realizar seu cadastro e liberar suas credenciais.
                            </p>
                        </div>
                        <p className="text-slate-400 text-xs mt-6 text-center md:text-left">
                            © {new Date().getFullYear()} Secretaria de Estado de Fazenda - MG
                        </p>
                    </div>
                </div>
            </main>

            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
}