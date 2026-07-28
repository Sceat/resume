# AresRPG monorepo — current flagship build

Harvested 2026-07-28 from ground truth at ~/dev/aresrpg (read-only survey).
Supersedes the site's older description (the "Sui→FalkorDB indexer" era) — the
indexer is now Rust + Redis 8. Update CVs from THIS file, not the site copy.

## What it is

Fully on-chain browser voxel MMORPG on Sui. The client is a pure renderer of chain
truth: every character, item, fight, and trade is a Sui object. Combines a 3D voxel
engine, a deterministic turn-based combat sim with a Move on-chain twin (same math —
client prediction equals chain resolution), zkLogin keyless onboarding, sponsored
gasless transactions, and a keyless read/indexer layer. Source-available, commercial
rights reserved. Active development, testnet-integrated, live CI/release pipeline.

## Scale (measured 2026-07-28)

- ~603,483 LOC (ts/tsx/move/js/vue) · 3,349 tracked files · 12 workspaces
- Move contracts: ~60,571 LOC across 9 on-chain packages
  (aresrpg, dungeon, engine, forgemagie, foundation, gifting, kolizeum, social, spells)
- Rust indexer: ~10,525 LOC
- 1,109 test-related files; gold/anchor/unit gate (`ares test`), sim↔Move replay
  parity fixtures, localnet harness

## CV-worthy systems (each defensible in interview)

- **Chain-as-server game architecture**: 9 Sui Move packages hold all canonical
  game state; deterministic TypeScript combat reducer (`reduce(state,cmd,ctx)`,
  zero deps) is a byte-exact twin of the Move resolution — verified by replayable
  fold fixtures.
- **Keyless RPC/indexer**: Rust (sui-indexer-alt-framework, axum, tokio) streams
  Sui checkpoints → Redis 8 (JSON + search indexes) → rate-limited, ETag'd REST
  API on Bun; read-only and keyless by construction, horizontally scalable.
- **Gas sponsorship service**: stateless sponsored-transaction API — allowlist
  gating, fail-closed tests, gas-pool/station config generation (users play gasless).
- **zkLogin + wallet stack**: Enoki keyless onboarding, sponsored tx, Sui kiosk
  marketplace integration.
- **Voxel engine** (`@aresrpg/engine3`): Three.js procedural world generation with
  LOD chunk streaming.
- **PTB SDK**: typed Programmable Transaction Block composition layer over the
  Move packages.
- **Engineering governance**: FROZEN.md "constitution" (immutable quality anchors,
  CODEOWNERS-gated), fast-forward-only edge→master promotion pipeline, ratcheting
  security gates (CodeQL, semgrep, dependency-cruiser), automated audit loops that
  file issues; tagged releases + Vercel deploy.

## Workspaces

engine (voxel engine) · frontend (React 19, Tailwind v4, Zustand, dapp-kit, PWA,
i18next ×6 locales, Sentry, trystero P2P) · sim (deterministic combat reducer) ·
move (9 Move packages) · fight (chain-log/settlement/presentation folds) · sdk
(PTB composition) · rpc (Rust indexer + Bun REST + gas station) · inventory ·
party · world (headless reducer cores) · simlab · validation · api/ (sponsored-tx
service)

## Stack inventory

TypeScript, JavaScript, Rust, Sui Move, React 19, Three.js, Zustand, Tailwind CSS
v4, Vite, Bun, Node.js, @mysten/sui + dapp-kit + Enoki zkLogin + kiosk +
wallet-standard, Redis 8 (JSON/search), axum, tokio, sui-indexer-alt-framework,
Prometheus, Docker/docker-compose, Sentry, i18next, trystero (WebRTC P2P),
Workbox/PWA, gltf-transform/draco3d, AWS S3 SDK, ESLint/Prettier, semgrep, CodeQL,
dependency-cruiser, GitHub Actions (gate/promote/edge-smoke/audit workflows).
