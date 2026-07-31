@AGENTS.md

## Claude Code Notes

- Sonata skills live in `.claude/skills/` and are invoked as slash commands (e.g. `/sonata-work`).
- A `$sonata-<name>` reference inside a skill or doc means: invoke the `sonata-<name>` skill.
- Start most requests with `sonata-work`; it routes to the smallest sufficient workflow.
- Run `./scripts/check-sonata.sh` to validate Sonata project structure and quality gates.
