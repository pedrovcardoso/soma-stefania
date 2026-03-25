'use client';

import Link from 'next/link';
import { MdInfoOutline } from 'react-icons/md';
import ParticleBackground from '@/components/ui/ParticleBackground';
import AccessibilityMenu from '@/components/accessibility/AccessibilityMenu';

export default function LoginPage() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-surface-alt transition-colors duration-300">
            <div className="absolute top-4 right-4 z-50">
                <AccessibilityMenu />
            </div>
            <main className="relative z-10 w-full max-w-4xl bg-surface backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-border">

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex flex-col items-center mb-8">
                        <img
                            src="/logo.png"
                            alt="SEF Logo"
                            width={120}
                            height={40}
                            className="mb-2"
                        />
                        <h2 className="text-2xl font-bold text-text tracking-tight">Bem-vindo de volta</h2>
                        <p className="text-text-muted text-sm mt-2">Acesse sua conta para continuar</p>
                    </div>

                    <div className="flex flex-col gap-4 w-full mt-6">
                        <Link
                            href={process.env.NEXT_PUBLIC_LOGIN_URL_GOVBR || '#'}
                            className="w-full flex items-center justify-center gap-2 bg-[#1351b4] hover:bg-[#0c3d87] text-white font-semibold py-3 px-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <span className="text-[16px]">Entrar com</span>
                            <img src="/govbr_logo.png" alt="Gov.br" className="h-6 w-auto object-contain filter invert brightness-0 opacity-100" />
                        </Link>
                        
                        <Link
                            href={process.env.NEXT_PUBLIC_LOGIN_URL_MICROSOFT || '#'}
                            className="w-full flex items-center justify-center gap-3 bg-[#2f2f2f] hover:bg-[#1f1f1f] text-white font-semibold py-3 px-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <img src="/microsoft-logo.svg" alt="Microsoft" className="w-6 h-6 object-contain" />
                            <span className="text-[16px]">Entrar com Microsoft</span>
                        </Link>
                    </div>
                </div>

                <div className="hidden md:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-l border-white/10 text-white p-12 flex-col justify-between">
                    <ParticleBackground
                        particleColor="rgba(255, 255, 255, 0.4)"
                        lineColorBase="255, 255, 255"
                    />

                    <div className="relative z-10">
                        <div className="h-1 w-12 bg-white mb-6 rounded-full opacity-80"></div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4 text-white">
                            SOMA
                        </h1>
                        <p className="text-slate-100 opacity-90 font-medium text-lg leading-relaxed max-w-sm">
                            Sistema de Orquestração de Manifestações ao TCE
                        </p>
                    </div>

                    <div className="relative z-10 mt-12">
                        <div className="bg-surface/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-white mt-4">
                            <h3 className="font-bold mb-2 text-base text-white">
                                Autenticação Centralizada
                            </h3>
                            <p className="text-slate-200 text-xs leading-relaxed">
                                O acesso ao sistema SOMA é realizado através do serviço corporativo de autenticação. Utilize sua conta institucional.
                            </p>
                            <p className="text-slate-100 text-xs leading-relaxed mt-3 font-semibold">
                                Caso não tenha acesso, entre em contato com o gabinete do tesouro para a liberação.
                            </p>
                        </div>
                        <p className="text-slate-400 text-xs mt-6 text-center md:text-left">
                            © {new Date().getFullYear()} Secretaria de Estado de Fazenda - MG
                        </p>
                    </div>
                </div>
            </main>
 
            {process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' && (
                <div className="mt-8 p-1.5 rounded-2xl bg-warning/10 backdrop-blur-md border border-warning/20 shadow-xl flex items-center gap-4 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="bg-warning/20 p-3 rounded-xl flex-shrink-0">
                        <MdInfoOutline size={24} className="text-warning" />
                    </div>
                    <div className="flex-grow pr-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-warning mb-0.5">Ambiente de Testes</h4>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-semibold text-warning bg-warning/20 px-2 py-0.5 rounded-full border border-warning/30">MOCK_API</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}