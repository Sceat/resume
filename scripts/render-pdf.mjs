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
const OUT_FILE = path.join(OUT_DIR, '001-CYRIL-MORLET-RESUME.pdf')

const COLOR = {
  fg: '#0b1220',
  fgDim: '#475569',
  fgMute: '#64748b',
  link: '#2563eb',
  accent: '#1d4ed8',
  rule: '#cbd5e1',
}

// ─── Font resolution ─────────────────────────────────────────────────────
function resolveFonts() {
  const candidates = {
    SpaceGrotesk: {
      normal: ['SpaceGrotesk-Regular.ttf', 'SpaceGrotesk-Regular.otf'],
      bold: ['SpaceGrotesk-Bold.ttf', 'SpaceGrotesk-Bold.otf'],
      italics: ['SpaceGrotesk-Regular.ttf'],
      bolditalics: ['SpaceGrotesk-Bold.ttf'],
    },
    JetBrainsMono: {
      normal: ['JetBrainsMono-Regular.ttf', 'JetBrainsMono-Regular.otf'],
      bold: ['JetBrainsMono-Bold.ttf', 'JetBrainsMono-Bold.otf'],
      italics: ['JetBrainsMono-Italic.ttf'],
      bolditalics: ['JetBrainsMono-BoldItalic.ttf'],
    },
  }

  const pickFirstExisting = (files) => {
    for (const f of files) {
      const p = path.join(FONT_DIR, f)
      if (fs.existsSync(p)) return p
    }
    return null
  }

  const sansPaths = {
    normal: pickFirstExisting(candidates.SpaceGrotesk.normal),
    bold: pickFirstExisting(candidates.SpaceGrotesk.bold),
    italics: pickFirstExisting(candidates.SpaceGrotesk.italics),
    bolditalics: pickFirstExisting(candidates.SpaceGrotesk.bolditalics),
  }
  const monoPaths = {
    normal: pickFirstExisting(candidates.JetBrainsMono.normal),
    bold: pickFirstExisting(candidates.JetBrainsMono.bold),
    italics: pickFirstExisting(candidates.JetBrainsMono.italics),
    bolditalics: pickFirstExisting(candidates.JetBrainsMono.bolditalics),
  }

  if (!sansPaths.normal || !monoPaths.normal) {
    console.log(
      '[render-pdf] Self-hosted fonts not found in src/assets/fonts/, falling back to Helvetica + Courier.',
    )
    return {
      defs: {
        Sans: { normal: 'Helvetica', bold: 'Helvetica-Bold' },
        Mono: { normal: 'Courier', bold: 'Courier-Bold' },
      },
      embedded: false,
    }
  }
  return { defs: { Sans: sansPaths, Mono: monoPaths }, embedded: true }
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
  margin: [0, 2, 0, 4],
})

const sectionHeading = (label) => ({
  text: label.toUpperCase(),
  style: 'h2',
  margin: [0, 8, 0, 2],
})

function formatPeriod(period) {
  const to = period.to || 'present'
  return `${period.from} — ${to}`
}

// ─── Document sections ───────────────────────────────────────────────────
function buildHeader() {
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
        margin: [0, 0, 0, 4],
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
        text: [
          dim(`${profile.location.city}, ${profile.location.country}`),
          dim('  ·  '),
          dim(profile.languages.map((l) => `${l.name} (${l.level})`).join(', ')),
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
      margin: [0, 4, 0, 2],
    })
    const bullets = w.bullets.slice(0, 1)
    out.push({
      ul: bullets,
      style: 'bullet',
      margin: [4, 0, 0, 2],
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
      margin: [0, 0, 0, 3],
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
    margin: [0, 0, 0, 6],
  })
  out.push({
    columns: skills.groups.map((g) => ({
      width: '*',
      stack: [
        {
          text: g.name.toUpperCase(),
          style: 'h3',
          color: COLOR.accent,
          margin: [0, 0, 0, 2],
        },
        ...g.items.map((it) => ({
          text: it.name,
          style: 'body',
          color: it.primary ? COLOR.fg : COLOR.fgDim,
          bold: !!it.primary,
        })),
      ],
    })),
    columnGap: 12,
  })
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
      margin: [0, 0, 0, 2],
    })
  }
  return out
}

// ─── Doc definition ─────────────────────────────────────────────────────
async function buildDocDefinition() {
  const content = [
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
    pageMargins: [36, 32, 36, 32],
    defaultStyle: {
      font: 'Sans',
      fontSize: 9.5,
      color: COLOR.fg,
      lineHeight: 1.22,
    },
    styles: {
      h1: { font: 'Sans', fontSize: 22, bold: true, color: COLOR.fg },
      h2: {
        font: 'Sans',
        fontSize: 10,
        bold: true,
        color: COLOR.accent,
        characterSpacing: 1,
      },
      h3: { font: 'Sans', fontSize: 9, bold: true, characterSpacing: 0.5 },
      mono: { font: 'Mono', fontSize: 8.5 },
      body: { font: 'Sans', fontSize: 9.5 },
      bullet: { font: 'Sans', fontSize: 9.5, color: COLOR.fgDim },
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
  const stream = fs.createWriteStream(OUT_FILE)
  pdfDoc.pipe(stream)
  pdfDoc.end()

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve)
    stream.on('error', reject)
  })

  const sizeKB = (fs.statSync(OUT_FILE).size / 1024).toFixed(1)
  const fontTag = fonts.embedded
    ? 'fonts=embedded(SpaceGrotesk+JetBrainsMono)'
    : 'fonts=fallback(Helvetica+Courier)'
  console.log(`[render-pdf] OK · ${OUT_FILE} · ${sizeKB} KB · ${fontTag}`)
}

main().catch((err) => {
  console.error('[render-pdf] FAILED', err)
  process.exit(1)
})
