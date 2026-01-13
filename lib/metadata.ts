import type { Metadata } from "next";
import { LANGS, type Lang } from "./i18n";

const baseUrl = 'https://ski-rental-house-plus.com';

/**
 * Генерирует metadata с hreflang тегами для многоязычных страниц
 * 
 * Используйте эту функцию в generateMetadata каждой страницы
 * для добавления альтернативных языковых версий
 * 
 * @param lang - Текущий язык страницы
 * @param path - Путь страницы без префикса языка (например: '', 'info', 'lessons')
 * @param metadata - Базовые metadata (title, description и т.д.)
 * @returns Metadata с hreflang тегами
 */
export function generateMultilingualMetadata(
  lang: Lang,
  path: string = '',
  metadata: Metadata = {}
): Metadata {
  // Формируем текущий URL
  const currentPath = path ? `/${lang}/${path}/` : `/${lang}/`;
  
  // Создаем объект с альтернативными языковыми версиями
  const alternates: Record<string, string> = {};
  
  LANGS.forEach((l) => {
    const altPath = path ? `/${l}/${path}/` : `/${l}/`;
    alternates[l] = `${baseUrl}${altPath}`;
  });

  return {
    ...metadata,
    alternates: {
      canonical: `${baseUrl}${currentPath}`,
      languages: alternates,
    },
  };
}

