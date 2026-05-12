/** @type {import('./schema').WorkEntry[]} */
export const work = [
  {
    company: 'Independent · Side Projects',
    role: 'Senior Fullstack Engineer',
    period: { from: '2024-10', to: null },
    location: 'Remote',
    remote: true,
    bullets: [
      'Building onchain side projects: AresRPG (onchain MMORPG on Sui · lead 3 devs · testnet) and a custom MMORPG server on top of Hytale (1,300+ unique players · Java 25 / Kubernetes on Talos). Open to senior Sui-ecosystem and crypto-exchange roles.',
    ],
  },
  {
    company: 'Bitfinex',
    role: 'Blockchain Integration Specialist',
    period: { from: '2022-04', to: '2024-10' },
    location: 'Remote',
    remote: true,
    bullets: [
      'Owned chain integration and crypto listing stability at a top-tier crypto exchange. Maintained chain backends for production deposit/withdrawal pipelines across multiple L1/L2s — including Sui.',
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
      'Shipped React + Node microservices for self-sovereign identity (SSI) and credential verification, working across distributed teams (EU/SG/IN). REST APIs, Docker, AWS.',
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
      'Co-founder and CTO. Led a 4-engineer team building a real-estate management platform from zero to production. Owned architecture, infra, and hiring.',
    ],
  },
  {
    company: 'Freelance · Open-Source',
    role: 'Software Engineer',
    period: { from: '2015-01', to: '2021-01' },
    location: 'France',
    remote: true,
    bullets: [
      'Created and maintained 18+ npm OSS libraries (auth, real-time graphs, transport, storage primitives — org: hydre.io). Freelance fullstack delivery alongside.',
    ],
    url: 'https://github.com/sceat',
  },
]
