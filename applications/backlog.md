# Sourcing backlog — offers found by /hunt sensors, not yet triaged/applied

Statuses: `new` → `applying` → moved to log.md as sent/parked/skipped.
Dedup: /hunt checks THIS file and log.md before fetching or building anything.
Sensor briefs live in .claude/skills/hunt/SKILL.md (crypto/web3 lane + AI lane;
verified-live direct ATS URLs only; remote-only, no US-Pacific mandatory hours,
no Golang/mobile/sales roles).

## AI lane (sourced 2026-07-29)

| Offer                               | Company               | URL                                                                        | Remote note                            | Status                        |
| ----------------------------------- | --------------------- | -------------------------------------------------------------------------- | -------------------------------------- | ----------------------------- |
| AI Engineer, Agent Infrastructure   | Zed                   | https://jobs.ashbyhq.com/zedfinancial/f6f294eb-5659-46d0-a9c6-480e6eb4852b | ONSITE SF (aggregator lied)            | skipped (office law)          |
| Agent Engineer [IC4]                | Sourcegraph           | https://job-boards.greenhouse.io/sourcegraph91/jobs/6103567004             | remote, EU/NA pref, 20h/wk EST overlap | sent (Cyril, 2026-07-29)      |
| Senior Applied AI Engineer          | Bolt.new (StackBlitz) | https://job-boards.greenhouse.io/stackblitz/jobs/4005254009                | fully remote, global                   | sent (2026-07-29)             |
| AI Platform Engineer                | Duvo Inc              | https://jobs.ashbyhq.com/duvo/a1e5cdbc-6159-4895-8dae-cf71196550fa         | EU/UK remote                           | sent (2026-07-29)             |
| Agent Platform Engineer             | Viktor                | https://jobs.ashbyhq.com/viktor/97fbbc0e-1e2f-4e7e-a8c0-8930c0cdc63d       | id not on board                        | dead                          |
| Engineer, Applied AI                | Zapier                | https://jobs.ashbyhq.com/zapier/38434b88-086c-424b-8d18-8d006e0b71b8       | id not on board                        | dead                          |
| Staff AI Engineer, Agentic Platform | ShiftKey              | https://jobs.ashbyhq.com/shiftkey/2d49484b-f266-4250-a24c-013d8e274559     | US-only                                | skip-candidate (US-only)      |
| Staff SWE, Agent Engineering        | TRM Labs              | https://jobs.ashbyhq.com/trm-labs/eb560943-3adb-4839-bf64-4cbdeee9ae57     | US-only                                | skip-candidate (US-only)      |
| Senior AI Engineer                  | SecurityScorecard     | https://job-boards.greenhouse.io/securityscorecard/jobs/7776439            | US-only + degree req                   | skip-candidate                |
| AI Infrastructure Engineer          | Percepta              | https://jobs.ashbyhq.com/percepta/c6f9f5f0-0e66-4f1d-9f8e-87ca4de2bdad     | remote policy unverified               | new                           |
| AI Engineer                         | Cresteo               | https://job-boards.greenhouse.io/cresteo/jobs/4696028005                   | LatAm remote, Python-lead              | skip-candidate (region+stack) |

## Web3 lane (sourced 2026-07-29)

| Offer                                             | Company                  | URL                                                                          | Remote note                | Status                                                       |
| ------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------ |
| Senior Software Engineer – AI Infrastructure      | Kraken                   | https://jobs.ashbyhq.com/kraken.com/d62250a9-363c-43b0-b3de-958e3cc9f97b     | global remote              | verify-at-apply (API-opaque; browser-verified live 07-29 AM) |
| Senior Software Engineer - Rust, Payward Services | Kraken                   | https://jobs.ashbyhq.com/kraken.com/d6d4cda0-81c5-4b88-9af5-f3bc1d48e1bc     | UK/LatAm/EU remote (no US) | verify-at-apply (API-opaque; browser-verified live 07-29 AM) |
| Senior Backend Engineer                           | Offchain Labs (Arbitrum) | https://jobs.lever.co/offchainlabs/82c41afd-b4be-40d2-8bc2-3f299ced3c4a      | global remote (not CA/CO)  | skipped (extensive Go/C++/Rust core req)                     |
| Senior Backend Engineer, Rust                     | Offchain Labs (Arbitrum) | https://jobs.lever.co/offchainlabs/163e72c9-cf90-406a-9311-6ee1d743ae84      | global remote (not CA/CO)  | sent (2026-07-29)                                            |
| Senior Software Engineer, Developer Platform      | Offchain Labs (Arbitrum) | https://jobs.lever.co/offchainlabs/ea44f500-981b-4d7e-9203-3ada1dc12365      | global remote (not CA/CO)  | skipped (Go-core KMS role)                                   |
| Senior Software Engineer, Chainlink Runtime       | Chainlink Labs           | https://jobs.ashbyhq.com/chainlink-labs/c50cdb85-2ccd-40dd-9333-3958b2408c97 | EU-wide remote             | verify-at-apply (API-opaque; browser-verified live 07-29 AM) |
| Member of Technical Staff, Custody (Backend)      | Anchorage Digital        | https://jobs.lever.co/anchorage/0853654f-cbaf-4cf0-82a5-16e7ef922b58         | US/BR/AR/PT/CA only        | skip-candidate (region)                                      |
| Senior Software Engineer, Data Products           | Chainlink Labs           | https://jobs.ashbyhq.com/chainlink-labs/1be78220-f909-4d03-ac4c-cf7f3b62f236 | Americas-only              | skip-candidate (region)                                      |

## Sensor efficiency law (learned 2026-07-29)

WebFetch cannot render Ashby/Lever/SPA-Greenhouse boards. Sourcing sensors MUST
verify liveness via the ATS JSON APIs, not browsers: Greenhouse
`boards-api.greenhouse.io/v1/boards/<org>/jobs`, Lever
`api.lever.co/v0/postings/<org>`, Ashby
`api.ashbyhq.com/posting-api/job-board/<org>`. Playwright only as last resort.

## Known walls (never re-source)

- Mysten Labs — requires San Francisco timezone (owner, prior attempt).
