# Tech inventory — every technology, mapped to its strongest evidence

Harvested 2026-07-28. Rule: a tech may appear on a CV only with its evidence tier.
**T1** = production/deep (claim freely, survives interview drilling) · **T2** =
real project use (claim in skills lists) · **T3** = touched/tooling-level (claim
only if the JD demands it, phrase as "familiarity") · **never** = do not claim.

## Languages

- **JavaScript / TypeScript — T1**: ~15y; aresrpg monorepo (~600K LOC), Bitfinex
  pipelines, 18+ published libs, koshi (140K LOC).
- **Java — T1**: Hytale MMORPG server (83K+ LOC measured, live, solo); Dofus-era
  protocol libs; AresCommons.
- **Sui Move — T1**: 9 on-chain packages, ~60K LOC in monorepo + aresrpg-move
  (139k bytes public).
- **Rust — T2**: aresrpg rpc indexer (~10.5K LOC; axum, tokio,
  sui-indexer-alt-framework); sui-gas-pool maintenance.
- **Solidity — T2 (legacy)**: Bitfinex EVM tooling, Mana Finance, PepeDefense.
- **C — T3**: minecraft-dissector (★70 Wireshark dissector) — cite for
  protocol/systems cred, not as a working C claim.
- **Python — T3**: tooling forks (headroom, frozen-gates plugin).
- **Lua — T3**: Factorio mods. **ActionScript — never** (archaeology).
- **Golang — never** (upstream x402 code only, not his).

## Backend & data

- **Node.js — T1** (~10y, Bitfinex production) · **Bun — T1** (aresrpg REST API).
- **GraphQL — T1**: authored server/client libs (graphql-http, shimio-graphql,
  graphql-batch-executor, make_schema, disk, auth) — missing from old CVs, add.
- **Redis — T1**: Redis 8 JSON/search indexes (aresrpg rpc), RedisGraph clients
  (rgraph ★46), Redis Stack/TimeSeries; semantic-memory-mcp (embeddings).
- **FalkorDB — T2**: Hytale server graph DB. **WebSocket — T1**: shimio, game
  netcode. **REST — T1**. **Microservices — T1** (Affinidi, own stack).
- **axum / tokio — T2** (Rust indexer). **Prometheus — T2**. **Sentry — T2**.

## Frontend

- **React 19 — T1** (aresrpg frontend), **Vue 3 — T1** (site, legacy apps),
  **Three.js — T1** (voxel engine, LOD streaming, gltf/draco pipelines),
  **Tailwind v4 — T2**, **Zustand — T2**, **PWA/Workbox — T2**, **i18next — T2**
  (6 locales), **WebRTC/P2P — T2** (trystero).

## Web3

- **Sui — T1**: exchange listing at Bitfinex; zkLogin/Enoki, sponsored tx + gas
  station, kiosk, PTB SDK authorship, checkpoint indexing (sui-checkpoint-reader,
  sui-indexer-alt-framework), BCS codegen (sui-bcs), Walrus (suize, VersUI).
- **x402 — T2**: open-source Sui facilitator (suize + upstream fork contributions).
- **EVM — T2 (legacy)**: Bitfinex tooling, DeFi projects.
- **Exchange integration — T1**: deposit/withdrawal pipelines, reorgs, finality,
  fee accounting (Bitfinex 2.5y).

## Infra & ops

- **Kubernetes — T1**: self-hosted Talos cluster (33 Helm releases, GitOps via
  Helmfile, Cilium, Longhorn, SOPS, MinIO, Cloudflare Tunnels), active daily.
- **Docker / DinD — T1** (Noxant sandboxes) · **CI/CD — T1**: GitHub Actions
  multi-workflow gates, CodeQL, semgrep, dependency-cruiser, fast-forward-only
  promotion pipelines · **KEDA — T3** · **AWS — T2** (Affinidi; S3 SDK) ·
  **Terraform — never** (no evidence).

## AI engineering

- **Claude Code — T1**: daily driver, multi-agent orchestration (N-agent consensus
  workflows). **OpenAI Codex — T2**: cross-vendor review lanes.
- **MCP (Model Context Protocol) — T2**: authored sui-graphql-mcp,
  semantic-memory-mcp, agent-pool plugin.
- **Agentic infra — T1**: built Noxant (agents execute/verify/publish in DinD on
  k8s); automated audit loops in aresrpg CI. **Embeddings/RAG — T3**
  (semantic-memory-mcp). **Cursor / Copilot — never** (owner-confirmed).

## Game engineering (own category — it sells)

Deterministic lockstep-style simulation with on-chain twin (sim↔Move parity),
procedural voxel worlds + LOD streaming, behavior-tree AI, anticheat, matchmaking/
instances, marketplace economies, protocol design & reverse-engineering
(Minecraft dissector ★70, Dofus 1.29), 10+ years running the AresRPG game IP.
