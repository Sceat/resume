# Master Profile — single source of truth for tailored CVs

Every claim on a generated CV MUST trace back to a fact in this file. Never invent
employers, titles, dates, metrics, tools, or degrees. If a job description wants a
keyword that has no fact here, the CV does not get that keyword — flag the gap to
Cyril instead (he may have unlisted experience to add here).

## Identity

- **Name:** Cyril Morlet
- **Email:** fetch@sceat.xyz
- **Site:** sceat.xyz · **GitHub:** github.com/sceat (orgs: HydreIO, aresrpg)
- **Phone:** intentionally not listed (shared on call) — NOTE: some ATS forms score
  blank phone fields down; ask Cyril per application if he wants it on that CV.
- **LinkedIn:** none known — gap worth flagging; many recruiters filter on it.
- **Location:** Remote · UTC+8 · overlaps EU and APAC working hours (US-East partial)
- **Languages:** French (native), English (fluent), Ukrainian (beginner)
- **Education:** self-taught, no degree, shipping production code since 2014.
  ⚠ Hard knockout for degree-gated postings — always flag in the fit check.
- **Experience:** 12 years programming, production code since 2014, Web3-native since 2018
- **Availability:** immediately available, remote only

## Work history (real titles, real dates — never alter)

### Founder & Solo Engineer — Independent · Oct 2024 – Present · Remote

Portfolio of live products, all designed, built, deployed, and operated solo:

- **Hytale MMORPG server** (Jan 2026 – present, live): custom MMORPG server on top of
  Hytale. Java 25, ~370K LOC, 1,300+ unique players, ~1k MRR, solo-operated.
  Behavior-tree mob AI, anticheat, marketplace, crafting (16 jobs), instance system.
  FalkorDB + Redis Stack, deployed on own Kubernetes cluster, on-call solo.
- **Noxant** (Dec 2025 – present, live, noxant.io): agentic CI/CD on Kubernetes — AI
  agents execute, verify, and publish their own tasks inside Docker-in-Docker
  sandboxes, no human in the loop. TypeScript.
- **AresRPG** (Feb 2024 – present, testnet, aresrpg.world · github.com/aresrpg):
  onchain MMORPG on Sui — leads a team of 3. Characters/items/trades are Sui objects;
  custom Sui→FalkorDB indexer for sub-second gameplay queries against onchain state.
  Sui Move, React 19, Bun, zkLogin, Walrus, Tailwind v4.
- **Talos cluster** (Dec 2025 – present, production): self-hosted Kubernetes on Talos
  OS. 33 Helm releases, 4 domains, GitOps via Helmfile, Cilium, Longhorn, SOPS
  secrets, Cloudflare Tunnels zero-trust ingress. Runs everything above.
- **VersUI**: decentralized Vercel on Sui + Walrus (testnet).
- **AI workflow:** Claude Code daily with multi-agent orchestration — spawns N agents
  per task for implementation/review consensus; built his own agentic infra (Noxant).

### Blockchain Integration Specialist — Bitfinex · Apr 2022 – Oct 2024 · Remote

- Top-tier crypto exchange. Owned end-to-end chain integrations for production
  deposit/withdrawal pipelines (Node.js, TypeScript, Solidity, EVM tooling).
- Integrated multiple L1/L2 blockchain backends into the exchange — including Sui
  (owned the Sui listing) — and maintained existing integrations under production load.
- Owned chain-specific edge cases: reorgs, finality thresholds, fee accounting —
  code where a bug loses real customer funds.

### Fullstack Developer — Affinidi · Jan 2021 – Apr 2022 · Kyiv, Ukraine (remote)

- React + Node.js microservices for self-sovereign identity (SSI) and verifiable
  credential verification. REST APIs, Docker, AWS.
- Worked across distributed teams (EU / Singapore / India).

### CTO & Co-founder — Sidy · Jan 2019 – Jan 2021 · Montpellier, France

- Co-founded; led a 4-engineer team building a real-estate management platform from
  zero to production. Owned architecture, infrastructure, and hiring.

### Software Engineer — Freelance & Open-Source · Jan 2015 – Jan 2021 · France (remote)

- Created and maintains 18+ npm OSS libraries (auth, real-time graphs, transport,
  storage primitives) under the hydre.io org (github.com/HydreIO): auth, rgraph,
  doubt, shimio, disk. Freelance fullstack delivery alongside.

### Older projects

- **Mana Finance** — DeFi yield aggregator (React, Solidity), past.
- **PepeDefense** — onchain tower defense (Solidity, Canvas, Vue 3), past.

## Skills (only claim what's here)

- **Backend:** Node.js (primary, ~10y), TypeScript/JavaScript (primary), Java 25
  (370K-LOC production server), Bun, REST APIs, WebSocket, microservices
- **Frontend:** React 19, Vue 3, Tailwind CSS v4, Three.js, i18n
- **Databases:** FalkorDB (graph), Redis / Redis Stack / Redis TimeSeries, schema &
  database design, custom blockchain indexers
- **Infra/Ops:** Kubernetes, Docker, Docker-in-Docker, Talos OS, Helm, Helmfile,
  Cilium, Longhorn, SOPS, Cloudflare Tunnels, GitOps, CI/CD, AWS, MinIO
- **AI tooling:** Claude Code (daily driver, multi-agent orchestration), agentic
  CI/CD pipelines (built Noxant), context engineering, AI-orchestrated code review.
  Do NOT claim Cursor/Copilot unless Cyril confirms.
- **Web3:** Sui Move, Sui RPC/indexers, zkLogin, Walrus, Solidity, EVM tooling,
  exchange chain integration (deposits/withdrawals/listings)
- Does NOT do (never claim): Golang, Python (unconfirmed), Rust (unconfirmed),
  C++ (unconfirmed), mobile native (unconfirmed) — ask before adding anything.

## Positioning notes

- For exchanges/crypto: lead with Bitfinex + Sui listing + "code where bugs lose funds".
- For AI-flavored roles: lead with Noxant + Claude Code multi-agent workflow — very
  few candidates have BUILT agentic infra rather than just used Copilot.
- For backend roles: lead with Hytale server scale (370K LOC, 1,300+ players, solo).
- For teams/leadership: Sidy (led 4), AresRPG (leads 3), Affinidi (distributed teams).
- "Independent since Oct 2024" must read as _founder shipping live revenue-generating
  products_, never as a gap.
