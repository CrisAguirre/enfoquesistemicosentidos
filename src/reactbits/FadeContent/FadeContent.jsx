import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const FadeContent = ({
  children,
  className = '',
  blur = true,
  duration = 0.8,
  delay = 0,
  easing = 'power3.out',
  threshold = 0.1,
  direction = 'up',
  distance = 40,
  initialOpacity = 0,
}) => {
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const directionMap = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
    };

    gsap.set(element, {
      opacity: initialOpacity,
      filter: blur ? 'blur(8px)' : 'none',
      ...directionMap[direction],
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          gsap.to(element, {
            opacity: 1,
            x: 0,
            y: 0,
            filter: 'blur(0px)',
            duration,
            delay,
            ease: easing,
          });
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [blur, duration, delay, easing, threshold, direction, distance, initialOpacity]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform, opacity, filter' }}>
      {children}
    </div>
  );
};

export default FadeContent;
