/** @type {import('./schema').Profile} */
export const profile = {
  name: 'Cyril Morlet',
  title: 'Senior Fullstack Engineer',
  email: 'fetch@sceat.xyz',
  site: 'sceat.xyz',
  github: '@sceat',
  // Phone intentionally omitted — share on a call.
  location: 'Remote · UTC+8 · EU/US-East overlap',
  languages: [
    { name: 'French', level: 'native' },
    { name: 'English', level: 'fluent' },
    { name: 'Ukrainian', level: 'beginner' },
  ],
  status: {
    availability: 'available',
    remote: true,
    ecosystem: 'sui ecosystem',
  },
  summary:
    '12y senior fullstack · ex-Bitfinex (chain integration, incl. Sui) · lead 3 devs on AresRPG (onchain MMORPG on Sui) · run a 1,300-player Hytale MMORPG server.',
  education: 'Self-taught · shipping production code since 2014',
}
