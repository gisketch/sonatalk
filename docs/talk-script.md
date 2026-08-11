# Talk Script — per slide, ADHD mode

One glance per slide. **Bold = do.** Plain = say (your words, these are beats not lines).
Total budget ~10 min with the game. Hotkeys: `N` notes · `F` fullscreen · `O` bail to fake sim · `Shift+R` reset session.

---

## 1 · Title (dark) — 30s

- Hi, quick one. Everyone's covering AI tools — mine's a bit different.
- Agents write code stupid fast now. This talk is about the part nobody demos: **trusting** what they write.
- I built my own system for this. By the end you'll see it working. That's all I'll say for now. *(don't spoil)*

## 2 · The Problem — 45s

- Read the two quote lines off the slide, slow.
- **Pause after "Trust is the bottleneck."** Let it sit.
- Anecdote in one breath: agent gives me a 40-file diff in 3 minutes, then I lose an afternoon reviewing it. Speed moved; the bottleneck moved with it.

## 3 · Feedforward / Feedback — 2 min ← THE concept

- Two articles shaped this — they're on the slide:
  - **OpenAI's harness engineering post**: their Codex team's lesson — when the agent fails, don't wait for a better model, **iterate on the harness around it**. Same model, better scaffolding, better results.
  - **Birgitta Böckeler on martinfowler.com**: gives the loop its names — **guides** steer the agent *before* it acts (conventions, docs, skills), **sensors** catch it *after* (linters, tests, checks) — and the error messages loop straight back so the agent fixes itself before a human ever looks.
- So one idea, two halves: feedforward steers, feedback corrects.
- **Point at the dots** flowing on the diagram: work flows right, feedback flows back.
- Punchline, off the footline: only sensors = same mistakes forever. Only guides = you never learn if your rules worked.

## 4 · Sonata — 45s

- So I built mine. Called Sonata. Two halves, same two ideas.
- Skills that build — the agent can't skip steps. Checks that validate — it self-corrects before I read anything.
- Grown on real work, feature by feature. Not designed in a vacuum.

## 5 · Sensors — 1.5 min

- Frame: you barely have to build anything — existing tools pair beautifully with agents.
- Card 1: agents write god-files → my own **300-line limit** script, and the agent runs it *itself*.
- Card 2: agents over-engineer → **scc** counts complexity, numbers call it out before I do.
- Card 3: agents leave orphan code → **skylos** hunts the ghosts.
- Close on the footline: examples, not prescription. The pattern: **every check speaks in errors the agent can act on.**

## 6 · Documentation — 1 min

- Docs stopped being for humans only — they're **executable context** now.
- Architecture notes so it extends my design instead of inventing a parallel one.
- Conventions so I never type the same feedback twice.
- And the flow keeps them alive — docs update as part of every feature. Not a wiki that rots.

## 7 · Skills — 1 min ← for the devs

- "One more feedforward trick — the biggest lever: **skills**."
- What: a markdown file the agent loads on demand. A checklist it actually follows. No platform, no plugin.
- How: type `/its-name`, or the description auto-triggers it. Description = *when*, body = *how*.
- When: **the second time you explain something, write it as a skill.** Deploy runbook, review checklist, release notes.
- Point at the example: 20 lines of markdown, whole team invokes it — your best explanation becomes the default one.
- Kicker: every Sonata workflow in this talk — grill, spec, implement — is literally a skill file.

## 8 · QR JOIN — 1 min ← phones out

- "Okay. Phones out. Scan this."
- **Say nothing else.** The app is deliberately empty — that's the joke later.
- **Watch the counter climb.** When it settles: "cool, you're in, keep it open."
- *(If room is dead / wifi dead: press `O` on the demo slide, do the fake demo, nothing else changes.)*

## 9 · Workflow demo LIVE — 2.5 min ← the heart

- "Sonata sizes every task: trivial, normal, complex. Watch the flow — and watch your phone."
- **Click through TRIVIAL** (add a name input): "trivial = just do it, one check." → done ships → **"check your phones."** Name input just appeared. Let the murmur happen.
- **Click through NORMAL** (canvas): light spec, quick nod, build. → **"draw your character."** Give them a beat to doodle.
- **Click through COMPLEX** (tools): full gauntlet — grill first. These grill questions on screen? Real ones. → tools materialize on phones mid-drawing.
- **Click "start the 60s draw."** Hype it: "60 seconds, draw your fighter."
- Timer ends → uploads → thumbnails pop on deck. → **"to the picks"** — rock, paper, or scissors. Team counts live on the bottom bar.

## 10 · The Arena — 2 min

- Button waits until **everyone picked + placed** (shows the ready count).
- **Click "show players"** — everyone appears frozen where they placed themselves. Weapons stay secret. "Look where you all are…"
- **Click "start the battle."** Weapons reveal, chaos. Then shut up and let the room react.
- *(Rude drawing? Click the sprite. It just dies. Nobody knows.)*
- Arena shrinks after 45s — always ends within ~90s.
- **Multiple survivors = stand-off** → "next round — re-pick": survivors choose weapon + spawn again. Repeats until ONE champion.
- "NAME wins!" splash → **"crown the winner."** Say their name out loud.

## 11 · The Reveal — 1 min ← land the thesis

- "One more thing. The deck. The phone app. The name input, the canvas, the tools, that battle."
- **"One application. And I built it through Sonata itself — in about 1–2 hours of actual work."**
- Point at receipts: it got grilled first. Specced. Ticketed. The 300-line sensor fired *during the build* and the agent split the files itself.
- Every drawing's back on screen. "Your characters were the proof."

## 12 · On Disk — 1 min

- "And the whole harness? It's just files. This is the actual repo, live."
- **Click AGENTS.md**: the map. Agents read this first.
- **Click quality.md**: the sensors, as a table.
- **Click interactive-audience-system.md**: the grill record — tonight's app started as this interview.
- "No platform. No magic. Markdown and a few shell scripts."

## 13 · Start Tiny — 45s

- The takeaway, honest version:
- **AI is fast. Really fast, right now — take advantage of it.**
- This exact system is what works *for me* — it's a personal preference, not a prescription.
- Want your own? **Start tiny.** One rule in AGENTS.md today — the thing you keep correcting. Ten minutes.
- Then one sensor with errors the agent can read. Then: every mistake that happens twice becomes a rule or a sensor. That's the whole practice.

## 14 · Closing (dark) — 30s

- Thesis, slow: **"The model isn't the moat. The harness is."**
- Links are on screen — the two articles, and my repo.
- "Salamat! — questions?"
- *(If someone asks "could this work team-wide?" — that's the seed. Smile.)*

## 15 · Game 1 — RPS Rematch (post-talk)

- "Rewards time. Same characters. One champion per game."
- **Click "rematch — new game."** Everyone revives, phones re-pick. QR in the corner for stragglers (they name + draw, no timer — gate waits for them).
- Same arena flow; sudden death until ONE stands. **Crown = recorded** (👑 strip, top right).

## 16 · Game 2 — The Sprint (post-talk)

- "Phones are now running shoes. LEFT-RIGHT-LEFT-RIGHT. Same foot twice = stumble."
- **Click "start the race."** 3·2·1 syncs on every phone. First to 50 steps wins.
- Winner freezes the race → **crown** → recorded. `↺ race again` if the room demands it.

---

## Panic card

| Thing | Key |
|---|---|
| Bail demo slide to fake sim | `O` |
| FULL reset (wipes players, phones auto-rejoin) | `Shift+R` |
| Kill a rude drawing | click the sprite |
| Notes on/off | `N` |
| Wifi died mid-arc | battle still runs — deck has everything |
