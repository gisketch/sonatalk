# Interactive Audience System — Grill Record

> Status: GRILL CLOSED. This is the decision record; per-phase specs derive from it.
> Specs: `ws-core.md` · `drawing-tier-drops.md` · `rps-battle.md` (reveal folded into battle spec).

## Outcome

During slide 7's workflow demo, each tier (trivial → normal → complex) visibly ships a real
feature to ~30 audience phones live, proving the talk's thesis. Arc closes with a 60s drawing
challenge and an RPS DVD-bounce battle of the audience's drawn characters on the main slide,
then a reveal: deck + phone app are one application built through Sonata.

## Settled Decisions

- One Node server (Express + `ws`), single process: deck at `/`, phone client at `/join`, in-memory state only, no DB, no persistence.
- Hosted on VPS "bedrock", exposed as talk.gisketch.com via Nginx Proxy Manager (TLS + WS); no
  tunnels. Phones use mobile data; office wifi not trusted.
- Server owns truth for everything phones can affect: session, names, tier state, submissions, RPS picks.
- The battle sim renders on the deck client only; phones receive low-rate events (e.g. elimination), not tick state. Broadcast, not shared state.
- Slide-7 demo is chronological trivial → normal → complex; no presenter choice of scenario.
- Trivial drop = name input appears on phones. Normal drop = TBD (drawing tools direction). Complex drop = fill + brush sizes + 60s timed challenge.
- The "AI implements it live" moment is staged feature-flag flipping; honest because the reveal shows the features were genuinely built through Sonata (receipts).
- Drawing is fully local on the phone; only the final PNG uploads when the timer ends. No stroke streaming.
- Canvas keeps a fixed paper background regardless of any theming; theme (if any) affects chrome only.
- Battle must force an ending: accelerate/shrink arena after ~45s; cap ~90s total.
- Presenter kill-switch: deck can remove any entity (rude drawing/name insurance).
- Existing fake simulator remains as offline fallback for slide 7; deck must present fully with no connectivity.
- Hard cuts kept from handoff: no chat, no accounts, no reconnection logic, no persistence, no free text beyond name field, one map/screen.
- Fallback ladder: deck-only → +join count moment → +drawing gallery ending (no battle) → full battle. Each phase independently shippable.

## Settled in Grill

- Join moment: QR shown right before slide 7 (dedicated beat); deck bottom edge shows a live
  "N connected" counter ticking up. No long idle window, no wake-lock complexity for the gap.
- Tier drops (chronological, no presenter choice of scenario):
  - Trivial → name input appears on phones.
  - Normal → canvas + instruction "draw your character" (single black brush).
  - Complex → tools panel materializes: 5 colors, fill tool, brush sizes.
  - 60s drawing challenge follows complex; drawings upload as PNG on timer end.
- RPS: free pick per player; collision eliminates the loser (poof on deck, 💀 ping to phone);
  battle ends when one type remains. Deck shows live count per R/P/S team.
- Phase control: presenter-driven, all of it — tier flags flip on the chat playback's "done"
  clicks; dedicated clicks start the 60s timer and the battle. One button pattern throughout.
- Ending: winner splash (team banner + surviving drawings enlarged with names), then next click
  → reveal slide where ALL drawings (eliminated included) form a gallery grid behind the receipts.

- Failure posture: deck mirrors all server state as it arrives (names, drawings, picks) so the
  battle can always run with whatever was received; one presenter hotkey bails slide 7 to the
  fake simulator at any point (covers outage and zero-joins). Duplicate names allowed; late
  joiners receive current phase on connect; a dropped phone simply leaves the roster.
- Hosting: VPS "bedrock", domain talk.gisketch.com through Nginx Proxy Manager — NO tunnels,
  plain WSS through the proxy (stable URL → QR can be prepared early). Implication: deck
  depends on venue internet too — the state mirror + bail hotkey are load-bearing. Pre-tasks:
  verify VPS state; enable WebSocket support on the NPM proxy host; add WS heartbeat pings so
  idle sockets survive nginx proxy timeouts.
- The interactivity is a SURPRISE to the audience — no coworker dry run. Validation is solo:
  multi-tab local harness through the full arc, own devices over the real talk.gisketch.com QR, and a
  kill-the-server failure drill to rehearse the bail hotkey.

## Acceptance Behavior (whole arc)

1. Phone scans QR → lands on `/join` → deck counter increments within ~1s.
2. Presenter's trivial "done" click → name inputs appear on all connected phones; submitted
   names appear on deck roster.
3. Normal "done" click → canvas + "draw your character" appears (single black brush).
4. Complex "done" click → 5 colors, fill, brush sizes materialize on phones.
5. Timer click → synchronized 60s countdown on deck + phones; on expiry phones upload PNG;
   thumbnails appear on deck as they land.
6. RPS phase → phones show R/P/S pick; deck shows live per-team counts.
7. Battle click → drawings bounce DVD-style with names + team badges; collisions eliminate
   losers (💀 ping to that phone); arena accelerates/shrinks after ~45s; ends ≤90s.
8. Winner splash → surviving team banner + drawings; next click → reveal with all-drawings
   gallery + Sonata receipts.
9. At ANY point, bail hotkey swaps slide 7 to the fake simulator without a visible error.

## Risks (accepted)

- Free-form drawings/names on a projector: mitigated by presenter kill-switch, accepted (coworkers).
- Lopsided team picks: accepted as comedy; zero-pick teams resolve naturally by elimination.
- No reconnect: locked/refreshed phone = new anonymous join, prior drawing lost. Accepted.
- Venue internet is a single point of failure for live mode: mitigated by mirror + bail, accepted.
- Surprise constraint blocks group rehearsal: solo validation only. Accepted.
