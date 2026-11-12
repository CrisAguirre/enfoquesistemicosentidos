export default function AppLogo({ size = 32, className = '' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo Los Sentidos - Pensamiento Sistémico"
    >
      <defs>
        <linearGradient id="navBrainGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {/* Halo de fondo */}
      <circle cx="32" cy="32" r="30" fill="rgba(168, 85, 247, 0.14)" stroke="#a855f7" strokeWidth="1.5" />
      {/* Silueta del cerebro */}
      <path
        d="M32 14c-6.5 0-11.5 2.5-14 6.5-1.6 2.5-2.5 5.7-1.6 9 0 1.6-.8 3.3-2.5 4.1-.8.8-1.6 2.5-1.6 4.1 0 2.5 1.6 4.1 4.1 4.9.8 0 1.6.8 2.5 2.5.8 2.5 3.3 4.1 5.7 4.9 1.6.8 3.3.8 4.9 0h5c1.6.8 3.3.8 4.9 0 2.5-.8 4.9-2.5 5.7-4.9.8-1.6 1.6-2.5 2.5-2.5 2.5-.8 4.1-2.5 4.1-4.9 0-1.6-.8-3.3-1.6-4.1-1.6-.8-2.5-2.5-2.5-4.1.8-3.3 0-6.5-1.6-9-2.5-4-7.5-6.5-14-6.5z"
        fill="url(#navBrainGrad)"
      />
      {/* Surco interhemisférico */}
      <path d="M32 17v29" fill="none" stroke="#e9d5ff" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.6" />
      {/* 5 nodos sensoriales periféricos */}
      <circle cx="16" cy="20" r="3.2" fill="#f59e0b" opacity="0.95"><title>Vista</title></circle>
      <circle cx="48" cy="20" r="3.2" fill="#3b82f6" opacity="0.95"><title>Oído</title></circle>
      <circle cx="32" cy="9"  r="3"   fill="#10b981" opacity="0.95"><title>Olfato</title></circle>
      <circle cx="17" cy="45" r="3.2" fill="#ef4444" opacity="0.95"><title>Gusto</title></circle>
      <circle cx="47" cy="45" r="3.2" fill="#f97316" opacity="0.95"><title>Tacto</title></circle>
      {/* Conectores neuronales aferentes */}
      <line x1="16" y1="20" x2="23" y2="24" stroke="#f59e0b" strokeWidth="1.2" opacity="0.75" />
      <line x1="48" y1="20" x2="41" y2="24" stroke="#3b82f6" strokeWidth="1.2" opacity="0.75" />
      <line x1="32" y1="9"  x2="32" y2="15" stroke="#10b981" strokeWidth="1.2" opacity="0.75" />
      <line x1="17" y1="45" x2="24" y2="39" stroke="#ef4444" strokeWidth="1.2" opacity="0.75" />
      <line x1="47" y1="45" x2="40" y2="39" stroke="#f97316" strokeWidth="1.2" opacity="0.75" />
    </svg>
  );
}

