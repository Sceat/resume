# GitHub portfolio — full inventory

Harvested 2026-07-28 via GitHub API. Totals: **174 repos** across Sceat (96),
HydreIO (30), aresrpg (48) · **335 stars** · 110 public / 38 private / rest forks-
archived. Member of 9 further orgs: usidy, luckcoin-finance, mana-finance,
umara-nui, Krysos, pepe-defense, Versui, noxant-agentic, koshi-studio.
Private repo names/metadata only here — never cite private contents on a CV.

## Top starred (public, own work)

| Repo                                 | ★   | What it proves                                                                                      |
| ------------------------------------ | --- | --------------------------------------------------------------------------------------------------- |
| aresrpg/aresrpg-mc                   | 78  | The Minecraft-era AresRPG MMORPG (301k JS) — a decade of running the same game IP                   |
| aresrpg/minecraft-dissector          | 70  | Wireshark dissector for the Minecraft protocol, written in C — protocol-level network engineering   |
| HydreIO/rgraph                       | 46  | High-performance Node.js RedisGraph client                                                          |
| aresrpg/aresrpg-map-colors           | 16  | Minecraft map color utility                                                                         |
| HydreIO/doubt · disk · auth · shimio | ~13 | TAP testing lib, GraphQL-types-in-Redis, GraphQL auth server (k8s-ready), multiplexed WebSocket lib |
| aresrpg/sui-checkpoint-reader        | 5   | Sui checkpoint-file processing lib (87k JS)                                                         |
| aresrpg/aresrpg-world                | 3   | Seeded procedural terrain generator (314k TS)                                                       |
| aresrpg/aresrpg-move                 | 3   | Sui Move modules, 139k bytes of Move (pre-monorepo era)                                             |

## Eras (the interview narrative)

1. **2016–2019 · protocol reverse-engineering roots**: Dofus 1.29 protocol +
   client libraries in Java (HydreIO/dofus-protocol-1.29, Tofumanchou, UsainBot),
   bitcoin UTXO consolidation tool (Java).
2. **2018–2023 · AresRPG Minecraft era**: aresrpg-mc ★78, minecraft-dissector ★70
   (C), map tooling, behavior-tree editor (arborist), node-minecraft-protocol work.
3. **2019–2023 · HydreIO OSS suite**: ~20 published JS libraries — heavy **GraphQL**
   authorship (graphql-http, shimio-graphql, graphql-batch-executor, graphql-plate,
   make_schema, disk), auth server, RedisGraph clients, testing (doubt), logging
   (pino-human). This is the "18+ npm OSS libs" claim's home.
4. **2023–present · Sui era**: sui-checkpoint-reader, aresrpg-move, sui-bcs
   (BCS type generation), sui-graphql-mcp, suize ("websites on Walrus, gasless
   USDC publishing on Sui, open-source **x402 facilitator**" — active 2026-07),
   x402 fork (Sui facilitator contributions to the open payment standard),
   sui-gas-pool work, VersUI.
5. **2025–present · AI infra era**: noxant (agentic CI/CD), agent-pool (persistent
   multi-agent MCP plugin for Claude Code), semantic-memory-mcp (Redis + embeddings
   memory for agents), frozen-gates-claude-plugin (filesystem protection for AI
   edits), headroom fork (usage dashboards), private "claude" repo (distributed
   agent orchestration on Kubernetes + KEDA).

## Language spread (from API breakdowns)

JavaScript & TypeScript (dominant, ~15y), Java (Hytale server + Dofus-era libs),
Move (139k bytes public + monorepo), Rust (indexer, gas pool), C (dissector),
Python (tooling), Lua (Factorio mods: sceatorio, shared-radar), Vue, Shell,
ActionScript (legacy), Nix (touched), Dockerfile everywhere.

## Notes for tailoring

- **GraphQL belongs on the skills list** — years of server/client library
  authorship; it was absent from the old CV.
- **MCP (Model Context Protocol)**: two published servers + a plugin — rare, hot
  keyword for AI-tooling roles.
- suize + x402: "built an open-source x402 payment facilitator on Sui" — strong
  for fintech/payments JDs.
- The resume repo itself is PUBLIC — corpus must stay free of anything private.
