import { SITE_URL, servicePages } from './data';
export default function sitemap() {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...Object.keys(servicePages).map((slug) => ({ url: `${SITE_URL}/servicos/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 }))
  ];
}
