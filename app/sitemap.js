import { services, SITE_URL } from './data';
import { getEditorialContent } from '@/lib/editorial';

export default async function sitemap() {
  const now = new Date();
  const editorial = await getEditorialContent();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/santa-fe-do-sul`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${SITE_URL}/iturama`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${SITE_URL}/artigos`, lastModified: editorial.updatedAt ? new Date(editorial.updatedAt) : now, changeFrequency: 'weekly', priority: 0.8 },
    ...Object.keys(services).map((slug) => ({ url: `${SITE_URL}/servicos/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 })),
    ...editorial.articles.map((article) => ({ url: `${SITE_URL}/artigos/${article.slug}`, lastModified: editorial.updatedAt ? new Date(editorial.updatedAt) : (article.date ? new Date(`${article.date}T12:00:00`) : now), changeFrequency: 'monthly', priority: 0.75 })),
  ];
}