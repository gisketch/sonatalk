// The tree IS this repo — core harness docs imported raw at build time.
import agentsMd from '../../../AGENTS.md?raw'
import claudeMd from '../../../CLAUDE.md?raw'
import indexMd from '../../../docs/index.md?raw'
import briefMd from '../../../docs/project-brief.md?raw'
import beliefsMd from '../../../docs/core-beliefs.md?raw'
import qualityMd from '../../../docs/quality.md?raw'
import archMd from '../../../docs/architecture/index.md?raw'
import grillMd from '../../../docs/specs/interactive-audience-system.md?raw'
import wsSpecMd from '../../../docs/specs/2026-07-31-ws-core.md?raw'
import ticketsMd from '../../../docs/exec-plans/active/2026-07-31-interactive-audience-tickets.md?raw'

export interface TreeNode {
  name: string
  /** raw markdown → clickable; absent → dimmed scenery */
  doc?: string
  children?: TreeNode[]
}

export const TREE: TreeNode[] = [
  { name: 'AGENTS.md', doc: agentsMd },
  { name: 'CLAUDE.md', doc: claudeMd },
  {
    name: 'docs/',
    children: [
      { name: 'index.md', doc: indexMd },
      { name: 'project-brief.md', doc: briefMd },
      { name: 'core-beliefs.md', doc: beliefsMd },
      { name: 'quality.md', doc: qualityMd },
      { name: 'architecture/', children: [{ name: 'index.md', doc: archMd }] },
      {
        name: 'specs/',
        children: [
          { name: 'interactive-audience-system.md', doc: grillMd },
          { name: 'ws-core.md', doc: wsSpecMd },
          { name: 'drawing-tier-drops.md' },
          { name: 'rps-battle.md' },
        ],
      },
      {
        name: 'exec-plans/',
        children: [{ name: 'interactive-audience-tickets.md', doc: ticketsMd }],
      },
    ],
  },
  {
    name: '.sonata/',
    children: [{ name: 'manifest.json' }, { name: 'quality-gates.json' }],
  },
  { name: '.claude/', children: [{ name: 'skills/' }] },
  {
    name: 'scripts/',
    children: [{ name: 'check-sonata.sh' }, { name: 'check-file-size.sh' }, { name: 'rehearse.mjs' }],
  },
  { name: 'src/', children: [] },
  { name: 'server/', children: [] },
  { name: 'package.json' },
]

export const DEFAULT_DOC = { name: 'AGENTS.md', doc: agentsMd }
