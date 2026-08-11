#!/usr/bin/env node
/**
 * Multi-phone rehearsal harness: simulates N audience phones through the full arc.
 * The deck (real browser) stays the presenter; this script only plays the crowd.
 *
 *   node scripts/rehearse.mjs [count] [server]
 *   node scripts/rehearse.mjs 10 http://localhost:8787
 */
import QRCode from 'qrcode'
import { WebSocket } from 'ws'

const COUNT = Number(process.argv[2] ?? 10)
const SERVER = process.argv[3] ?? 'http://localhost:8787'
const WS_URL = SERVER.replace(/^http/, 'ws') + '/ws'

const NAMES = [
  'Ash', 'Bo', 'Cyra', 'Dot', 'Eli', 'Fig', 'Gus', 'Hana', 'Ivy', 'Jax',
  'Kit', 'Lume', 'Momo', 'Nia', 'Oz', 'Pip', 'Quill', 'Rex', 'Sage', 'Tobi',
]
const PICKS = ['rock', 'paper', 'scissors']

const stats = { joined: 0, named: 0, uploaded: 0, picked: 0, eliminated: 0, winners: 0 }
let done

function spawnPhone(i) {
  const name = NAMES[i % NAMES.length] + (i >= NAMES.length ? `-${i}` : '')
  const ws = new WebSocket(WS_URL)
  const phone = { id: null, named: false, uploaded: false, picked: false }

  ws.on('open', () => {
    ws.send(JSON.stringify({ type: 'hello', role: 'phone' }))
    stats.joined++
  })

  ws.on('message', async (raw) => {
    const msg = JSON.parse(raw)
    if (msg.type === 'you') phone.id = msg.id
    if (msg.type === 'eliminated') {
      stats.eliminated++
      console.log(`  💀 ${name}`)
    }
    if (msg.type === 'winner') {
      stats.winners++
      console.log(`  🏆 ${name}`)
    }
    if (msg.type !== 'snapshot') return

    if (msg.phase === 'names' && !phone.named) {
      phone.named = true
      stats.named++
      ws.send(JSON.stringify({ type: 'setName', name }))
    }
    if (msg.phase === 'drawing' && !phone.uploaded && phone.id) {
      phone.uploaded = true
      const png = await QRCode.toBuffer(name, { width: 256, margin: 2 })
      const res = await fetch(`${SERVER}/api/drawing?player=${phone.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'image/png' },
        body: png,
      })
      if (res.ok) stats.uploaded++
      else console.log(`  ✗ upload rejected for ${name}: ${res.status}`)
    }
    if (msg.phase === 'battle') phone.picked = false // re-arm for sudden-death re-picks
    if (msg.phase === 'pick' && !phone.picked) {
      phone.picked = true
      const self = msg.players.find((p) => p.id === phone.id)
      if (self?.alive) {
        // late joiner (games mode): first upload is allowed outside the drawing window
        if (!phone.uploaded && phone.id) {
          phone.uploaded = true
          const png = await QRCode.toBuffer(name, { width: 256, margin: 2 })
          await fetch(`${SERVER}/api/drawing?player=${phone.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'image/png' },
            body: png,
          }).then((r) => r.ok && stats.uploaded++)
        }
        stats.picked++
        ws.send(JSON.stringify({ type: 'pick', pick: PICKS[Math.floor(Math.random() * 3)] }))
        // choose a spawn spread across the arena and lock in
        const spawn = { x: 0.1 + ((i * 0.79) % 0.8), y: 0.1 + ((i * 0.37) % 0.8) }
        ws.send(JSON.stringify({ type: 'ready', spawn }))
        stats.ready = (stats.ready ?? 0) + 1
      }
    }
    // game 2: alternate-tap sprint at a per-bot random cadence
    if (msg.phase === 'race' && !msg.payload.winner) {
      if (!phone.racing) {
        phone.racing = true
        phone.footSide = i % 2 ? 'left' : 'right'
        const cadence = 90 + Math.random() * 160 // ms per tap → varied finishers
        const startIn = Math.max(0, Number(msg.payload.startsAt ?? 0) - Date.now())
        setTimeout(() => {
          phone.raceTimer = setInterval(() => {
            ws.send(JSON.stringify({ type: 'raceTap', side: phone.footSide }))
            phone.footSide = phone.footSide === 'left' ? 'right' : 'left'
          }, cadence)
        }, startIn)
      }
    } else if (phone.raceTimer) {
      clearInterval(phone.raceTimer)
      phone.raceTimer = null
      phone.racing = false
    }
    // game 3: bots obey randomly — one tap on a random side, 20% freeze (survives DON'T TAP)
    if (msg.phase === 'gauntlet' && msg.payload.state === 'prompt') {
      const key = `${msg.payload.round}`
      if (phone.gauntletRound !== key) {
        phone.gauntletRound = key
        const self = msg.players.find((p) => p.id === phone.id)
        if (self?.alive && Math.random() > 0.2) {
          // humans tap after the TV shows the prompt — schedule relative to showAt
          const showIn = Math.max(0, Number(msg.payload.showAt ?? 0) - Date.now())
          const wait = showIn + 150 + Math.random() * 600
          setTimeout(() => {
            ws.send(JSON.stringify({ type: 'gauntletTap', side: Math.random() < 0.5 ? 'left' : 'right' }))
            if (Math.random() < 0.25) {
              ws.send(JSON.stringify({ type: 'gauntletTap', side: Math.random() < 0.5 ? 'left' : 'right' }))
            }
          }, wait)
        }
      }
    }
    // no exit on reveal — post-talk games (rematch) continue after it; Ctrl+C or 5min timeout ends the run
  })

  ws.on('error', (err) => console.log(`  ! ${name}: ${err.message}`))
  return ws
}

function finish(reason) {
  if (done) return
  done = true
  console.log(`\narc complete (${reason}):`, JSON.stringify(stats))
  process.exit(0)
}

console.log(`spawning ${COUNT} phones → ${WS_URL}`)
for (let i = 0; i < COUNT; i++) spawnPhone(i)
process.on('SIGINT', () => finish('interrupted'))
setTimeout(() => finish('timeout 5min'), 5 * 60_000)
