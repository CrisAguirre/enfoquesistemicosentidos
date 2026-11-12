import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SequenceCarousel({ steps, color = '#f59e0b', title = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextStep = () => {
    if (currentIndex < steps.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const prevStep = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div style={{ 
      background: 'rgba(0,0,0,0.2)', 
      padding: '1.5rem', 
      borderRadius: '12px', 
      border: `1px solid ${color}40`, 
      margin: '1.5rem 0', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {title && <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', color, fontSize: '1.2rem' }}>{title}</h4>}
      
      {/* Container for the current step */}
      <div style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ position: 'absolute', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
          >
            {typeof steps[currentIndex] === 'object' && steps[currentIndex].icon && (
              <div style={{ 
                fontSize: '2.5rem', 
                filter: `drop-shadow(0 0 10px ${color}60)`,
                marginBottom: '0.25rem'
              }}>
                {steps[currentIndex].icon}
              </div>
            )}
            <p style={{ margin: 0, fontSize: '1.15rem', color: '#e2e8f0', fontWeight: '500', lineHeight: '1.6' }}>
              {typeof steps[currentIndex] === 'object' ? steps[currentIndex].text : steps[currentIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
        <button 
          onClick={prevStep} 
          disabled={currentIndex === 0}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: currentIndex === 0 ? '#475569' : color, 
            fontSize: '1.8rem', 
            cursor: currentIndex === 0 ? 'default' : 'pointer',
            padding: '0 1rem',
            lineHeight: 1,
            transition: 'color 0.2s'
          }}
          aria-label="Anterior"
        >
          &#8249;
        </button>
        
        {/* Dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {steps.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: idx === currentIndex ? color : '#334155',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'background 0.3s, transform 0.2s',
                transform: idx === currentIndex ? 'scale(1.2)' : 'scale(1)'
              }}
              aria-label={`Ir al paso ${idx + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={nextStep} 
          disabled={currentIndex === steps.length - 1}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: currentIndex === steps.length - 1 ? '#475569' : color, 
            fontSize: '1.8rem', 
            cursor: currentIndex === steps.length - 1 ? 'default' : 'pointer',
            padding: '0 1rem',
            lineHeight: 1,
            transition: 'color 0.2s'
          }}
          aria-label="Siguiente"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}
