import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { attachDrawings } from './drawings.js'
import { createSession } from './session.js'
import { attachWs } from './ws.js'

const PORT = Number(process.env.PORT ?? 8787)
const PRESENTER_TOKEN = process.env.PRESENTER_TOKEN ?? 'dev-token'

const root = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(root, '..', 'dist')

const app = express()
const session = createSession()

// Static deck + phone client (production build). In dev, Vite serves these and proxies /ws here.
app.use(express.static(dist))
app.get('/join', (_req, res) => res.sendFile(path.join(dist, 'join.html')))
app.get('/sonata-talk', (_req, res) => res.sendFile(path.join(dist, 'sonata-talk.html')))
app.get('/racing', (_req, res) => res.sendFile(path.join(dist, 'racing.html')))

const server = http.createServer(app)
const { broadcast } = attachWs(server, session, PRESENTER_TOKEN)
attachDrawings(app, session, broadcast)

server.listen(PORT, () => {
  console.log(`server on :${PORT}`)
})
