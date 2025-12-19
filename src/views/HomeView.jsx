'use client';

import React, { useState, useEffect } from 'react';
import useTabStore from '@/store/useTabStore';
import {
  MdBarChart,
  MdLanguage,
  MdDescription,
  MdChat,
  MdAddToPhotos,
  MdArrowForward
} from 'react-icons/md';
import ParticleBackground from '@/components/ui/ParticleBackground';

const StefanIaAnimation = () => {
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    fetch('/stefan.svg')
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch((err) => console.error("Error fetching SVG:", err));
  }, []);

  if (!svgContent) {
    return <div className="w-full h-full aspect-square" />;
  }

  return (
    <div
      className="relative z-10 w-full h-auto pointer-events-none drop-shadow-xl"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

const HomeView = () => {
  const openTab = useTabStore((state) => state.openTab);
  const switchTab = useTabStore((state) => state.switchTab);

  const features = [
    { id: 'dashboard', type: 'dashboard', title: 'Dashboard', description: 'Métricas e dados estatísticos em tempo real.', icon: <MdBarChart size={24} className="text-blue-600" />, path: '/dashboard' },
    { id: 'sei', type: 'sei_list', title: 'Processos SEI', description: 'Busca detalhada de processos e tramitações.', icon: <MdLanguage size={24} className="text-blue-600" />, path: '/sei' },
    { id: 'documents', type: 'doc_list', title: 'Documentos', description: 'Análise e criação de documentos com IA.', icon: <MdDescription size={24} className="text-blue-600" />, path: '/documents' },
    { id: 'stefania', type: 'stefania', title: 'StefanIA', description: 'Chatbot inteligente para insights processuais.', icon: <MdChat size={24} className="text-blue-600" />, path: '/stefania' },
    { id: 'action-plans', type: 'action_plans', title: 'Planos de Ação', description: 'Gestão estruturada de grupos de trabalho.', icon: <MdAddToPhotos size={24} className="text-blue-600" />, path: '/action-plans' },
  ];

  const handleCardClick = (feature) => {
    openTab({
      id: feature.id,
      type: feature.type,
      title: feature.title
    });
  };

  return (
    <>
      <style jsx global>{`
        #stefan-ia-container svg path {
          stroke: #5270a2;
          stroke-width: 2px;
          fill: transparent;
          stroke-dasharray: 3000;
          stroke-dashoffset: 3000;
          animation: 
            draw-in 4s cubic-bezier(0.25, 1, 0.5, 1) forwards,
            pulse-fill 6s ease-in-out 4s infinite,
            traveling-pulse 60s linear 2s infinite;
        }

        @keyframes draw-in {
          to { 
            stroke-dashoffset: 0; 
            fill: rgba(30, 64, 175, 0.15);
          }
        }

        @keyframes pulse-fill {
          0%, 100% { fill: rgba(30, 64, 175, 0.15); } 
          50% { fill: rgba(30, 64, 175, 0.35); }
        }

        @keyframes traveling-pulse {
          from { stroke-dasharray: 2970 30; stroke-dashoffset: 0; }
          to { stroke-dasharray: 2970 30; stroke-dashoffset: -3000; }
        }
        
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
      `}</style>

      <div className="flex h-full flex-col overflow-y-auto bg-slate-50 text-slate-800 font-sans">
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">

          <section className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-16 mt-4">
            <div className="lg:w-1/2 flex flex-col text-center lg:text-left animate-fade-in-right z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                SOMA - Sistema de Orquestração de Manifestações ao TCE
              </h1>
              <p className="text-lg text-slate-600 mt-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Centralize processos, analise documentos e obtenha insights estratégicos com a
                <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500"> StefanIA</span>
                , a inteligência artificial do Tesouro.
              </p>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end animate-fade-in-left relative">
              <div id="stefan-ia-container" className="relative flex items-center justify-center w-[350px] h-[350px] md:w-[450px] md:h-[450px]">
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden"
                  style={{
                    animation: 'morph 12s ease-in-out infinite both',
                    background: 'radial-gradient(circle, rgba(219, 234, 254, 1) 0%, rgba(239, 246, 255, 0.4) 60%, rgba(255,255,255,0) 100%)',
                  }}
                >
                  <ParticleBackground
                    particleColor="rgba(30, 64, 175, 0.6)"
                    lineColorBase="30, 64, 175"
                  />
                </div>

                <StefanIaAnimation />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
                Funcionalidades
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <button
                  key={feature.id}
                  onClick={() => handleCardClick(feature)}
                  className="group relative flex flex-col items-start text-left bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden"
                  style={{ animationDelay: `${100 * index}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10 mb-4 flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-200 group-hover:text-white transition-colors duration-300 shadow-inner">
                    {feature.icon}
                  </div>

                  <h3 className="relative z-10 font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="relative z-10 text-slate-500 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  <div className="relative z-10 mt-auto flex items-center text-xs font-bold text-blue-600 opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    ACESSAR <MdArrowForward className="ml-1" />
                  </div>
                </button>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default HomeView;