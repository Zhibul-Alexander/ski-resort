export type Lang = "en" | "ru" | "ge" | "zh" | "kk";
export const LANGS: Lang[] = ["en", "ru", "ge", "zh", "kk"];

export type LocaleKey = "en" | "ru" | "ge" | "zh" | "kk";

export function toLocaleKey(lang: Lang): LocaleKey {
  return lang;
}

export function langToHtmlLang(lang: Lang): string {
  // proper language tags for accessibility / SEO
  return lang;
}
