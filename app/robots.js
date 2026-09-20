import { EDITOR_PATH, SITE_URL } from './data';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: [EDITOR_PATH, '/api/editor/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}