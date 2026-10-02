import { useState } from 'react'
import {
  Play,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  Target,
} from 'lucide-react'
import Game from './Game.jsx'
import mosquitoImg from './assets/m2.png'
import SpeedSlider, { SPEED_LEVELS } from './SpeedSlider.jsx'

export default function App() {
  const [gameState, setGameState] = useState('start') // 'start' | 'playing' | 'end'
  const [theme, setTheme] = useState('dark') // 'dark' (default) | 'light'
  const [results, setResults] = useState({ killed: 0, missed: 0, accuracy: 0, totalSwats: 0 })
  const [speedLevel, setSpeedLevel] = useState(3) // Default to 3: Average (1.0x)
  const [gameKey, setGameKey] = useState(0)

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }

  const activeSpeedConfig = SPEED_LEVELS.find(s => s.level === speedLevel) || SPEED_LEVELS[2]

  const startGame = () => {
    setGameState('playing')
    setResults({ killed: 0, missed: 0, accuracy: 0, totalSwats: 0 })
    setGameKey(k => k + 1)
  }

  const handleReset = () => {
    setResults({ killed: 0, missed: 0, accuracy: 0, totalSwats: 0 })
    setGameKey(k => k + 1)
  }

  const goToHome = () => {
    setGameState('start')
    setResults({ killed: 0, missed: 0, accuracy: 0, totalSwats: 0 })
    setGameKey(k => k + 1)
  }

  const endGame = (killed, missed, accuracy = 0, totalSwats = 0) => {
    setResults({ killed, missed, accuracy, totalSwats })
    setGameState('end')
  }

  const accuracyPercent = results.accuracy !== undefined ? results.accuracy : 0

  const getOutcome = () => {
    const { killed } = results
    if (killed === 10) {
      if (accuracyPercent === 100) {
        return {
          title: 'PERFECT HUNT',
          subtitle: 'Flawless 100% precision! Every mosquito eliminated on the 1st swat.',
          statusColor: '#22c55e',
        }
      }
      return {
        title: 'ALL 10 ELIMINATED',
        subtitle: `All 10 mosquitoes destroyed with ${accuracyPercent}% chance efficiency!`,
        statusColor: '#22c55e',
      }
    }
    if (killed >= 7) {
      return {
        title: 'MISSION COMPLETE',
        subtitle: `Great reflexes! Cleared with ${accuracyPercent}% swat accuracy.`,
        statusColor: '#22c55e',
      }
    }
    if (killed >= 4) {
      return {
        title: 'ROUND COMPLETE',
        subtitle: `Good effort! Achieved ${accuracyPercent}% swat accuracy.`,
        statusColor: '#f59e0b',
      }
    }
    return {
      title: 'ROUND OVER',
      subtitle: 'The mosquitoes got away. Conserve your swats and try again!',
      statusColor: '#ef4444',
    }
  }

  const outcome = getOutcome()

  return (
    <div className={`app theme-${theme}`} data-theme={theme}>
      {gameState === 'playing' && (
        <div className="title-bar">
          <h1 className="title">Rangoski</h1>
        </div>
      )}

      {gameState === 'playing' && (
        <Game
          key={gameKey}
          onGameEnd={endGame}
          onReset={handleReset}
          onHome={goToHome}
          speedMultiplier={activeSpeedConfig.mult}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {gameState === 'start' && (
        <div className="home-screen-layout">
          {/* Theme Toggle Button in top-right */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle brightness theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            <span className="theme-toggle-label">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
          </button>

          {/* Top: Header at the top of the screen */}
          <header className="home-top-header">
            <img src={mosquitoImg} alt="Mosquito" className="home-top-mosquito-img" />
            <h1 className="home-top-title">Rangoski</h1>
          </header>

          {/* Middle: Plain centered slider & start button (No modal box) */}
          <main className="home-center-content">
            <div className="home-slider-wrap">
              <SpeedSlider currentLevel={speedLevel} onLevelChange={setSpeedLevel} />
            </div>

            <button className="home-start-btn" onClick={startGame}>
              <Play size={22} fill="currentColor" />
              <span>START</span>
            </button>
          </main>
        </div>
      )}

      {gameState === 'end' && (
        <div className="end-screen-layout">
          {/* Theme Toggle Button in top-right */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle brightness theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            <span className="theme-toggle-label">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
          </button>

          {/* Top: Header matching home screen */}
          <header className="end-top-header">
            <img src={mosquitoImg} alt="Mosquito" className="end-top-mosquito-img" />
            <h1 className="end-top-title">Rangoski</h1>
          </header>

          {/* Center: Clean, unboxed results layout */}
          <main className="end-center-content">
            <div className="end-status-block">
              <span
                className="end-status-badge"
                style={{
                  color: outcome.statusColor,
                  borderColor: outcome.statusColor,
                }}
              >
                {outcome.title}
              </span>
              <p className="end-subtitle">{outcome.subtitle}</p>
            </div>

            {/* Clean, beautifully aligned stats strip */}
            <div className="end-stats-row">
              <div className="end-stat-item">
                <div className="end-stat-header">
                  <CheckCircle2 size={16} className="end-stat-icon green" />
                  <span className="end-stat-label">KILLED</span>
                </div>
                <div className="end-stat-val green">
                  {results.killed} <span className="end-stat-denom">/ 10</span>
                </div>
              </div>

              <div className="end-stat-divider" />

              <div className="end-stat-item">
                <div className="end-stat-header">
                  <Target size={16} className="end-stat-icon blue" />
                  <span className="end-stat-label">ACCURACY</span>
                </div>
                <div className="end-stat-val blue">{accuracyPercent}%</div>
              </div>

              <div className="end-stat-divider" />

              <div className="end-stat-item">
                <div className="end-stat-header">
                  <XCircle size={16} className="end-stat-icon red" />
                  <span className="end-stat-label">ESCAPED</span>
                </div>
                <div className="end-stat-val red">{results.missed}</div>
              </div>
            </div>

            {/* Symmetrical, professional action buttons */}
            <div className="end-actions-row">
              <button type="button" className="end-action-btn primary" onClick={startGame}>
                <RotateCcw size={18} />
                <span>PLAY AGAIN</span>
              </button>
              <button type="button" className="end-action-btn secondary" onClick={goToHome}>
                <Home size={18} />
                <span>MAIN MENU</span>
              </button>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
