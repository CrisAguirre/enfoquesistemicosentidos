import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import './ModelViewer.css';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/* ── Label 3D que rota con el modelo ── */
function ModelLabel({ position, text, color = '#60a5fa', icon }) {
  return (
    <Html position={position} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${color}44`,
        borderRadius: '8px',
        padding: '4px 10px',
        fontSize: '11px',
        fontWeight: 600,
        color: color,
        whiteSpace: 'nowrap',
        boxShadow: `0 0 12px ${color}33`,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        lineHeight: 1.3,
      }}>
        {icon && <span style={{ fontSize: '13px' }}>{icon}</span>}
        {text}
      </div>
    </Html>
  );
}

/* ── Línea de flujo con pulso animado ── */
function FlowLine({ points, color = '#ef4444', speed = 1.5, pulseWidth = 0.15 }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * speed) % 1;
    ref.current.material.dashOffset = -t * 2;
  });

  return (
    <Line
      ref={ref}
      points={points}
      color={color}
      lineWidth={2.5}
      dashed
      dashSize={pulseWidth}
      gapSize={0.3}
      opacity={0.8}
      transparent
    />
  );
}

/* ── Escena del modelo con etiquetas y flujo ── */
function ModelScene({ src, mode, rate, depth, animBaseRate = 60, labels = [], flowLines = [] }) {
  const { scene, animations } = useGLTF(src);
  const innerRef = useRef();
  const { actions, mixer } = useAnimations(animations, innerRef);
  const paramsRef = useRef({ mode, rate, depth, animBaseRate });

  useEffect(() => {
    paramsRef.current = { mode, rate, depth, animBaseRate };
  }, [mode, rate, depth, animBaseRate]);

  useEffect(() => {
    if (mode !== 'animation') return;
    const names = Object.keys(actions);
    if (names.length === 0) return;
    const action = actions[names[0]];
    action.reset().fadeIn(0.3).play();
    return () => {
      action.fadeOut(0.3);
    };
  }, [actions, mode]);

  const norm = useMemo(() => {
    const bb = new THREE.Box3().setFromObject(scene);
    const center = bb.getCenter(new THREE.Vector3());
    const size = bb.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = 4 / maxDim;
    return { center, s };
  }, [scene]);

  useFrame(() => {
    const p = paramsRef.current;

    if (p.mode === 'animation' && mixer) {
      mixer.timeScale = clamp((p.rate || 60) / (p.animBaseRate || 60), 0.05, 4);
      return;
    }

    if (!innerRef.current) return;

    if (p.mode === 'breathe') {
      const r = clamp(p.rate || 14, 4, 60);
      const elapsed = performance.now() / 1000;
      const cycleSec = 60 / r;
      const phase = (elapsed % cycleSec) / cycleSec;
      const scale = phase < 0.4 ? 1 + 0.06 * (phase / 0.4) : 1 + 0.06 * (1 - (phase - 0.4) / 0.6);
      innerRef.current.scale.setScalar(scale);
    } else if (p.mode === 'pulse') {
      const r = clamp(p.rate || 60, 30, 200);
      const beatMs = 60000 / r;
      const elapsed = performance.now();
      const cycle = (elapsed / beatMs) % 1;
      innerRef.current.scale.setScalar(1 + 0.03 * Math.sin(cycle * Math.PI * 2));
    } else {
      innerRef.current.scale.setScalar(1);
    }
  });

  return (
    <group
      position={[-norm.center.x * norm.s, -norm.center.y * norm.s, -norm.center.z * norm.s]}
      scale={norm.s}
    >
      <group ref={innerRef}>
        <primitive object={scene} />
        {/* Etiquetas 3D que rotan con el modelo */}
        {labels.map((label, i) => (
          <ModelLabel key={i} {...label} />
        ))}
        {/* Líneas de flujo */}
        {flowLines.map((line, i) => (
          <FlowLine key={`flow-${i}`} {...line} />
        ))}
      </group>
    </group>
  );
}

export default function ModelWithLabels({
  src,
  mode = 'none',
  rate,
  depth,
  animBaseRate,
  autoRotate = true,
  height = 520,
  camera = [0, 0, 7],
  fov = 45,
  labels = [],
  flowLines = [],
}) {
  return (
    <div className="model3d-canvas" style={{ height }}>
      <Canvas
        camera={{ position: camera, fov }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 8, 5]} intensity={1.6} />
        <directionalLight position={[-5, -3, -4]} intensity={0.5} />
        <Suspense fallback={null}>
          <ModelScene
            src={src}
            mode={mode}
            rate={rate}
            depth={depth}
            animBaseRate={animBaseRate}
            labels={labels}
            flowLines={flowLines}
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
          minDistance={3}
          maxDistance={14}
        />
      </Canvas>
    </div>
  );
}
