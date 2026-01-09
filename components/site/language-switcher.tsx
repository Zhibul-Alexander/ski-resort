"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const langs: { lang: Lang; label: string }[] = [
  { lang: "en", label: "EN" },
  { lang: "ru", label: "RU" },
  { lang: "ge", label: "GE" },
  { lang: "zh", label: "中文" },
  { lang: "kk", label: "KK" },
  { lang: "he", label: "עברית" }
];

export function LanguageSwitcher({ currentLang }: { currentLang: Lang }) {
  const pathname = usePathname();

  function getLanguagePath(newLang: Lang): string {
    // Заменяем текущий язык в пути на новый
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length > 0 && langs.some(l => l.lang === pathSegments[0])) {
      pathSegments[0] = newLang;
      const newPath = "/" + pathSegments.join("/");
      // Добавляем trailing slash если он был в оригинальном пути
      return pathname.endsWith("/") && newPath !== "/" ? newPath + "/" : newPath;
    }
    // Если путь не содержит язык, просто добавляем новый язык
    const basePath = pathname === "/" ? "" : pathname;
    return `/${newLang}${basePath}`;
  }

  return (
    <div className="hidden sm:flex items-center flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
      {langs.map((l) => (
        <Link
          key={l.lang}
          href={getLanguagePath(l.lang)}
          className={cn(
            "no-underline px-2.5 py-1 text-xs rounded-lg transition-colors",
            l.lang === currentLang ? "bg-brand/15 text-brand" : "text-muted-foreground hover:bg-brand-hover/10 hover:text-brand"
          )}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

export function LanguageSwitcherMobile({ currentLang, onLanguageChange }: { currentLang: Lang; onLanguageChange?: () => void }) {
  const pathname = usePathname();

  function getLanguagePath(newLang: Lang): string {
    // Заменяем текущий язык в пути на новый
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length > 0 && langs.some(l => l.lang === pathSegments[0])) {
      pathSegments[0] = newLang;
      const newPath = "/" + pathSegments.join("/");
      // Добавляем trailing slash если он был в оригинальном пути
      return pathname.endsWith("/") && newPath !== "/" ? newPath + "/" : newPath;
    }
    // Если путь не содержит язык, просто добавляем новый язык
    const basePath = pathname === "/" ? "" : pathname;
    return `/${newLang}${basePath}`;
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground">Language</div>
      <div className="grid grid-cols-3 gap-2">
        {langs.map((l) => (
          <Link
            key={l.lang}
            href={getLanguagePath(l.lang)}
            onClick={onLanguageChange}
            className={cn(
              "no-underline text-center text-xs rounded-xl border border-border py-2 transition-colors",
              l.lang === currentLang ? "bg-brand/15 text-brand" : "text-muted-foreground hover:bg-brand-hover/10 hover:text-brand"
            )}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

