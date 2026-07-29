# Master Profile — single source of truth for tailored CVs

Every claim on a generated CV MUST trace back to a fact in this file. Never invent
employers, titles, dates, metrics, tools, or degrees. If a job description wants a
keyword that has no fact here, the CV does not get that keyword — flag the gap to
Cyril instead (he may have unlisted experience to add here).

## Identity

- **Name:** Cyril Morlet
- **Email:** fetch@sceat.xyz
- **Site:** sceat.xyz · **GitHub:** github.com/sceat (orgs: HydreIO, aresrpg)
- **Phone:** +380 68 978 1786 (owner-confirmed 2026-07-28 — include on CVs and ATS forms)
- **LinkedIn:** none (owner-confirmed 2026-07-28) — leave the field blank, never invent one.
- **Salary expectation (owner 2026-07-29):** acceptable range 70k–300k+ USD —
  never skip an offer on salary in that range. Form answers: within the posted
  band when one exists, else "USD 100,000+"; the 70k floor exists but is never
  volunteered. Onsite remains the only absolute deal breaker; timezone-overlap
  asks (incl. US-Pacific) are acceptable.
- **Location (owner 2026-07-29: "Da nang is the location"):** Da Nang, Vietnam —
  ICT (UTC+7; the site/CVs say UTC+8, close enough, don't churn PDFs). For form
  fields: city "Da Nang", country "Vietnam", zip/postal "550000". Work
  authorization in Vietnam: answer Yes (he lives and works there). French (EU)
  citizen. Region filters: only offers open to Vietnam/APAC/global remote are
  viable — EU-residence-scoped or US-scoped roles are skips.
- **Languages:** French (native), English (fluent), Ukrainian (beginner)
- **Education:** self-taught, no degree, shipping production code since 2014.
  ⚠ Hard knockout for degree-gated postings — always flag in the fit check.
- **Experience:** 12 years programming, production code since 2014, Web3-native since 2018
- **Availability:** immediately available, remote only

## Work history (real titles, real dates — never alter)

### Founder & Solo Engineer — Independent · Oct 2024 – Present · Remote

Portfolio of live products, all designed, built, deployed, and operated solo:

- **AresRPG monorepo** (Feb 2024 – present, testnet, aresrpg.world ·
  github.com/aresrpg — full survey: corpus/aresrpg.md): fully on-chain browser
  voxel MMORPG on Sui — **~600K LOC, 12 workspaces**: 9 Sui Move packages (~60K
  LOC Move), deterministic combat sim with a Move on-chain twin (replay-verified
  parity), **Rust chain indexer** (~10.5K LOC; axum, tokio,
  sui-indexer-alt-framework → Redis 8 JSON/search → Bun REST API), gas
  sponsorship service (gasless play, fail-closed), zkLogin/Enoki onboarding, Sui
  kiosk marketplace, Three.js voxel engine with LOD streaming, PTB SDK. Leads a
  team of 3. ⚠ SUPERSEDES the site's old "Sui→FalkorDB indexer" description.
- **Hytale MMORPG server** (Jan 2026 – present, live): custom MMORPG server on top
  of Hytale. Java 25, **83K+ LOC measured** (site's older ~370K figure
  unverified — use 80K+ until Cyril justifies the larger count), 1,300+ unique
  players, ~1k MRR, solo-operated. Behavior-tree mob AI, anticheat, marketplace,
  crafting (16 jobs), instance system. FalkorDB + Redis Stack, deployed on own
  Kubernetes cluster, on-call solo.
- **Noxant** (Dec 2025, noxant.io — DEPRECATED per owner 2026-07-28): agentic CI/CD
  on Kubernetes — AI agents execute, verify, and publish tasks inside
  Docker-in-Docker sandboxes. Prior art only; the live agentic-development story
  is the AresRPG harness (see AI workflow below).
- **Talos cluster** (Dec 2025 – present, production): self-hosted Kubernetes on Talos
  OS. 33 Helm releases, 4 domains, GitOps via Helmfile, Cilium, Longhorn, SOPS
  secrets, Cloudflare Tunnels zero-trust ingress. Runs everything above; infra
  repo active daily.
- **suize / x402** (2026, active): websites on Walrus shipped by AI agents, gasless
  USDC publishing on Sui, **open-source x402 payment facilitator** + Sui
  facilitator contributions to the upstream x402 standard.
- **VersUI**: decentralized Vercel on Sui + Walrus (testnet).
- **Koshi** (through Jun 2026): turn-based isometric tactical MMORPG — 140K LOC
  JavaScript/React; combat VFX, spell decks, marketplace. Unreleased; strong
  evidence, not yet a headline claim.
- **AI workflow — THE headline achievement (owner 2026-07-28: "my biggest
  achievement is AresRPG, everything I'm doing with it is top-notch agentic
  development, the Claude harness and how we use it"):** AresRPG is built through
  an agentic system Cyril engineered around Claude Code — multi-agent
  orchestration (N-agent implementation/review consensus), a CODEOWNERS-gated
  quality constitution (FROZEN.md) that neither humans nor agents may tune,
  ratcheting mechanical gates (CodeQL, semgrep, dependency-cruiser,
  gold/anchor/unit test gate), fast-forward-only edge→master promotion, and
  automated audit loops that file issues autonomously. Also published MCP
  servers (sui-graphql-mcp, semantic-memory-mcp, agent-pool); Noxant is
  deprecated prior art.

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

## Skills (only claim what's here — evidence tiers: corpus/tech-inventory.md)

- **Backend:** Node.js (primary, ~10y), TypeScript/JavaScript (primary), Java 25
  (80K+ LOC production server), Rust (working — 10K+ LOC indexer: axum, tokio),
  Bun, GraphQL (authored server/client libraries), REST APIs, WebSocket,
  microservices
- **Frontend:** React 19, Vue 3, Tailwind CSS v4, Three.js, Zustand, PWA, i18n
- **Databases:** Redis (8 JSON/search, Stack, TimeSeries, RedisGraph client
  authorship), FalkorDB (graph), schema & database design, custom blockchain
  indexers
- **Infra/Ops:** Kubernetes, Docker, Docker-in-Docker, Talos OS, Helm, Helmfile,
  Cilium, Longhorn, SOPS, Cloudflare Tunnels, GitOps, CI/CD, AWS, MinIO
- **AI tooling:** Claude Code (daily driver, multi-agent orchestration), OpenAI
  Codex (cross-vendor review lanes), agentic CI/CD pipelines (built Noxant),
  authored MCP servers (sui-graphql-mcp, semantic-memory-mcp, agent-pool),
  context engineering, AI-orchestrated code review. Owner-confirmed 2026-07-28:
  Claude Code + Codex ONLY — never claim Cursor or Copilot.
- **Web3:** Sui Move, Sui RPC/indexers (checkpoint streaming, BCS codegen),
  zkLogin, sponsored transactions / gas stations, Walrus, x402 (open-source Sui
  facilitator), Solidity, EVM tooling, exchange chain integration
  (deposits/withdrawals/listings)
- **Game engineering:** deterministic simulation with on-chain twin, procedural
  voxel worlds + LOD streaming, behavior-tree AI, anticheat, marketplace
  economies, protocol design & reverse-engineering (Wireshark Minecraft
  dissector ★70, Dofus 1.29 protocol libs)
- **Open source:** 174 repos across 3 orgs, 335 stars total; 18+ published npm
  libs (HydreIO); notable: aresrpg-mc ★78, minecraft-dissector ★70, rgraph ★46.
- Does NOT do (never claim): Golang, C++ (unconfirmed), mobile native
  (unconfirmed); Python and Lua are tooling-tier only (T3) — ask before
  upgrading anything.

## Positioning notes

- **JavaScript is the deepest expertise (owner 2026-07-29: "don't forget my
  deepest expertise is javascript")** — ~15 years: HydreIO's 18+ libs are pure
  JS, aresrpg-mc is 301k JS, koshi is 140K JS. EVERY CV lists the literal word
  "JavaScript" alongside TypeScript (recruiters keyword-search both), and
  JS-heavy roles lead with it.

- For exchanges/crypto: lead with Bitfinex + Sui listing + "code where bugs lose funds".
- For AI-flavored roles: lead with the AresRPG agentic harness — a ~600K-LOC
  production system engineered and shipped through Claude Code multi-agent
  orchestration under mechanical quality gates; then MCP server authorship.
  Noxant is deprecated — prior art, one line max.
- For backend roles: lead with the aresrpg monorepo (~600K LOC, Rust indexer) and
  Hytale server (83K+ LOC Java, 1,300+ players, solo).
- For game studios: 10+ years of the AresRPG IP (Minecraft ★78 → Hytale → onchain),
  deterministic sim, voxel engines, protocol reverse-engineering (dissector ★70).
- For payments/fintech: Bitfinex pipelines + x402 open-source Sui facilitator +
  gasless USDC publishing (suize).
- For teams/leadership: Sidy (led 4), AresRPG (leads 3), Affinidi (distributed teams).
- "Independent since Oct 2024" must read as _founder shipping live revenue-generating
  products_, never as a gap.
