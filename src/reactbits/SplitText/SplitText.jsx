import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

const SplitText = ({
  text = '',
  className = '',
  delay = 50,
  animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
  easing = 'power3.out',
  threshold = 0.1,
  rootMargin = '-50px',
  textAlign = 'center',
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const hasAnimated = useRef(false);

  const setLetterRef = useCallback((el, index) => {
    lettersRef.current[index] = el;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          gsap.to(lettersRef.current.filter(Boolean), {
            ...animationTo,
            duration: 0.6,
            stagger: delay / 1000,
            ease: easing,
            onComplete: onLetterAnimationComplete,
          });
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animationTo, delay, easing, threshold, rootMargin, onLetterAnimationComplete]);

  const words = text.split(' ');
  let letterIndex = 0;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ textAlign, display: 'flex', flexWrap: 'wrap', justifyContent: textAlign === 'center' ? 'center' : 'flex-start', gap: '0.35em' }}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} style={{ display: 'inline-flex' }}>
          {word.split('').map((char) => {
            const idx = letterIndex++;
            return (
              <span
                key={idx}
                ref={(el) => setLetterRef(el, idx)}
                style={{
                  ...animationFrom,
                  display: 'inline-block',
                  willChange: 'transform, opacity',
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

export default SplitText;
