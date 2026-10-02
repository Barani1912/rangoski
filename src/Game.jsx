import { useState, useEffect, useRef, useCallback } from 'react'
import MosquitoSVG from './MosquitoSVG.jsx'
import SwatterSVG from './SwatterSVG.jsx'

const TOTAL_MOSQUITOES = 10
const MOSQUITO_LIFETIME = 10 // seconds
const HIT_RADIUS = 48 // forgiving hitbox radius in px
const MOSQUITO_SIZE = 48
const SPAWN_DELAY = 800 // ms between mosquitoes

export default function Game({ onGameEnd }) {
  const gameAreaRef = useRef(null)
  const mosquitoRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, angle: 0 })
  const animFrameRef = useRef(null)
  const spawnTimeRef = useRef(0)
  const resultsRef = useRef([])
  const aliveRef = useRef(false)
  const processingRef = useRef(false) // guard against double-processing

  const [mosquitoPos, setMosquitoPos] = useState({ x: 0, y: 0, angle: 0 })
  const [mosquitoAlive, setMosquitoAlive] = useState(false)
  const [mosquitoDying, setMosquitoDying] = useState(false)
  const [mosquitoEscaping, setMosquitoEscaping] = useState(false)
  const [timeLeft, setTimeLeft] = useState(MOSQUITO_LIFETIME)
  const [results, setResults] = useState([])
  const [swatterPos, setSwatterPos] = useState({ x: -100, y: -100 })
  const [swinging, setSwinging] = useState(false)
  const [effects, setEffects] = useState([])
  const [showSwatter, setShowSwatter] = useState(false)

  const isTouchRef = useRef(false)
  const onGameEndRef = useRef(onGameEnd)
  onGameEndRef.current = onGameEnd

  useEffect(() => {
    isTouchRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouchRef.current) {
      setShowSwatter(true)
    }
  }, [])

  // Get game area bounds
  const getBounds = useCallback(() => {
    if (!gameAreaRef.current) return { left: 0, top: 0, width: 800, height: 600 }
    const rect = gameAreaRef.current.getBoundingClientRect()
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
  }, [])

  // Add floating text effect
  const addEffect = useCallback((x, y, type) => {
    const id = Date.now() + Math.random()
    const texts = type === 'hit'
      ? ['SPLAT!', 'GOT IT!', 'SQUISH!', 'SWATTED!', 'BOOM!', 'NAILED IT!']
      : ['ESCAPED!', 'TOO SLOW!', 'BZZ BZZ!', 'MISSED!', 'NOPE!']
    const text = texts[Math.floor(Math.random() * texts.length)]
    setEffects(prev => [...prev, { id, x, y, type, text }])
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== id))
    }, 900)
  }, [])

  // Add impact particles
  const addParticles = useCallback((x, y) => {
    const particles = []
    const colors = ['#4ade80', '#fbbf24', '#fb923c', '#f87171', '#a78bfa']
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5
      const dist = 20 + Math.random() * 40
      particles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        px: Math.cos(angle) * dist,
        py: Math.sin(angle) * dist,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    setEffects(prev => [...prev, ...particles.map(p => ({ ...p, type: 'particle' }))])
    setTimeout(() => {
      setEffects(prev => prev.filter(e => !particles.find(p => p.id === e.id)))
    }, 600)
  }, [])

  // Spawn a mosquito at random position
  const spawnMosquito = useCallback(() => {
    const bounds = getBounds()
    const padding = 60
    const x = padding + Math.random() * (bounds.width - padding * 2)
    const y = padding + Math.random() * (bounds.height - padding * 2)
    const speed = 1.5 + Math.random() * 1.5
    const angle = Math.random() * Math.PI * 2

    mosquitoRef.current = {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      angle: Math.random() * 360,
      turnTimer: 0,
      zigzagTimer: 0,
      pauseTimer: 0,
      isPaused: false,
      speed,
    }

    processingRef.current = false
    aliveRef.current = true
    setMosquitoPos({ x, y, angle: 0 })
    setMosquitoAlive(true)
    setMosquitoDying(false)
    setMosquitoEscaping(false)
    setTimeLeft(MOSQUITO_LIFETIME)
    spawnTimeRef.current = Date.now()
  }, [getBounds])

  // Advance to next mosquito or end game
  const advanceToNext = useCallback((result) => {
    const newResults = [...resultsRef.current, result]
    resultsRef.current = newResults
    setResults(newResults)

    if (newResults.length >= TOTAL_MOSQUITOES) {
      setTimeout(() => {
        const killed = newResults.filter(r => r === 'killed').length
        const missed = newResults.filter(r => r === 'missed').length
        onGameEndRef.current(killed, missed)
      }, SPAWN_DELAY)
      return
    }

    setTimeout(() => spawnMosquito(), SPAWN_DELAY)
  }, [spawnMosquito])

  // Handle mosquito escape (timer ran out)
  const handleMosquitoEscape = useCallback(() => {
    if (processingRef.current) return
    processingRef.current = true
    aliveRef.current = false

    setMosquitoAlive(false)
    setMosquitoEscaping(true)

    const mPos = mosquitoRef.current
    addEffect(mPos.x, mPos.y, 'miss')

    setTimeout(() => {
      setMosquitoEscaping(false)
      advanceToNext('missed')
    }, 600)
  }, [addEffect, advanceToNext])

  // Handle successful hit
  const handleHit = useCallback((clickX, clickY) => {
    if (processingRef.current) return
    processingRef.current = true
    aliveRef.current = false

    setMosquitoAlive(false)
    setMosquitoDying(true)

    const mPos = mosquitoRef.current
    addEffect(mPos.x, mPos.y, 'hit')
    addParticles(mPos.x, mPos.y)

    setTimeout(() => {
      setMosquitoDying(false)
      advanceToNext('killed')
    }, 450)
  }, [addEffect, addParticles, advanceToNext])

  // Mosquito movement loop
  useEffect(() => {
    if (!mosquitoAlive || mosquitoDying || mosquitoEscaping) return

    let lastTime = performance.now()
    const mRef = mosquitoRef.current

    const update = (now) => {
      const dt = Math.min((now - lastTime) / 16.67, 3)
      lastTime = now
      const bounds = getBounds()

      // Random turn
      mRef.turnTimer += dt
      if (mRef.turnTimer > 30 + Math.random() * 60) {
        mRef.turnTimer = 0
        const turnAngle = (Math.random() - 0.5) * Math.PI * 0.8
        const cos = Math.cos(turnAngle)
        const sin = Math.sin(turnAngle)
        const nvx = mRef.vx * cos - mRef.vy * sin
        const nvy = mRef.vx * sin + mRef.vy * cos
        mRef.vx = nvx
        mRef.vy = nvy
      }

      // Occasional zigzag burst
      mRef.zigzagTimer += dt
      if (mRef.zigzagTimer > 120 + Math.random() * 200) {
        mRef.zigzagTimer = 0
        if (Math.random() < 0.4) {
          const perpAngle = Math.atan2(mRef.vy, mRef.vx) + (Math.random() > 0.5 ? 1 : -1) * Math.PI / 2
          mRef.vx += Math.cos(perpAngle) * 2
          mRef.vy += Math.sin(perpAngle) * 2
        }
      }

      // Occasional brief pause then burst
      mRef.pauseTimer += dt
      if (mRef.pauseTimer > 180 + Math.random() * 300) {
        mRef.pauseTimer = 0
        if (Math.random() < 0.2 && !mRef.isPaused) {
          mRef.isPaused = true
          mRef.vx = 0
          mRef.vy = 0
          setTimeout(() => {
            if (mRef.isPaused) {
              mRef.isPaused = false
              const burstAngle = Math.random() * Math.PI * 2
              const burstSpeed = mRef.speed * 2.5
              mRef.vx = Math.cos(burstAngle) * burstSpeed
              mRef.vy = Math.sin(burstAngle) * burstSpeed
              setTimeout(() => {
                const currentAngle = Math.atan2(mRef.vy, mRef.vx)
                mRef.vx = Math.cos(currentAngle) * mRef.speed
                mRef.vy = Math.sin(currentAngle) * mRef.speed
              }, 300)
            }
          }, 200 + Math.random() * 400)
        }
      }

      // Move
      mRef.x += mRef.vx * dt
      mRef.y += mRef.vy * dt

      // Bounce off walls with randomness
      const wallPadding = 20
      if (mRef.x < wallPadding) {
        mRef.x = wallPadding
        mRef.vx = Math.abs(mRef.vx) * (0.8 + Math.random() * 0.4)
        mRef.vy += (Math.random() - 0.5) * 1.5
      }
      if (mRef.x > bounds.width - wallPadding) {
        mRef.x = bounds.width - wallPadding
        mRef.vx = -Math.abs(mRef.vx) * (0.8 + Math.random() * 0.4)
        mRef.vy += (Math.random() - 0.5) * 1.5
      }
      if (mRef.y < wallPadding) {
        mRef.y = wallPadding
        mRef.vy = Math.abs(mRef.vy) * (0.8 + Math.random() * 0.4)
        mRef.vx += (Math.random() - 0.5) * 1.5
      }
      if (mRef.y > bounds.height - wallPadding) {
        mRef.y = bounds.height - wallPadding
        mRef.vy = -Math.abs(mRef.vy) * (0.8 + Math.random() * 0.4)
        mRef.vx += (Math.random() - 0.5) * 1.5
      }

      // Clamp speed
      const currentSpeed = Math.sqrt(mRef.vx * mRef.vx + mRef.vy * mRef.vy)
      const maxSpeed = mRef.speed * 3
      const minSpeed = mRef.speed * 0.4
      if (currentSpeed > maxSpeed) {
        mRef.vx = (mRef.vx / currentSpeed) * maxSpeed
        mRef.vy = (mRef.vy / currentSpeed) * maxSpeed
      } else if (currentSpeed < minSpeed && !mRef.isPaused) {
        const a = Math.atan2(mRef.vy, mRef.vx)
        mRef.vx = Math.cos(a) * minSpeed
        mRef.vy = Math.sin(a) * minSpeed
      }

      // Rotate based on movement direction
      mRef.angle = Math.atan2(mRef.vy, mRef.vx) * (180 / Math.PI)
      setMosquitoPos({ x: mRef.x, y: mRef.y, angle: mRef.angle })

      animFrameRef.current = requestAnimationFrame(update)
    }

    animFrameRef.current = requestAnimationFrame(update)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [mosquitoAlive, mosquitoDying, mosquitoEscaping, getBounds])

  // Countdown timer
  useEffect(() => {
    if (!mosquitoAlive || mosquitoDying || mosquitoEscaping) return

    const interval = setInterval(() => {
      const elapsed = (Date.now() - spawnTimeRef.current) / 1000
      const remaining = Math.max(0, MOSQUITO_LIFETIME - elapsed)
      setTimeLeft(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
        handleMosquitoEscape()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [mosquitoAlive, mosquitoDying, mosquitoEscaping, handleMosquitoEscape])

  // Start first mosquito on mount
  useEffect(() => {
    const timeout = setTimeout(() => spawnMosquito(), 500)
    return () => clearTimeout(timeout)
  }, [spawnMosquito])

  // Handle click/tap
  const handleInteraction = useCallback((clientX, clientY) => {
    if (!aliveRef.current || processingRef.current) return

    const bounds = getBounds()
    const relX = clientX - bounds.left
    const relY = clientY - bounds.top

    // Swing animation
    setSwinging(true)
    setTimeout(() => setSwinging(false), 200)

    // Check hit
    const mPos = mosquitoRef.current
    const dx = relX - mPos.x
    const dy = relY - mPos.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < HIT_RADIUS) {
      handleHit(relX, relY)
    }
  }, [getBounds, handleHit])

  // Mouse handlers
  const handleMouseMove = useCallback((e) => {
    setSwatterPos({ x: e.clientX, y: e.clientY })
    if (!showSwatter && !isTouchRef.current) setShowSwatter(true)
  }, [showSwatter])

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    handleInteraction(e.clientX, e.clientY)
  }, [handleInteraction])

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    e.preventDefault()
    const touch = e.touches[0]
    if (!touch) return
    setSwatterPos({ x: touch.clientX, y: touch.clientY })
    setShowSwatter(true)
    handleInteraction(touch.clientX, touch.clientY)

    setTimeout(() => {
      if (isTouchRef.current) setShowSwatter(false)
    }, 400)
  }, [handleInteraction])

  // Timer ring calculations
  const timerRadius = 14
  const timerCircumference = 2 * Math.PI * timerRadius
  const timerProgress = timeLeft / MOSQUITO_LIFETIME
  const timerOffset = timerCircumference * (1 - timerProgress)
  const timerClass = timeLeft <= 3 ? 'danger' : timeLeft <= 5 ? 'warning' : ''

  return (
    <>
      {/* HUD */}
      <div className="hud">
        <div className="score-dots">
          {Array.from({ length: TOTAL_MOSQUITOES }, (_, i) => {
            let cls = 'score-dot'
            if (results[i] === 'killed') cls += ' killed'
            else if (results[i] === 'missed') cls += ' missed'
            else if (i === results.length && mosquitoAlive) cls += ' active'
            return <div key={i} className={cls} />
          })}
        </div>

        {mosquitoAlive && (
          <div className="timer-ring-container">
            <svg className="timer-ring" viewBox="0 0 36 36">
              <circle className="timer-ring-bg" cx="18" cy="18" r={timerRadius} />
              <circle
                className={`timer-ring-fill ${timerClass}`}
                cx="18"
                cy="18"
                r={timerRadius}
                strokeDasharray={timerCircumference}
                strokeDashoffset={timerOffset}
              />
            </svg>
            <div className="timer-text">{Math.ceil(timeLeft)}</div>
          </div>
        )}
      </div>

      {/* Game Area */}
      <div
        className={`game-area ${!showSwatter ? 'show-cursor' : ''}`}
        ref={gameAreaRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Mosquito */}
        {(mosquitoAlive || mosquitoDying || mosquitoEscaping) && (
          <div
            className={`mosquito ${mosquitoDying ? 'dying' : ''} ${mosquitoEscaping ? 'escaping' : ''}`}
            style={{
              left: mosquitoPos.x - MOSQUITO_SIZE / 2,
              top: mosquitoPos.y - MOSQUITO_SIZE / 2,
              transform: `rotate(${mosquitoPos.angle + 90}deg)`,
            }}
          >
            <div className="mosquito-body">
              <MosquitoSVG />
            </div>
          </div>
        )}

        {/* Effects */}
        {effects.map(eff => {
          if (eff.type === 'particle') {
            return (
              <div
                key={eff.id}
                className="impact-particle"
                style={{
                  left: eff.x,
                  top: eff.y,
                  backgroundColor: eff.color,
                  '--px': `${eff.px}px`,
                  '--py': `${eff.py}px`,
                }}
              />
            )
          }
          return (
            <div
              key={eff.id}
              className={eff.type === 'hit' ? 'hit-text' : 'miss-text'}
              style={{ left: eff.x, top: eff.y - 30 }}
            >
              {eff.text}
            </div>
          )
        })}
      </div>

      {/* Fly Swatter */}
      {showSwatter && (
        <div
          className={`swatter ${swinging ? 'swinging' : ''}`}
          style={{ left: swatterPos.x, top: swatterPos.y }}
        >
          <div className="swatter-inner">
            <SwatterSVG />
          </div>
        </div>
      )}
    </>
  )
}
