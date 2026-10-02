import { useRef } from 'react'
import { Flame, Rocket, Gauge, Clock, Turtle } from 'lucide-react'

export const SPEED_LEVELS = [
  { level: 5, label: 'Very High', short: 'V.High', mult: 2.2, color: '#f87171', Icon: Flame },
  { level: 4, label: 'High', short: 'High', mult: 1.5, color: '#fbbf24', Icon: Rocket },
  { level: 3, label: 'Average', short: 'Avg', mult: 1.0, color: '#4ade80', Icon: Gauge },
  { level: 2, label: 'Slow', short: 'Slow', mult: 0.75, color: '#34d399', Icon: Clock },
  { level: 1, label: 'Very Slow', short: 'V.Slow', mult: 0.5, color: '#38bdf8', Icon: Turtle },
]

export default function SpeedSlider({ currentLevel, onLevelChange }) {
  const activeConfig = SPEED_LEVELS.find(s => s.level === currentLevel) || SPEED_LEVELS[2]
  const ActiveIcon = activeConfig.Icon
  const containerRef = useRef(null)

  // Prevent swatter/swing clicks and touches from bubbling to the game area
  const preventBubble = (e) => {
    e.stopPropagation()
  }

  // Handle native vertical range slider change
  const handleRangeChange = (e) => {
    const val = parseInt(e.target.value, 10)
    onLevelChange(val)
  }

  return (
    <aside
      className="speed-control-container"
      ref={containerRef}
      onMouseDown={preventBubble}
      onTouchStart={preventBubble}
      onClick={preventBubble}
      aria-label="Mosquito Speed Control"
    >
      <div className="speed-badge" style={{ borderColor: activeConfig.color }}>
        <span className="speed-badge-icon">
          <ActiveIcon size={14} />
        </span>
        <span className="speed-badge-text">{activeConfig.label}</span>
      </div>

      <div className="speed-slider-wrapper">
        <div className="speed-track-bg">
          {/* Fill indicator line */}
          <div
            className="speed-track-fill"
            style={{
              height: `${((currentLevel - 1) / 4) * 100}%`,
              backgroundColor: activeConfig.color,
              boxShadow: `0 0 12px ${activeConfig.color}`,
            }}
          />
        </div>

        {/* Step buttons for tap / click */}
        <div className="speed-steps">
          {SPEED_LEVELS.map((item) => {
            const isActive = item.level === currentLevel
            const StepIcon = item.Icon
            return (
              <button
                key={item.level}
                type="button"
                className={`speed-step-btn ${isActive ? 'active' : ''}`}
                style={isActive ? { borderColor: item.color, color: '#ffffff' } : {}}
                onClick={(e) => {
                  e.stopPropagation()
                  onLevelChange(item.level)
                }}
                title={`${item.label} (${item.mult}x)`}
                aria-label={`Set speed to ${item.label}`}
              >
                <span className="step-icon">
                  <StepIcon size={13} />
                </span>
                <span className="step-label">{item.label}</span>
                <span className="step-short-label">{item.short}</span>
              </button>
            )
          })}
        </div>

        {/* Accessible vertical HTML range input overlaid */}
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={currentLevel}
          onChange={handleRangeChange}
          className="speed-range-input"
          aria-label="Speed level slider from Very Slow to Very High"
        />
      </div>
    </aside>
  )
}
