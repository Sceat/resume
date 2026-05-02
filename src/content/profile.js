/** @type {import('./schema').Profile} */
export const profile = {
  name: 'Cyril Morlet',
  title: 'Senior Fullstack Engineer',
  email: 'fetch@sceat.xyz',
  site: 'sceat.xyz',
  github: '@sceat',
  // Phone intentionally omitted — share on a call.
  location: { city: 'Bali', country: 'Indonesia' },
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
}
