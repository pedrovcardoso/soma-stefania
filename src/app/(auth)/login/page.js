'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
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
            id: crypto.randomUUID(),
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
        <div className="bg-slate-200 flex items-center justify-center min-h-screen p-4">
            <main className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col-reverse md:flex-row">
                <div className="w-full md:w-1/2 p-8">
                    <div className="flex justify-start mb-6">
                        <Image
                            src="/logo.png"
                            alt="SEF Logo"
                            width={110}
                            height={36}
                            priority
                        />
                    </div>

                    <h1 className="text-xl font-bold text-slate-800 mb-2">Acesse sua conta</h1>

                    <form id="login-form" className="space-y-5" onSubmit={handleLogin} noValidate>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-600 mb-1">E-mail</label>
                            <input type="email" id="email" name="email" placeholder="seu.email@fazenda.mg.gov.br" required
                                className="block w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-800 shadow-sm transition duration-150
                                       focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50
                                       hover:border-slate-400"
                                tabIndex="1" />
                        </div>
                        
                        <div>
                            <div className="relative z-10 flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-600">Senha</label>
                                <button type="button" onClick={handleForgotPassword} className="text-sm font-medium text-sky-600 hover:text-sky-700" tabIndex="4">
                                    Esqueceu a senha?
                                </button>
                            </div>
                            <div className="relative">
                                <input 
                                    type={passwordVisible ? 'text' : 'password'} 
                                    id="password" 
                                    name="password" 
                                    placeholder="Sua senha" 
                                    required
                                    className="block w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-800 shadow-sm transition duration-150
                                           focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 
                                           hover:border-slate-400 pr-10"
                                    tabIndex="2" />
                                <button type="button" onMouseDown={() => setPasswordVisible(true)} onMouseUp={() => setPasswordVisible(false)} onMouseLeave={() => setPasswordVisible(false)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700 transition-colors" tabIndex="-1">
                                    {passwordVisible ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full mt-2 bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm
                                       hover:bg-sky-700 
                                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500
                                       transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                tabIndex="3">
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="w-full md:w-1/2 bg-slate-100 p-10 flex flex-col justify-center items-center text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">Bem-vindo(a) de volta!</h2>
                    <p className="text-slate-600 text-sm">
                        Acesse o sistema para gerenciar processos, documentos e dashboards analíticos com eficiência e segurança.
                    </p>
                </div>
            </main>
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
}