"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, FileText, Handshake, Mail, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { ContactSticker } from "./ContactSticker";
import { useLanguage } from "./LanguageProvider";
import type { Locale } from "@/lib/i18n";

type ContactKind = "telegram" | "mail";

type Contact = {
  channel: string;
  name: string;
  account: string;
  description: string;
  href: string;
  kind: ContactKind;
};

const contactLinks: Array<Pick<Contact, "name" | "href" | "kind">> = [
  { name: "pr@appdo.xyz", href: "mailto:pr@appdo.xyz?subject=APPDO%20商务合作", kind: "mail" },
  { name: "APPDO Bot", href: "https://t.me/appdo_bot", kind: "telegram" },
];

const collaborationCopy: Record<Locale, {
  eyebrow: string;
  titlePrefix: string;
  titleSuffix: string;
  paragraphs: string[];
  mediaKit: string;
  business: string;
  contactTitle: string;
  contacts: Array<Pick<Contact, "channel" | "account" | "description">>;
  copyEmail: string;
  copied: string;
  openContact: string;
  footer: string;
}> = {
  zh: {
    eyebrow: "合作伙伴",
    titlePrefix: "与",
    titleSuffix: "合作",
    paragraphs: [
      "下载媒体资料包，了解 APPDO 的用户画像、传播数据、内容生态与合作案例。",
      "我们提供品牌推广、产品评测、广告投放、内容合作、联合活动以及数字产品曝光服务，帮助优质产品触达更精准的数字生活用户。",
    ],
    mediaKit: "媒体资料包",
    business: "商务合作",
    contactTitle: "找到合适的合作方式",
    contacts: [
      { channel: "发送邮件", account: "商务合作邮箱", description: "品牌合作、广告投放、产品推广与联合活动。" },
      { channel: "私信 TG 机器人", account: "@appdo_bot", description: "通过 Telegram 直接咨询商务合作与内容合作。" },
    ],
    copyEmail: "复制邮箱",
    copied: "已复制",
    openContact: "打开联系方式",
    footer: "无论你在哪里，APPDO 都与你同行。帮助你发现更好用的工具与服务，提升数字生活效率与品质。",
  },
  ja: {
    eyebrow: "パートナーシップ",
    titlePrefix: "",
    titleSuffix: "と協業する",
    paragraphs: [
      "メディアキットでは、APPDOのユーザー層、リーチデータ、コンテンツエコシステム、これまでの協業事例をご覧いただけます。",
      "ブランドプロモーション、製品レビュー、広告、コンテンツ制作、共同イベント、デジタル製品の認知拡大を通じて、優れた製品を適切なデジタルライフ層へ届けます。",
    ],
    mediaKit: "メディアキット",
    business: "ビジネスのお問い合わせ",
    contactTitle: "お問い合わせ方法",
    contacts: [
      { channel: "メールを送る", account: "ビジネス窓口", description: "ブランド協業、広告、製品プロモーション、共同イベントのご相談。" },
      { channel: "Telegram Botへ連絡", account: "@appdo_bot", description: "Telegramからビジネス協業やコンテンツ連携について直接ご相談いただけます。" },
    ],
    copyEmail: "メールをコピー",
    copied: "コピー済み",
    openContact: "連絡先を開く",
    footer: "どこにいても、APPDOはあなたとともに。より良いツールとサービスを見つけ、デジタルライフの効率と質を高めます。",
  },
  en: {
    eyebrow: "Partnerships",
    titlePrefix: "Work with",
    titleSuffix: "",
    paragraphs: [
      "Download our media kit to learn about APPDO's audience, reach, content ecosystem, and partnership work.",
      "We offer brand campaigns, product reviews, advertising, content partnerships, joint events, and digital-product exposure to connect outstanding products with the right digital-life audience.",
    ],
    mediaKit: "Media kit",
    business: "Business inquiry",
    contactTitle: "Choose how to reach us",
    contacts: [
      { channel: "Send an email", account: "Business email", description: "Brand partnerships, advertising, product campaigns, and joint events." },
      { channel: "Message our Telegram bot", account: "@appdo_bot", description: "Contact us directly on Telegram about business and content partnerships." },
    ],
    copyEmail: "Copy email",
    copied: "Copied",
    openContact: "Open contact",
    footer: "Wherever you are, APPDO is with you—helping you find better tools and services for a more productive digital life.",
  },
};

function ContactIcon({ kind }: { kind: ContactKind }) {
  if (kind === "telegram") {
    return <Send className="h-5 w-5 fill-current" aria-hidden="true" />;
  }
  return <Mail className="h-5 w-5" aria-hidden="true" />;
}

function ContactCard({
  contact,
  index,
  copyEmailLabel,
  copiedLabel,
  openContactLabel,
}: {
  contact: Contact;
  index: number;
  copyEmailLabel: string;
  copiedLabel: string;
  openContactLabel: string;
}) {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    const email = "pr@appdo.xyz";
    let didCopy = false;

    try {
      await navigator.clipboard.writeText(email);
      didCopy = true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      didCopy = document.execCommand("copy");
      textarea.remove();
    }

    if (didCopy) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="collaboration-contact group flex min-h-[120px] items-center gap-4 rounded-[24px] border border-white/[0.08] bg-white/[0.03] px-5 py-5 backdrop-blur-[20px] sm:px-6"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-200/25 bg-sky-400/[0.12] text-sky-100 shadow-[0_8px_22px_rgba(36,132,255,0.18)]">
        <ContactIcon kind={contact.kind} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold tracking-[0.04em] text-sky-200/80">{contact.channel}</span>
        <span className="mt-1 block truncate text-base font-bold text-white sm:text-lg">{contact.name}</span>
        <span className="mt-0.5 block text-sm text-white/55">{contact.account}</span>
        <span className="mt-2 block line-clamp-1 text-sm text-white/70">{contact.description}</span>
      </span>
      {contact.kind === "mail" ? (
        <button
          type="button"
          onClick={copyEmail}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-sky-200/70 transition hover:border-sky-200/40 hover:bg-sky-400/[0.08] hover:text-sky-100"
          aria-label={copied ? copiedLabel : copyEmailLabel}
          title={copied ? copiedLabel : copyEmailLabel}
        >
          {copied ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
        </button>
      ) : (
        <a
          href={contact.href}
          target="_blank"
          rel="noreferrer"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-sky-200/70 transition hover:border-sky-200/40 hover:text-sky-100"
          aria-label={`${openContactLabel}: ${contact.name}`}
        >
          <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </a>
      )}
    </motion.article>
  );
}

export function CollaborationSection() {
  const reduceMotion = useReducedMotion();
  const { locale } = useLanguage();
  const copy = collaborationCopy[locale];
  const contacts = copy.contacts.map((contact, index) => ({ ...contact, ...contactLinks[index] }));

  return (
    <>
      <section id="cooperation" className="collaboration-surface relative isolate mt-12 scroll-mt-24 overflow-hidden rounded-[32px] border border-white/[0.07] px-5 py-14 shadow-[0_30px_90px_rgba(0,0,0,0.24)] sm:mt-14 sm:px-8 sm:py-16 lg:mt-16 lg:px-12 lg:py-20" aria-labelledby="collaboration-title">
        <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="grid gap-14 lg:grid-cols-[0.45fr_0.55fr] lg:items-start lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.14 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold tracking-[0.04em] text-[#3b82f6]">{copy.eyebrow}</p>
            <h2 id="collaboration-title" className="mt-5 text-5xl font-extrabold leading-[1.08] tracking-[-0.06em] text-white sm:text-6xl lg:text-[64px]">
              {copy.titlePrefix} <span className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent">APPDO</span> {copy.titleSuffix}
            </h2>
            <div className="mt-8 space-y-5 text-base leading-[1.9] text-white/75 sm:text-lg">
              {copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <motion.a
                href="https://drive.google.com/drive/folders/1hOIh3z9hcwngtjajHkSQq8oA5ilSQGJ1?usp=sharing"
                target="_blank"
                rel="noreferrer"
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="collaboration-primary-button inline-flex h-16 items-center justify-center gap-2 rounded-[18px] bg-gradient-to-br from-[#2563eb] to-[#3b82f6] px-6 text-base font-semibold text-white shadow-[0_16px_32px_rgba(37,99,235,0.3)] transition-shadow hover:shadow-[0_20px_38px_rgba(59,130,246,0.46)]"
              >
                {copy.mediaKit}
                <FileText className="h-5 w-5" aria-hidden="true" />
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </motion.a>
              <motion.a
                href="mailto:pr@appdo.xyz?subject=APPDO%20商务合作"
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex h-16 items-center justify-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.05] px-6 text-base font-semibold text-white transition-colors hover:border-sky-200/45 hover:bg-white/[0.08]"
              >
                <Handshake className="h-5 w-5 text-sky-200" aria-hidden="true" />
                {copy.business}
              </motion.a>
            </div>
          </motion.div>

          <div className="relative lg:pt-14">
            <motion.h3
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: reduceMotion ? 0 : 0.62, delay: reduceMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl font-bold leading-tight tracking-[-0.045em] text-white sm:text-5xl"
            >
              {copy.contactTitle}
            </motion.h3>
            <ContactSticker />
            <div className="mt-9 space-y-5">
              {contacts.map((contact, index) => (
                <ContactCard
                  key={contact.channel}
                  contact={contact}
                  index={index}
                  copyEmailLabel={copy.copyEmail}
                  copiedLabel={copy.copied}
                  openContactLabel={copy.openContact}
                />
              ))}
            </div>
          </div>
        </div>

        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 flex items-center justify-center gap-3 px-6 text-center lg:mt-14"
      >
        <Sparkles className="h-5 w-5 shrink-0 text-sky-200" aria-hidden="true" />
        <p className="max-w-4xl text-base leading-[1.8] text-white/80 sm:text-lg">
          {copy.footer}
        </p>
      </motion.div>
    </>
  );
}
