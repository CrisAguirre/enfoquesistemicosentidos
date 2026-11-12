import { useEffect, useRef } from 'react';
import './Aurora.css';

const Aurora = ({
  colorStops = ['#3b82f6', '#1d4ed8', '#06b6d4'],
  blend = 0.5,
  amplitude = 1.0,
  speed = 0.5,
  className = '',
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const width = () => canvas.offsetWidth;
    const height = () => canvas.offsetHeight;

    const animate = (time) => {
      const t = time * 0.001 * speed;
      const w = width();
      const h = height();

      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = blend;

      colorStops.forEach((color, i) => {
        const offset = (i / colorStops.length) * Math.PI * 2;
        const cx = w * 0.5 + Math.sin(t + offset) * w * 0.3 * amplitude;
        const cy = h * 0.5 + Math.cos(t * 0.7 + offset) * h * 0.3 * amplitude;
        const radius = Math.max(w, h) * 0.5;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [colorStops, blend, amplitude, speed]);

  return <canvas ref={canvasRef} className={`aurora-canvas ${className}`} />;
};

export default Aurora;
