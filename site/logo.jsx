// Pulse logo mark — reused across nav + hero + footer
function PulseMark({ size = 40, color = BRAND.text, accent = BRAND.amber, rings = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" style={{ display: 'block' }}>
      {rings && <>
        <circle cx="52" cy="52" r="50" fill="none" stroke={color} strokeWidth="1.2" opacity="0.2"/>
        <circle cx="52" cy="52" r="36" fill="none" stroke={color} strokeWidth="1.4" opacity="0.42"/>
        <circle cx="52" cy="52" r="22" fill="none" stroke={color} strokeWidth="1.8" opacity="0.78"/>
      </>}
      <circle cx="52" cy="52" r="9" fill={accent}/>
    </svg>
  );
}

// Animated pulse — used in hero
function PulseAnimated({ size = 360, color = BRAND.text, accent = BRAND.amber }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <style>{`
        @keyframes pulse-ring-1 { 0% { transform: scale(0.4); opacity: 0.9; } 100% { transform: scale(1); opacity: 0; } }
        @keyframes pulse-ring-2 { 0% { transform: scale(0.4); opacity: 0.7; } 100% { transform: scale(1); opacity: 0; } }
        @keyframes pulse-ring-3 { 0% { transform: scale(0.4); opacity: 0.5; } 100% { transform: scale(1); opacity: 0; } }
        @keyframes pulse-core { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
      `}</style>
      <svg width={size} height={size} viewBox="0 0 400 400" style={{ position: 'absolute', inset: 0 }}>
        <g style={{ transformOrigin: '200px 200px', animation: 'pulse-ring-1 3s ease-out infinite' }}>
          <circle cx="200" cy="200" r="180" fill="none" stroke={color} strokeWidth="1"/>
        </g>
        <g style={{ transformOrigin: '200px 200px', animation: 'pulse-ring-2 3s ease-out infinite', animationDelay: '0.6s' }}>
          <circle cx="200" cy="200" r="180" fill="none" stroke={color} strokeWidth="1"/>
        </g>
        <g style={{ transformOrigin: '200px 200px', animation: 'pulse-ring-3 3s ease-out infinite', animationDelay: '1.2s' }}>
          <circle cx="200" cy="200" r="180" fill="none" stroke={color} strokeWidth="1"/>
        </g>
        <circle cx="200" cy="200" r="140" fill="none" stroke={color} strokeWidth="1" opacity="0.15"/>
        <circle cx="200" cy="200" r="100" fill="none" stroke={color} strokeWidth="1.2" opacity="0.28"/>
        <circle cx="200" cy="200" r="62" fill="none" stroke={color} strokeWidth="1.6" opacity="0.5"/>
        <g style={{ transformOrigin: '200px 200px', animation: 'pulse-core 2.4s ease-in-out infinite' }}>
          <circle cx="200" cy="200" r="28" fill={accent}/>
        </g>
      </svg>
    </div>
  );
}

Object.assign(window, { PulseMark, PulseAnimated });
