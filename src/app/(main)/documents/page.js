import React, { useRef, useEffect } from 'react';

const NetworkAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // --- CONFIGURAÇÕES AQUI ---
    const particleCount = 130;      // MAIS ELEMENTOS (Antes era 60)
    const connectionDistance = 120; // Distância para criar linhas
    const mouseDistance = 200;      // Raio de interação do mouse
    const speedMultiplier = 0.3;    // MAIS LENTO (Quanto menor, mais lento. Antes era ~1.5)
    // ---------------------------

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const mouse = { x: null, y: null };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Velocidade reduzida pelo speedMultiplier
        this.vx = (Math.random() - 0.5) * speedMultiplier; 
        this.vy = (Math.random() - 0.5) * speedMultiplier;
        this.size = Math.random() * 2 + 1; // Tamanho variável (1 a 3px)
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebater nas bordas
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interação suave com o mouse
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < mouseDistance) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseDistance - distance) / mouseDistance;
                
                // Empurra mais devagar também, para não quebrar a calmaria
                const repulsionStrength = 2; 
                this.vx -= forceDirectionX * force * repulsionStrength * 0.05;
                this.vy -= forceDirectionY * force * repulsionStrength * 0.05;
            }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#a5f3fc'; // Cor Cyan claro (Tailwind cyan-200)
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
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      connectParticles();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        // Otimização: j = i + 1 evita verificar o mesmo par duas vezes
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            // A opacidade baseada na distância cria o efeito "fade"
            const opacity = 1 - (distance / connectionDistance);
            
            // Cor da linha: Azul Neon Tech
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.8})`; // (R, G, B, Alpha)
            ctx.lineWidth = 0.8; // Linhas mais finas para ficar elegante com muitos elementos
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }

    const handleMouseLeave = () => {
        mouse.x = null;
        mouse.y = null;
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gray-950 relative overflow-hidden">
        {/* Fundo com gradiente radial sutil para dar profundidade estilo 'espaço' */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black opacity-80"></div>
      
      <canvas 
        ref={canvasRef} 
        className="block absolute top-0 left-0"
      />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 text-5xl font-bold tracking-widest filter drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          CONSTELLATION
        </h1>
      </div>
    </div>
  );
};

export default NetworkAnimation;