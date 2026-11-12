import { Link } from 'react-router-dom';
import '../App.css';
import {
  SplitText,
  BlurText,
  GradientText,
  Aurora,
  Particles,
  FadeContent,
} from '../reactbits';

export default function Landing() {
  return (
    <div className="app">
      {/* ===== HERO ===== */}
      <section id="inicio" className="hero">
        <div className="hero-background">
          <Aurora
            colorStops={['#581c87', '#7e22ce', '#3b82f6']}
            blend={0.4}
            amplitude={0.9}
            speed={0.35}
          />
          <Particles
            quantity={65}
            color="#c084fc"
            size={0.65}
            staticity={35}
            ease={55}
          />

          {/* Símbolos flotantes de los 5 sentidos + cerebro */}
          <div className="floating-symbols">
            <div className="float-symbol brain-symbol" style={{ top: '15%', left: '10%' }}>🧠</div>
            <div className="float-symbol" style={{ top: '25%', right: '12%', animation: 'float 6s ease-in-out infinite' }}>👁️</div>
            <div className="float-symbol" style={{ bottom: '30%', left: '8%', animation: 'float 7s ease-in-out infinite 1s' }}>👂</div>
            <div className="float-symbol" style={{ bottom: '20%', right: '15%', animation: 'float 8s ease-in-out infinite 2s' }}>👃</div>
            <div className="float-symbol" style={{ top: '45%', right: '8%', animation: 'float 6.5s ease-in-out infinite 1.5s' }}>👅</div>
            <div className="float-symbol" style={{ top: '60%', left: '15%', animation: 'float 7.5s ease-in-out infinite 0.5s' }}>🖐️</div>
          </div>
        </div>

        <div className="hero-content">
          <FadeContent delay={0.2} direction="up" distance={30}>
            <span className="hero-badge">
              <span className="pulse" style={{ background: '#c084fc', boxShadow: '0 0 12px #c084fc' }}></span>
              Pensamiento Sistémico · Ciencias Naturales
            </span>
          </FadeContent>

          <FadeContent delay={0.35} direction="up" distance={24}>
            <div className="hero-banner">
              Estrategia de Aprendizaje Fundamentada en el Pensamiento Sistémico: El Cerebro como Eje Fundamental y los 5 Sentidos como Subsistemas de Captación de Información
            </div>
          </FadeContent>

          <div className="hero-title">
            <SplitText
              text="Explora los Sentidos y el"
              delay={40}
              className="hero-title"
              animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
              animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            />
            <GradientText
              colors={['#c084fc', '#3b82f6', '#ec4899', '#c084fc']}
              animationSpeed={3}
              className="hero-title"
            >
              Cerebro Humano
            </GradientText>
          </div>

          <div className="hero-subtitle">
            <BlurText
              text="Una experiencia inmersiva para comprender cómo el cerebro integra fotones, ondas sonoras, moléculas y presiones en una sola percepción unificada de la realidad."
              delay={20}
              animateBy="words"
              direction="bottom"
            />
          </div>

          <FadeContent delay={0.8} direction="up" distance={20}>
            <div className="hero-actions">
              <Link to="/laboratorio" className="btn btn-primary">
                🚀 Entrar al Laboratorio
              </Link>
              <Link to="/sesiones" className="btn btn-outline">
                📚 Secuencia Didáctica
              </Link>
            </div>
          </FadeContent>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="temas" className="features">
        <div className="container">
          <div className="features-header">
            <FadeContent direction="up">
              <h2>
                Aprende con{' '}
                <GradientText colors={['#c084fc', '#38bdf8', '#c084fc']} animationSpeed={4}>
                  Pensamiento Sistémico
                </GradientText>
              </h2>
              <p>
                Descubre los 7 lineamientos del Dr. Eliécer Pineda Ballesteros aplicados a la neurociencia de los sentidos.
              </p>
            </FadeContent>
          </div>

          <div className="features-grid">
            <FadeContent delay={0.1} direction="up">
              <div className="glass-card feature-card">
                <div className="feature-icon">🧠</div>
                <h3>El Cerebro Integrador</h3>
                <p>
                  El procesador central: recibe aferencias de los 5 sentidos, las sincroniza, interpreta y elabora respuestas motoras y emocionales.
                </p>
              </div>
            </FadeContent>

            <FadeContent delay={0.2} direction="up">
              <div className="glass-card feature-card">
                <div className="feature-icon">👁️</div>
                <h3>La Vista</h3>
                <p>
                  Transducción de ondas electromagnéticas en la retina, apertura pupilar adaptativa y proyección hacia la corteza visual occipital.
                </p>
              </div>
            </FadeContent>

            <FadeContent delay={0.3} direction="up">
              <div className="glass-card feature-card">
                <div className="feature-icon">👂</div>
                <h3>El Oído</h3>
                <p>
                  Mecanorrecepción coclear: de la vibración aérea del tímpano al mapa tonotópico en el lóbulo temporal del cerebro.
                </p>
              </div>
            </FadeContent>

            <FadeContent delay={0.4} direction="up">
              <div className="glass-card feature-card">
                <div className="feature-icon">👃</div>
                <h3>El Olfato</h3>
                <p>
                  Detección de moléculas volátiles, quimiorrecepción en el epitelio nasal y conexión íntima con la memoria y el sistema límbico.
                </p>
              </div>
            </FadeContent>

            <FadeContent delay={0.5} direction="up">
              <div className="glass-card feature-card">
                <div className="feature-icon">👅</div>
                <h3>El Gusto</h3>
                <p>
                  Los cinco sabores primarios, receptores en botones gustativos y la sinergia retronasal que da origen a la experiencia del sabor.
                </p>
              </div>
            </FadeContent>

            <FadeContent delay={0.6} direction="up">
              <div className="glass-card feature-card">
                <div className="feature-icon">🖐️</div>
                <h3>El Tacto y el Homúnculo</h3>
                <p>
                  Receptores de presión, vibración, dolor y temperatura en la piel, representados en el mapa somatosensorial de Penfield.
                </p>
              </div>
            </FadeContent>
          </div>
        </div>
      </section>
    </div>
  );
}
