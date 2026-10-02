import { useState } from 'react'
import Game from './Game.jsx'

export default function App() {
  const [gameState, setGameState] = useState('start') // 'start' | 'playing' | 'end'
  const [results, setResults] = useState({ killed: 0, missed: 0 })

  const startGame = () => {
    setGameState('playing')
    setResults({ killed: 0, missed: 0 })
  }

  const endGame = (killed, missed) => {
    setResults({ killed, missed })
    setGameState('end')
  }

  const getMessage = () => {
    const { killed } = results
    if (killed === 10) return { emoji: '🏆', text: 'PERFECT! All mosquitoes destroyed!' }
    if (killed >= 8) return { emoji: '🔥', text: 'Almost perfect! Nice reflexes!' }
    if (killed >= 5) return { emoji: '😤', text: 'Not bad... those bugs are sneaky!' }
    if (killed >= 3) return { emoji: '🦟', text: 'The mosquitoes are winning...' }
    return { emoji: '💀', text: 'The mosquitoes send their regards.' }
  }

  return (
    <div className="app">
      <div className="title-bar">
        <h1 className="title">Rangoski</h1>
      </div>

      {gameState === 'playing' && (
        <Game onGameEnd={endGame} />
      )}

      {gameState === 'start' && (
        <div className="screen-overlay">
          <div className="screen-emoji">🦟</div>
          <div className="screen-title">Rangoski</div>
          <p className="screen-subtitle">
            Kill 10 mosquitoes with your trusty fly swatter. You have 10 seconds each. Ready?
          </p>
          <br />
          <button className="play-btn" onClick={startGame}>
            🪰 Start Swatting
          </button>
        </div>
      )}

      {gameState === 'end' && (
        <div className="screen-overlay">
          <div className="screen-emoji">{getMessage().emoji}</div>
          <div className="screen-title">Rangoski</div>
          <p className="screen-subtitle">{getMessage().text}</p>
          <div className="screen-stats">
            <div className="stat-box">
              <div className="stat-value green">{results.killed}</div>
              <div className="stat-label">Killed</div>
            </div>
            <div className="stat-box">
              <div className="stat-value red">{results.missed}</div>
              <div className="stat-label">Escaped</div>
            </div>
          </div>
          <button className="play-btn" onClick={startGame}>
            🔄 Play Again
          </button>
        </div>
      )}
    </div>
  )
}
