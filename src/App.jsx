import { useState } from 'react'
import {
  Play,
  RotateCcw,
  Settings,
  Trophy,
  Flame,
  ThumbsUp,
  AlertCircle,
  Skull,
  Crosshair,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import Game from './Game.jsx'
import mosquitoImg from './assets/m2.png'
import SpeedSlider, { SPEED_LEVELS } from './SpeedSlider.jsx'

export default function App() {
  const [gameState, setGameState] = useState('start') // 'start' | 'playing' | 'end'
  const [results, setResults] = useState({ killed: 0, missed: 0 })
  const [speedLevel, setSpeedLevel] = useState(3) // Default to 3: Average (1.0x)
  const [gameKey, setGameKey] = useState(0)

  const activeSpeedConfig = SPEED_LEVELS.find(s => s.level === speedLevel) || SPEED_LEVELS[2]
  const ActiveSpeedIcon = activeSpeedConfig.Icon

  const startGame = () => {
    setGameState('playing')
    setResults({ killed: 0, missed: 0 })
    setGameKey(k => k + 1)
  }

  const handleReset = () => {
    setResults({ killed: 0, missed: 0 })
    setGameKey(k => k + 1)
  }

  const endGame = (killed, missed) => {
    setResults({ killed, missed })
    setGameState('end')
  }

  const getMessage = () => {
    const { killed } = results
    if (killed === 10) {
      return {
        Icon: Trophy,
        color: '#fbbf24',
        text: 'PERFECT! All mosquitoes destroyed!',
      }
    }
    if (killed >= 8) {
      return {
        Icon: Flame,
        color: '#f97316',
        text: 'Almost perfect! Nice reflexes!',
      }
    }
    if (killed >= 5) {
      return {
        Icon: ThumbsUp,
        color: '#4ade80',
        text: 'Not bad... those bugs are sneaky!',
      }
    }
    if (killed >= 3) {
      return {
        Icon: AlertCircle,
        color: '#fbbf24',
        text: 'The mosquitoes are winning...',
      }
    }
    return {
      Icon: Skull,
      color: '#f87171',
      text: 'The mosquitoes send their regards.',
    }
  }

  const resultMsg = getMessage()
  const ResultIcon = resultMsg.Icon

  return (
    <div className="app">
      <div className="title-bar">
        <h1 className="title">Rangoski</h1>
      </div>

      {/* Speed Slider ONLY before the game start (on start screen) */}
      {gameState === 'start' && (
        <SpeedSlider currentLevel={speedLevel} onLevelChange={setSpeedLevel} />
      )}

      {gameState === 'playing' && (
        <Game
          key={gameKey}
          onGameEnd={endGame}
          onReset={handleReset}
          speedMultiplier={activeSpeedConfig.mult}
        />
      )}

      {gameState === 'start' && (
        <div className="screen-overlay">
          <div className="screen-mosquito-wrap">
            <img src={mosquitoImg} alt="Rangoski Mosquito" className="screen-mosquito-img" />
          </div>
          <div className="screen-title">Rangoski</div>
          <p className="screen-subtitle">
            Kill 10 mosquitoes with your trusty fly swatter. You have 10 seconds each. Ready?
          </p>
          <div className="start-speed-pill" style={{ borderColor: activeSpeedConfig.color }}>
            <ActiveSpeedIcon size={15} style={{ color: activeSpeedConfig.color }} />
            <span>
              Speed: <strong>{activeSpeedConfig.label}</strong> ({activeSpeedConfig.mult}x)
            </span>
          </div>
          <br />
          <button className="play-btn" onClick={startGame}>
            <Play size={18} fill="currentColor" />
            <span>Start Swatting</span>
          </button>
        </div>
      )}

      {gameState === 'end' && (
        <div className="screen-overlay">
          <div className="screen-result-icon-wrap" style={{ color: resultMsg.color }}>
            <ResultIcon size={64} strokeWidth={2.2} />
          </div>
          <div className="screen-title">Rangoski</div>
          <p className="screen-subtitle">{resultMsg.text}</p>
          <div className="screen-stats">
            <div className="stat-box">
              <div className="stat-value green">{results.killed}</div>
              <div className="stat-label">
                <CheckCircle2 size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                Killed
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-value red">{results.missed}</div>
              <div className="stat-label">
                <XCircle size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                Escaped
              </div>
            </div>
          </div>
          <div className="end-actions">
            <button className="play-btn" onClick={startGame}>
              <RotateCcw size={18} />
              <span>Play Again</span>
            </button>
            <button className="change-speed-btn" onClick={() => setGameState('start')}>
              <Settings size={18} />
              <span>Change Speed</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
