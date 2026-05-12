/** @type {import('./schema').Flagship[]} */
export const flagships = [
  {
    id: 'bitfinex',
    order: 1,
    eyebrow: 'flagship/01 · exchange backend · 2022—2024 · 1.5y',
    title: 'Bitfinex',
    oneLiner:
      'Chain integration backend at a top-tier crypto exchange — including the Sui ship.',
    problem:
      'Major cryptocurrency exchange needed new chain integrations and ongoing maintenance for production blockchain infrastructure.',
    scale: [
      'multi-chain integration',
      'sui integrated',
      'production maintenance',
      '1.5y tenure',
    ],
    stack: ['Node.js', 'TypeScript', 'Solidity', 'EVM tooling', 'CI/CD'],
    role: 'Blockchain Integration Specialist',
    status: 'past',
    outcome: [
      'Integrated multiple blockchain backends into the exchange, including Sui.',
      'Maintained existing chain integrations under production load.',
      'Owned chain-specific edge cases: reorgs, finality thresholds, fee accounting.',
    ],
    proof: [{ label: 'bitfinex.com', href: 'https://www.bitfinex.com' }],
    dates: 'apr 2022 — oct 2024 · 1.5 years',
    accent: 'bitfinex',
  },
  {
    id: 'hytale',
    order: 2,
    eyebrow: 'flagship/02 · live · 1,300+ unique players · solo',
    title: 'Hytale MMORPG server',
    oneLiner:
      'Custom MMORPG server on top of Hytale · 1,300+ unique players · Java 25 / FalkorDB / Kubernetes on Talos.',
    problem:
      '1k-MRR live multiplayer game, fully solo, AI-augmented dev workflow.',
    scale: ['1,300+ unique players', '1k MRR', 'solo-operated', '~370K LOC'],
    stack: [
      'Java 25',
      'FalkorDB',
      'Redis Stack',
      'Kubernetes',
      'Helm',
      'Cilium',
      'Longhorn',
      'Cloudflare Tunnels',
    ],
    role: 'solo · architect · dev · sysadmin · on-call',
    status: 'live',
    outcome: [
      'Solo-operating a live MMORPG with 1,300+ unique players and 1k MRR.',
      'Behavior-tree mob AI, anticheat, marketplace, crafting (16 jobs), instance system.',
      'Self-hosted on the Talos cluster — connects all four flagships.',
    ],
    // private repo; add link if/when public
    proof: [],
    dates: 'jan 2026 — present · live in production',
    accent: 'hytale',
  },
  {
    id: 'aresrpg',
    order: 3,
    eyebrow: 'flagship/03 · onchain mmorpg · since 2024',
    title: 'AresRPG',
    oneLiner:
      'Onchain MMORPG on Sui (testnet) — lead a team of 3 · custom Sui→FalkorDB indexer for sub-second gameplay queries against onchain state.',
    problem:
      'Build a real on-chain MMORPG where every character, item, and trade is a Sui object — true ownership, not a database row.',
    scale: [
      'characters as sui objects',
      'equipment as sui objects',
      'on-chain marketplace',
      'sui-signature auth',
    ],
    stack: [
      'Sui Move',
      'React 19',
      'Bun',
      'FalkorDB',
      'Redis TimeSeries',
      'zkLogin',
      'Walrus',
      'Tailwind v4',
    ],
    role: 'solo · architect · dev · ops',
    status: 'testnet',
    outcome: [
      'Characters and their equipment are Sui objects — true on-chain ownership, not a database row.',
      'All canonical game state lives on chain · marketplace and trades settle in Move.',
      'Sui-signature auth verified server-side · FalkorDB caches the graph for fast queries.',
    ],
    proof: [
      { label: 'aresrpg.world', href: 'https://aresrpg.world' },
      { label: 'github.com/aresrpg', href: 'https://github.com/aresrpg' },
    ],
    dates: 'feb 2024 — present',
    accent: 'aresrpg',
  },
  {
    id: 'noxant',
    order: 5,
    eyebrow: 'flagship/05 · agentic CI/CD on Kubernetes · live',
    title: 'Noxant',
    oneLiner:
      'Agentic CI/CD on Kubernetes — AI agents execute, verify, and publish their own tasks inside Docker-in-Docker sandboxes.',
    problem:
      "Engineers shouldn't babysit pipelines. Build infrastructure where agents take a task, run it in isolation, validate the result, and publish — autonomously.",
    scale: [
      'agentic pipelines',
      'DinD isolation',
      'autonomous publish',
      'k8s-hosted',
    ],
    stack: ['Kubernetes', 'Docker-in-Docker', 'TypeScript', 'AI agents'],
    role: 'solo · architect · dev · ops',
    status: 'live',
    outcome: [
      'AI agents execute, verify, and publish their own tasks inside Docker-in-Docker sandboxes — no human in the loop.',
      'Self-hosted on the Talos cluster alongside AresRPG and the Hytale server.',
      'Built winter 2025.',
    ],
    proof: [{ label: 'noxant.io', href: 'https://noxant.io' }],
    dates: 'dec 2025 — present',
    accent: 'noxant',
  },
  {
    id: 'talos',
    order: 4,
    eyebrow: 'flagship/04 · self-hosted prod · 33 helm releases',
    title: 'Talos cluster',
    oneLiner:
      'Self-hosted production K8s on Talos OS · GitOps via Helmfile · zero-trust ingress · SOPS secrets · Longhorn storage. Powers all side projects.',
    problem:
      'Run all my production workloads on hardware I control, with zero cloud lock-in.',
    scale: [
      '33 helm releases',
      '4 domains',
      'zero-trust ingress',
      'GitOps via Helmfile',
    ],
    stack: [
      'Talos OS',
      'Cilium',
      'Longhorn',
      'MinIO',
      'Cloudflare Tunnels',
      'Helmfile',
      'SOPS',
    ],
    role: 'solo · architect · ops',
    status: 'production',
    outcome: [
      'Self-hosted production Kubernetes cluster on Talos OS — every flagship above runs here.',
      '33 Helm releases across 4 namespaces; every change goes through git via Helmfile.',
      'SOPS-encrypted secrets, Longhorn distributed storage, Cloudflare Tunnels for zero-trust ingress.',
    ],
    proof: [],
    dates: 'dec 2025 — present',
    accent: 'talos',
  },
]
