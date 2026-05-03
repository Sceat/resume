/**
 * Content schema — JSDoc types shared by web (src/views/home.vue) and PDF
 * (scripts/render-pdf.mjs). Every content module under src/content/* conforms
 * to one of these shapes. Single source of truth.
 */

export interface Profile {
  name: string
  title: string
  email: string
  site: string
  github: string
  /** PDF only — privacy: not rendered on web */
  phone?: string
  location: string
  languages: { name: string; level: string }[]
  status: { availability: string; remote: boolean; ecosystem: string }
}

export interface WorkEntry {
  company: string
  role: string
  /** ISO YYYY-MM strings; `to: null` means current */
  period: { from: string; to: string | null }
  location: string
  remote: boolean
  bullets: string[]
  url?: string
}

export type FlagshipId = 'bitfinex' | 'hytale' | 'aresrpg' | 'talos'
export type FlagshipStatus = 'live' | 'production' | 'testnet' | 'past'

export interface FlagshipProof {
  label: string
  href?: string
  /** Long string (e.g. contract address) shown truncated, click to copy */
  copyValue?: string
}

export interface Flagship {
  id: FlagshipId
  order: number
  eyebrow: string
  title: string
  oneLiner: string
  problem: string
  /** Metric chips shown in the scale row */
  scale: string[]
  stack: string[]
  role: string
  status: FlagshipStatus
  /** 2-3 outcome bullets */
  outcome: string[]
  proof: FlagshipProof[]
  /** Human-readable date range, e.g. 'jan 2024 — present · 16 months' */
  dates: string
  /** CSS data-accent value, matches selectors in src/styles/index.css */
  accent: FlagshipId
}

export interface Project {
  name: string
  tagline: string
  stack: string[]
  status: string
  link?: string
  proof?: { suiscan?: string; npm?: string; github?: string }
}

export interface Lib {
  name: string
  tagline: string
  url: string
}

export interface SkillItem {
  name: string
  /** True for primary/headline skills in a group */
  primary?: boolean
}

export interface SkillGroup {
  name: string
  items: SkillItem[]
}

export interface Skills {
  primary: string
  alsoFluent: string[]
  groups: SkillGroup[]
}
