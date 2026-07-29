"use client";

import Image from "next/image";
import { Mail, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "./LanguageProvider";

export function SiteHeader() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const linksRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const links = [
    { href: "#about", label: t("nav", "about") },
    { href: "#products", label: t("nav", "products") },
    { href: "#ecosystem", label: t("nav", "ecosystem") },
    { href: "#cooperation", label: t("nav", "cooperation") },
  ];

  useEffect(() => {
    const syncScrollState = () => setIsScrolled(window.scrollY > 24);

    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncScrollState);
    };
  }, []);

  function moveHighlight(link: HTMLAnchorElement) {
    const linksElement = linksRef.current;
    const highlight = highlightRef.current;
    if (!linksElement || !highlight) return;

    const parentRect = linksElement.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    highlight.style.setProperty("--nav-highlight-x", `${linkRect.left - parentRect.left}px`);
    highlight.style.setProperty("--nav-highlight-width", `${linkRect.width}px`);
    highlight.style.setProperty("--nav-highlight-height", `${linkRect.height}px`);
    highlight.classList.add("is-visible");
  }

  function hideHighlight() {
    highlightRef.current?.classList.remove("is-visible");
  }

  return (
    <>
      <div className="site-header-spacer h-16" aria-hidden="true" />
      <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
        <div className="site-header-frame">
          <nav
            ref={linksRef}
            className="site-nav-links hidden md:flex"
            aria-label="Primary navigation"
            onPointerLeave={hideHighlight}
          >
            <span ref={highlightRef} className="site-nav-highlight" aria-hidden="true" />
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="site-nav-link"
                onPointerEnter={(event) => moveHighlight(event.currentTarget)}
                onFocus={(event) => moveHighlight(event.currentTarget)}
                onBlur={hideHighlight}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="site-nav-actions">
            <LanguageSwitcher />
            <ThemeToggle />
            <a className="nav-contact-button" href="#cooperation">
              <span>{t("nav", "contact")}</span>
            </a>
          </div>
        </div>
      </header>
    </>
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
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Image
            src="/assets/appdo-logo.png"
            alt="APPDO"
            width={158}
            height={66}
            className="brand-logo-image h-auto w-[106px] shrink-0 object-contain sm:w-[141px]"
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
