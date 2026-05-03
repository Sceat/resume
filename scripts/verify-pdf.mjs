/**
 * scripts/verify-pdf.mjs
 *
 * Sanity-checks the generated PDF after `render-pdf.mjs` has run:
 *  - Reads dist/001-CYRIL-MORLET-RESUME.pdf
 *  - Extracts text (pdf-parse)
 *  - Asserts that a set of REQUIRED keywords appear (hard fail if missing)
 *  - Counts matches against a SOFT keyword list (warning only)
 *  - Prints page count, char count, sample, and pass/fail summary
 *
 * Exit code 1 if any required keyword is missing.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pdf = require('pdf-parse')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PDF_FILE = path.join(ROOT, 'dist/001-CYRIL-MORLET-RESUME.pdf')

// ─── Required keywords (hard fail if missing) ───────────────────────────
// Anchors that MUST appear for the PDF to be considered valid.
const REQUIRED = [
  'Cyril Morlet',
  'Senior Fullstack',
  'Bitfinex',
  'Hytale',
  'AresRPG',
  'Talos',
  'Sui',
  'Move',
  'Kubernetes',
  'TypeScript',
  'fetch@sceat.xyz',
]

// ─── Soft keywords (counted, never fail) ────────────────────────────────
const SOFT = [
  'Solo',
  'multi-chain',
  'on-chain',
  'Helm',
  'FalkorDB',
  'Java',
  'Bun',
  'React',
  'Vue',
  'Cilium',
  'Longhorn',
  'GitOps',
  'SOPS',
  'Cloudflare',
  'Redis',
  'WebSocket',
  'zkLogin',
  'Walrus',
  'Affinidi',
  'Sidy',
  'Hydre',
  'Node.js',
  'Solidity',
  'remote',
  'French',
  'English',
  'Experience',
  'Highlighted Projects',
]

async function main() {
  if (!fs.existsSync(PDF_FILE)) {
    console.error('[verify-pdf] FAIL · file not found:', PDF_FILE)
    process.exit(1)
  }

  const buf = fs.readFileSync(PDF_FILE)
  const data = await pdf(buf)
  const text = data.text || ''
  const pages = data.numpages || 0
  const chars = text.length

  console.log(`[verify-pdf] pages=${pages} chars=${chars}`)
  console.log(
    `[verify-pdf] sample: ${JSON.stringify(text.slice(0, 200))}`,
  )

  // Case-insensitive match: the PDF renders the name in uppercase via
  // `.toUpperCase()` on the H1, so a literal `text.includes('Cyril Morlet')`
  // would miss it. Lowercase both sides.
  const haystack = text.toLowerCase()
  const includes = (kw) => haystack.includes(kw.toLowerCase())

  let requiredMatched = 0
  const missing = []
  for (const kw of REQUIRED) {
    if (includes(kw)) requiredMatched++
    else missing.push(kw)
  }

  let softMatched = 0
  for (const kw of SOFT) {
    if (includes(kw)) softMatched++
  }

  console.log(`[verify-pdf] required matched: ${requiredMatched}/${REQUIRED.length}`)
  console.log(`[verify-pdf] soft matched:     ${softMatched}/${SOFT.length}`)
  console.log(
    `[verify-pdf] total matched:    ${requiredMatched + softMatched} (threshold ≥ 20)`,
  )

  if (missing.length) {
    console.error(`[verify-pdf] FAIL · missing required: ${missing.join(', ')}`)
    process.exit(1)
  }

  if (requiredMatched + softMatched < 20) {
    console.error(
      `[verify-pdf] FAIL · total matches (${requiredMatched + softMatched}) below threshold (20)`,
    )
    process.exit(1)
  }

  console.log('[verify-pdf] OK · all gates passed')
}

main().catch((err) => {
  console.error('[verify-pdf] FAILED', err)
  process.exit(1)
})
