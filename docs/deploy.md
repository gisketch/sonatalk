# Deploy — talk.gisketch.com on VPS "bedrock"

One Node process in Docker, exposed via Nginx Proxy Manager. No tunnels.

## Build & run (on the VPS)

```bash
git clone <repo> sonatalk && cd sonatalk
echo "PRESENTER_TOKEN=<long-random-secret>" > .env
docker compose up -d --build
```

The container serves deck + phone client + WS on port 8787.

## Nginx Proxy Manager (checklist — done by Ghe)

1. Proxy Host: `talk.gisketch.com` → `http://<container-host>:8787`.
2. **Enable "WebSockets Support"** on the proxy host (off by default — without it `/ws` upgrades fail).
3. SSL tab: request Let's Encrypt cert, force SSL.
4. DNS: `talk.gisketch.com` A record → VPS IP.

The server pings every socket every 30s, which keeps idle connections under nginx's
default `proxy_read_timeout`; no NPM timeout tuning should be needed.

## Talk-day URLs

- Audience QR: `https://talk.gisketch.com/join` (QR renders on the deck's join slide from the page origin).
- Presenter deck: `https://talk.gisketch.com/?key=<PRESENTER_TOKEN>` — the `key` is what
  authorizes phase advances; open this on the presenting machine only.
- Fresh session: `docker compose restart` (state is in-memory by design).

## Verify after deploy (T4 acceptance)

- [ ] Phone on mobile data scans QR → joins; deck counter increments.
- [ ] Phone idle 10+ minutes stays connected (heartbeat through NPM).
- [ ] `wss://` upgrade works (no mixed-content or 502 on /ws).
