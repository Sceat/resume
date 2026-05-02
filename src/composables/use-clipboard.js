import { onBeforeUnmount, ref } from 'vue'

/**
 * Copy-to-clipboard with toast-style feedback.
 *
 * Uses the modern `navigator.clipboard.writeText` API when available; falls
 * back to a hidden `<textarea>` + `document.execCommand('copy')` for older
 * browsers and non-secure contexts. `copied` flips to `true` for `resetMs`
 * after a successful copy. Errors are swallowed and logged to the console.
 *
 * @param {{ resetMs?: number }} [options]
 * @returns {{
 *   copy: (value: string) => Promise<boolean>,
 *   copied: import('vue').Ref<boolean>
 * }}
 */
export function useClipboard({ resetMs = 2000 } = {}) {
  const copied = ref(false)
  let resetTimer = 0

  const fallbackCopy = value => {
    if (typeof document === 'undefined') return false
    const ta = document.createElement('textarea')
    ta.value = value
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '0'
    ta.style.left = '0'
    ta.style.opacity = '0'
    ta.style.pointerEvents = 'none'
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch (err) {
      console.warn('[use-clipboard] fallback copy failed', err)
      ok = false
    }
    document.body.removeChild(ta)
    return ok
  }

  const flagSuccess = () => {
    copied.value = true
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = window.setTimeout(() => {
      copied.value = false
      resetTimer = 0
    }, resetMs)
  }

  const copy = async value => {
    if (value == null) return false
    const text = String(value)
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function' &&
      // Clipboard API requires a secure context
      (typeof window === 'undefined' || window.isSecureContext !== false)
    ) {
      try {
        await navigator.clipboard.writeText(text)
        flagSuccess()
        return true
      } catch (err) {
        console.warn(
          '[use-clipboard] navigator.clipboard failed, falling back',
          err
        )
      }
    }
    const ok = fallbackCopy(text)
    if (ok) flagSuccess()
    return ok
  }

  onBeforeUnmount(() => {
    if (resetTimer) clearTimeout(resetTimer)
  })

  return { copy, copied }
}
