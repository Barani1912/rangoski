import { Turtle, Clock, Gauge, Rocket, Flame } from 'lucide-react'

export const SPEED_LEVELS = [
  { level: 1, label: 'Very Slow', short: 'V.Slow', mult: 0.5, color: '#38bdf8', Icon: Turtle },
  { level: 2, label: 'Slow', short: 'Slow', mult: 0.75, color: '#34d399', Icon: Clock },
  { level: 3, label: 'Average', short: 'Average', mult: 1.0, color: '#4ade80', Icon: Gauge },
  { level: 4, label: 'High', short: 'High', mult: 1.5, color: '#fbbf24', Icon: Rocket },
  { level: 5, label: 'Very High', short: 'V.High', mult: 2.2, color: '#f87171', Icon: Flame },
]

export default function SpeedSlider({ currentLevel, onLevelChange }) {
  const activeConfig = SPEED_LEVELS.find(s => s.level === currentLevel) || SPEED_LEVELS[2]
  const ActiveIcon = activeConfig.Icon

  const handleChange = (e) => {
    onLevelChange(parseInt(e.target.value, 10))
  }

  // Calculate percentage for progress fill: (level - 1) / 4 * 100%
  const progressPercent = ((currentLevel - 1) / 4) * 100

  return (
    <div
      className="speed-slider-horizontal"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="speed-header">
        <span className="speed-header-label">Mosquito Speed:</span>
        <div
          className="speed-current-badge"
          style={{ borderColor: activeConfig.color }}
        >
          <ActiveIcon size={14} style={{ color: activeConfig.color }} />
          <span>
            {activeConfig.label} <strong>({activeConfig.mult}x)</strong>
          </span>
        </div>
      </div>

      <div className="slider-track-container">
        {/* Visual Track and Fill */}
        <div className="custom-slider-track">
          <div
            className="custom-slider-fill"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: activeConfig.color,
              boxShadow: `0 0 10px ${activeConfig.color}`,
            }}
          />
        </div>

        {/* Real draggable native range input */}
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={currentLevel}
          onChange={handleChange}
          className="horizontal-range-input"
          style={{ '--thumb-color': activeConfig.color }}
          aria-label="Mosquito Speed Slider"
        />

        {/* Stepped click targets & labels */}
        <div className="slider-ticks">
          {SPEED_LEVELS.map((item) => {
            const isSelected = item.level === currentLevel
            const StepIcon = item.Icon
            return (
              <button
                key={item.level}
                type="button"
                className={`slider-tick ${isSelected ? 'active' : ''}`}
                style={isSelected ? { color: item.color } : {}}
                onClick={(e) => {
                  e.stopPropagation()
                  onLevelChange(item.level)
                }}
                aria-label={`Select ${item.label} speed`}
                title={`${item.label} (${item.mult}x)`}
              >
                <div
                  className="tick-dot"
                  style={isSelected ? { backgroundColor: item.color, borderColor: '#ffffff' } : {}}
                />
                <div className="tick-content">
                  <StepIcon size={13} className="tick-icon" />
                  <span className="tick-text">{item.short}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
