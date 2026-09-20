import './globals.css';
import Motion from './motion';
import { SITE_URL, doctor } from './data';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dr. Pedro de Paula Junior | Cirurgia Digestiva, Endoscopia e Colonoscopia',
    template: '%s | Dr. Pedro de Paula Junior',
  },
  description: 'Cirurgião geral e do aparelho digestivo em Santa Fé do Sul (SP), com endoscopia, colonoscopia e exames em Iturama (MG). CRM-SP 112723 · CRM-MG 47662 · RQE 28023/28024.',
  keywords: [
    'Dr Pedro de Paula Junior',
    'cirurgião geral Santa Fé do Sul',
    'cirurgião aparelho digestivo Santa Fé do Sul',
    'cirurgia digestiva Santa Fé do Sul',
    'endoscopia Iturama',
    'colonoscopia Iturama',
    'endoscopia Santa Fé do Sul',
    'colonoscopia Santa Fé do Sul',
    'cirurgia de hérnia Santa Fé do Sul',
    'cirurgia de vesícula Santa Fé do Sul',
    'SIBO Santa Fé do Sul',
    'teste de hidrogênio expirado',
  ],
  authors: [{ name: doctor.name }],
  creator: doctor.name,
  category: 'Saúde',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: doctor.name,
    title: 'Dr. Pedro de Paula Junior | Cirurgia Digestiva',
    description: 'Cirurgia geral e do aparelho digestivo, endoscopia e colonoscopia em Santa Fé do Sul (SP) e Iturama (MG).',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: doctor.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Pedro de Paula Junior | Cirurgia Digestiva',
    description: 'Cirurgia geral e digestiva, endoscopia e colonoscopia.',
    images: ['/opengraph-image'],
  },
  icons: { icon: '/favicon.svg' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f3f0e9',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Motion />
      </body>
    </html>
  );
}