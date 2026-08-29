import './globals.css';
import './mobile-fixes.css';

const siteUrl = 'https://pedro-de-paula-junior.vercel.app';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dr. Pedro de Paula Junior | Cirurgia Digestiva',
    template: '%s | Dr. Pedro de Paula Junior'
  },
  description: 'Cirurgião geral e do aparelho digestivo em Santa Fé do Sul e Iturama. Endoscopia, colonoscopia e cirurgia videolaparoscópica.',
  keywords: [
    'cirurgião geral Santa Fé do Sul',
    'cirurgião do aparelho digestivo Santa Fé do Sul',
    'endoscopia Santa Fé do Sul',
    'colonoscopia Santa Fé do Sul',
    'endoscopia Iturama',
    'colonoscopia Iturama',
    'cirurgia digestiva Iturama',
    'Dr Pedro de Paula Junior'
  ],
  authors: [{ name: 'Dr. Pedro de Paula Junior' }],
  creator: 'Dr. Pedro de Paula Junior',
  category: 'Saúde',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 }
  },
  openGraph: {
    title: 'Dr. Pedro de Paula Junior | Cirurgia Digestiva',
    description: 'Cirurgia geral e digestiva, endoscopia e colonoscopia em Santa Fé do Sul (SP) e Iturama (MG).',
    url: siteUrl,
    siteName: 'Dr. Pedro de Paula Junior',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/images/pedro-portrait.webp', width: 1023, height: 1537, alt: 'Dr. Pedro de Paula Junior' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Pedro de Paula Junior | Cirurgia Digestiva',
    description: 'Cirurgia geral e digestiva, endoscopia e colonoscopia em Santa Fé do Sul e Iturama.',
    images: ['/images/pedro-portrait.webp']
  },
  icons: { icon: '/favicon.svg' }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f6f1e7'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
