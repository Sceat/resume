---
name: hunt
description: Autonomous job-hunt cycle (runs on a 6h loop, owner grant 2026-07-29) — source new offers, triage under the house laws, build tailored CVs, submit applications directly via browser automation, park anything requiring Cyril, report only failures/parked items. Use when the loop fires or Cyril says "run a hunt cycle".
---

# /hunt — one autonomous cycle: source → triage → build → apply → report

OWNER GRANT (2026-07-29): Cyril explicitly authorized applying on his behalf
("apply for me directly, run a loop every 6h"). Submissions are outward-facing
and irreversible — the quality bars below are what make the grant safe. When he
checks the chat he reads ONLY: count of successes + ordered list of skips/parks
with reasons.

## Cycle

1. **Source.** Spawn 2 sourcing sensors (worker/sonnet, read-only web): crypto/
   web3 lane + AI-agents lane, per the briefs archived in applications/backlog.md
   header. Each returns verified-live direct ATS URLs. Append new finds to
   `applications/backlog.md`; also fold in any unprocessed rows already there.
   EFFICIENCY LAW: verify liveness/JD via ATS JSON APIs (greenhouse boards-api,
   api.lever.co/v0/postings, api.ashbyhq.com/posting-api) — WebFetch cannot
   render these boards' SPAs and Playwright verification is 10x the cost.
   REMOTE-AWARE LAW (owner 2026-07-29): sensors return ONLY offers that are
   genuinely location-flexible — "remote global/anywhere", or region-scoped in
   a way that includes Cyril. A posting with a country/residence list that
   excludes him is not a find, it's noise; sensors drop it at their level.
   Mysten Labs and SF-timezone Sui roles: permanent wall, never re-source
   (jobs.sui.io is mostly Mysten-orbit — treat with the same suspicion).
2. **Triage** every new offer with the `/apply` laws (dedup vs log.md AND
   backlog.md; office law; timezone law — no mandatory US-Pacific; never-claim
   stack walls; sales/presales shape; degree hard-gates flagged). Log skips
   immediately with reasons.
3. **Build** (NO volume cap — owner 2026-07-29: "no applications limit, even
   50+ if needed"; the quality gates above are the only throttle — a bad-fit
   application burns his name, a good-fit one never waits): for each APPLY
   verdict, compose cv.json per /apply (facts from master.md + corpus/),
   render + verify via a worker lane, eyeball the PDF header.
4. **Apply via browser** (Playwright MCP, ONE browser at a time, close it when
   the cycle ends):
   - Navigate to the form, snapshot, fill from master.md identity: name, email
     fetch@sceat.xyz, phone +380 68 978 1786, location "Remote (UTC+8)",
     website sceat.xyz, GitHub github.com/sceat, LinkedIn: leave blank.
   - Resume: upload the application dir's Cyril-Morlet-Resume.pdf.
   - Salary: within the posted band if one exists, else "100k+ USD".
   - "How did you hear": the actual source (job board name) or "job board".
   - Free-text "why us / why you" questions: generate honestly from the JD +
     master.md in Cyril's voice — simple human sentences, no em-dashes (his
     style law), every claim interview-proof. Save ALL answers given to
     `applications/<dir>/form-answers.md` before submitting (audit trail).
   - EEO/demographic sections: select "Decline to self-identify" variants.
   - Cover letter: only if required; short (≤120 words), same rules.
   - Submit, screenshot the confirmation into the application dir, set log row
     to `sent` with the date.
5. **PARK, never guess** — set status `needs-cyril` and move on when a REQUIRED
   field asks anything not in master.md: work-authorization/visa specifics,
   references, assessments, account creation/login walls, or any claim we can't
   back. CAPTCHA = park immediately (we do not defeat anti-bot systems, ever).
   A parked app keeps its filled-answers file so Cyril can finish in 2 minutes.
6. **Housekeeping**: flag `sent` rows >10 days old as follow-up candidates in
   the report; commit + push everything (git law).
7. **Report format** (owner correction 2026-07-29: "if jobs are not
   remote-aware then why mention them to me"): the cycle report shows ONLY
   actionable items — "`N` submitted" + the list of submissions, then any
   PARKED item with its exact one-minute finish steps. Skipped/region-locked/
   dead offers go to log.md and backlog.md silently, NEVER into the report.
   (Exception: batches Cyril sends by hand still get the full ordered verdict
   list per the /apply format law — he knows those offers exist.)

## Hard rules

- Truth only, everywhere. A gamed knockout answer detonates at offer stage.
- Dedup is sacred: log.md + backlog.md are checked before any fetch/build/apply.
- Never re-submit anything with status `sent`, `needs-cyril`, or unknown-but-
  possibly-submitted (the 6 pre-autopilot CVs: ask Cyril, don't touch).
- Browser teardown at cycle end (browser_close). One browser at a time.
- Worker lanes for all code/json writes (lead edit guard); briefs per rules.
- If the cycle itself errors twice distinctly: stop, leave a clear report,
  don't thrash.
