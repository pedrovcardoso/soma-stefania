'use client';

import React, { useState, useEffect, useRef } from 'react';
import useTabStore from '@/store/useTabStore';

// Icons
import {
  MdBarChart,
  MdLanguage,
  MdDescription,
  MdChat,
  MdAddToPhotos,
  MdArrowForward
} from 'react-icons/md';

// --- 1. COMPONENTE DO FUNDO DE PARTÍCULAS (ADAPTADO PARA TEMA CLARO) ---
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const particleCount = 45; 
    const connectionDistance = 90; 
    const mouseDistance = 120;
    
    let width = canvas.width = container.clientWidth;
    let height = canvas.height = container.clientHeight;

    let particles = [];
    const mouse = { x: null, y: null };

    // Cores definidas para o tema claro (Azul SEFA/TCE)
    // Usando tons de azul mais escuro para aparecer no fundo claro
    const particleColor = 'rgba(30, 64, 175, 0.6)'; // Blue-800 com opacidade
    const lineColorBase = '30, 64, 175'; // RGB do Blue-800 para usar no rgba()

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4; // Movimento suave
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < mouseDistance) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseDistance - distance) / mouseDistance;
                this.vx -= forceDirectionX * force * 0.03;
                this.vy -= forceDirectionY * force * 0.03;
            }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // NÃO desenhamos mais o fundo preto aqui. O fundo será CSS.
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - (distance / connectionDistance);
            // Linhas azuis sutis
            ctx.strokeStyle = `rgba(${lineColorBase}, ${opacity * 0.4})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const handleResize = () => {
      if (container) {
        width = canvas.width = container.clientWidth;
        height = canvas.height = container.clientHeight;
        init();
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; 
      mouse.y = e.clientY - rect.top;
    }

    const handleMouseLeave = () => {
        mouse.x = null;
        mouse.y = null;
    }

    window.addEventListener('resize', handleResize);
    if(container) {
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);
    }

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if(container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden"
      // Aqui está o GLOW GRADIENTE MAIS CLARO e a forma MORPH
      style={{
        animation: 'morph 12s ease-in-out infinite both',
        background: 'radial-gradient(circle, rgba(219, 234, 254, 1) 0%, rgba(239, 246, 255, 0.4) 60%, rgba(255,255,255,0) 100%)', // Blue-100 para transparente
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

// --- 2. COMPONENTE SVG ---
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

// --- PÁGINA PRINCIPAL ---
const HomePage = () => {
  const addTab = useTabStore((state) => state.addTab);
  const switchTab = useTabStore((state) => state.switchTab);

  const features = [
    { id: 'dashboard', title: 'Dashboard', description: 'Métricas e dados estatísticos em tempo real.', icon: <MdBarChart size={24} className="text-blue-600" />, path: '/dashboard' },
    { id: 'sei-process-list', title: 'Processos SEI', description: 'Busca detalhada de processos e tramitações.', icon: <MdLanguage size={24} className="text-blue-600" />, path: '/sei' },
    { id: 'documents', title: 'Documentos', description: 'Análise e criação de documentos com IA.', icon: <MdDescription size={24} className="text-blue-600" />, path: '/documents' },
    { id: 'stefania', title: 'StefanIA', description: 'Chatbot inteligente para insights processuais.', icon: <MdChat size={24} className="text-blue-600" />, path: '/stefania' },
    { id: 'action-plans', title: 'Planos de Ação', description: 'Gestão estruturada de grupos de trabalho.', icon: <MdAddToPhotos size={24} className="text-blue-600" />, path: '/action-plans' },
  ];

  const handleCardClick = (feature) => {
    const newTab = { id: feature.id, title: feature.title, path: feature.path };
    addTab(newTab);
    switchTab(newTab.id);
  };

  return (
    <>
      <style jsx global>{`
        /* Configuração das linhas do SVG (Agora ESCURAS para fundo claro) */
        #stefan-ia-container svg path {
          stroke: #1e40af; /* Blue-800 - Azul forte */
          stroke-width: 2px;
          fill: transparent;
          stroke-dasharray: 3000;
          stroke-dashoffset: 3000;
          /* Animação Sequencial: Desenha -> Espera -> Pulsa */
          animation: 
            draw-in 4s cubic-bezier(0.25, 1, 0.5, 1) forwards,
            pulse-fill 6s ease-in-out 4s infinite,
            traveling-pulse 60s linear 2s infinite;
        }

        /* 1. Desenha a linha e preenche gradualmente */
        @keyframes draw-in {
          to { 
            stroke-dashoffset: 0; 
            fill: rgba(30, 64, 175, 0.15); /* Preenchimento inicial (leve) */
          }
        }

        /* 2. Pulsa apenas a opacidade do preenchimento (70% a 100% da cor base definida) */
        /* Nota: Como estamos manipulando fill-opacity, a cor base é fixa */
        @keyframes pulse-fill {
          0%, 100% { fill: rgba(30, 64, 175, 0.15); } 
          50% { fill: rgba(30, 64, 175, 0.35); } /* Mais intenso */
        }

        @keyframes traveling-pulse {
          from { stroke-dasharray: 2970 30; stroke-dashoffset: 0; }
          to { stroke-dasharray: 2970 30; stroke-dashoffset: -3000; }
        }
        
        /* Animação suave da forma de fundo */
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
      `}</style>

      <div className="flex h-full flex-col overflow-y-auto bg-slate-100 text-slate-800">
        <div className="w-full max-w-7xl mx-auto p-6 md:p-10 lg:p-14">
          
          {/* --- HERO SECTION --- */}
          <section className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-16 mt-4">
            
            {/* Texto */}
            {/* <div className="lg:w-1/2 flex flex-col text-center lg:text-left animate-fade-in-right z-10">
              <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-700 uppercase bg-blue-100 rounded-full w-fit mx-auto lg:mx-0">
                Nova Versão 2.0
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Monitoramento Inteligente <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">TCE-RJ</span>
              </h1>
              <p className="text-lg text-slate-600 mt-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Centralize processos, analise documentos e obtenha insights estratégicos com a IA do Tesouro.
              </p>
            </div> */}
            <div className="lg:w-1/2 flex flex-col text-center lg:text-left animate-fade-in-right z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Sistema de monitoramento de demandas
              </h1>
              <p className="text-lg text-slate-600 mt-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Centralize processos, analise documentos e obtenha insights estratégicos com a 
                <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500"> StefanIA</span>
                , a inteligência artificial do Tesouro.
              </p>
            </div>

            {/* Animação - Agora Harmônica e "Clean" */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end animate-fade-in-left relative">
              <div id="stefan-ia-container" className="relative flex items-center justify-center w-[350px] h-[350px] md:w-[450px] md:h-[450px]">
                
                {/* Background: Partículas Azuis sobre Glow Claro */}
                <ParticleBackground />

                <StefanIaAnimation />
              </div>
            </div>
          </section>

          {/* --- FEATURES SECTION (Cards Melhorados) --- */}
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
                  {/* Hover Gradient Background (Sutil) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Icon Box */}
                  <div className="relative z-10 mb-4 flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-200 group-hover:text-white transition-colors duration-300 shadow-inner">
                    {feature.icon}
                  </div>

                  <h3 className="relative z-10 font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="relative z-10 text-slate-500 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Seta indicativa no hover */}
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

export default HomePage;