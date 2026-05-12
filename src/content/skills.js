/** @type {import('./schema').Skills} */
export const skills = {
  primary: 'TypeScript / JavaScript',
  alsoFluent: ['Move', 'Java', 'Solidity'],
  method:
    'AI-orchestrated reviews · Claude Code workflows · context engineering',
  groups: [
    {
      name: 'onchain',
      items: [
        { name: 'Sui Move', primary: true },
        { name: 'Sui RPC / indexers' },
        { name: 'zkLogin' },
        { name: 'Walrus' },
        { name: 'Solidity (legacy)' },
      ],
    },
    {
      name: 'systems',
      items: [
        { name: 'Node.js', primary: true },
        { name: 'Bun' },
        { name: 'Java 25' },
        { name: 'FalkorDB' },
        { name: 'Redis' },
        { name: 'WebSocket' },
      ],
    },
    {
      name: 'product',
      items: [
        { name: 'React 19', primary: true },
        { name: 'Vue 3' },
        { name: 'Tailwind v4' },
        { name: 'i18n' },
        { name: 'Three.js' },
      ],
    },
    {
      name: 'ops',
      items: [
        { name: 'Kubernetes', primary: true },
        { name: 'agentic CI/CD (DinD)', primary: true },
        { name: 'Talos' },
        { name: 'Helm' },
        { name: 'Helmfile' },
        { name: 'Cilium' },
        { name: 'SOPS' },
        { name: 'Cloudflare Tunnels' },
        { name: 'GitOps' },
      ],
    },
  ],
}
