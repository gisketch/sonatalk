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
    if (msg.phase === 'pick' && !phone.picked) {
      phone.picked = true
      stats.picked++
      ws.send(JSON.stringify({ type: 'pick', pick: PICKS[i % 3] }))
      // choose a spawn spread across the arena and lock in
      const spawn = { x: 0.1 + ((i * 0.79) % 0.8), y: 0.1 + ((i * 0.37) % 0.8) }
      ws.send(JSON.stringify({ type: 'ready', spawn }))
      stats.ready = (stats.ready ?? 0) + 1
    }
    if (msg.phase === 'reveal') finish('reveal reached')
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
