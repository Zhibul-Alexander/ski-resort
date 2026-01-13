import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Базовый URL сайта
const baseUrl = 'https://ski-rental-house-plus.com';

// Список всех языков
const LANGS = ['en', 'ru', 'ge', 'zh', 'kk', 'he'];

// Список всех страниц (без префикса языка)
const pages = [
  '',
  'info',
  'lessons',
  'privacy',
  'rental',
  'services',
];

// Генерируем URL для каждой страницы и каждого языка
const urls = [];
pages.forEach((page) => {
  LANGS.forEach((lang) => {
    const path = page ? `/${lang}/${page}/` : `/${lang}/`;
    urls.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: page === '' ? 'weekly' : 'monthly',
      priority: page === '' ? '1.0' : '0.8',
    });
  });
});

// Генерируем XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

// Записываем файл в папку public
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`✅ Sitemap generated: ${sitemapPath}`);
console.log(`   Total URLs: ${urls.length}`);

