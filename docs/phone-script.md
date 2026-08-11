# PHONE SCRIPT — Harness Engineering
(N = notes · F = fullscreen · O = bail to fake demo · Shift+R = full reset · M = mute)
BEFORE STARTING: Shift+R once. Set TV delay on race slide later.
RUNNING LONG? Cut in this order: 7 SKILLS → 13 ON DISK → trim 5 SENSORS to acts 1+3
  → in 4, keep the disclaimer and drop the "where it came from" bullets.
NEVER cut: 2 (the confession), 3 (concept), 8 (humans steer), 12 (reveal).

---

## 1 · TITLE — 45s
- "Hi, quick one. Everyone talks about AI tools. Mine's a bit different."
- **"Agents write code stupidly fast now. This talk is about the part nobody demos — TRUSTING what they write."**
- (point at the definition) "Quick word check — HARNESS. Like a horse harness."
- **"The horse is the model — strong, fast, kinda wild. The harness is everything AROUND it: the docs, the rules, the checks. The harness is what makes all that power pull in YOUR direction."**
- "The model? You rent that. Same one everyone has. The harness is the part you actually OWN — and that's what tonight is about."
- "I built my own. You'll see it working later. That's all I'm saying."
- (small smile, move on — don't spoil)

## 2 · THE PROBLEM — 60s ← earn the right to talk (be honest here)
- Read the two quotes off the slide. SLOWLY.
- **"Trust is the bottleneck."**
- (pause 2 seconds. let it sit.)
- One breath: "Agent gives me a 40-file diff in 3 minutes… then I lose my whole afternoon reviewing it. The speed moved. The bottleneck moved with it."
- CONFESSION (say it plainly, don't perform it): **"And I know this one firsthand, because I did it the bad way first."**
- "I have vibecoded entire projects. Straight prompting, no rules, no checks, just vibes and speed."
- **"They worked. For about two weeks."** (beat) "Then I couldn't touch my own repo. Duplicate helpers everywhere, five versions of the same function, files nobody could open."
- "I didn't abandon those projects because AI was bad at coding. I abandoned them because I gave it nothing to work inside."
- **"So this talk isn't theory I read. It's what I built after cleaning up my own mess."**

## 3 · FEEDFORWARD / FEEDBACK — 2min ← THE CONCEPT
- "Two articles changed how I think about this. **These two.**" (point at the cards, left then right)
- LEFT — OpenAI's Codex team: **"when the agent fails, don't wait for a better model — fix the HARNESS around it."**
- RIGHT — Böckeler on martinfowler.com names the two halves:
  - **GUIDES** — steer it BEFORE it acts (docs, conventions, skills)
  - **SENSORS** — catch it AFTER (linters, tests, checks)
- (point at the dots) "Work flows right. Feedback flows back. The errors go to the AGENT, not to me — it fixes itself before I ever look."
- Punchline: **"Only sensors? Same mistakes forever. Only guides? You never know if your rules work."**

## 4 · SONATA — 75s ← the machine runs itself, just talk over it
- "So I built mine. I call it Sonata. Watch it run — it's one machine with two halves."
- (trace the TOP lane with your hand, left to right) **"An idea gets stamped through grill, spec, tickets, implement. Skills that BUILD."**
- "It can't skip a station. That's the point of a lane."
- (follow it around the corner) "Out the end comes CODE. Now it goes back the other way—"
- (trace the BOTTOM lane, right to left) **"—through lint, tests, the 300-line gate. Checks that VALIDATE."**
- (point at the green card that drops out) **"And what falls out the end is a diff I can actually trust."**
- WHERE IT CAME FROM (slow down, this is the honest part):
  - "I want to be clear about what this is. **Nobody handed me this.** I built it for myself."
  - "It came from reading those two articles, then just… using AI every single day. Experiments. Side projects. A lot of failed ones."
  - **"Every station on that lane exists because something went wrong twice."** "The 300-line gate is there because agents kept writing god-files at me. The grilling is there because I got tired of being asked forty questions after the code was already written."
  - "It's been through a LOT of iterations. It's my daily driver now — every project I touch runs through it."
- THE DISCLAIMER (say it, it buys you the room): **"I'm not up here saying Sonata is the right answer. It's MY answer."**
- "You work differently than me. Your harness should look different. **I'm showing you mine so you can go build yours.**"

## 5 · SENSORS — 2min ← INTERACTIVE (click the stage)
- Frame: **"You barely have to build anything. Existing tools pair beautifully with agents. Watch three of them actually work."**
- ACT 1 — 300 lines (4 clicks): "Agents write god-files. Here comes one…"
  → counter blows past 300 → ✗ "sensor says no." → **"and the agent READS that error and splits the file ITSELF."** → ✓
  → **"This literally happened building tonight's app."**
- ACT 2 — scc (4 clicks): "Agents over-engineer. Look at this nesting…"
  → complexity 24 ✗ → flattens to early returns → ✓ "numbers call it out before I do."
- ACT 3 — skylos (4 clicks): "Agents leave orphans behind."
  → 👻 zero callers ✗ → ghost dissolves → ✓
- Close: **"Same loop three times: attempt, error, self-correct, pass. Every check speaks in errors the agent can act on."**

## 6 · DOCUMENTATION — 1min ← INTERACTIVE (one click)
- (point left) "Same prompt: add refunds. Agent WITHOUT docs: invents
  RefundManager2, wrong folder, new parallel pattern. Technically works. Ruins your codebase."
- **CLICK "load the docs"** (chips fly in)
- (point right) **"Same model. Same prompt. Now it lands in payments/, follows MY pattern."**
- **"The diff changed because the CONTEXT changed. Docs are executable now."**
- "And the flow keeps them alive — docs update with every feature. Not a wiki that rots."

## 7 · SKILLS — 1min ← for the devs
- "One more feedforward trick. The biggest lever: **skills**."
- WHAT: "A markdown file the agent loads on demand. A checklist it actually follows. No platform, no plugin."
- WHEN: **"The SECOND time you explain something — write it as a skill."**
- (point at example) "Twenty lines. The whole team invokes it. Your best explanation becomes everyone's default."
- Kicker: "Every workflow you'll see tonight — grill, spec, implement — is literally one of these files."

## 8 · HUMANS STEER — 75s ← INTERACTIVE (one click, then click back)
- Ask it out loud: **"So… if the agent writes it, am I still an engineer?"**
- (beat) "Honest answer: I'm MORE of one. Because all of that only works if a human is steering it."
- (point at the three cards) **"DESIGN — before. DECIDE — during. REVIEW — after."**
  - "I still draw the architecture. The agent works INSIDE the box I drew."
  - "Every real fork comes back to me — that's what the grilling is."
  - **"And nothing merges unread. The sensors go first so my eyes go LAST — and go deep."**
- **CLICK "take your hands off"**
- (point at the belt) **"Watch the machine. Same speed. It does not care."**
- (point at the numbers) **"But look — 'you understood' just stopped. And that red number? That's code in MY repo that nobody in the world understands."**
- (tap the red number) "This is the number from my vibecoded projects. It just kept going up until I couldn't open the folder anymore."
- **"And notice — when I put my hands back, it doesn't catch up. That code stays unread forever. That's how a codebase dies."**
- **"Speed was never the problem. Direction was."**
- **CLICK BACK.** "So no — this isn't about typing less. It's about my attention going where judgment actually lives. I still understand every line that ships."

## 9 · QR — 1min ← PHONES OUT
- **"Okay. Phones out. Scan this."**
- Then SAY NOTHING. (the app being empty is the joke later)
- Watch the counter climb. When it settles:
- "Cool. You're in. Keep it open."
- (if room/wifi is dead → press O on next slide, fake demo, keep moving)

## 10 · LIVE DEMO — 2.5min ← THE HEART
- "Sonata sizes every task: trivial, normal, complex. Watch the flow — and watch your phone."
- TRIVIAL (name input): click through. "Trivial = just do it, one check." → ships → **"check your phones."** (let the murmur happen. enjoy it.)
- NORMAL (canvas): "Light spec, quick nod, build." → **"Draw your character."** (give them a beat to doodle)
- COMPLEX (tools): "Full gauntlet — it grills ME first. These questions on screen? Real ones from building this." → tools appear mid-drawing.
- **"60 seconds. Draw your fighter. GO."**
- Timer ends → thumbnails pop on deck → "to the picks."

## 11 · ARENA — 2min
- **"Your drawings. RPS rules. Collisions are fatal. Last team standing."**
- Wait for ready gate → show players → START.
- Then SHUT UP and let the room react. (killfeed does the comedy for you)
- (rude drawing? click the sprite. it just dies. nobody knows.)
- Winner → crown → name the survivors out loud.

## 12 · REVEAL — 1min ← LAND THE THESIS
- "One more thing. The deck. The phone app. The name input, the canvas, that battle you just screamed at."
- (pause)
- **"ONE application. Built through Sonata itself. About 1–2 hours of actual work."**
- Point at receipts: "It got grilled. Specced. Ticketed. The 300-line sensor fired DURING the build and the agent split its own files."

## 13 · ON DISK — 1min
- **"And the whole harness? It's just files. This is the real repo, live."**
- Click AGENTS.md — "the map, agents read this first."
- Click quality.md — "the sensors."
- Click the grill record — "tonight's app started as this interview."
- "No platform. No magic. Markdown and shell scripts."

## 14 · START TINY — 45s
- Honest version: **"AI is fast RIGHT NOW. Take advantage of it."**
- "This system works for ME. It's a preference, not a prescription."
- **"Want yours? Start tiny. ONE rule in AGENTS.md today — the thing you keep correcting. Ten minutes."**
- "Then one sensor. Then: every mistake that happens twice becomes a rule or a sensor. That's the entire practice."

## 15 · CLOSING — 30s
- (slow) **"The model isn't the moat. The harness is."**
- "Links on screen — both articles, and my repo."
- "Salamat! Questions?"
- (someone asks 'could this work team-wide?' → smile. that's the seed.)
- …then: "and now. GAMES." → arrow onward, buttons guide you from here.

---
PANIC: O = fake demo · Shift+R = reset · click sprite = kill · M = mute
