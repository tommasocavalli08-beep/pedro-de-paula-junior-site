import { get } from '@vercel/blob';
import { defaultEditorial } from '@/app/data';

export const EDITORIAL_PATHNAME = 'pedro-de-paula-junior/editorial.json';

function cleanArticle(article = {}) {
  const slug = String(article.slug || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);

  return {
    slug,
    title: String(article.title || '').trim().slice(0, 140),
    category: String(article.category || 'Saúde digestiva').trim().slice(0, 60),
    date: String(article.date || '').trim().slice(0, 20),
    description: String(article.description || '').trim().slice(0, 320),
    intro: String(article.intro || '').trim().slice(0, 1200),
    coverImage: String(article.coverImage || '').trim().slice(0, 500),
    videoUrl: String(article.videoUrl || '').trim().slice(0, 500),
    sections: Array.isArray(article.sections)
      ? article.sections.slice(0, 14).map((section) => ({
          heading: String(section?.heading || '').trim().slice(0, 140),
          text: String(section?.text || '').trim().slice(0, 5000),
        })).filter((section) => section.heading || section.text)
      : [],
    faq: Array.isArray(article.faq)
      ? article.faq.slice(0, 12).map((item) => ({
          q: String(item?.q || '').trim().slice(0, 220),
          a: String(item?.a || '').trim().slice(0, 1800),
        })).filter((item) => item.q && item.a)
      : [],
  };
}

export function normalizeEditorial(data = {}) {
  const articles = Array.isArray(data.articles)
    ? data.articles.map(cleanArticle).filter((article) => article.slug && article.title)
    : [];

  return {
    updatedAt: data.updatedAt || null,
    practical: {
      santaFeHours: String(data.practical?.santaFeHours || defaultEditorial.practical.santaFeHours).slice(0, 100),
      ituramaHours: String(data.practical?.ituramaHours || defaultEditorial.practical.ituramaHours).slice(0, 100),
    },
    articles,
  };
}

export async function getEditorialContent({ fresh = false } = {}) {
  try {
    const result = await get(EDITORIAL_PATHNAME, {
      access: 'private',
      useCache: !fresh,
    });
    if (!result?.stream) return defaultEditorial;
    const raw = await new Response(result.stream).text();
    return normalizeEditorial(JSON.parse(raw));
  } catch {
    return defaultEditorial;
  }
}

export function youtubeEmbedUrl(url = '') {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').split('/')[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.split('/')[2];
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
      }
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
  } catch {}
  return null;
}