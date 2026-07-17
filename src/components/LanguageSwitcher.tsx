"use client";

import { Languages } from "lucide-react";
import { localeLabels, locales } from "@/lib/i18n";
import { useLanguage } from "@/components/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <label
      className="header-icon-button relative inline-flex h-10 items-center gap-1 rounded-full px-2 transition focus-within:ring-4 focus-within:ring-emerald-300/35"
      title={t("nav", "language")}
      aria-label={t("nav", "language")}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span className="text-xs font-semibold leading-none">{localeLabels[locale]}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as typeof locale)}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 outline-none"
        aria-label={t("nav", "language")}
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
