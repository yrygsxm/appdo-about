"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import type { Locale } from "@/lib/i18n";

type Partner = {
  name: string;
  domain?: string;
  fallback: string;
};

const partners: Partner[] = [
  { name: "OneKey", domain: "onekey.so", fallback: "1K" },
  { name: "Keystone", domain: "keyst.one", fallback: "K" },
  { name: "Bybit Wallet", domain: "bybit.com", fallback: "BY" },
  { name: "Bitget", domain: "bitget.com", fallback: "B" },
  { name: "Plasma", domain: "plasma.to", fallback: "P" },
  { name: "Tangem", domain: "tangem.com", fallback: "T" },
  { name: "数码荔枝", fallback: "荔" },
  { name: "复星证券", domain: "fosun.com", fallback: "复" },
  { name: "长桥证券", domain: "longbridge.com", fallback: "长" },
  { name: "moomoo", domain: "moomoo.com", fallback: "m" },
  { name: "少数派", domain: "sspai.com", fallback: "少" },
  { name: "Starryblu", domain: "starryblu.com", fallback: "S" },
  { name: "Backpack", domain: "backpack.exchange", fallback: "B" },
];

const partnerCopy: Record<Locale, { eyebrow: string; title: string; aria: string }> = {
  zh: { eyebrow: "合作网络", title: "APPDO 合作品牌", aria: "APPDO 合作品牌列表" },
  ja: { eyebrow: "パートナーネットワーク", title: "APPDO パートナー企業", aria: "APPDO パートナー企業一覧" },
  en: { eyebrow: "Partner network", title: "APPDO partners", aria: "APPDO partner list" },
};

function PartnerLogo({ partner }: { partner: Partner }) {
  const [failed, setFailed] = useState(!partner.domain);

  return (
    <span className="partner-logo" aria-hidden="true">
      {!failed && partner.domain ? (
        // Google favicon is used as a lightweight remote logo source, with a text fallback for unavailable domains.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://www.google.com/s2/favicons?sz=64&domain=${partner.domain}`}
          alt=""
          className="h-7 w-7 rounded-md object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-sm font-black tracking-[-0.06em] text-sky-100">{partner.fallback}</span>
      )}
    </span>
  );
}

function PartnerItem({ partner }: { partner: Partner }) {
  return (
    <article className="partner-marquee-item flex h-[72px] min-w-[180px] items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 backdrop-blur-xl">
      <PartnerLogo partner={partner} />
      <p className="whitespace-nowrap text-sm font-semibold tracking-[-0.015em] text-white/85">{partner.name}</p>
    </article>
  );
}

export function PartnerCarousel() {
  const reduceMotion = useReducedMotion();
  const { locale } = useLanguage();
  const copy = partnerCopy[locale];

  return (
    <section className="partner-section mt-8 border-t border-white/[0.1] pt-10 lg:mt-10 lg:pt-12" aria-labelledby="partner-title">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reduceMotion ? 0 : 0.58, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-sm font-semibold tracking-[0.04em] text-[#78b7ff]">{copy.eyebrow}</p>
        <h2 id="partner-title" className="mt-4 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
          {copy.title}
        </h2>
      </motion.div>

      <div className="partner-marquee mt-9 overflow-hidden" aria-label={copy.aria}>
        <div className={`partner-marquee-track ${reduceMotion ? "partner-marquee-track--static" : ""}`}>
          <div className="flex gap-4">
            {partners.map((partner) => (
              <PartnerItem key={partner.name} partner={partner} />
            ))}
          </div>
          <div className="flex gap-4" aria-hidden="true">
            {partners.map((partner) => (
              <PartnerItem key={`${partner.name}-duplicate`} partner={partner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
