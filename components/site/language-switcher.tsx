"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { Select, type SelectOption } from "@/components/ui/select";

// Полные названия языков для лучшей понятности
const langLabels: Record<Lang, string> = {
  en: "English",
  ru: "Русский",
  ge: "ქართული",
  zh: "中文",
  kk: "Қазақша",
  he: "עברית"
};

const LANGS: Lang[] = ["en", "ru", "ge", "zh", "kk", "he"];

function getLanguagePath(pathname: string, newLang: Lang): string {
  // Заменяем текущий язык в пути на новый
  const pathSegments = pathname.split("/").filter(Boolean);
  if (pathSegments.length > 0 && LANGS.includes(pathSegments[0] as Lang)) {
    pathSegments[0] = newLang;
    const newPath = "/" + pathSegments.join("/");
    // Добавляем trailing slash если он был в оригинальном пути
    return pathname.endsWith("/") && newPath !== "/" ? newPath + "/" : newPath;
  }
  // Если путь не содержит язык, просто добавляем новый язык
  const basePath = pathname === "/" ? "" : pathname;
  return `/${newLang}${basePath}`;
}

export function LanguageSwitcher({ currentLang }: { currentLang: Lang }) {
  const pathname = usePathname();
  const router = useRouter();

  const options: SelectOption[] = LANGS.map((lang) => ({
    value: lang,
    label: langLabels[lang]
  }));

  const handleLanguageChange = (newLang: string) => {
    const newPath = getLanguagePath(pathname, newLang as Lang);
    router.push(newPath);
  };

  return (
    <div className="min-w-[120px] max-w-[160px] sm:min-w-[140px]">
      <Select
        value={currentLang}
        onChange={handleLanguageChange}
        options={options}
        className="w-full"
      />
    </div>
  );
}

