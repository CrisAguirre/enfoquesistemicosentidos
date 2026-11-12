import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import SimCard from '../components/shared/SimCard';
import { FadeContent } from '../reactbits';
import './pages.css';

export default function LaboratorioHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightNum = parseInt(searchParams.get('highlight'), 10) || 0;
  const cardRefs = useRef({});

  useEffect(() => {
    if (highlightNum && cardRefs.current[highlightNum]) {
      const el = cardRefs.current[highlightNum];
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('sim-card-highlight');
        const timer = setTimeout(() => {
          el.classList.remove('sim-card-highlight');
          setSearchParams({}, { replace: true });
        }, 4000);
        return () => clearTimeout(timer);
      }, 400);
    }
  }, [highlightNum, setSearchParams]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Laboratorio de Simulaciones Sensoriales</h1>
        <p className="page-subtitle">
          Explora las 6 fases interactivas de los sentidos y el cerebro desde el pensamiento sistémico.
        </p>
      </div>

      <section className="sim-block">
        <div className="block-header">
          <span className="block-icon">📚</span>
          <div>
            <h2 className="block-title">Módulo Introductorio</h2>
            <p className="block-desc">Fase 1: El macrosistema sensorial y pensamiento sistémico</p>
          </div>
        </div>

        <div className="sim-grid">
          <FadeContent delay={0.1} duration={0.6} direction="up">
            <div ref={(el) => (cardRefs.current[1] = el)}>
              <SimCard
                simNumber={1}
                title="Laboratorio de Introducción"
                description="Concepto de sistema, puzzle de acoplamiento de vías y saberes previos."
                icon="🎬"
                routePath="/laboratorio/introduccion"
              />
            </div>
          </FadeContent>
        </div>
      </section>

      <section className="sim-block">
        <div className="block-header">
          <span className="block-icon">🧩</span>
          <div>
            <h2 className="block-title">Componentes y Causalidad</h2>
            <p className="block-desc">Fases 2 y 3: Los transductores primarios (Luz y Sonido)</p>
          </div>
        </div>

        <div className="sim-grid">
          <FadeContent delay={0.2} duration={0.6} direction="up">
            <div ref={(el) => (cardRefs.current[2] = el)}>
              <SimCard
                simNumber={2}
                title="La Vista"
                description="Óptica ocular, apertura pupilar, conos, bastones y vía occipital."
                icon="👁️"
                routePath="/laboratorio/vista"
              />
            </div>
          </FadeContent>
          <FadeContent delay={0.3} duration={0.6} direction="up">
            <div ref={(el) => (cardRefs.current[3] = el)}>
              <SimCard
                simNumber={3}
                title="El Oído"
                description="Ondas sonoras, vibración mecanoacústica, cóclea y corteza temporal."
                icon="👂"
                routePath="/laboratorio/oido"
              />
            </div>
          </FadeContent>
        </div>
      </section>

      <section className="sim-block">
        <div className="block-header">
          <span className="block-icon">🔍</span>
          <div>
            <h2 className="block-title">Representación y Escalas</h2>
            <p className="block-desc">Fases 4 y 5: Quimiorrecepción y Mecanorrecepción somática</p>
          </div>
        </div>

        <div className="sim-grid">
          <FadeContent delay={0.4} duration={0.6} direction="up">
            <div ref={(el) => (cardRefs.current[4] = el)}>
              <SimCard
                simNumber={4}
                title="Olfato y Gusto"
                description="Quimiorrecepción molecular, umbrales y la sinergia emergente del sabor."
                icon="👃"
                routePath="/laboratorio/olfato-gusto"
              />
            </div>
          </FadeContent>
          <FadeContent delay={0.5} duration={0.6} direction="up">
            <div ref={(el) => (cardRefs.current[5] = el)}>
              <SimCard
                simNumber={5}
                title="El Tacto"
                description="Capas de la piel, receptores de presión y el Homúnculo de Penfield."
                icon="🖐️"
                routePath="/laboratorio/tacto"
              />
            </div>
          </FadeContent>
        </div>
      </section>

      <section className="sim-block">
        <div className="block-header">
          <span className="block-icon">🌐</span>
          <div>
            <h2 className="block-title">Visión de Totalidad</h2>
            <p className="block-desc">Fase 6: El Cerebro como centro de control y neuroplasticidad</p>
          </div>
        </div>

        <div className="sim-grid">
          <FadeContent delay={0.6} duration={0.6} direction="up">
            <div ref={(el) => (cardRefs.current[6] = el)}>
              <SimCard
                simNumber={6}
                title="Integración Sensorial"
                description="El cerebro coordinando los 5 sentidos: conservación, propósito y compensación."
                icon="🧠"
                routePath="/laboratorio/integracion-sensorial"
              />
            </div>
          </FadeContent>
        </div>
      </section>
    </div>
  );
}
