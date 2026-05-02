import { onBeforeUnmount, ref } from 'vue'

/**
 * Vanilla rAF typewriter. Grapheme-correct via Intl.Segmenter so multi-codepoint
 * characters (emoji, combining marks) reveal as a single visual unit.
 *
 * @param {{
 *   text: string,
 *   charDelayMs?: number,
 *   onComplete?: () => void
 * }} options
 * @returns {{
 *   output: import('vue').Ref<string>,
 *   complete: import('vue').Ref<boolean>,
 *   start: () => void,
 *   skip: () => void,
 *   reset: () => void
 * }}
 */
export function useTypewriter({ text, charDelayMs = 22, onComplete } = {}) {
  const output = ref('')
  const complete = ref(false)

  const segments = (() => {
    if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })
      return Array.from(segmenter.segment(text), s => s.segment)
    }
    return Array.from(text)
  })()

  let index = 0
  let lastTickTs = 0
  let rafId = 0
  let running = false

  const tick = ts => {
    if (!running) return
    if (!lastTickTs) lastTickTs = ts
    const elapsed = ts - lastTickTs
    if (elapsed >= charDelayMs) {
      const steps = Math.max(1, Math.floor(elapsed / charDelayMs))
      for (let i = 0; i < steps && index < segments.length; i += 1) {
        output.value += segments[index]
        index += 1
      }
      lastTickTs = ts
      if (index >= segments.length) {
        running = false
        complete.value = true
        if (typeof onComplete === 'function') onComplete()
        return
      }
    }
    rafId = requestAnimationFrame(tick)
  }

  const start = () => {
    if (running || complete.value) return
    running = true
    lastTickTs = 0
    rafId = requestAnimationFrame(tick)
  }

  const skip = () => {
    running = false
    if (rafId) cancelAnimationFrame(rafId)
    output.value = text
    index = segments.length
    if (!complete.value) {
      complete.value = true
      if (typeof onComplete === 'function') onComplete()
    }
  }

  const reset = () => {
    running = false
    if (rafId) cancelAnimationFrame(rafId)
    output.value = ''
    index = 0
    lastTickTs = 0
    complete.value = false
  }

  onBeforeUnmount(() => {
    running = false
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { output, complete, start, skip, reset }
}
