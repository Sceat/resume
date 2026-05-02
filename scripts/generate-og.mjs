/**
 * scripts/generate-og.mjs
 *
 * Generates the Open Graph share card at dist/og-image.png.
 * Uses @vercel/og (Node entry — Satori under the hood) to render JSX to PNG.
 *
 * 1200×630, dark surface, headline + role + accent rule.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { ImageResponse } from '@vercel/og'

import { profile } from '../src/content/profile.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'dist')
const OUT_FILE = path.join(OUT_DIR, 'og-image.png')

const W = 1200
const H = 630

// Inline JSX-equivalent via the React-element factory. @vercel/og accepts
// any structure shaped like { type, props }, so we hand-build it without
// a JSX runtime.
const el = (type, props, ...children) => ({
  type,
  props: { ...(props || {}), children: children.length === 1 ? children[0] : children },
  key: null,
})

function template() {
  return el(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '72px 80px',
        background:
          'linear-gradient(135deg, #06080f 0%, #0c1018 50%, #131826 100%)',
        color: '#e2e8f0',
        fontFamily: 'sans-serif',
      },
    },
    // Top row — small mono tag + accent rule
    el(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontSize: 22,
          color: '#94a3b8',
          letterSpacing: 4,
          textTransform: 'uppercase',
        },
      },
      el('span', null, '~/sceat-portfolio'),
      el('span', { style: { flex: 1, height: 1, background: '#1e2638' } }),
      el('span', { style: { color: '#60a5fa' } }, 'sceat.xyz'),
    ),
    // Center stack — name + role + tagline
    el(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
      el(
        'div',
        {
          style: {
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -2,
            color: '#e2e8f0',
          },
        },
        profile.name,
      ),
      el(
        'div',
        {
          style: {
            fontSize: 38,
            color: '#94a3b8',
            letterSpacing: -0.5,
          },
        },
        `${profile.title} · Sui Move · Web3`,
      ),
      el(
        'div',
        {
          style: {
            display: 'flex',
            marginTop: 16,
            fontSize: 24,
            color: '#60a5fa',
            letterSpacing: 1,
            fontFamily: 'monospace',
          },
        },
        '12y shipping · ex-Bitfinex · live MMORPG · onchain on Sui',
      ),
    ),
    // Bottom row — contact ribbon
    el(
      'div',
      {
        style: {
          display: 'flex',
          gap: 24,
          fontSize: 22,
          color: '#475569',
          fontFamily: 'monospace',
          letterSpacing: 1,
        },
      },
      el('span', null, profile.email),
      el('span', null, '·'),
      el('span', null, `github.com/${profile.github.replace(/^@/, '')}`),
      el('span', null, '·'),
      el('span', null, `${profile.location.city}, ${profile.location.country}`),
    ),
  )
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  const img = new ImageResponse(template(), { width: W, height: H })
  const ab = await img.arrayBuffer()
  fs.writeFileSync(OUT_FILE, Buffer.from(ab))

  const sizeKB = (fs.statSync(OUT_FILE).size / 1024).toFixed(1)
  console.log(`[generate-og] OK · ${OUT_FILE} · ${sizeKB} KB`)
}

main().catch((err) => {
  console.error('[generate-og] FAILED', err)
  // Don't fail the build over the OG image — log + carry on.
  process.exit(0)
})
