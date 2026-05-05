'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type ElementType = 'fire' | 'water' | 'earth' | 'air'
type Fighter = {
  x: number
  y: number
  width: number
  height: number
  velocityY: number
  facing: 1 | -1
  hp: number
  color: string
  element: ElementType
  attackCooldown: number
  isBlocking: boolean
  name: string
}

type InputState = {
  left: boolean
  right: boolean
  jump: boolean
  attack: boolean
  block: boolean
  special: boolean
}

const WIDTH = 960
const HEIGHT = 540
const GROUND_Y = 440
const gravity = 0.95
const moveSpeed = 5
const jumpPower = -15
const attackRange = 86

const elementPalette: Record<ElementType, { glow: string; attack: string; special: string }> = {
  fire: { glow: '#ef4444', attack: '#fb7185', special: '#f97316' },
  water: { glow: '#38bdf8', attack: '#60a5fa', special: '#22d3ee' },
  earth: { glow: '#84cc16', attack: '#a3e635', special: '#65a30d' },
  air: { glow: '#e2e8f0', attack: '#cbd5e1', special: '#f1f5f9' },
}

function createFighter(name: string, x: number, color: string, element: ElementType, facing: 1 | -1): Fighter {
  return {
    x,
    y: GROUND_Y - 120,
    width: 55,
    height: 120,
    velocityY: 0,
    facing,
    hp: 100,
    color,
    element,
    attackCooldown: 0,
    isBlocking: false,
    name,
  }
}

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [player, setPlayer] = useState(() => createFighter('You', 220, '#f8fafc', 'fire', 1))
  const [enemy, setEnemy] = useState(() => createFighter('Tempest', 680, '#fef08a', 'water', -1))
  const [message, setMessage] = useState('Elemental Duel: defeat Tempest!')
  const [input, setInput] = useState<InputState>({ left: false, right: false, jump: false, attack: false, block: false, special: false })

  const gameOver = useMemo(() => player.hp <= 0 || enemy.hp <= 0, [player.hp, enemy.hp])

  useEffect(() => {
    const handleKey = (pressed: boolean) => (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      setInput((prev) => ({
        ...prev,
        left: key === 'a' ? pressed : prev.left,
        right: key === 'd' ? pressed : prev.right,
        jump: key === 'w' ? pressed : prev.jump,
        attack: key === 'j' ? pressed : prev.attack,
        block: key === 'k' ? pressed : prev.block,
        special: key === 'l' ? pressed : prev.special,
      }))
    }

    const down = handleKey(true)
    const up = handleKey(false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useEffect(() => {
    let raf = 0

    const loop = () => {
      setPlayer((prevPlayer) => {
        const next = { ...prevPlayer }

        if (!gameOver) {
          if (input.left) next.x -= moveSpeed
          if (input.right) next.x += moveSpeed
          if (input.jump && next.y >= GROUND_Y - next.height - 1) next.velocityY = jumpPower
          next.velocityY += gravity
          next.y += next.velocityY
          if (next.y > GROUND_Y - next.height) {
            next.y = GROUND_Y - next.height
            next.velocityY = 0
          }
          next.x = Math.max(20, Math.min(WIDTH - next.width - 20, next.x))
          next.isBlocking = input.block
          next.facing = next.x < enemy.x ? 1 : -1
          next.attackCooldown = Math.max(0, next.attackCooldown - 1)
        }

        return next
      })

      setEnemy((prevEnemy) => {
        const next = { ...prevEnemy }
        if (!gameOver) {
          const distance = player.x - prevEnemy.x
          const moveDir = Math.sign(distance)
          if (Math.abs(distance) > 130) next.x += moveDir * 2.1
          if (Math.random() < 0.006 && next.y >= GROUND_Y - next.height - 1) next.velocityY = jumpPower * 0.85
          next.velocityY += gravity
          next.y += next.velocityY
          if (next.y > GROUND_Y - next.height) {
            next.y = GROUND_Y - next.height
            next.velocityY = 0
          }
          next.facing = next.x < player.x ? 1 : -1
          next.x = Math.max(20, Math.min(WIDTH - next.width - 20, next.x))
          next.attackCooldown = Math.max(0, next.attackCooldown - 1)
          next.isBlocking = Math.random() < 0.008
        }
        return next
      })

      setEnemy((currentEnemy) => {
        const nextEnemy = { ...currentEnemy }
        if (input.attack && player.attackCooldown <= 0 && !gameOver) {
          const dist = Math.abs(player.x - currentEnemy.x)
          if (dist < attackRange) {
            const dmg = currentEnemy.isBlocking ? 6 : 12
            nextEnemy.hp = Math.max(0, nextEnemy.hp - dmg)
            setMessage(`You strike with ${player.element}! -${dmg} HP`)
          } else {
            setMessage('Attack missed! Move closer.')
          }
          setPlayer((p) => ({ ...p, attackCooldown: 20 }))
        }
        if (input.special && player.attackCooldown <= 0 && !gameOver) {
          const dist = Math.abs(player.x - currentEnemy.x)
          if (dist < attackRange + 30) {
            const dmg = currentEnemy.isBlocking ? 10 : 22
            nextEnemy.hp = Math.max(0, nextEnemy.hp - dmg)
            setMessage(`${player.element.toUpperCase()} BURST! -${dmg} HP`)
          }
          setPlayer((p) => ({ ...p, attackCooldown: 36 }))
        }
        return nextEnemy
      })

      setPlayer((currentPlayer) => {
        const nextPlayer = { ...currentPlayer }
        if (enemy.attackCooldown <= 0 && Math.abs(enemy.x - currentPlayer.x) < attackRange && !gameOver) {
          const useSpecial = Math.random() < 0.3
          const dmg = currentPlayer.isBlocking ? (useSpecial ? 11 : 5) : useSpecial ? 18 : 9
          nextPlayer.hp = Math.max(0, nextPlayer.hp - dmg)
          setEnemy((e) => ({ ...e, attackCooldown: useSpecial ? 45 : 26 }))
          setMessage(`${enemy.name} uses ${useSpecial ? 'special' : 'attack'}! -${dmg} HP`)
        }
        return nextPlayer
      })

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [enemy, gameOver, input, player])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT)
    bg.addColorStop(0, '#0f172a')
    bg.addColorStop(1, '#1e293b')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = '#334155'
    ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y)

    const drawFighter = (fighter: Fighter) => {
      const palette = elementPalette[fighter.element]
      ctx.shadowColor = palette.glow
      ctx.shadowBlur = 18
      ctx.fillStyle = fighter.color
      ctx.fillRect(fighter.x, fighter.y, fighter.width, fighter.height)
      ctx.shadowBlur = 0

      ctx.fillStyle = palette.attack
      const orbX = fighter.facing === 1 ? fighter.x + fighter.width + 8 : fighter.x - 16
      ctx.beginPath()
      ctx.arc(orbX, fighter.y + 22, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 16px sans-serif'
      ctx.fillText(fighter.name, fighter.x - 6, fighter.y - 10)
    }

    drawFighter(player)
    drawFighter(enemy)

    const drawBar = (x: number, hp: number, label: string, color: string) => {
      ctx.fillStyle = '#0b1120'
      ctx.fillRect(x, 20, 280, 24)
      ctx.fillStyle = color
      ctx.fillRect(x + 2, 22, (276 * hp) / 100, 20)
      ctx.strokeStyle = '#e2e8f0'
      ctx.strokeRect(x, 20, 280, 24)
      ctx.fillStyle = '#f8fafc'
      ctx.font = 'bold 14px sans-serif'
      ctx.fillText(`${label} ${hp} HP`, x + 10, 37)
    }

    drawBar(22, player.hp, player.element.toUpperCase(), elementPalette[player.element].special)
    drawBar(WIDTH - 302, enemy.hp, enemy.element.toUpperCase(), elementPalette[enemy.element].special)

    if (gameOver) {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.78)'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      ctx.fillStyle = '#f8fafc'
      ctx.font = 'bold 56px sans-serif'
      ctx.fillText(player.hp > 0 ? 'VICTORY' : 'DEFEAT', WIDTH / 2 - 140, HEIGHT / 2)
    }
  }, [enemy, gameOver, player])

  const touchButton = (label: string, key: keyof InputState, className = '') => (
    <button
      className={`rounded-2xl bg-slate-900/90 border border-slate-500 text-white font-bold px-4 py-3 active:scale-95 transition ${className}`}
      onTouchStart={() => setInput((prev) => ({ ...prev, [key]: true }))}
      onTouchEnd={() => setInput((prev) => ({ ...prev, [key]: false }))}
      onMouseDown={() => setInput((prev) => ({ ...prev, [key]: true }))}
      onMouseUp={() => setInput((prev) => ({ ...prev, [key]: false }))}
      onMouseLeave={() => setInput((prev) => ({ ...prev, [key]: false }))}
      type="button"
    >
      {label}
    </button>
  )

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-center mb-2">Elemental Arena</h1>
        <p className="text-center text-slate-300 mb-4">Mobile 2D touchscreen fighting game • touch controls + keyboard (A/D/W, J/K/L)</p>

        <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
          <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="w-full h-auto bg-slate-900" />
        </div>

        <p className="mt-3 text-center text-cyan-300 font-semibold min-h-6">{message}</p>

        <section className="mt-5 grid grid-cols-2 gap-4 sm:gap-6 select-none touch-none">
          <div className="grid grid-cols-2 gap-3">
            {touchButton('⬅ Left', 'left')}
            {touchButton('Right ➡', 'right')}
            {touchButton('Jump', 'jump', 'col-span-2')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {touchButton('Attack', 'attack')}
            {touchButton('Block', 'block')}
            {touchButton('Special', 'special', 'col-span-2 bg-orange-600/90 border-orange-300')}
          </div>
        </section>
      </div>
    </main>
  )
}
