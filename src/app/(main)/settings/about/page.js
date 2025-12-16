'use client';

import { TbBrandNextjs, TbBrandTailwind, TbBrandReact } from 'react-icons/tb';
import { SiPostgresql } from 'react-icons/si';
import { MdCode, MdOpenInNew } from 'react-icons/md';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function AboutSettingsPage() {
    return (
        <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                Sobre o Sistema
            </h2>

            <div className="flex flex-col gap-8">
                {/* Hero / Brand Section */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white flex items-center justify-between overflow-hidden relative shadow-lg">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">SOMA</h1>
                        <p className="text-slate-300 text-sm max-w-sm leading-relaxed">
                            Sistema de Orquestração de Manifestações ao TCE<br />
                            Secretaria de Estado de Fazenda de Minas Gerais
                        </p>
                        <div className="mt-6 inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium backdrop-blur-sm">
                            Versão 1.0.0
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute right-0 bottom-0 opacity-10">
                        <MdCode size={180} />
                    </div>
                </div>

                {/* Tech Stack */}
                <section>
                    <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">Tecnologias Utilizadas</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <TbBrandNextjs className="text-4xl text-black mb-2" />
                            <span className="text-sm font-medium text-slate-700">Next.js</span>
                            <span className="text-xs text-slate-400">v15.0</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <TbBrandReact className="text-4xl text-blue-500 mb-2" />
                            <span className="text-sm font-medium text-slate-700">React</span>
                            <span className="text-xs text-slate-400">v18.0</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <TbBrandTailwind className="text-4xl text-cyan-500 mb-2" />
                            <span className="text-sm font-medium text-slate-700">Tailwind</span>
                            <span className="text-xs text-slate-400">v3.4</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <SiPostgresql className="text-4xl text-blue-700 mb-2" />
                            <span className="text-sm font-medium text-slate-700">PostgreSQL</span>
                            <span className="text-xs text-slate-400">Database</span>
                        </div>
                    </div>
                </section>

                {/* Developer / Repo Link */}
                <section className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-medium text-slate-800">Repositório do Projeto</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Acesse o código fonte, reporte bugs ou veja o changelog completo no GitHub.
                            </p>
                        </div>
                        <a
                            href="https://github.com/pedrovcardoso/soma-stefania"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                        >
                            Acessar GitHub
                            <MdOpenInNew />
                        </a>
                    </div>
                </section>

                {/* API Documentation */}
                <section className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                        <h3 className="text-base font-medium text-slate-800">Documentação da API</h3>
                        <p className="text-sm text-slate-500 mt-1">Endpoints e especificações técnicas.</p>
                    </div>
                    <div className="p-4">
                        <SwaggerUI url="/openapi.yaml" />
                    </div>
                </section>

                {/* Copyright */}
                <footer className="text-center text-xs text-slate-400 mt-4">
                    © 2025 SEF/MG - Coordenação de Sistemas. Todos os direitos reservados.
                </footer>
            </div>
        </div>
    );
}
