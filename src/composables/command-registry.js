/* ============================================================================
 * command-registry.js
 * ----------------------------------------------------------------------------
 * The 13 commands the palette knows about. Each entry:
 *   - label    : displayed in the list
 *   - keywords : extra fuzzy-match aliases
 *   - action   : () => void  (executed when the entry is chosen)
 *   - shortcut : optional display-only hint (no actual key wiring yet)
 *
 * Anchor scrolling: tries the v3-plan target ID first
 * (e.g. `#flagships-anchor`), then falls back to the bare flagship id
 * (e.g. `#bitfinex`). Lets this wave ship before later waves add their
 * anchor stubs.
 * ============================================================================ */

function scrollToFirst(ids, fallbackTop = false) {
  if (typeof document === 'undefined') return
  for (const id of ids) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
  }
  if (fallbackTop) window.scrollTo({ top: 0, behavior: 'smooth' })
}

function downloadResume() {
  if (typeof document === 'undefined') return
  const a = document.createElement('a')
  a.href = '/001-CYRIL-MORLET-RESUME.pdf'
  a.download = '001-CYRIL-MORLET-RESUME.pdf'
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function rebootSession() {
  try {
    localStorage.removeItem('bootSeen')
  } catch {
    /* private mode / disabled */
  }
  window.location.reload()
}

export const commandRegistry = [
  {
    label: 'flagships',
    keywords: ['projects', 'work', 'portfolio'],
    shortcut: 'g f',
    action: () => scrollToFirst(['flagships-anchor', 'bitfinex']),
  },
  {
    label: 'bitfinex',
    keywords: ['exchange', 'sui', 'crypto'],
    action: () => scrollToFirst(['flagship-bitfinex', 'bitfinex']),
  },
  {
    label: 'hytale',
    keywords: ['mmorpg', 'game', 'minecraft'],
    action: () => scrollToFirst(['flagship-hytale', 'hytale']),
  },
  {
    label: 'aresrpg',
    keywords: ['ares', 'rpg', 'sui', 'on-chain', 'game'],
    action: () => scrollToFirst(['flagship-aresrpg', 'aresrpg']),
  },
  {
    label: 'talos',
    keywords: ['kubernetes', 'k8s', 'cluster', 'infra'],
    action: () => scrollToFirst(['flagship-talos', 'talos']),
  },
  {
    label: 'skills',
    keywords: ['stack', 'tech', 'matrix'],
    shortcut: 'g s',
    action: () => scrollToFirst(['skills-anchor', 'skills-heading']),
  },
  {
    label: 'contact',
    keywords: ['hire', 'reach', 'email'],
    shortcut: 'g c',
    action: () => scrollToFirst(['contact-anchor', 'contact-heading']),
  },
  {
    label: 'download resume',
    keywords: ['cv', 'pdf', 'résumé', 'resume'],
    shortcut: 'd r',
    action: downloadResume,
  },
  {
    label: 'email',
    keywords: ['mail', 'contact', 'fetch@sceat.xyz'],
    shortcut: 'm',
    action: () => {
      window.location.href = 'mailto:fetch@sceat.xyz'
    },
  },
  {
    label: 'github',
    keywords: ['gh', 'source', 'code', 'repo'],
    action: () => window.open('https://github.com/sceat', '_blank'),
  },
  {
    label: 'play on testnet',
    keywords: ['aresrpg', 'play', 'demo', 'game'],
    action: () => window.open('https://aresrpg.world', '_blank'),
  },
  {
    label: 'boot',
    keywords: ['reboot', 'restart', 'sequence', 'reset'],
    action: rebootSession,
  },
  {
    label: 'home',
    keywords: ['top', 'start'],
    shortcut: 'g h',
    action: () => scrollToFirst(['top'], true),
  },
]
