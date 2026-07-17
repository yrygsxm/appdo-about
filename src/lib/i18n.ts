export const locales = ["zh", "ja", "en"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  zh: "中文",
  ja: "日本語",
  en: "English",
};

export const localeHtmlLang: Record<Locale, string> = {
  zh: "zh-CN",
  ja: "ja",
  en: "en",
};

export function resolveLocale(value: string | null | undefined): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : "zh";
}

const navCopy: Record<Locale, Record<string, string>> = {
  zh: { language: "切换语言", about: "关于我们", ecosystem: "生态系统", products: "产品矩阵", cooperation: "合作" },
  ja: { language: "言語を切り替え", about: "私たちについて", ecosystem: "エコシステム", products: "プロダクト", cooperation: "協業" },
  en: { language: "Switch language", about: "About", ecosystem: "Ecosystem", products: "Products", cooperation: "Partnerships" },
};

export function t(locale: Locale, _scope: "nav", key: string) {
  return navCopy[locale][key] ?? navCopy.zh[key] ?? key;
}
