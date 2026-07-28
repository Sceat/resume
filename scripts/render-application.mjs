/**
 * scripts/render-application.mjs <application-dir>
 *
 * Renders a tailored, ATS-safe CV from <application-dir>/cv.json to
 * <application-dir>/Cyril-Morlet-Resume.pdf, then VERIFIES it by extracting
 * the text back with two independent parsers (pdf-parse always; poppler
 * pdftotext when installed) and asserting every meta.keyword survives
 * extraction intact. Exits 1 on any failure.
 *
 * ATS-safety rules baked into the template (learned the hard way — the main
 * site PDF embeds Space Grotesk, whose fi/ffi ligatures extract as
 * "Bitfnex" in some parsers, and its terminal preamble parses as the name):
 *  - Helvetica standard-14 fonts only: no embedding, no ligature shaping,
 *    WinAnsi text layer that every extractor reads identically.
 *  - Single column, no icons, no decorative glyphs, no preamble gimmicks —
 *    the first text on the page is the candidate's name.
 *  - Contact line is ONE plain text run so parsers can't fragment it.
 *  - Standard section headers (SUMMARY / SKILLS / EXPERIENCE / ...).
 *  - Human-standard dates: "Apr 2022 – Oct 2024".
 */

import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const PdfPrinter = require('pdfmake')
// Deep import dodges pdf-parse's `!module.parent` debug branch, which
// crashes when required from ESM via createRequire.
const pdfParse = require('pdf-parse/lib/pdf-parse.js')

const PDF_NAME = 'Cyril-Morlet-Resume.pdf'

const COLOR = { fg: '#111111', dim: '#444444', mute: '#666666', rule: '#999999' }

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

// "2022-04" → "Apr 2022" · null/undefined → "Present"
function formatDate(ym) {
  if (!ym) return 'Present'
  const [y, m] = ym.split('-')
  return `${MONTHS[Number(m) - 1]} ${y}`
}

const sectionHeading = (label) => [
  { text: label.toUpperCase(), bold: true, fontSize: 10, margin: [0, 8, 0, 1] },
  {
    canvas: [
      { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: COLOR.rule },
    ],
    margin: [0, 0, 0, 3],
  },
]

function buildDoc(cv) {
  const content = []

  // Header — name FIRST, plain runs, no gimmicks
  content.push({ text: cv.name, bold: true, fontSize: 17, margin: [0, 0, 0, 1] })
  content.push({ text: cv.title, fontSize: 10.5, color: COLOR.dim, margin: [0, 0, 0, 2] })
  // Single text run: fragmentation-proof for every extractor.
  content.push({
    text: [cv.contact.email, cv.contact.phone, ...cv.contact.links, cv.contact.location]
      .filter(Boolean)
      .join('  ·  '),
    fontSize: 9,
    color: COLOR.dim,
    margin: [0, 0, 0, 2],
  })

  content.push(...sectionHeading('Summary'))
  content.push({ text: cv.summary, fontSize: 9.5, margin: [0, 0, 0, 2] })

  content.push(...sectionHeading('Skills'))
  for (const g of cv.skills) {
    content.push({
      text: [{ text: `${g.label}:  `, bold: true }, { text: g.items }],
      fontSize: 9.5,
      margin: [0, 0, 0, 1.5],
    })
  }

  content.push(...sectionHeading('Experience'))
  for (const w of cv.experience) {
    content.push({
      columns: [
        {
          width: '*',
          text: [
            { text: w.role, bold: true },
            { text: ` — ${w.company}`, color: COLOR.dim },
          ],
          fontSize: 10,
        },
        {
          width: 'auto',
          text: `${formatDate(w.from)} – ${formatDate(w.to)}  ·  ${w.location}`,
          fontSize: 9,
          color: COLOR.mute,
          alignment: 'right',
        },
      ],
      margin: [0, 3, 0, 1],
    })
    content.push({
      ul: w.bullets,
      fontSize: 9.5,
      color: COLOR.fg,
      margin: [6, 0, 0, 1],
    })
  }

  if (cv.projects?.length) {
    content.push(...sectionHeading('Selected Projects'))
    for (const p of cv.projects) {
      content.push({
        text: [
          { text: p.name, bold: true },
          { text: ` — ${p.desc}` },
          ...(p.link
            ? [
                { text: '  ·  ', color: COLOR.mute },
                { text: p.link, link: `https://${p.link}`, color: COLOR.dim, decoration: 'underline' },
              ]
            : []),
        ],
        fontSize: 9.5,
        margin: [0, 0, 0, 2],
      })
    }
  }

  content.push(...sectionHeading('Education & Languages'))
  content.push({ text: cv.education, fontSize: 9.5, margin: [0, 0, 0, 1] })
  content.push({ text: `Languages: ${cv.languages}`, fontSize: 9.5 })

  return {
    info: {
      title: `${cv.name} — Resume`,
      author: cv.name,
      subject: `${cv.title} — Resume`,
      keywords: cv.meta.keywords.join(', '),
    },
    pageSize: 'A4',
    pageMargins: [40, 34, 40, 34],
    defaultStyle: { font: 'Helvetica', fontSize: 9.5, color: COLOR.fg, lineHeight: 1.12 },
    content,
  }
}

// ─── Verification ─────────────────────────────────────────────────────────
const normalize = (s) => s.toLowerCase().replace(/\s+/g, ' ')

function checkKeywords(parserName, text, keywords) {
  const haystack = normalize(text)
  const missing = keywords.filter((kw) => !haystack.includes(normalize(kw)))
  if (text.includes('�')) missing.push('<contains U+FFFD replacement chars>')
  if (missing.length) {
    console.error(`[verify:${parserName}] FAIL · not extracted intact: ${missing.join(', ')}`)
    return false
  }
  console.log(`[verify:${parserName}] OK · ${keywords.length}/${keywords.length} keywords extract intact`)
  return true
}

async function verify(outFile, cv) {
  const required = [cv.name, cv.contact.email, ...cv.meta.keywords]
  let ok = true

  const data = await pdfParse(fs.readFileSync(outFile))
  ok = checkKeywords('pdf-parse', data.text || '', required) && ok

  if (data.numpages > 2) {
    console.error(`[verify] FAIL · ${data.numpages} pages — a tailored CV must fit 2 pages max`)
    ok = false
  } else if (data.numpages > 1) {
    console.warn(`[verify] WARN · ${data.numpages} pages — aim for 1`)
  }

  const poppler = spawnSync('pdftotext', [outFile, '-'], { encoding: 'utf8' })
  if (poppler.status === 0) {
    ok = checkKeywords('pdftotext', poppler.stdout, required) && ok
    const firstLine = poppler.stdout.split('\n').find((l) => l.trim())
    if (firstLine && !normalize(firstLine).includes(normalize(cv.name))) {
      console.error(`[verify] FAIL · first extracted line is ${JSON.stringify(firstLine)}, not the candidate name`)
      ok = false
    }
  } else {
    console.warn('[verify] pdftotext not available — poppler cross-check skipped')
  }

  return ok
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  const dir = process.argv[2]
  if (!dir) {
    console.error('usage: node scripts/render-application.mjs <application-dir>')
    process.exit(1)
  }
  const cvFile = path.resolve(dir, 'cv.json')
  const cv = JSON.parse(fs.readFileSync(cvFile, 'utf8'))
  const outFile = path.resolve(dir, PDF_NAME)

  const printer = new PdfPrinter({
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  })
  const pdfDoc = printer.createPdfKitDocument(buildDoc(cv))
  const stream = fs.createWriteStream(outFile)
  pdfDoc.pipe(stream)
  pdfDoc.end()
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve)
    stream.on('error', reject)
  })

  const sizeKB = (fs.statSync(outFile).size / 1024).toFixed(1)
  console.log(`[render] ${outFile} · ${sizeKB} KB`)

  const ok = await verify(outFile, cv)
  if (!ok) process.exit(1)
  console.log('[render-application] OK · rendered and verified')
}

main().catch((err) => {
  console.error('[render-application] FAILED', err)
  process.exit(1)
})
