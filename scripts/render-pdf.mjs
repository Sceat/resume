/**
 * scripts/render-pdf.mjs
 *
 * Programmatic PDF generation via pdfmake.
 * Single source of truth: imports from src/content/* (same modules the web uses).
 *
 * Output: dist/001-CYRIL-MORLET-RESUME.pdf
 *
 * Layout: single A4 page, ATS-friendly.
 *  - Header (name, title, contact, location/languages)
 *  - Experience (1 bullet per role)
 *  - Highlighted Projects (one-liner per flagship + proof links)
 *  - Skills (4-column matrix + headline primary/also-fluent line)
 *  - More Projects (one-liner per project)
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

import { profile } from '../src/content/profile.js'
import { work } from '../src/content/work.js'
import { flagships } from '../src/content/flagships.js'
import { projects } from '../src/content/projects.js'
import { skills } from '../src/content/skills.js'

const require = createRequire(import.meta.url)
const PdfPrinter = require('pdfmake')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const FONT_DIR = path.join(ROOT, 'src/assets/fonts')
const OUT_DIR = path.join(ROOT, 'dist')
const PUBLIC_DIR = path.join(ROOT, 'public')
const PDF_NAME = '001-CYRIL-MORLET-RESUME.pdf'
const OUT_FILE = path.join(OUT_DIR, PDF_NAME)
// Also written to public/ so the dev server can serve /001-... at root
// without needing a full `npm run build` first.
const PUBLIC_FILE = path.join(PUBLIC_DIR, PDF_NAME)

const COLOR = {
  fg: '#0b1220',
  fgDim: '#475569',
  fgMute: '#64748b',
  link: '#3b82f6',
  accent: '#3b82f6',
  accentLight: '#60a5fa',
  accentGlow: '#93c5fd',
  rule: '#dbeafe',
}

// Per-flagship accent — mirrors the site's [data-accent] overrides.
// Falls back to COLOR.accent if a flagship lacks an entry.
const FLAGSHIP_COLOR = {
  bitfinex: '#fbbf24',
  hytale: '#818cf8',
  aresrpg: '#38bdf8',
  talos: '#34d399',
}

// Brand gradient for the top stripe — site primary-deep → sky.
const BRAND_GRADIENT = ['#3b82f6', '#38bdf8']

// ─── Font resolution ─────────────────────────────────────────────────────
// pdfmake/fontkit needs static TTFs to embed (woff2 trips a known
// subsetting bug in @foliojs-fork/fontkit). The browser uses the woff2 copies
// from public/fonts/; these TTFs are PDF-only. The latin subsets don't ship
// italic variants — italics map to regular, bold-italics to bold. The few
// `italics: true` styles in this doc are decorative and read fine upright.
// Web fonts include a 600 weight (used by some headings); the PDF only loads
// regular + 700 because no PDF text renders at 600.
function resolveFonts() {
  const file = (name) => {
    const p = path.join(FONT_DIR, name)
    if (!fs.existsSync(p)) {
      throw new Error(`[render-pdf] missing font file: ${p}`)
    }
    return p
  }

  const sansRegular = file('space-grotesk-v22-latin-regular.ttf')
  const sansBold = file('space-grotesk-v22-latin-700.ttf')
  const monoRegular = file('jetbrains-mono-v24-latin-regular.ttf')
  const monoBold = file('jetbrains-mono-v24-latin-700.ttf')

  return {
    defs: {
      Sans: {
        normal: sansRegular,
        bold: sansBold,
        italics: sansRegular,
        bolditalics: sansBold,
      },
      Mono: {
        normal: monoRegular,
        bold: monoBold,
        italics: monoRegular,
        bolditalics: monoBold,
      },
    },
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0, 10)

const dim = (text) => ({ text, color: COLOR.fgDim })

const link = (text, href) => ({
  text,
  link: href,
  color: COLOR.link,
  decoration: 'underline',
})

const hr = () => ({
  canvas: [
    { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: COLOR.rule },
  ],
  margin: [0, 1, 0, 2],
})

const sectionHeading = (label) => ({
  text: [
    { text: '▸ ', color: COLOR.accentLight },
    { text: label.toUpperCase() },
  ],
  style: 'h2',
  margin: [0, 5, 0, 1],
})

function formatPeriod(period) {
  const to = period.to || 'present'
  return `${period.from} — ${to}`
}

// ─── Document sections ───────────────────────────────────────────────────
function buildHeader() {
  // Drive language emphasis from the data: native/fluent → bold accent,
  // anything else → muted. Survives content edits without touching layout.
  const HIGHLIGHT_LEVELS = new Set(['native', 'fluent'])
  const languageNodes = []
  profile.languages.forEach((l, i) => {
    if (i > 0) {
      languageNodes.push({ text: '  ·  ', color: COLOR.fgMute })
    }
    const isHighlight = HIGHLIGHT_LEVELS.has(l.level)
    languageNodes.push({
      text: `${l.name} (${l.level})`,
      color: isHighlight ? COLOR.accent : COLOR.fgMute,
      bold: isHighlight,
    })
  })

  return {
    stack: [
      {
        text: profile.name.toUpperCase(),
        style: 'h1',
        margin: [0, 0, 0, 2],
      },
      {
        text: `${profile.title} · Sui Move · Web3`,
        style: 'mono',
        color: COLOR.fgDim,
        margin: [0, 0, 0, 2],
      },
      {
        text: [
          link(profile.email, `mailto:${profile.email}`),
          dim('  ·  '),
          link(profile.site, `https://${profile.site}`),
          dim('  ·  '),
          link(
            `github.com/${profile.github.replace(/^@/, '')}`,
            `https://github.com/${profile.github.replace(/^@/, '')}`,
          ),
        ],
        style: 'mono',
        fontSize: 9,
        margin: [0, 0, 0, 2],
      },
      {
        text: dim(profile.location),
        style: 'mono',
        fontSize: 9,
        margin: [0, 0, 0, 1],
      },
      {
        text: [
          { text: 'Languages   ', color: COLOR.fgDim, fontSize: 8.5 },
          ...languageNodes,
        ],
        style: 'mono',
        fontSize: 9,
      },
    ],
  }
}

function buildExperience() {
  const out = [sectionHeading('Experience'), hr()]
  for (const w of work) {
    out.push({
      columns: [
        {
          width: '*',
          text: [
            { text: w.role, bold: true, color: COLOR.fg },
            { text: '  ·  ', color: COLOR.fgMute },
            { text: w.company, color: COLOR.accent },
          ],
          style: 'body',
        },
        {
          width: 'auto',
          stack: [
            {
              text: formatPeriod(w.period),
              style: 'mono',
              fontSize: 9,
              color: COLOR.fgDim,
              alignment: 'right',
            },
            {
              text: `${w.location}${w.remote ? ' · remote' : ' · in-office'}`,
              style: 'mono',
              fontSize: 8,
              color: COLOR.fgMute,
              alignment: 'right',
            },
          ],
        },
      ],
      margin: [0, 3, 0, 1],
    })
    const bullets = w.bullets.slice(0, 1)
    out.push({
      ul: bullets,
      style: 'bullet',
      margin: [4, 0, 0, 1],
    })
  }
  return out
}

function buildHighlightedProjects() {
  const out = [sectionHeading('Highlighted Projects'), hr()]
  for (const f of flagships) {
    out.push({
      stack: [
        {
          text: [
            {
              text: '■ ',
              color: FLAGSHIP_COLOR[f.id] || COLOR.accent,
            },
            { text: f.title, bold: true, color: COLOR.fg },
            { text: '  —  ', color: COLOR.fgMute },
            { text: f.oneLiner, color: COLOR.fgDim },
          ],
          style: 'body',
          margin: [0, 0, 0, 1],
        },
        f.proof.length
          ? {
              text: f.proof.map((p, i) => {
                const node = p.href
                  ? link(p.label, p.href)
                  : { text: p.label, color: COLOR.fg }
                return i === 0 ? node : { text: ['  ·  ', node] }
              }),
              style: 'mono',
              fontSize: 9,
            }
          : { text: '', margin: [0, 0, 0, 0] },
      ],
      margin: [0, 0, 0, 2],
    })
  }
  return out
}

function buildSkills() {
  const out = [sectionHeading('Skills'), hr()]
  out.push({
    text: [
      { text: 'Primary: ', bold: true, color: COLOR.fg },
      { text: skills.primary, color: COLOR.fg },
      { text: '   ·   Also fluent: ', color: COLOR.fgDim },
      { text: skills.alsoFluent.join(', '), color: COLOR.fg },
    ],
    style: 'body',
    margin: [0, 0, 0, 2],
  })
  for (const g of skills.groups) {
    out.push({
      text: [
        {
          text: `${g.name.toUpperCase()}  `,
          style: 'h3',
          color: COLOR.accentLight,
        },
        ...g.items.flatMap((it, i) => {
          const sep = i === 0 ? [] : [{ text: ', ', color: COLOR.fgMute }]
          return [
            ...sep,
            {
              text: it.name,
              color: it.primary ? COLOR.fg : COLOR.fgDim,
              bold: !!it.primary,
            },
          ]
        }),
      ],
      style: 'body',
      margin: [0, 0, 0, 1],
    })
  }
  return out
}

function buildMoreProjects() {
  const out = [sectionHeading('More Projects'), hr()]
  for (const p of projects) {
    out.push({
      text: [
        { text: p.name, bold: true, color: COLOR.fg },
        { text: '  —  ', color: COLOR.fgMute },
        { text: p.tagline, color: COLOR.fgDim },
        { text: '  ·  ', color: COLOR.fgMute },
        { text: p.status, color: COLOR.fgMute, italics: true },
      ],
      style: 'body',
      margin: [0, 0, 0, 1],
    })
  }
  return out
}

// ─── Doc definition ─────────────────────────────────────────────────────
async function buildDocDefinition() {
  // Brand stripe: thin gradient bar spanning the content width
  // (A4 595 − pageMargins 32+32 = 531). Mirrors the site's primary→sky
  // signature without committing to SVG-embedded font shenanigans.
  const brandStripe = {
    canvas: [
      {
        type: 'rect',
        x: 0,
        y: 0,
        w: 531,
        h: 3,
        linearGradient: BRAND_GRADIENT,
      },
    ],
    margin: [0, 0, 0, 4],
  }

  // Terminal preamble — ties the doc to the site's terminal aesthetic.
  const terminalPreamble = {
    text: '~ %  cat cyril-morlet.cv',
    style: 'mono',
    fontSize: 8.5,
    color: COLOR.fgDim,
    margin: [0, 0, 0, 1],
  }

  const content = [
    brandStripe,
    terminalPreamble,
    buildHeader(),
    ...buildExperience(),
    ...buildHighlightedProjects(),
    ...buildSkills(),
    ...buildMoreProjects(),
  ]

  return {
    info: {
      title: 'Cyril Morlet — Resume',
      author: 'Cyril Morlet',
      subject: 'Senior Fullstack Engineer Resume',
      keywords:
        'Sui, Move, Kubernetes, Bitfinex, TypeScript, Vue, Web3, FalkorDB, Hytale, AresRPG, Talos, Node.js, Java, Solidity',
      creator: 'pdfmake (sceat.xyz portfolio build)',
      producer: 'pdfmake',
    },
    pageSize: 'A4',
    pageMargins: [32, 22, 32, 22],
    defaultStyle: {
      font: 'Sans',
      fontSize: 9,
      color: COLOR.fg,
      lineHeight: 1.1,
    },
    styles: {
      h1: { font: 'Sans', fontSize: 20, bold: true, color: COLOR.accent },
      h2: {
        font: 'Sans',
        fontSize: 9.5,
        bold: true,
        color: COLOR.accent,
        characterSpacing: 1,
      },
      h3: { font: 'Sans', fontSize: 8.5, bold: true, characterSpacing: 0.5 },
      mono: { font: 'Mono', fontSize: 8 },
      body: { font: 'Sans', fontSize: 9 },
      bullet: { font: 'Sans', fontSize: 9, color: COLOR.fgDim },
    },
    content,
    footer: (currentPage, pageCount) => ({
      columns: [
        {
          text: [
            { text: 'see live: ', color: COLOR.fgMute },
            { text: 'sceat.xyz', color: COLOR.link, link: 'https://sceat.xyz' },
            { text: `  ·  last updated ${today()}`, color: COLOR.fgMute },
          ],
          style: 'mono',
          fontSize: 8,
          alignment: 'left',
          margin: [40, 12, 0, 0],
        },
        {
          text: `${currentPage} / ${pageCount}`,
          style: 'mono',
          fontSize: 8,
          alignment: 'right',
          margin: [0, 12, 40, 0],
          color: COLOR.fgMute,
        },
      ],
    }),
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  const fonts = resolveFonts()
  const printer = new PdfPrinter(fonts.defs)
  const doc = await buildDocDefinition()
  const pdfDoc = printer.createPdfKitDocument(doc)

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true })

  const stream = fs.createWriteStream(OUT_FILE)
  pdfDoc.pipe(stream)
  pdfDoc.end()

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve)
    stream.on('error', reject)
  })

  // Mirror the PDF into public/ so the dev server (which only serves
  // public/ + the built dist) can resolve `/001-CYRIL-MORLET-RESUME.pdf`
  // at the root without a full Vite build.
  fs.copyFileSync(OUT_FILE, PUBLIC_FILE)

  const sizeKB = (fs.statSync(OUT_FILE).size / 1024).toFixed(1)
  console.log(
    `[render-pdf] OK · ${OUT_FILE} · ${sizeKB} KB · fonts=embedded(SpaceGrotesk+JetBrainsMono)`,
  )
  console.log(`[render-pdf] mirrored to ${PUBLIC_FILE}`)
}

main().catch((err) => {
  console.error('[render-pdf] FAILED', err)
  process.exit(1)
})
