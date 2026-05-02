import { onBeforeUnmount, ref, watch } from 'vue'

/**
 * Track whether a target element is intersecting the viewport.
 *
 * Wraps `IntersectionObserver` and exposes a reactive `inView` boolean. By
 * default the observer disconnects after the first `true` so it works as a
 * one-shot scroll-into-view trigger (count-up animations, lazy reveals).
 * Pass `{ once: false }` to keep tracking continuously.
 *
 * Safe in non-browser environments and when IntersectionObserver isn't
 * available — returns `inView: true` immediately so dependents still render.
 *
 * @param {import('vue').Ref<Element | null>} target
 * @param {IntersectionObserverInit & { once?: boolean }} [options]
 * @returns {{ inView: import('vue').Ref<boolean> }}
 */
export function useInView(target, options = {}) {
  const {
    once = true,
    root = null,
    rootMargin = '0px',
    threshold = 0.2,
  } = options
  const inView = ref(false)

  if (
    typeof window === 'undefined' ||
    typeof IntersectionObserver === 'undefined'
  ) {
    inView.value = true
    return { inView }
  }

  let observer = null

  const teardown = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const observe = el => {
    teardown()
    if (!el) return
    observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            inView.value = true
            if (once) teardown()
          } else if (!once) {
            inView.value = false
          }
        }
      },
      { root, rootMargin, threshold }
    )
    observer.observe(el)
  }

  watch(target, el => observe(el), { immediate: true, flush: 'post' })

  onBeforeUnmount(teardown)

  return { inView }
}
