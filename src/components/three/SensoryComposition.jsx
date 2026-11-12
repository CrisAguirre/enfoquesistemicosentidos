import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import brainUrl from '../../assets/models/brain.glb?url';
import './ModelViewer.css';

function boxInfo(obj) {
  const bb = new THREE.Box3().setFromObject(obj);
  return { center: bb.getCenter(new THREE.Vector3()), size: bb.getSize(new THREE.Vector3()) };
}

/* ── Línea sináptica con pulso de señal hacia el cerebro ── */
function SynapticBeam({ start, end, color = '#a855f7', speed = 2, active = true }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const t = (clock.getElapsedTime() * speed) % 1;
    ref.current.material.dashOffset = -t * 2;
  });

  return (
    <Line
      ref={ref}
      points={[start, end]}
      color={active ? color : '#475569'}
      lineWidth={active ? 2.5 : 1}
      dashed
      dashSize={0.2}
      gapSize={0.25}
      opacity={active ? 0.85 : 0.25}
      transparent
    />
  );
}

/* ── Nodo 3D de cada sentido orbitando al cerebro ── */
function SensoryNode({ position, name, icon, color, active, count }) {
  return (
    <Html position={position} center distanceFactor={7}>
      <div
        style={{
          background: active ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.5)',
          border: `2px solid ${active ? color : '#64748b'}`,
          boxShadow: active ? `0 0 16px ${color}66` : 'none',
          borderRadius: '12px',
          padding: '6px 12px',
          color: active ? '#ffffff' : '#94a3b8',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <div>
          <div>{name}</div>
          {active && (
            <div style={{ fontSize: '10px', color: color, fontWeight: 500 }}>
              {count} señales/s
            </div>
          )}
          {!active && (
            <div style={{ fontSize: '10px', color: '#ef4444' }}>Desactivado (Compensando)</div>
          )}
        </div>
      </div>
    </Html>
  );
}

function Scene({ activity = 50, disabledSense = null }) {
  const brain = useGLTF(brainUrl);
  const brainGroup = useRef();

  const brainBox = useMemo(() => boxInfo(brain.scene), [brain]);
  const targetH = 3.2;
  const scale = targetH / (brainBox.size.y || 1);
  const bc = brainBox.center;

  useFrame((state) => {
    if (!brainGroup.current) return;
    const t = state.clock.elapsedTime;
    const freq = 1 + (activity / 100) * 1.5;
    const pulse = 1 + 0.03 * Math.sin(t * freq * Math.PI * 2);
    brainGroup.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
  });

  // Posición de nodos sensoriales periféricos
  const SENSE_NODES = [
    { id: 'vista', name: 'Vista', icon: '👁️', color: '#3b82f6', pos: [-2.6, 1.2, 1.2], target: [0, 0.3, -0.6] },
    { id: 'oido', name: 'Oído', icon: '👂', color: '#22c55e', pos: [2.6, 0.2, 0.8], target: [0.6, -0.2, 0] },
    { id: 'olfato', name: 'Olfato', icon: '👃', color: '#eab308', pos: [-1.8, -1.8, 1.5], target: [0, -0.5, 0.8] },
    { id: 'gusto', name: 'Gusto', icon: '👅', color: '#ec4899', pos: [1.8, -1.8, 1.5], target: [0.3, -0.2, 0.4] },
    { id: 'tacto', name: 'Tacto', icon: '🖐️', color: '#f97316', pos: [0, 2.5, -0.8], target: [0, 0.7, 0.1] },
  ];

  return (
    <>
      <group
        ref={brainGroup}
        position={[-bc.x * scale, -bc.y * scale, -bc.z * scale]}
      >
        <primitive object={brain.scene} />
      </group>

      {SENSE_NODES.map((node) => {
        const isActive = disabledSense !== node.id;
        const rateMultiplier = disabledSense ? 1.25 : 1.0;
        const count = Math.round((20 + activity * 1.2) * rateMultiplier);

        return (
          <group key={node.id}>
            <SensoryNode
              position={node.pos}
              name={node.name}
              icon={node.icon}
              color={node.color}
              active={isActive}
              count={count}
            />
            <SynapticBeam
              start={node.pos}
              end={node.target}
              color={node.color}
              speed={1.5 + (activity / 100) * 2}
              active={isActive}
            />
          </group>
        );
      })}
    </>
  );
}

export default function SensoryComposition({ activity = 50, disabledSense = null, height = 540 }) {
  return (
    <div className="model3d-canvas" style={{ height }}>
      <Canvas
        camera={{ position: [0, 1, 6.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 8, 5]} intensity={1.5} />
        <directionalLight position={[-6, -4, -5]} intensity={0.8} />
        <pointLight position={[0, 0, 0]} intensity={1.2} color="#c084fc" />
        <Suspense fallback={null}>
          <Scene activity={activity} disabledSense={disabledSense} />
        </Suspense>
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          minDistance={3.5}
          maxDistance={12}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

