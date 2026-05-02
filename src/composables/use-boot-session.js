/* ============================================================================
 * use-boot-session.js
 * ----------------------------------------------------------------------------
 * Singleton state for the once-per-session boot animation gate.
 *
 * The Cmd+K palette ships a `boot` command (see command-registry.js) that
 * does `localStorage.removeItem('bootSeen')` + reload — KEY is kept as the
 * literal string `'bootSeen'` to stay aligned with that command without
 * versioning churn.
 * ============================================================================ */
import { ref } from 'vue'

const KEY = 'bootSeen'

const seen = ref(false)
try {
  if (typeof localStorage !== 'undefined') {
    seen.value = localStorage.getItem(KEY) === '1'
  }
} catch {
  /* private mode / SSR / disabled storage — treat as not seen */
}

export function useBootSession() {
  return {
    seen,
    markSeen: () => {
      seen.value = true
      try {
        localStorage.setItem(KEY, '1')
      } catch {
        /* swallow */
      }
    },
    reset: () => {
      seen.value = false
      try {
        localStorage.removeItem(KEY)
      } catch {
        /* swallow */
      }
    },
  }
}
