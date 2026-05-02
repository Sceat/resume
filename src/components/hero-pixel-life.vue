<template>
  <canvas ref="canvasRef" class="hero-pixel-life" aria-hidden="true" />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'

/**
 * Hero pixel-life — canvas2d ambient layer.
 *
 *  Draws a "blockchain factory at work" backdrop above the curl-noise field
 *  but below the hero content. Five sub-layers, all on one shared rAF loop:
 *
 *   1. Carbon dot grid          — static, painted once per frame at low alpha
 *   2. Hex glyph rain           — sparse mono characters drifting upward
 *   3. Tx packet trails         — small square "blocks" travelling between
 *                                 random waypoints, leaving a fading streak
 *   4. Commit pulse rings       — tiny rings emitted when a block reaches
 *                                 its waypoint (the "tx confirmed" beat)
 *   5. Ledger ticker (corner)   — slow scrolling list of fake block heights,
 *                                 only on desktop, very low opacity
 *
 *  The cursor never *guides* anything here. Blocks within ~120px of the
 *  cursor receive a tiny repulsive push (think: dust catching air). The
 *  field stays autonomous.
 *
 *  Pauses on offscreen, prefers-reduced-motion, and document.hidden.
 */

const props = defineProps({
  mouseX: { type: Number, default: 0.5 },
  mouseY: { type: Number, default: 0.5 },
})

const reduced = usePrefersReducedMotion()

const canvasRef = ref(null)
let ctx = null
let raf = 0
let lastTs = 0
let inView = true
let observer = null
let resizeObserver = null
let dpr = 1
let widthCss = 0
let heightCss = 0

// ─── Colour palette (read once from CSS tokens) ────────────────────────
let palette = {
  primary: 'rgba(96,165,250,1)',
  primaryGlow: 'rgba(147,197,253,1)',
  fg: 'rgba(226,232,240,1)',
  fgMute: 'rgba(71,85,105,1)',
  success: 'rgba(52,211,153,1)',
}

const readPalette = () => {
  if (typeof window === 'undefined') return
  const css = getComputedStyle(document.documentElement)
  const grab = (k, fb) => {
    const v = css.getPropertyValue(k).trim()
    return v || fb
  }
  palette = {
    primary: grab('--color-primary', '#60a5fa'),
    primaryGlow: grab('--color-primary-glow', '#93c5fd'),
    fg: grab('--color-fg', '#e2e8f0'),
    fgMute: grab('--color-fg-mute', '#475569'),
    success: grab('--color-success', '#34d399'),
  }
}

// ─── Mouse (CSS-px space, set once per frame) ──────────────────────────
const mouseCss = { x: 0, y: 0 }

watch(
  () => [props.mouseX, props.mouseY],
  ([mx, my]) => {
    mouseCss.x = mx * widthCss
    mouseCss.y = my * heightCss
  },
)

// ─── Particles ─────────────────────────────────────────────────────────
const HEX_GLYPH_COUNT_DESKTOP = 28
const HEX_GLYPH_COUNT_MOBILE = 12
const TX_PACKET_COUNT_DESKTOP = 7
const TX_PACKET_COUNT_MOBILE = 3

const HEX_CHARS = '0123456789abcdef'
const HEX_TOKENS = [
  '0x4f',
  '0xc1',
  '0x8f',
  '0x9a',
  '0x6e',
  '0x42',
  '0xf0',
  'tx::',
  'mv::',
  'sui::',
  '→ commit',
  '→ apply',
  '→ exec',
  'block',
  'pkg::',
  '0x2',
  'cap',
]

const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[(Math.random() * arr.length) | 0]
const isMobile = () => widthCss < 768

let glyphs = []
let packets = []
let pulses = []

const seedGlyph = (g) => {
  g.x = rand(0, widthCss)
  g.y = rand(0, heightCss)
  g.vy = rand(-0.10, -0.04) // slow upward drift
  g.vx = rand(-0.02, 0.02)
  g.char = Math.random() < 0.4
    ? pick(HEX_TOKENS)
    : HEX_CHARS[(Math.random() * HEX_CHARS.length) | 0]
  g.opacity = rand(0.03, 0.11)
  g.size = rand(9, 13)
  g.life = rand(0, 18) // seconds
  g.maxLife = rand(14, 26)
}

const seedPackets = () => {
  packets = []
  const n = isMobile() ? TX_PACKET_COUNT_MOBILE : TX_PACKET_COUNT_DESKTOP
  for (let i = 0; i < n; i++) {
    packets.push({
      x: rand(0, widthCss),
      y: rand(0, heightCss),
      tx: rand(0, widthCss),
      ty: rand(0, heightCss),
      label: pick(HEX_TOKENS),
      size: rand(10, 16) | 0,
      progress: 0,
      duration: rand(7.5, 14.0),
      lastEmit: -10,
      hue: Math.random() < 0.6 ? 'primary' : 'success',
    })
  }
}

const reseedGlyphs = () => {
  glyphs = []
  const n = isMobile() ? HEX_GLYPH_COUNT_MOBILE : HEX_GLYPH_COUNT_DESKTOP
  for (let i = 0; i < n; i++) {
    const g = {}
    seedGlyph(g)
    glyphs.push(g)
  }
}

// ─── Sizing ────────────────────────────────────────────────────────────
const handleResize = () => {
  if (!canvasRef.value) return
  const parent = canvasRef.value.parentElement
  if (!parent) return
  const rect = parent.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return
  dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  widthCss = rect.width
  heightCss = rect.height
  canvasRef.value.width = Math.floor(widthCss * dpr)
  canvasRef.value.height = Math.floor(heightCss * dpr)
  canvasRef.value.style.width = `${widthCss}px`
  canvasRef.value.style.height = `${heightCss}px`
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  if (!glyphs.length) reseedGlyphs()
  if (!packets.length) seedPackets()
}

// ─── Drawing helpers ───────────────────────────────────────────────────
const drawCarbonGrid = () => {
  // Dot grid — gives a faint structural feel, like a circuit substrate.
  ctx.save()
  ctx.fillStyle = palette.primary
  ctx.globalAlpha = 0.045
  const step = 28
  const r = 1
  // Offset slightly so the grid doesn't sit perfectly at edge
  for (let x = step / 2; x < widthCss; x += step) {
    for (let y = step / 2; y < heightCss; y += step) {
      ctx.fillRect(x - r / 2, y - r / 2, r, r)
    }
  }
  ctx.restore()
}

const drawGlyph = (g, dt) => {
  g.x += g.vx
  g.y += g.vy
  g.life += dt
  if (g.x < -40) g.x = widthCss + 40
  if (g.x > widthCss + 40) g.x = -40
  if (g.y < -20 || g.life > g.maxLife) {
    seedGlyph(g)
    g.y = heightCss + rand(0, 60)
  }
  // Fade in/out at life endpoints
  const t = g.life / g.maxLife
  const fade = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1
  ctx.save()
  ctx.font = `${g.size}px ui-monospace, "JetBrains Mono", Menlo, monospace`
  ctx.fillStyle = palette.primaryGlow
  ctx.globalAlpha = g.opacity * fade
  ctx.fillText(g.char, g.x, g.y)
  ctx.restore()
}

const drawPacket = (pkt, elapsed, dt) => {
  // Ease in/out between (sx, sy) and (tx, ty). When progress hits 1,
  // pick a new target waypoint and emit a commit pulse.
  pkt.progress += dt / pkt.duration

  // Cursor repulsion — barely-there push if close (felt, not magnet)
  const dx = pkt.x - mouseCss.x
  const dy = pkt.y - mouseCss.y
  const d2 = dx * dx + dy * dy
  if (d2 < 90 * 90) {
    const inv = 1 / Math.max(40, Math.sqrt(d2))
    const push = (1 - Math.sqrt(d2) / 90) * 0.5
    pkt.x += dx * inv * push
    pkt.y += dy * inv * push
  }

  if (pkt.progress >= 1) {
    pulses.push({
      x: pkt.tx,
      y: pkt.ty,
      age: 0,
      hue: pkt.hue,
    })
    pkt.x = pkt.tx
    pkt.y = pkt.ty
    pkt.tx = rand(0, widthCss)
    pkt.ty = rand(0, heightCss)
    pkt.label = pick(HEX_TOKENS)
    pkt.duration = rand(7.5, 14.0)
    pkt.progress = 0
    pkt.hue = Math.random() < 0.6 ? 'primary' : 'success'
  }

  // Smooth-step easing
  const t = pkt.progress
  const e = t * t * (3 - 2 * t)
  // Origin is the previous (x, y). We blend the static x/y with target.
  const drawX = pkt.x + (pkt.tx - pkt.x) * e
  const drawY = pkt.y + (pkt.ty - pkt.y) * e

  const colour = pkt.hue === 'success' ? palette.success : palette.primary
  const colourGlow =
    pkt.hue === 'success' ? palette.success : palette.primaryGlow

  // ── Trail (3 ghosts behind) ──
  ctx.save()
  for (let k = 1; k <= 3; k++) {
    const tt = Math.max(0, t - k * 0.04)
    const ee = tt * tt * (3 - 2 * tt)
    const tx = pkt.x + (pkt.tx - pkt.x) * ee
    const ty = pkt.y + (pkt.ty - pkt.y) * ee
    ctx.globalAlpha = 0.10 - k * 0.025
    ctx.fillStyle = colour
    ctx.fillRect(tx - pkt.size / 2, ty - pkt.size / 2, pkt.size, pkt.size)
  }
  ctx.restore()

  // ── Block ──
  ctx.save()
  ctx.globalAlpha = 0.18
  ctx.fillStyle = colour
  ctx.fillRect(drawX - pkt.size / 2, drawY - pkt.size / 2, pkt.size, pkt.size)

  ctx.globalAlpha = 0.55
  ctx.strokeStyle = colourGlow
  ctx.lineWidth = 1
  ctx.strokeRect(
    drawX - pkt.size / 2 + 0.5,
    drawY - pkt.size / 2 + 0.5,
    pkt.size - 1,
    pkt.size - 1,
  )

  // Inner pip (1px) — fakes a "data dot"
  ctx.globalAlpha = 0.85
  ctx.fillStyle = colourGlow
  ctx.fillRect(drawX - 0.5, drawY - 0.5, 1, 1)
  ctx.restore()

  // ── Label (tiny mono, only emit one per ~1.5s to keep it sparse) ──
  if (elapsed - pkt.lastEmit > 1.5 && Math.random() < 0.04) {
    pkt.lastEmit = elapsed
  }
  if (elapsed - pkt.lastEmit < 1.2) {
    const labelAge = (elapsed - pkt.lastEmit) / 1.2
    const labelFade = 1 - labelAge
    ctx.save()
    ctx.font = '10px ui-monospace, "JetBrains Mono", Menlo, monospace'
    ctx.fillStyle = colourGlow
    ctx.globalAlpha = 0.25 * labelFade
    ctx.fillText(pkt.label, drawX + pkt.size / 2 + 4, drawY + 3)
    ctx.restore()
  }
}

const drawPulses = (dt) => {
  for (let i = pulses.length - 1; i >= 0; i--) {
    const p = pulses[i]
    p.age += dt
    if (p.age > 0.9) {
      pulses.splice(i, 1)
      continue
    }
    const r = p.age * 60
    const alpha = (1 - p.age / 0.9) * 0.35
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.strokeStyle =
      p.hue === 'success' ? palette.success : palette.primaryGlow
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
}

// ─── Frame loop ────────────────────────────────────────────────────────
const tick = (ts) => {
  raf = 0
  if (!ctx) return
  if (!lastTs) lastTs = ts
  const dt = Math.min((ts - lastTs) / 1000, 0.05)
  lastTs = ts
  const elapsed = ts / 1000

  ctx.clearRect(0, 0, widthCss, heightCss)
  drawCarbonGrid()
  for (let i = 0; i < glyphs.length; i++) drawGlyph(glyphs[i], dt)
  for (let i = 0; i < packets.length; i++) drawPacket(packets[i], elapsed, dt)
  drawPulses(dt)

  if (!reduced.value && inView && !document.hidden) {
    raf = requestAnimationFrame(tick)
  }
}

const kick = () => {
  if (!raf && !reduced.value && inView && !document.hidden) {
    lastTs = 0
    raf = requestAnimationFrame(tick)
  }
}

const onVisibility = () => {
  if (document.hidden) {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  } else kick()
}

onMounted(() => {
  if (typeof window === 'undefined' || !canvasRef.value) return
  ctx = canvasRef.value.getContext('2d')
  if (!ctx) return
  readPalette()
  handleResize()

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(canvasRef.value.parentElement)
  } else {
    window.addEventListener('resize', handleResize, { passive: true })
  }

  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          inView = entry.isIntersecting
          if (inView) kick()
        }
      },
      { threshold: 0.01 },
    )
    observer.observe(canvasRef.value)
  }

  document.addEventListener('visibilitychange', onVisibility)

  if (reduced.value) {
    // Render a single static frame so the layer still has presence.
    requestAnimationFrame(() => tick(performance.now()))
  } else {
    kick()
  }
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  if (observer) observer.disconnect()
  observer = null
  if (resizeObserver) resizeObserver.disconnect()
  else window.removeEventListener('resize', handleResize)
  resizeObserver = null
  document.removeEventListener('visibilitychange', onVisibility)
  ctx = null
})
</script>

<style scoped>
.hero-pixel-life {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -8;
  display: block;
}
</style>
