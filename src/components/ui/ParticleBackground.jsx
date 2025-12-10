'use client';

import React, { useEffect, useRef } from 'react';

const ParticleBackground = ({ className, particleColor = 'rgba(156, 163, 175, 0.6)', lineColorBase = '156, 163, 175' }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const particleCount = 45;
        const connectionDistance = 90;
        const mouseDistance = 120;

        let width = canvas.width = container.clientWidth;
        let height = canvas.height = container.clientHeight;

        let particles = [];
        const mouse = { x: null, y: null };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
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
                    let distance = Math.sqrt(dx * dx + dy * dy);
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
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [particleColor, lineColorBase]);

    return (
        <div ref={containerRef} className={`absolute inset-0 w-full h-full overflow-hidden ${className || ''}`}>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

export default ParticleBackground;
