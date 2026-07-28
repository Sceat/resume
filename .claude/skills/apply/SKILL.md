---
name: apply
description: Tailor Cyril's CV to a specific job offer — fetch the JD, run an honest fit check, generate an ATS-safe PDF from the master profile, verify text extraction with two parsers, and log the application. Use whenever the user sends a job offer URL or pasted job description.
---

# /apply — one job offer → one tailored, verified CV

Input: a job offer URL or pasted JD text.

## Process

1. **Extract the JD.** WebFetch the URL (ask for a paste if blocked). Capture: exact
   job title, company, hard requirements (degree, location, visa, seniority,
   must-have tech), keywords, and the JD's own phrasing — mirror exact spellings
   ("Node.js" vs "NodeJS", "CI/CD" vs "CICD"). Identify the ATS from the apply
   URL (myworkdayjobs.com = Workday · boards.greenhouse.io = Greenhouse ·
   jobs.lever.co = Lever · taleo.net = Taleo) and note it in the report — Taleo
   recruiters lean on literal Boolean keyword search (exact JD terms critical);
   Greenhouse has no algorithmic scoring (humans + scorecards); Workday is
   structured-fields-first (the form data matters as much as the PDF).
2. **Fit check FIRST.** Compare hard requirements against `applications/master.md`.
   Report knockouts honestly (degree gates, student-only programs, required tech he
   lacks) BEFORE polishing prose — a tailored CV cannot beat a knockout filter, and
   knowing the odds tells Cyril where to spend energy. Verdict: strong / stretch /
   knockout.
3. **Compose** `applications/<yyyy-mm>-<company>-<role-slug>/cv.json` (schema: copy
   an existing application's cv.json):
   - Facts ONLY from `applications/master.md` — never invent skills, dates, metrics,
     titles, tools, or degrees. A JD keyword with no supporting fact = flag the gap
     to Cyril, don't fake it.
   - Mine `applications/corpus/` (per-project evidence: subsystems, metrics, full
     tech inventory) for JD-relevant depth; promote any newly-claimed fact to
     master.md in the same change.
   - Mirror the JD title in the CV `title` line; reorder skills groups and pick
     bullets by JD priority; lead the summary with what the JD leads with.
   - `meta.keywords` = the JD terms this CV targets. Each must genuinely appear in
     the CV content — the renderer hard-fails otherwise (anti-fabrication gate).
   - Keyword placement (researched 2026-07-28): primary JD terms appear 2–3× in
     DIFFERENT contexts (summary + an achievement bullet + skills line); secondary
     terms ≥1×; never stuff (repetition without context triggers manipulation
     flags in modern semantic ATS). Spell out acronym + short form once for key
     terms when the JD uses either ("Kubernetes (K8s)"). Role titles must stay
     recruiter-searchable standard ("Senior Full Stack Engineer", not creative
     variants) — recruiters find candidates by SEARCHING parsed titles/skills,
     not by scrolling.
   - Aim to honestly cover ~75% of the JD's requirement terms; list the uncovered
     ones in the report as gaps.
   - 3–4 bullets for recent roles, fewer for older ones; aim for 1 page.
4. **Render + verify:** `node scripts/render-application.mjs applications/<dir>` —
   produces `Cyril-Morlet-Resume.pdf` and hard-fails unless every keyword extracts
   intact from the PDF via two independent parsers (pdf-parse + poppler pdftotext).
   Note: the lead's edit guard blocks code/json writes — route cv.json (and any
   script fix) through a worker lane with the exact content in the brief.
5. **Log it.** Add a row to `applications/log.md`. Update `Status` when Cyril
   reports back (sent / interview / rejected / ghosted).
6. **Commit + push** (git law), then report to Cyril: PDF path, fit verdict,
   keyword coverage + gaps, detected ATS platform, and suggested answers for the
   FORM questions — the knockout questions (work authorization, location, years
   of experience, salary, notice) are the single biggest auto-reject filter,
   bigger than anything on the resume. Defaults from master.md: immediately
   available · remote UTC+8 · salary 100k+ USD. Answers must be truthful; a
   gamed knockout answer detonates at offer stage.

## Cyril's applying checklist (paste into the report when relevant)

- Apply EARLY — recruiters work pools on a rolling basis; some roles close once
  enough strong candidates are in.
- On Workday: it will autofill from the PDF and often garble it — manually verify
  every field (titles, dates, employers); the parsed structured fields are what
  recruiters query, not the PDF.
- Fill ALL optional structured fields (skills, links); blank fields lose searches.
- If a portal explicitly prefers DOC/DOCX (common on Taleo): tell Claude — we'll
  add a DOCX render target that day, not speculatively before.

## Template rules (enforced by scripts/render-application.mjs — don't bypass)

- Truth only. The CV must survive a reference check and a live interview.
- Single column, Helvetica standard fonts (no embedding → no ligature corruption:
  the old site PDF extracted "Bitfinex" as "Bitfnex" in some parsers), no icons, no
  decorative glyphs, no terminal-preamble gimmicks — the first text on the page is
  the name. Contact line is one plain text run.
- 1 page target, 2 pages hard max.
- Never edit the main site PDF (`dist/001-…`) for an application; per-offer CVs
  live in `applications/` only.

## Pipeline hygiene

- `applications/log.md` is the pipeline: at session start, mention stale `sent`
  rows older than ~10 days as follow-up candidates.
- After a rejection/interview, record the signal (which CV version, any feedback)
  in the log row — the process improves per iteration.
