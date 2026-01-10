"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";

export function Header({
  lang,
  brandName,
  phone,
  navLabels
}: {
  lang: Lang;
  brandName: string;
  phone: string;
  navLabels?: {
    aboutUs?: string;
    rentalPrices?: string;
    lessons?: string;
    services?: string;
    contacts?: string;
    requestBooking?: string;
  };
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Закрываем меню при изменении URL
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const nav = [
    { href: `/${lang}`, label: navLabels?.aboutUs || "About Us" },
    { href: `/${lang}/rental`, label: navLabels?.rentalPrices || "Rental Prices" },
    { href: `/${lang}/lessons`, label: navLabels?.lessons || "Lessons" },
    { href: `/${lang}/services`, label: navLabels?.services || "Services" },
    { href: `/${lang}#contacts`, label: navLabels?.contacts || "Contacts" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-[70px] items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/${lang}`} className="no-underline min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-[75px] w-[75px] rounded-xl shrink-0 relative overflow-hidden">
                <Image src="/logo.png" alt={brandName} width={75} height={75} className="object-contain" />
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-2 text-sm">
          {nav.map((l) => {
            // Нормализуем пути для сравнения (убираем trailing slash и якорь)
            const normalizedPathname = pathname.replace(/\/$/, "") || "/";
            const normalizedHref = l.href.replace(/#.*$/, "").replace(/\/$/, "");
            // Для главной страницы проверяем только точное совпадение, для остальных - startsWith
            const isMainPage = normalizedHref === `/${lang}`;
            // Для якорных ссылок (contacts) никогда не выделяем
            const isContactsLink = l.href.includes("#contacts");
            const isActive = isContactsLink
              ? false
              : isMainPage 
                ? normalizedPathname === normalizedHref
                : normalizedPathname === normalizedHref || normalizedPathname.startsWith(normalizedHref + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs lg:text-sm",
                  isActive
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLang={lang} />

          {/* Mobile menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="space-y-4 pt-4">

                <div className="space-y-2">
                  {nav.map((l) => {
                    const normalizedPathname = pathname.replace(/\/$/, "") || "/";
                    const normalizedHref = l.href.replace(/#.*$/, "").replace(/\/$/, "");
                    // Для главной страницы проверяем только точное совпадение, для остальных - startsWith
                    const isMainPage = normalizedHref === `/${lang}`;
                    // Для якорных ссылок (contacts) никогда не выделяем
                    const isContactsLink = l.href.includes("#contacts");
                    const isActive = isContactsLink
                      ? false
                      : isMainPage 
                        ? normalizedPathname === normalizedHref
                        : normalizedPathname === normalizedHref || normalizedPathname.startsWith(normalizedHref + "/");
                    return (
                      <SheetClose key={l.href} asChild>
                        <Link href={l.href} className="no-underline block">
                          <Button variant="secondary" className={cn("w-full justify-start h-auto py-3 px-4", isActive && "bg-secondary")}>
                            {l.label}
                          </Button>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
