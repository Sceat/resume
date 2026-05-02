/* ============================================================================
 * use-command-palette.js
 * ----------------------------------------------------------------------------
 * Singleton state + keyboard hook for the Cmd+K command palette.
 *
 *  - Cmd+K / Ctrl+K  → toggle open
 *  - ESC             → close
 *  - ↑ / ↓           → move selection
 *  - Enter           → execute selected
 *
 * `useCommandPalette()` returns the same reactive state every call so any
 * component (App, Nav, Hero CTA) can open the palette imperatively. The
 * keyboard listener is mounted exactly once via `installCommandPaletteHotkeys`
 * from App.vue.
 *
 * Substring-fuzzy ranker is intentionally dependency-free (~25 lines).
 * ============================================================================ */
import { computed, nextTick, ref } from 'vue'

import { commandRegistry } from './command-registry.js'

// ---------------------------------------------------------------------------
// Singleton reactive state — survives across composable callers
// ---------------------------------------------------------------------------
const isOpen = ref(false)
const query = ref('')
const selectedIndex = ref(0)
const lastFocusedEl = ref(null)
let listenerInstalled = false

// ---------------------------------------------------------------------------
// Fuzzy match — substring-with-gaps ranker
// ---------------------------------------------------------------------------
/**
 * Score a haystack against a needle.
 *  - exact match        → 1000
 *  - prefix match       → 500 - position
 *  - contiguous match   → 300 - position
 *  - scattered (in order) → 100 - gaps
 *  - no match           → -1
 */
function score(haystack, needle) {
  if (!needle) return 1
  const h = haystack.toLowerCase()
  const n = needle.toLowerCase()

  if (h === n) return 1000
  if (h.startsWith(n)) return 500 - (h.length - n.length)

  const contiguous = h.indexOf(n)
  if (contiguous !== -1) return 300 - contiguous

  // scattered: every char of n must appear in order somewhere in h
  let hi = 0
  let lastMatch = -1
  let gaps = 0
  for (let ni = 0; ni < n.length; ni++) {
    const ch = n[ni]
    const found = h.indexOf(ch, hi)
    if (found === -1) return -1
    if (lastMatch !== -1 && found - lastMatch > 1) gaps += found - lastMatch
    lastMatch = found
    hi = found + 1
  }
  return 100 - gaps
}

function bestScore(cmd, needle) {
  let best = score(cmd.label, needle)
  if (cmd.keywords)
    for (const kw of cmd.keywords) {
      const s = score(kw, needle)
      if (s > best) best = s
    }
  return best
}

// ---------------------------------------------------------------------------
// Filtered + ranked commands
// ---------------------------------------------------------------------------
const filtered = computed(() => {
  const q = query.value.trim()
  if (!q) return commandRegistry.slice()
  const scored = []
  for (const cmd of commandRegistry) {
    const s = bestScore(cmd, q)
    if (s > -1) scored.push({ cmd, s })
  }
  scored.sort((a, b) => b.s - a.s)
  return scored.map(x => x.cmd)
})

// ---------------------------------------------------------------------------
// Public API — singleton across all callers
// ---------------------------------------------------------------------------
export function useCommandPalette() {
  function open() {
    if (isOpen.value) return
    lastFocusedEl.value =
      typeof document !== 'undefined' ? document.activeElement : null
    query.value = ''
    selectedIndex.value = 0
    isOpen.value = true
  }

  function close() {
    if (!isOpen.value) return
    isOpen.value = false
    nextTick(() => {
      const prev = lastFocusedEl.value
      if (prev && typeof prev.focus === 'function') {
        try {
          prev.focus()
        } catch {
          /* element gone */
        }
      }
      lastFocusedEl.value = null
    })
  }

  function toggle() {
    isOpen.value ? close() : open()
  }

  function setQuery(value) {
    query.value = value
    selectedIndex.value = 0
  }

  function moveSelection(delta) {
    const len = filtered.value.length
    if (len === 0) return
    selectedIndex.value = (selectedIndex.value + delta + len) % len
  }

  function selectIndex(i) {
    if (i < 0 || i >= filtered.value.length) return
    selectedIndex.value = i
  }

  function executeSelected() {
    const cmd = filtered.value[selectedIndex.value]
    if (!cmd) return
    close()
    // Defer so close() animation/focus restore happen first
    nextTick(() => {
      try {
        cmd.action()
      } catch (err) {
        // Swallow — palette must never leave the user stuck
        console.error('[command-palette] action threw:', err)
      }
    })
  }

  return {
    isOpen,
    query,
    selectedIndex,
    filtered,
    open,
    close,
    toggle,
    setQuery,
    moveSelection,
    selectIndex,
    executeSelected,
  }
}

// ---------------------------------------------------------------------------
// Global keydown wiring — install once from App.vue onMounted
// ---------------------------------------------------------------------------
export function installCommandPaletteHotkeys() {
  if (listenerInstalled || typeof window === 'undefined') return () => {}
  listenerInstalled = true

  const onKeyDown = event => {
    // Cmd+K (mac) or Ctrl+K (others)
    const isCmdK =
      (event.metaKey || event.ctrlKey) &&
      !event.shiftKey &&
      !event.altKey &&
      (event.key === 'k' || event.key === 'K')

    if (isCmdK) {
      event.preventDefault()
      const palette = useCommandPalette()
      palette.toggle()
    }
  }

  window.addEventListener('keydown', onKeyDown)

  return () => {
    window.removeEventListener('keydown', onKeyDown)
    listenerInstalled = false
  }
}
