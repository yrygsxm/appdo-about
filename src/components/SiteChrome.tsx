"use client";

import Image from "next/image";
import { Mail, Send } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "./LanguageProvider";

export function SiteHeader() {
  const { t } = useLanguage();
  const links = [
    { href: "#about", label: t("nav", "about") },
    { href: "#ecosystem", label: t("nav", "ecosystem") },
    { href: "#products", label: t("nav", "products") },
    { href: "#cooperation", label: t("nav", "cooperation") },
  ];

  return (
    <header className="site-header sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
        <a href="#about" className="flex items-center gap-3" aria-label="APPDO">
          <Image src="/assets/appdo-logo.png" alt="" width={40} height={40} className="brand-logo-image h-9 w-9 rounded-xl object-contain" priority />
          <span className="text-lg font-extrabold tracking-[-0.04em] text-slate-100">APPDO</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-400 transition hover:text-white">{link.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { locale } = useLanguage();
  const copy = {
    zh: "发现更好的数字产品，打造更高效、更安全的数字生活。",
    ja: "より良いデジタル製品を見つけ、効率的で安全なデジタルライフを。",
    en: "Discover better digital products for a more productive and secure digital life.",
  }[locale];

  return (
    <footer className="site-footer border-t bg-slate-950">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <Image
            src="/assets/appdo-logo.png"
            alt="APPDO"
            width={198}
            height={82}
            className="brand-logo-image h-auto w-[132px] shrink-0 object-contain sm:w-[176px]"
          />
          <p className="max-w-md text-sm leading-6 text-slate-400 sm:text-[15px]">{copy}</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://x.com/APPDOTG" target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-xl border border-slate-700 bg-slate-900/80 px-4 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white">X</a>
          <a href="https://t.me/AppDoDo" target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"><Send className="h-4 w-4" />Telegram</a>
          <a href="mailto:pr@appdo.xyz" className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"><Mail className="h-4 w-4" />Email</a>
        </div>
      </div>
    </footer>
  );
}
