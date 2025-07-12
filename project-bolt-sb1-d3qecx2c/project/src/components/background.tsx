import React, { useEffect, useRef } from 'react';

const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      pulse: number;
    }> = [];

    const colors = ['rgba(225, 0, 60, 0.4)', 'rgba(255, 0, 191, 0.3)', 'rgba(241, 242, 242, 0.3)'];

    // Create particles
    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < 300; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += 0.02;

        // Bounce off edges
        const rect = canvas.getBoundingClientRect();
        if (particle.x < 0 || particle.x > rect.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > rect.height) particle.vy *= -1;

        // Pulsing effect
        const pulseFactor = Math.sin(particle.pulse) * 0.3 + 1;
        const currentSize = particle.size * pulseFactor;

        // Draw particle with glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentSize * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw connections with enhanced effects
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            
            const connectionOpacity = (1 - distance / 150) * 0.35;
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y,
              otherParticle.x, otherParticle.y
            );
            gradient.addColorStop(0, `rgba(225, 0, 60, ${connectionOpacity})`);
            gradient.addColorStop(1, `rgba(255, 0, 191, ${connectionOpacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default ParticlesBackground;