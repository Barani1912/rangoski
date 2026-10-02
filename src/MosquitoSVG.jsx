export default function MosquitoSVG() {
  return (
    <svg
      className="mosquito-svg"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wings */}
      <ellipse cx="22" cy="20" rx="12" ry="6" fill="rgba(180, 210, 255, 0.25)" stroke="rgba(180, 210, 255, 0.4)" strokeWidth="0.5">
        <animate attributeName="ry" values="6;4;6" dur="0.1s" repeatCount="indefinite" />
        <animate attributeName="rx" values="12;10;12" dur="0.1s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="42" cy="20" rx="12" ry="6" fill="rgba(180, 210, 255, 0.25)" stroke="rgba(180, 210, 255, 0.4)" strokeWidth="0.5">
        <animate attributeName="ry" values="4;6;4" dur="0.1s" repeatCount="indefinite" />
        <animate attributeName="rx" values="10;12;10" dur="0.1s" repeatCount="indefinite" />
      </ellipse>

      {/* Body */}
      <ellipse cx="32" cy="32" rx="6" ry="14" fill="#3d3d3d" />
      <ellipse cx="32" cy="32" rx="5" ry="12" fill="#555" />
      
      {/* Head */}
      <circle cx="32" cy="16" r="5" fill="#444" />
      <circle cx="32" cy="16" r="4" fill="#555" />
      
      {/* Eyes */}
      <circle cx="29" cy="14" r="2.2" fill="#ff4444" />
      <circle cx="35" cy="14" r="2.2" fill="#ff4444" />
      <circle cx="29.5" cy="13.5" r="0.8" fill="#ff8888" />
      <circle cx="35.5" cy="13.5" r="0.8" fill="#ff8888" />

      {/* Proboscis (stinger) */}
      <line x1="32" y1="11" x2="32" y2="3" stroke="#666" strokeWidth="1" strokeLinecap="round" />

      {/* Legs */}
      <line x1="26" y1="26" x2="16" y2="32" stroke="#555" strokeWidth="1" strokeLinecap="round" />
      <line x1="26" y1="32" x2="14" y2="38" stroke="#555" strokeWidth="1" strokeLinecap="round" />
      <line x1="27" y1="38" x2="16" y2="46" stroke="#555" strokeWidth="1" strokeLinecap="round" />
      <line x1="38" y1="26" x2="48" y2="32" stroke="#555" strokeWidth="1" strokeLinecap="round" />
      <line x1="38" y1="32" x2="50" y2="38" stroke="#555" strokeWidth="1" strokeLinecap="round" />
      <line x1="37" y1="38" x2="48" y2="46" stroke="#555" strokeWidth="1" strokeLinecap="round" />

      {/* Body stripes */}
      <line x1="28" y1="28" x2="36" y2="28" stroke="#3d3d3d" strokeWidth="0.8" />
      <line x1="28" y1="32" x2="36" y2="32" stroke="#3d3d3d" strokeWidth="0.8" />
      <line x1="28" y1="36" x2="36" y2="36" stroke="#3d3d3d" strokeWidth="0.8" />
    </svg>
  )
}
