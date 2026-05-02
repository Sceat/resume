import { onBeforeUnmount, ref } from 'vue'

/**
 * Reactive boolean ref that tracks `prefers-reduced-motion: reduce`.
 * Updates live as the user toggles their OS-level setting.
 * Safe to call during SSR (returns `false` if `window` is undefined).
 *
 * @returns {import('vue').Ref<boolean>}
 */
export function usePrefersReducedMotion() {
  const reduced = ref(false)

  if (typeof window === 'undefined' || !window.matchMedia) return reduced

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = mq.matches

  const onChange = event => {
    reduced.value = event.matches
  }

  // Modern browsers: addEventListener; older Safari: addListener
  if (typeof mq.addEventListener === 'function')
    mq.addEventListener('change', onChange)
  else mq.addListener(onChange)

  onBeforeUnmount(() => {
    if (typeof mq.removeEventListener === 'function')
      mq.removeEventListener('change', onChange)
    else mq.removeListener(onChange)
  })

  return reduced
}
