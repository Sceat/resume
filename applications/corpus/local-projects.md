# Local projects — everything else in ~/dev

Harvested 2026-07-28 (read-only metrics pass). LOC counts cover code extensions
only, node_modules excluded. For forks of upstream projects, claim the
CONTRIBUTION, never the repo's LOC.

## Substantial, CV-relevant

- **hytale** — "AresRPG for Hytale": the live MMORPG server implementation on top
  of Hytale. Java, **83,347 LOC measured** / 1,463 files. Last commit 2026-05-29
  (dungeon fixes). ⚠ The site/master claims "~370K LOC" — measured ground truth is
  83K; use 80K+ on CVs unless Cyril explains the 370K figure (may include assets/
  configs or an older count). Player/MRR numbers (1,300+ · ~1k MRR) come from the
  owner, not measurable here.
- **koshi** — turn-based isometric tactical MMORPG. JavaScript/React (js, jsx),
  **140,154 LOC** / 977 files. Active through 2026-06-29 (combat VFX, spell deck,
  marketplace charts, responsive UI). NOT on the current CV at all — strong
  evidence of long-form game/product engineering in pure JS. (koshi-2d = earlier
  non-git iteration, 3,894 files.)
- **kubernetes** — the GitOps infra repo for the Talos cluster (YAML/sh, 5,693
  LOC). Active DAILY (commit 2026-07-28: rpc-indexer testnet release ceremony) —
  this is the "33 Helm releases" claim's home.
- **x402** — fork of the open internet-payments standard (x402, originated by
  Coinbase). Cyril's commits add/maintain the **Sui facilitator**: e.g. 2026-07-10
  "migrate facilitator signer off retired public JSON-RPC to gRPC". Claim: "Sui
  support contributions to the x402 open payment standard" — never the repo's
  479K LOC (upstream code).
- **sui-gas-pool** — Rust service powering sponsored transactions on Sui
  (MystenLabs upstream; local work through 2026-06-02, sui deps bumps). Evidence
  of Rust + Sui infra fluency; pairs with the aresrpg gas station.
- **aresrpg-rpc** — standalone public repo of the AresRPG RPC/indexer stack
  (JS + Rust, 13,715 LOC), active 2026-07-20 (sponsor image parity fix).
- **versui** — "Vercel for Web3": deploy sites on Sui + Walrus (testnet). 985
  files; also on the site CV.
- **headroom** — Python fork: multi-account Claude/Codex usage-log aggregation
  (3,226 LOC, active 2026-07-12). Minor; evidence of Python tooling ability.
- **hydre** — @hydre/graphql-http, published GraphQL-over-HTTP library (part of
  the 18+ HydreIO OSS libs).

## Ignore (archives / scratch)

noxant local dir (non-git archive — the live Noxant claim is anchored by noxant.io
and the k8s repo), tether, sceat (workspace container), suize-deploy-test.
