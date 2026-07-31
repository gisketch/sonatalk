export type Team = 'rock' | 'paper' | 'scissors'

export const TEAMS: Team[] = ['rock', 'paper', 'scissors']
export const TEAM_EMOJI: Record<Team, string> = { rock: '🪨', paper: '📄', scissors: '✂️' }

const PREY: Record<Team, Team> = { rock: 'scissors', scissors: 'paper', paper: 'rock' }

/** The team this team hunts (and kills on contact). */
export function preyOf(team: Team): Team {
  return PREY[team]
}

export function beats(a: Team, b: Team): boolean {
  return PREY[a] === b
}

/** Winner of a collision, or null when same team (bounce, nobody dies). */
export function resolve(a: Team, b: Team): Team | null {
  if (a === b) return null
  return beats(a, b) ? a : b
}

/** The single winning team once every living entity shares it; null while contested or empty. */
export function soleTeam(teams: Team[]): Team | null {
  if (teams.length === 0) return null
  const first = teams[0]
  return teams.every((t) => t === first) ? first : null
}
