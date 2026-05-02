import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * useTypingStream — irregular-cadence agent thought stream.
 *
 * Cycles through an array of phrases:
 *   1. Type chars at random 28-44ms with occasional 200-400ms "think pauses"
 *   2. Hold the typed phrase for 2s
 *   3. Delete backwards at 18ms/char
 *   4. 600ms pause, then next phrase
 *
 * Honors `prefers-reduced-motion` (returns the first phrase, fully rendered).
 * Pauses when `paused.value === true` (e.g., section off-screen).
 *
 * @param {string[]} phrases
 * @param {{ paused?: import('vue').Ref<boolean>, reduced?: import('vue').Ref<boolean> }} opts
 * @returns {{ text: import('vue').Ref<string>, isTyping: import('vue').Ref<boolean> }}
 */
export function useTypingStream(phrases, opts = {}) {
  const text = ref('')
  const isTyping = ref(false)

  const { reduced, paused } = opts

  let timer = 0
  let phraseIdx = Math.floor(Math.random() * phrases.length)
  let charIdx = 0
  let mode = 'typing' // typing | hold | deleting | gap
  let pausesLeft = 0

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer)
      timer = 0
    }
  }

  const pickPauseSlots = len => {
    // 3-5 random pause positions, sorted ascending
    const count = 3 + Math.floor(Math.random() * 3)
    const slots = new Set()
    while (slots.size < count) {
      slots.add(2 + Math.floor(Math.random() * Math.max(1, len - 2)))
    }
    return Array.from(slots).sort((a, b) => a - b)
  }

  let pauseSlots = []

  const schedule = ms => {
    clearTimer()
    timer = setTimeout(tick, ms)
  }

  const tick = () => {
    if (paused && paused.value) {
      schedule(200)
      return
    }
    const phrase = phrases[phraseIdx]

    if (mode === 'typing') {
      isTyping.value = true
      if (charIdx >= phrase.length) {
        mode = 'hold'
        schedule(2000)
        return
      }
      // think pause?
      if (pauseSlots.includes(charIdx) && pausesLeft > 0) {
        pausesLeft -= 1
        pauseSlots = pauseSlots.filter(s => s !== charIdx)
        isTyping.value = false
        schedule(200 + Math.floor(Math.random() * 200))
        return
      }
      text.value = phrase.slice(0, charIdx + 1)
      charIdx += 1
      schedule(28 + Math.floor(Math.random() * 17))
      return
    }

    if (mode === 'hold') {
      isTyping.value = false
      mode = 'deleting'
      schedule(0)
      return
    }

    if (mode === 'deleting') {
      isTyping.value = true
      if (text.value.length === 0) {
        mode = 'gap'
        schedule(600)
        return
      }
      text.value = text.value.slice(0, -1)
      schedule(18)
      return
    }

    if (mode === 'gap') {
      phraseIdx = (phraseIdx + 1) % phrases.length
      charIdx = 0
      const next = phrases[phraseIdx]
      pauseSlots = pickPauseSlots(next.length)
      pausesLeft = pauseSlots.length
      mode = 'typing'
      schedule(0)
    }
  }

  const start = () => {
    if (reduced && reduced.value) {
      ;[text.value] = phrases
      isTyping.value = false
      return
    }
    const first = phrases[phraseIdx]
    pauseSlots = pickPauseSlots(first.length)
    pausesLeft = pauseSlots.length
    mode = 'typing'
    charIdx = 0
    text.value = ''
    schedule(0)
  }

  onMounted(start)

  if (reduced) {
    watch(reduced, val => {
      clearTimer()
      if (val) {
        ;[text.value] = phrases
        isTyping.value = false
      } else {
        start()
      }
    })
  }

  onBeforeUnmount(() => {
    clearTimer()
  })

  return { text, isTyping }
}
