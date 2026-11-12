import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Carousel({ children, color = '#f59e0b', title = "", titleMarginTop = '3rem' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = () => {
    if (currentIndex < React.Children.count(children) - 1) {
      setDirection(1);
      setCurrentIndex(c => c + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(c => c - 1);
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
      {title && (
        <div style={{ marginTop: titleMarginTop }}>
          <h4 style={{ textAlign: 'center', marginBottom: '4rem', color, fontSize: '1.2rem' }}>{title}</h4>
        </div>
      )}
      
      <div style={{ minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ position: 'absolute', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
          >
            {React.Children.toArray(children)[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
        <button 
          onClick={prevSlide} 
          disabled={currentIndex === 0}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: currentIndex === 0 ? '#475569' : '#f59e0b', 
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
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {Array.from({ length: React.Children.count(children) }).map((_, idx) => (
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
                background: idx === currentIndex ? '#f59e0b' : '#334155',
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
          onClick={nextSlide} 
          disabled={currentIndex >= React.Children.count(children) - 1}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: currentIndex >= React.Children.count(children) - 1 ? '#475569' : '#f59e0b', 
            fontSize: '1.8rem', 
            cursor: currentIndex >= React.Children.count(children) - 1 ? 'default' : 'pointer',
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