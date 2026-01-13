import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

// Базовый URL сайта
const baseUrl = 'https://ski-rental-house-plus.com'

/**
 * Генерирует robots.txt для многоязычного сайта
 * 
 * Разрешает индексацию всех страниц поисковыми системами,
 * включая все языковые версии (en, ru, ge, zh, kk, he).
 * Правило allow: '/' покрывает все пути, включая /{lang}/*.
 * 
 * Указывает путь к sitemap.xml, который содержит все 36 URL
 * (6 языков × 6 страниц).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/out/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

