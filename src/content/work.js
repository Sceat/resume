/** @type {import('./schema').WorkEntry[]} */
export const work = [
  {
    company: 'Claude Code Enjoyer',
    role: 'Solo · multi-agent orchestrator',
    period: { from: '2025-01', to: null },
    location: 'Bali, Indonesia',
    remote: true,
    bullets: [
      'Spent an unhealthy amount of time breaking my teeth shipping production systems through Claude Code — including the live Hytale MMORPG, the Talos cluster, and on-chain Sui work.',
      'Plan-by-default · parallel agent consensus · critique loops on every plan before a single line gets written.',
    ],
  },
  {
    company: 'Hytale MMORPG',
    role: 'Solo · architect · dev · sysadmin · on-call',
    period: { from: '2026-01', to: null },
    location: 'Bali, Indonesia',
    remote: true,
    bullets: [
      'Live solo-run MMORPG with 1,300+ unique players and 1k MRR — Java 25 + FalkorDB + Kubernetes on the Talos cluster.',
      'Behavior-tree mob AI, anticheat, marketplace, crafting (16 jobs), instance system. Architect to on-call, one human.',
    ],
  },
  {
    company: 'AresRPG',
    role: 'Solo · founder · onchain MMORPG',
    period: { from: '2024-02', to: null },
    location: 'Bali, Indonesia',
    remote: true,
    bullets: [
      'Fully on-chain MMORPG on Sui — characters and their equipment are Sui objects, true ownership instead of database rows.',
      'Sui Move marketplace · React 19 + Bun WebSocket · zkLogin auth · FalkorDB graph as cache · 6-locale i18n.',
    ],
    url: 'https://aresrpg.world',
  },
  {
    company: 'Bitfinex',
    role: 'Blockchain Integration Specialist',
    period: { from: '2022-04', to: '2024-10' },
    location: 'Remote',
    remote: true,
    bullets: [
      'Integrated multiple blockchains into a major cryptocurrency exchange.',
      'Coordinated cross-team rollouts with custody, security, and customer-facing teams.',
    ],
    url: 'https://www.bitfinex.com',
  },
  {
    company: 'Affinidi',
    role: 'Fullstack Developer',
    period: { from: '2021-01', to: '2022-04' },
    location: 'Kyiv, Ukraine',
    remote: true,
    bullets: [
      'Worked in big teams across multiple timezones on major and diverse React/Node/Docker API & App projects, including SSI and credentials verification.',
      'Hosted on AWS with advanced CI pipelines.',
    ],
    url: 'https://www.affinidi.com',
  },
  {
    company: 'Sidy',
    role: 'CTO · Co-founder',
    period: { from: '2019-01', to: '2021-01' },
    location: 'Montpellier, France',
    remote: false,
    bullets: [
      'Co-founder and CTO. Wrote and led the development of every technology inside the company.',
      'Managed the developers team and owned the full technical direction.',
    ],
  },
  {
    company: 'Freelance · Open-Source',
    role: 'Software Engineer',
    period: { from: '2015-01', to: '2021-01' },
    location: 'France',
    remote: true,
    bullets: [
      'Contributed, created, and maintained many open-source libraries (see GitHub for details).',
      'Delivered freelance missions across various clients.',
    ],
    url: 'https://github.com/sceat',
  },
]
