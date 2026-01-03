"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LanguageSwitcher, LanguageSwitcherMobile } from "./language-switcher";

export function Header({
  lang,
  brandName,
  phone,
  email
}: {
  lang: Lang;
  brandName: string;
  phone: string;
  email: string;
}) {
  const pathname = usePathname();
  const nav = [
    { href: `/${lang}/about-us`, label: "About Us" },
    { href: `/${lang}/rental`, label: "Rental Prices" },
    { href: `/${lang}/lessons`, label: "Lessons" },
    { href: `/${lang}/resort`, label: "Ski Resort" }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/${lang}`} className="no-underline min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-9 w-9 rounded-xl shrink-0 relative overflow-hidden">
                <Image src="/logo.png" alt={brandName} width={36} height={36} className="object-contain" />
              </div>
              <div className="leading-tight min-w-0">
                <div className="font-semibold truncate">{brandName}</div>
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((l) => {
            // Нормализуем пути для сравнения (убираем trailing slash и якорь)
            const normalizedPathname = pathname.replace(/\/$/, "") || "/";
            const normalizedHref = l.href.replace(/#.*$/, "").replace(/\/$/, "");
            const isActive = normalizedPathname === normalizedHref || normalizedPathname.startsWith(normalizedHref + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href={`/${lang}/rental#booking-form`} className="no-underline">
            <Button size="sm">Request Booking</Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href={`/${lang}/about-us#contacts`} className="hidden lg:flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contacts
          </Link>
          <LanguageSwitcher currentLang={lang} />

          {/* Mobile primary action */}
          <Link href={`/${lang}/rental#booking-form`} className="md:hidden no-underline">
            <Button size="sm">Request Booking</Button>
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="font-semibold">{brandName}</div>
                </div>

                <div className="grid gap-2">
                  {nav.map((l) => {
                    const normalizedPathname = pathname.replace(/\/$/, "") || "/";
                    const normalizedHref = l.href.replace(/#.*$/, "").replace(/\/$/, "");
                    const isActive = normalizedPathname === normalizedHref || normalizedPathname.startsWith(normalizedHref + "/");
                    return (
                      <Link key={l.href} href={l.href} className="no-underline">
                        <Button variant="secondary" className={cn("w-full justify-start", isActive && "bg-secondary")}>
                          {l.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>

                <Link href={`/${lang}/about-us#contacts`} className="no-underline">
                  <Button variant="secondary" className="w-full justify-start">
                    Contacts
                  </Button>
                </Link>

                <LanguageSwitcherMobile currentLang={lang} />

                <Link href={`/${lang}/rental#booking-form`} className="no-underline">
                  <Button className="w-full">Request booking</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
