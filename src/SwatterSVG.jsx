export default function SwatterSVG() {
  return (
    <svg
      viewBox="0 0 64 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }}
    >
      {/* Handle */}
      <rect x="29" y="38" width="6" height="40" rx="3" fill="#8B5E3C" />
      <rect x="30" y="38" width="4" height="40" rx="2" fill="#A0714F" />
      {/* Handle grip lines */}
      <line x1="29" y1="60" x2="35" y2="60" stroke="#7A5030" strokeWidth="0.8" />
      <line x1="29" y1="64" x2="35" y2="64" stroke="#7A5030" strokeWidth="0.8" />
      <line x1="29" y1="68" x2="35" y2="68" stroke="#7A5030" strokeWidth="0.8" />

      {/* Swatter head */}
      <rect x="6" y="4" width="52" height="36" rx="4" fill="#E74C3C" />
      <rect x="8" y="6" width="48" height="32" rx="3" fill="#C0392B" />
      
      {/* Grid holes */}
      {[0, 1, 2, 3].map(row =>
        [0, 1, 2, 3, 4].map(col => (
          <circle
            key={`${row}-${col}`}
            cx={14 + col * 9}
            cy={10 + row * 8}
            r="2.5"
            fill="#E74C3C"
            opacity="0.7"
          />
        ))
      )}

      {/* Grid lines */}
      <line x1="8" y1="14" x2="56" y2="14" stroke="#A93226" strokeWidth="0.5" />
      <line x1="8" y1="22" x2="56" y2="22" stroke="#A93226" strokeWidth="0.5" />
      <line x1="8" y1="30" x2="56" y2="30" stroke="#A93226" strokeWidth="0.5" />
      <line x1="17" y1="6" x2="17" y2="38" stroke="#A93226" strokeWidth="0.5" />
      <line x1="26" y1="6" x2="26" y2="38" stroke="#A93226" strokeWidth="0.5" />
      <line x1="38" y1="6" x2="38" y2="38" stroke="#A93226" strokeWidth="0.5" />
      <line x1="47" y1="6" x2="47" y2="38" stroke="#A93226" strokeWidth="0.5" />

      {/* Highlight */}
      <rect x="10" y="8" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
    </svg>
  )
}
