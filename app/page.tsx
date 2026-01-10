import Link from "next/link";
import { LANGS } from "@/lib/i18n";

const labels: Record<string, string> = { en: "English", ru: "Русский", ge: "ქართული", zh: "中文", kk: "Қазақша", he: "עברית" };

export default function Root() {
  return (
    <main className="min-h-screen grid place-items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100">
      <div className="max-w-lg w-full p-6">
        <div className="rounded-3xl border border-border bg-card shadow-sm p-8">
          <div className="text-3xl font-semibold">SKI HOUSE+</div>
          <div className="text-sm text-muted-foreground mt-2">Choose your language</div>
          <div className="mt-6 grid gap-2">
            {LANGS.map(l => (
              <Link
                key={l}
                href={`/${l}`}
                className="no-underline rounded-xl border border-border bg-background px-4 py-3 hover:bg-secondary/60 transition-colors"
              >
                {labels[l]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
