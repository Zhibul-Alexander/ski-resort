export type Lang = "en" | "ru" | "ge" | "zh" | "kk";
export const LANGS: Lang[] = ["en", "ru", "ge", "zh", "kk"];

export type LocaleKey = "en" | "ru" | "ka" | "zh-Hans" | "kk";

export function toLocaleKey(lang: Lang): LocaleKey {
  if (lang === "ge") return "ka";
  if (lang === "zh") return "zh-Hans";
  return lang;
}

export function langToHtmlLang(lang: Lang): string {
  // proper language tags for accessibility / SEO
  if (lang === "ge") return "ka";
  if (lang === "zh") return "zh-Hans";
  return lang;
}
