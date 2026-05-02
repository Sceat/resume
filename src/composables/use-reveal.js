/**
 * `v-reveal` directive: fades + translates an element into view on scroll.
 *
 * Adds `.reveal` class on bind (initial state: opacity 0, translateY 24px) and
 * swaps to `.is-revealed` when the element enters the viewport. One-shot.
 * Honors `prefers-reduced-motion` by revealing instantly without transition
 * (the CSS handles that).
 *
 * Usage in main.js:
 *   import { revealDirective } from './composables/use-reveal.js'
 *   app.directive('reveal', revealDirective)
 *
 * Then in any template:
 *   <section v-reveal>...</section>
 */

const observed = new WeakMap()
let sharedObserver = null

const ensureObserver = () => {
  if (sharedObserver) return sharedObserver
  if (typeof IntersectionObserver === 'undefined') return null
  sharedObserver = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          sharedObserver.unobserve(entry.target)
          observed.delete(entry.target)
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )
  return sharedObserver
}

export const revealDirective = {
  mounted(el) {
    el.classList.add('reveal')
    const obs = ensureObserver()
    if (!obs) {
      // Environments without IO: reveal immediately
      el.classList.add('is-revealed')
      return
    }
    observed.set(el, true)
    obs.observe(el)
  },
  unmounted(el) {
    if (sharedObserver && observed.has(el)) {
      sharedObserver.unobserve(el)
      observed.delete(el)
    }
  },
}
