# PHONE SCRIPT — Harness Engineering
(N = notes · F = fullscreen · O = bail to fake demo · Shift+R = full reset · M = mute)
BEFORE STARTING: Shift+R once. Set TV delay on race slide later.

---

## 1 · TITLE — 30s
- "Hi, quick one. Everyone talks about AI tools. Mine's a bit different."
- **"Agents write code stupidly fast now. This talk is about the part nobody demos — TRUSTING what they write."**
- "I built my own system for this. You'll see it working later. That's all I'm saying."
- (small smile, move on — don't spoil)

## 2 · THE PROBLEM — 45s
- Read the two quotes off the slide. SLOWLY.
- **"Trust is the bottleneck."**
- (pause 2 seconds. let it sit.)
- One breath: "Agent gives me a 40-file diff in 3 minutes… then I lose my whole afternoon reviewing it. The speed moved. The bottleneck moved with it."

## 3 · FEEDFORWARD / FEEDBACK — 2min ← THE CONCEPT
- "Two articles changed how I think about this — they're on screen."
- OpenAI's Codex team: **"when the agent fails, don't wait for a better model — fix the HARNESS around it."**
- Böckeler on martinfowler.com names the two halves:
  - **GUIDES** — steer it BEFORE it acts (docs, conventions, skills)
  - **SENSORS** — catch it AFTER (linters, tests, checks)
- (point at the dots) "Work flows right. Feedback flows back. The errors go to the AGENT, not to me — it fixes itself before I ever look."
- Punchline: **"Only sensors? Same mistakes forever. Only guides? You never know if your rules work."**

## 4 · SONATA — 45s
- "So I built mine. I call it Sonata."
- **"Skills that BUILD. Checks that VALIDATE."** Same two halves.
- "It wasn't designed in a vacuum — it grew on real work. Every mistake that happened twice became part of the system."

## 5 · SENSORS — 1.5min
- Frame: **"You barely have to build anything. Existing tools pair beautifully with agents."**
- Card 1: agents write god-files → my 300-line limit script. "And the agent runs it ITSELF."
- Card 2: agents over-engineer → scc counts complexity. "Numbers call it out before I do."
- Card 3: agents leave dead code → skylos hunts the ghosts.
- Close: **"The pattern: every check speaks in errors the agent can act on."**

## 6 · DOCUMENTATION — 1min
- **"Docs aren't for humans anymore. They're executable context."**
- "Architecture notes — so it extends MY design, not a parallel one it invented."
- "Conventions — so I never type the same code-review comment twice."
- "And the flow keeps them alive. Docs update with every feature. Not a wiki that rots."

## 7 · SKILLS — 1min ← for the devs
- "One more feedforward trick. The biggest lever: **skills**."
- WHAT: "A markdown file the agent loads on demand. A checklist it actually follows. No platform, no plugin."
- WHEN: **"The SECOND time you explain something — write it as a skill."**
- (point at example) "Twenty lines. The whole team invokes it. Your best explanation becomes everyone's default."
- Kicker: "Every workflow you'll see tonight — grill, spec, implement — is literally one of these files."

## 8 · QR — 1min ← PHONES OUT
- **"Okay. Phones out. Scan this."**
- Then SAY NOTHING. (the app being empty is the joke later)
- Watch the counter climb. When it settles:
- "Cool. You're in. Keep it open."
- (if room/wifi is dead → press O on next slide, fake demo, keep moving)

## 9 · LIVE DEMO — 2.5min ← THE HEART
- "Sonata sizes every task: trivial, normal, complex. Watch the flow — and watch your phone."
- TRIVIAL (name input): click through. "Trivial = just do it, one check." → ships → **"check your phones."** (let the murmur happen. enjoy it.)
- NORMAL (canvas): "Light spec, quick nod, build." → **"Draw your character."** (give them a beat to doodle)
- COMPLEX (tools): "Full gauntlet — it grills ME first. These questions on screen? Real ones from building this." → tools appear mid-drawing.
- **"60 seconds. Draw your fighter. GO."**
- Timer ends → thumbnails pop on deck → "to the picks."

## 10 · ARENA — 2min
- **"Your drawings. RPS rules. Collisions are fatal. Last team standing."**
- Wait for ready gate → show players → START.
- Then SHUT UP and let the room react. (killfeed does the comedy for you)
- (rude drawing? click the sprite. it just dies. nobody knows.)
- Winner → crown → name the survivors out loud.

## 11 · REVEAL — 1min ← LAND THE THESIS
- "One more thing. The deck. The phone app. The name input, the canvas, that battle you just screamed at."
- (pause)
- **"ONE application. Built through Sonata itself. About 1–2 hours of actual work."**
- Point at receipts: "It got grilled. Specced. Ticketed. The 300-line sensor fired DURING the build and the agent split its own files."

## 12 · ON DISK — 1min
- **"And the whole harness? It's just files. This is the real repo, live."**
- Click AGENTS.md — "the map, agents read this first."
- Click quality.md — "the sensors."
- Click the grill record — "tonight's app started as this interview."
- "No platform. No magic. Markdown and shell scripts."

## 13 · START TINY — 45s
- Honest version: **"AI is fast RIGHT NOW. Take advantage of it."**
- "This system works for ME. It's a preference, not a prescription."
- **"Want yours? Start tiny. ONE rule in AGENTS.md today — the thing you keep correcting. Ten minutes."**
- "Then one sensor. Then: every mistake that happens twice becomes a rule or a sensor. That's the entire practice."

## 14 · CLOSING — 30s
- (slow) **"The model isn't the moat. The harness is."**
- "Links on screen — both articles, and my repo."
- "Salamat! Questions?"
- (someone asks 'could this work team-wide?' → smile. that's the seed.)
- …then: "and now. GAMES." → arrow onward, buttons guide you from here.

---
PANIC: O = fake demo · Shift+R = reset · click sprite = kill · M = mute
