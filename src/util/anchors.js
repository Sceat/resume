import mitt from 'mitt'

const emitter = mitt()
const anchors_elements = new Map() // used to scroll to an element

export const anchor_scroll = {
  mounted(el, { value }) {
    const { onclick } = el
    el.onclick = async () => {
      await onclick?.()
      const anchor_element = anchors_elements.get(value)
      if (!anchor_element) {
        console.error(`anchor element not found (${value})`)
        return
      }
      window.scrollTo({
        top: anchor_element.getBoundingClientRect().top + window.scrollY,
        behavior: 'smooth',
      })
    }
  },
}

export const anchor = {
  mounted(el, { value }) {
    if (!el.anchors_observers) el.anchors_observers = new Map()
    const { anchors_observers } = el
    const observer = new IntersectionObserver(
      ([entries]) => {
        if (entries.isIntersecting) emitter.emit('anchor', value)
      },
      { threshold: [0] }
    )
    anchors_elements.set(value, el)
    anchors_observers.set(el, observer)
    observer.observe(el)
  },
  beforeUnmount(el, { value }) {
    const observer = el.anchors_observers.get(el)
    observer.disconnect()

    el.anchors_observers.delete(el)
    anchors_elements.delete(value)
  },
}

export { emitter }
