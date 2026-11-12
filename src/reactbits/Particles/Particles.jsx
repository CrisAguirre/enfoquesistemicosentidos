import { useEffect, useRef, useMemo } from 'react';
import './Particles.css';

const Particles = ({
  className = '',
  quantity = 80,
  size = 0.5,
  color = '#3b82f6',
  vx = 0,
  vy = -0.1,
  staticity = 50,
  ease = 50,
  refresh = false,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const hexToRgb = useMemo(() => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = Array.from({ length: quantity }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        translateX: 0,
        translateY: 0,
        size: Math.random() * 2 + size,
        alpha: 0,
        targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
        dx: (Math.random() - 0.5) * 0.2,
        dy: (Math.random() - 0.5) * 0.2,
        magnetism: 0.1 + Math.random() * 4,
      }));
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particlesRef.current.forEach((p) => {
        p.alpha += (p.targetAlpha - p.alpha) * 0.05;
        p.x += p.dx + vx;
        p.y += p.dy + vy;

        const mx = mouseRef.current.x - p.x - p.translateX;
        const my = mouseRef.current.y - p.y - p.translateY;
        const dist = Math.sqrt(mx * mx + my * my);
        const force = Math.max(0, staticity - dist) / staticity;

        p.translateX += (mx * force * p.magnetism) / (ease * 10);
        p.translateY += (my * force * p.magnetism) / (ease * 10);

        // Wraparound
        if (p.x + p.translateX < -10) p.x = canvas.offsetWidth + 10;
        if (p.x + p.translateX > canvas.offsetWidth + 10) p.x = -10;
        if (p.y + p.translateY < -10) p.y = canvas.offsetHeight + 10;
        if (p.y + p.translateY > canvas.offsetHeight + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x + p.translateX, p.y + p.translateY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb.r}, ${hexToRgb.g}, ${hexToRgb.b}, ${p.alpha})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [quantity, size, color, vx, vy, staticity, ease, hexToRgb, refresh]);

  return <canvas ref={canvasRef} className={`particles-canvas ${className}`} />;
};

export default Particles;
