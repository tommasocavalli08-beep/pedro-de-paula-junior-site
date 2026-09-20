export default function manifest() {
  return {
    name: 'Dr. Pedro de Paula Junior',
    short_name: 'Dr. Pedro',
    description: 'Cirurgia digestiva, endoscopia e colonoscopia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f3f0e9',
    theme_color: '#24342d',
    lang: 'pt-BR',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}