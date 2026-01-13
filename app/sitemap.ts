import { MetadataRoute } from 'next'
import { LANGS } from '@/lib/i18n'

export const dynamic = 'force-static'

// Базовый URL сайта
const baseUrl = 'https://ski-rental-house-plus.com'

// Список всех страниц (без префикса языка)
const pages = [
  '',
  'info',
  'lessons',
  'privacy',
  'rental',
  'services',
]

/**
 * Генерирует sitemap.xml для многоязычного сайта
 * 
 * Включает все языковые версии всех страниц:
 * - 6 языков: en, ru, ge, zh, kk, he
 * - 6 страниц: главная, info, lessons, privacy, rental, services
 * - Итого: 36 URL
 * 
 * Hreflang теги для альтернативных языковых версий 
 * добавляются через metadata в app/[lang]/layout.tsx
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = []

  // Генерируем URL для каждой страницы и каждого языка
  // Каждая языковая версия создается как отдельная запись в sitemap
  pages.forEach((page) => {
    LANGS.forEach((lang) => {
      const path = page ? `/${lang}/${page}/` : `/${lang}/`
      urls.push({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
      })
    })
  })

  return urls
}

