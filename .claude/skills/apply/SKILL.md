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
   ("Node.js" vs "NodeJS", "CI/CD" vs "CICD").
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
   - 3–4 bullets for recent roles, fewer for older ones; aim for 1 page.
4. **Render + verify:** `node scripts/render-application.mjs applications/<dir>` —
   produces `Cyril-Morlet-Resume.pdf` and hard-fails unless every keyword extracts
   intact from the PDF via two independent parsers (pdf-parse + poppler pdftotext).
   Note: the lead's edit guard blocks code/json writes — route cv.json (and any
   script fix) through a worker lane with the exact content in the brief.
5. **Log it.** Add a row to `applications/log.md`. Update `Status` when Cyril
   reports back (sent / interview / rejected / ghosted).
6. **Commit + push** (git law), then report to Cyril: PDF path, fit verdict,
   keyword coverage, and suggested answers for common ATS form fields (why-company
   pitch in 2 sentences, notice period: immediately available, location: remote
   UTC+8, salary expectation: ask Cyril — never guess one).

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
