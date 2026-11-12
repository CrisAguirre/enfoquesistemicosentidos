import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const BlurText = ({
  text = '',
  className = '',
  delay = 50,
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '-50px',
  animationFrom,
  animationTo,
  easing = 'power3.out',
  onAnimationComplete,
}) => {
  const containerRef = useRef(null);
  const elementsRef = useRef([]);
  const hasAnimated = useRef(false);

  const defaultFrom = {
    opacity: 0,
    filter: 'blur(10px)',
    y: direction === 'top' ? -30 : 30,
  };

  const defaultTo = {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
  };

  const fromVals = animationFrom || defaultFrom;
  const toVals = animationTo || defaultTo;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          gsap.to(elementsRef.current.filter(Boolean), {
            ...toVals,
            duration: 0.8,
            stagger: delay / 1000,
            ease: easing,
            onComplete: onAnimationComplete,
          });
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [toVals, delay, easing, threshold, rootMargin, onAnimationComplete]);

  const items = animateBy === 'words' ? text.split(' ') : text.split('');

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: animateBy === 'words' ? '0.35em' : '0',
      }}
    >
      {items.map((item, idx) => (
        <span
          key={idx}
          ref={(el) => (elementsRef.current[idx] = el)}
          style={{
            ...fromVals,
            display: 'inline-block',
            willChange: 'transform, opacity, filter',
          }}
        >
          {item === ' ' ? '\u00A0' : item}
        </span>
      ))}
    </div>
  );
};

export default BlurText;
