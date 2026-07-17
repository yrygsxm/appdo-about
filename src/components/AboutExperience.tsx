"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { BookOpen, FileText, Medal, Scale, Search, ShieldCheck, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { CollaborationSection } from "./CollaborationSection";
import { PartnerCarousel } from "./PartnerCarousel";
import { ProductMatrix } from "./ProductMatrix";
import type { Locale } from "@/lib/i18n";

type Metric = { value: number; suffix: string; label: string };
type EcosystemFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const aboutCopy: Record<Locale, {
  hero: { eyebrow: string; title: string; subtitle: string; intro: string[]; awardsAlt: string };
  impact: { label: string; metrics: Metric[] };
  mission: { eyebrow: string; title: string; paragraphs: string[] };
  ecosystem: {
    eyebrow: string;
    title: string;
    description: string;
    mainTitle: string;
    mainDescription: string;
    features: EcosystemFeature[];
  };
}> = {
  zh: {
    hero: {
      eyebrow: "关于 APPDO · 自 2020 年起",
      title: "APPDO 数字生活指南",
      subtitle: "发现更好用的 App、工具与服务，打造更高效、更安全的数字生活。",
      intro: [
        "APPDO 是一个专注于 App 评测、数字工具推荐与使用教程的内容平台。",
        "自 2020 年以来持续分享真实体验与实用指南，帮助用户发现优质产品，提升数字生活效率与品质。",
      ],
      awardsAlt: "APPDO 获奖展示：2023 至 2024 年加密媒体奖项",
    },
    impact: {
      label: "我们的影响力",
      metrics: [
        { value: 100, suffix: "万+", label: "月度读者" },
        { value: 3, suffix: "万+", label: "原创评测与教程" },
        { value: 80, suffix: "万+", label: "社交媒体关注者" },
        { value: 20, suffix: "万+", label: "电子报订阅者" },
        { value: 150, suffix: "+", label: "覆盖国家与地区" },
        { value: 4, suffix: "年+", label: "持续创作与分享" },
      ],
    },
    mission: {
      eyebrow: "我们的使命",
      title: "让数字生活变得更简单、更高效、更安全。",
      paragraphs: [
        "APPDO 数字生活指南专注于发现、评测和分享优秀的数字产品、应用程序与互联网服务。我们通过真实体验、长期测试和深入研究，为读者提供清晰、客观且具有实际参考价值的内容。",
        "在 AI、云服务、数字支付、隐私安全和生产力工具快速发展的时代，我们希望帮助每个人找到真正适合自己的数字工具，建立更高效的工作流，享受更便捷、更安全的数字生活。",
      ],
    },
    ecosystem: {
      eyebrow: "品牌矩阵",
      title: "生态系统",
      description: "多年来，APPDO 的业务范围已从内容创作扩展到更广泛的媒体、研究、活动和行业情报生态系统，服务于全球数字生活用户。",
      mainTitle: "内容创作与报道",
      mainDescription: "专注数字生活领域的深度内容创作、产品评测、教程指南、行业动态与趋势解读，帮助用户发现更好的工具与服务。",
      features: [
        { title: "评测与评论", description: "对应用程序、工具、平台、硬件和服务进行独立、客观的评测与评论，为用户提供真实可靠的参考依据。", icon: ShieldCheck },
        { title: "对比指南", description: "从功能、价格、易用性、安全性、隐私等维度进行全面对比，帮助用户做出更明智的选择。", icon: Scale },
        { title: "最佳推荐", description: "基于严格的评估标准和实际体验，精选各类数字产品与服务，为用户提供值得信赖的推荐榜单。", icon: Medal },
        { title: "研究与洞察", description: "持续追踪市场趋势、行业报告、技术创新与用户行为，提供深入分析与前瞻性洞察。", icon: Search },
      ],
    },
  },
  ja: {
    hero: {
      eyebrow: "APPDOについて · 2020年より",
      title: "APPDO デジタルライフガイド",
      subtitle: "より便利なアプリ、ツール、サービスを見つけ、効率的で安全なデジタルライフを実現します。",
      intro: [
        "APPDOは、アプリのレビュー、デジタルツールの紹介、活用ガイドに特化したコンテンツプラットフォームです。",
        "2020年以来、実体験に基づくレビューと実用的なガイドを発信し、優れた製品の発見とデジタルライフの向上を支援しています。",
      ],
      awardsAlt: "APPDOが2023年から2024年に受賞した暗号資産メディア賞",
    },
    impact: {
      label: "私たちの影響力",
      metrics: [
        { value: 100, suffix: "万+", label: "月間読者" },
        { value: 3, suffix: "万+", label: "独自レビュー・ガイド" },
        { value: 80, suffix: "万+", label: "SNSフォロワー" },
        { value: 20, suffix: "万+", label: "ニュースレター購読者" },
        { value: 150, suffix: "+", label: "対象国・地域" },
        { value: 4, suffix: "年+", label: "継続的な情報発信" },
      ],
    },
    mission: {
      eyebrow: "私たちの使命",
      title: "デジタルライフを、もっとシンプルに、効率的に、安全に。",
      paragraphs: [
        "APPDO デジタルライフガイドは、優れたデジタル製品、アプリ、インターネットサービスの発見・検証・紹介に取り組んでいます。実体験、長期テスト、綿密な調査を通じて、明快で客観的、実用性の高い情報を提供します。",
        "AI、クラウドサービス、デジタル決済、プライバシー保護、生産性ツールが急速に進化する今、一人ひとりに合うツールを見つけ、より効率的なワークフローと便利で安全なデジタルライフを築けるよう支援します。",
      ],
    },
    ecosystem: {
      eyebrow: "ブランドエコシステム",
      title: "エコシステム",
      description: "APPDOは、コンテンツ制作からメディア、調査、イベント、業界インテリジェンスへと活動領域を広げ、世界中のデジタルライフユーザーにサービスを提供しています。",
      mainTitle: "コンテンツ制作・取材",
      mainDescription: "デジタルライフ分野の詳しい記事、製品レビュー、活用ガイド、業界ニュース、トレンド分析を通じて、より良いツールとサービスの発見を支援します。",
      features: [
        { title: "レビュー・評価", description: "アプリ、ツール、プラットフォーム、ハードウェア、サービスを独立した立場で客観的に評価し、信頼できる判断材料を提供します。", icon: ShieldCheck },
        { title: "比較ガイド", description: "機能、価格、使いやすさ、安全性、プライバシーなどを総合的に比較し、より良い選択を支援します。", icon: Scale },
        { title: "ベストセレクション", description: "厳格な評価基準と実体験に基づき、信頼できるデジタル製品とサービスを厳選して紹介します。", icon: Medal },
        { title: "リサーチ・洞察", description: "市場動向、業界レポート、技術革新、ユーザー行動を継続的に追跡し、深い分析と将来を見据えた洞察を提供します。", icon: Search },
      ],
    },
  },
  en: {
    hero: {
      eyebrow: "ABOUT APPDO · SINCE 2020",
      title: "APPDO Digital Life Guide",
      subtitle: "Discover better apps, tools, and services for a more productive and secure digital life.",
      intro: [
        "APPDO is a content platform focused on app reviews, digital tool recommendations, and practical how-to guides.",
        "Since 2020, we have shared hands-on reviews and useful guides to help people discover quality products and improve their digital lives.",
      ],
      awardsAlt: "APPDO crypto media awards received between 2023 and 2024",
    },
    impact: {
      label: "Our impact",
      metrics: [
        { value: 1, suffix: "M+", label: "Monthly readers" },
        { value: 30, suffix: "K+", label: "Original reviews & guides" },
        { value: 800, suffix: "K+", label: "Social media followers" },
        { value: 200, suffix: "K+", label: "Newsletter subscribers" },
        { value: 150, suffix: "+", label: "Countries & regions" },
        { value: 4, suffix: "+ years", label: "Publishing and sharing" },
      ],
    },
    mission: {
      eyebrow: "Our mission",
      title: "Make digital life simpler, more productive, and more secure.",
      paragraphs: [
        "APPDO Digital Life Guide discovers, reviews, and shares outstanding digital products, apps, and online services. Through hands-on experience, long-term testing, and in-depth research, we provide clear, objective, and genuinely useful guidance.",
        "As AI, cloud services, digital payments, privacy tools, and productivity software evolve rapidly, we help people find the tools that truly fit their needs, build better workflows, and enjoy a more convenient and secure digital life.",
      ],
    },
    ecosystem: {
      eyebrow: "Brand ecosystem",
      title: "Ecosystem",
      description: "Over the years, APPDO has expanded beyond content creation into a broader ecosystem of media, research, events, and industry intelligence for digital-life audiences worldwide.",
      mainTitle: "Content & reporting",
      mainDescription: "We create in-depth digital-life stories, product reviews, practical guides, industry coverage, and trend analysis to help people discover better tools and services.",
      features: [
        { title: "Reviews & commentary", description: "Independent, objective reviews of apps, tools, platforms, hardware, and services that give readers reliable information for their decisions.", icon: ShieldCheck },
        { title: "Comparison guides", description: "Clear comparisons across features, pricing, usability, security, and privacy to help people make smarter choices.", icon: Scale },
        { title: "Best picks", description: "Trusted recommendations for digital products and services, selected through rigorous criteria and real-world experience.", icon: Medal },
        { title: "Research & insights", description: "Ongoing analysis of market trends, industry reports, technology innovation, and user behavior, with a forward-looking perspective.", icon: Search },
      ],
    },
  },
};

const ecosystemOrbitIcons: Array<{ icon: LucideIcon; className: string; delay: number }> = [
  { icon: Search, className: "left-[8%] top-[19%]", delay: 0 },
  { icon: FileText, className: "right-[7%] top-[12%]", delay: 0.45 },
  { icon: Wrench, className: "bottom-[15%] left-[16%]", delay: 0.9 },
  { icon: BookOpen, className: "bottom-[8%] right-[14%]", delay: 1.35 },
  { icon: Medal, className: "left-[42%] bottom-[1%]", delay: 1.8 },
];

function AnimatedMetric({ value, suffix, label, index }: Metric & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.55 });
  const reduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView || reduceMotion) return;

    const controls = animate(0, value, {
      duration: 1.2,
      delay: index * 0.08,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [index, isInView, reduceMotion, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, delay: index * 0.05 }}
      className="rounded-xl px-1.5 py-2 transition-colors hover:bg-white/[0.045] sm:rounded-2xl sm:px-3"
    >
      <div className="whitespace-nowrap text-[28px] font-extrabold leading-none tracking-[-0.05em] text-white sm:text-[40px] lg:text-[52px]">
        {reduceMotion && isInView ? value : displayValue}
        {suffix}
      </div>
      <p className="mt-1.5 text-xs leading-snug text-white/70 sm:mt-2 sm:text-base lg:text-lg">{label}</p>
    </motion.div>
  );
}

function EcosystemVisual({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="ecosystem-visual relative min-h-64 overflow-hidden rounded-[24px] sm:min-h-72 lg:min-h-full" aria-hidden="true">
      <div className="ecosystem-pulse absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/25 blur-3xl" />
      <div className="ecosystem-orbit absolute left-1/2 top-1/2 h-44 w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-sky-300/25" />
      <div className="ecosystem-orbit ecosystem-orbit--reverse absolute left-1/2 top-1/2 h-36 w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-indigo-300/20" />
      <div className="absolute left-[6%] top-1/2 h-px w-[88%] -translate-y-1/2 bg-gradient-to-r from-transparent via-sky-300/50 to-transparent" />

      {ecosystemOrbitIcons.map(({ icon: Icon, className, delay }) => (
        <motion.div
          key={className}
          animate={reduceMotion ? undefined : { y: [0, -5, 0], rotate: [0, 3, 0] }}
          transition={reduceMotion ? undefined : { duration: 4.5, delay, ease: "easeInOut", repeat: Infinity }}
          className={`absolute ${className} flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-sky-100 shadow-[0_10px_26px_rgba(20,112,255,0.2)] backdrop-blur-xl sm:h-11 sm:w-11`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
        </motion.div>
      ))}

      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, 1.5, 0] }}
        transition={reduceMotion ? undefined : { duration: 6.5, ease: "easeInOut", repeat: Infinity }}
        className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 [perspective:1000px] sm:h-36 sm:w-36"
      >
        <div className="relative flex h-full w-full items-center justify-center rounded-[28px] border border-sky-100/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.38),rgba(126,189,255,0.2)_44%,rgba(47,96,210,0.58))] shadow-[0_18px_48px_rgba(25,115,255,0.46)] backdrop-blur-xl [transform:rotateX(55deg)_rotateZ(-36deg)] [transform-style:preserve-3d]">
          <div className="absolute inset-2 rounded-[21px] border border-white/25 bg-slate-950/15" />
          <span className="relative -rotate-[9deg] text-lg font-black tracking-[0.16em] text-white drop-shadow-[0_3px_10px_rgba(5,45,105,0.8)] sm:text-xl">
            APPDO
          </span>
          <span className="absolute -bottom-4 left-5 h-4 w-[calc(100%-1.4rem)] rounded-b-2xl border-x border-b border-sky-300/20 bg-[#174aa3]/60 blur-[0.2px]" />
        </div>
      </motion.div>
    </div>
  );
}

function EcosystemFeatureCard({
  feature,
  index,
  reduceMotion,
}: {
  feature: EcosystemFeature;
  index: number;
  reduceMotion: boolean | null;
}) {
  const Icon = feature.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={reduceMotion ? undefined : { y: -8 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="ecosystem-card group rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-7 shadow-[0_18px_48px_rgba(0,0,0,0.14)] backdrop-blur-[20px] sm:p-10"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-[linear-gradient(135deg,rgba(114,186,255,0.28),rgba(121,82,255,0.22))] text-sky-100 shadow-[0_8px_24px_rgba(46,123,255,0.18)] transition-transform duration-300 group-hover:rotate-6">
        <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <h3 className="mt-8 text-xl font-bold tracking-[-0.025em] text-white">{feature.title}</h3>
      <p className="mt-4 text-sm leading-[1.8] text-white/75 sm:text-base">{feature.description}</p>
    </motion.article>
  );
}

export function AboutExperience() {
  const reduceMotion = useReducedMotion();
  const { locale } = useLanguage();
  const copy = aboutCopy[locale];
  const metrics = copy.impact.metrics;
  const ecosystemFeatures = copy.ecosystem.features;
  const transition = { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <main id="about" className="about-surface relative isolate overflow-hidden text-white">
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-24">
        <section className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={transition}
          >
            <p className="text-sm font-semibold tracking-[0.04em] text-[#4ea1ff]">{copy.hero.eyebrow}</p>
            <h1 className="mt-8 max-w-3xl text-5xl font-extrabold leading-[1.1] tracking-[-0.055em] text-white sm:text-6xl lg:text-[64px]">
              {copy.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-medium leading-relaxed text-white/80 sm:text-2xl">
              {copy.hero.subtitle}
            </p>
            <div className="mt-8 max-w-2xl space-y-5 text-base leading-[1.8] text-white/75 sm:text-lg">
              {copy.hero.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ ...transition, delay: reduceMotion ? 0 : 0.14 }}
            className="w-full"
          >
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={reduceMotion ? undefined : { duration: 7.5, ease: "easeInOut", repeat: Infinity }}
              whileHover={reduceMotion ? undefined : { y: -4, scale: 1.015 }}
              className="relative aspect-[781/325] w-full origin-center drop-shadow-[0_24px_42px_rgba(0,0,0,0.3)]"
            >
              <Image
                src="/assets/appdo-awards.webp"
                alt={copy.hero.awardsAlt}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 42vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ ...transition, delay: reduceMotion ? 0 : 0.12 }}
          className="about-impact-card mt-10 grid gap-6 rounded-[28px] border border-white/[0.08] bg-white/[0.05] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-[30px] sm:mt-12 sm:min-h-[320px] sm:gap-10 sm:p-12 lg:mt-14 lg:grid-cols-[0.25fr_0.75fr] lg:p-[60px]"
        >
          <div className="about-impact-sidebar flex items-baseline justify-between border-b border-white/[0.1] pb-4 sm:flex-col sm:justify-center sm:pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
            <p className="text-sm font-semibold text-white/75 sm:text-xl">{copy.impact.label}</p>
            <p className="text-2xl font-extrabold tracking-[-0.05em] text-white sm:mt-2 sm:text-[40px]">APPDO</p>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-y-6 lg:grid-cols-3 lg:gap-y-8">
            {metrics.map((metric, index) => (
              <AnimatedMetric key={metric.label} {...metric} index={index} />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ ...transition, delay: reduceMotion ? 0 : 0.08 }}
          className="about-mission-section mt-10 border-t border-white/[0.1] pt-10 sm:mt-12 sm:pt-12 lg:mt-14 lg:pt-14"
          aria-labelledby="mission-title"
        >
          <div className="max-w-[1180px]">
            <p className="text-sm font-semibold tracking-[0.04em] text-[#4ea1ff]">{copy.mission.eyebrow}</p>
            <h2 id="mission-title" className="mt-5 text-3xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
              {copy.mission.title}
            </h2>
            <div className="mt-8 space-y-6 text-base leading-[1.9] text-white/75 sm:text-lg">
              {copy.mission.paragraphs.map((paragraph) => <p key={paragraph} className="break-words">{paragraph}</p>)}
            </div>
          </div>
        </motion.section>

        <div id="ecosystem" className="about-ecosystem-wrap mt-12 scroll-mt-24 border-t border-white/[0.1] pt-12 sm:mt-14 sm:pt-14 lg:mt-16 lg:pt-16">
          <section
            className="ecosystem-surface relative isolate overflow-hidden rounded-[32px] border border-white/[0.07] px-5 py-16 shadow-[0_30px_90px_rgba(0,0,0,0.24)] sm:px-8 sm:py-20 lg:px-12 lg:py-24"
            aria-labelledby="ecosystem-title"
          >
            <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={transition}
            >
              <p className="text-sm font-semibold tracking-[0.04em] text-[#78b7ff]">{copy.ecosystem.eyebrow}</p>
              <h2 id="ecosystem-title" className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-[#73c4ff] via-[#4e9dff] to-[#8b7bff] bg-clip-text text-transparent">APPDO</span>{" "}
                {copy.ecosystem.title}
              </h2>
              <p className="mt-6 max-w-5xl text-base leading-[1.8] text-white/75 sm:text-lg">
                {copy.ecosystem.description}
              </p>
            </motion.div>

            <div className="mt-12">
              <div className="grid gap-5 lg:grid-cols-[7fr_3fr]">
                <motion.article
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.16 }}
                  whileHover={reduceMotion ? undefined : { y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="ecosystem-card group min-h-[400px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-7 shadow-[0_18px_48px_rgba(0,0,0,0.14)] backdrop-blur-[20px] sm:p-10"
                >
                  <div className="grid h-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div className="relative z-10 max-w-md">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-[linear-gradient(135deg,rgba(114,186,255,0.28),rgba(121,82,255,0.22))] text-sky-100 shadow-[0_8px_24px_rgba(46,123,255,0.18)] transition-transform duration-300 group-hover:rotate-6">
                        <FileText className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                      </div>
                      <h3 className="mt-8 text-2xl font-bold tracking-[-0.035em] text-white sm:text-3xl">{copy.ecosystem.mainTitle}</h3>
                      <p className="mt-5 text-sm leading-[1.9] text-white/75 sm:text-base">
                        {copy.ecosystem.mainDescription}
                      </p>
                    </div>
                    <EcosystemVisual reduceMotion={reduceMotion} />
                  </div>
                </motion.article>

                <EcosystemFeatureCard feature={ecosystemFeatures[0]} index={1} reduceMotion={reduceMotion} />
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {ecosystemFeatures.slice(1).map((feature, index) => (
                  <EcosystemFeatureCard key={feature.title} feature={feature} index={index + 2} reduceMotion={reduceMotion} />
                ))}
              </div>
            </div>
            </div>
          </section>
        </div>

        <ProductMatrix />
        <PartnerCarousel />
        <CollaborationSection />
      </div>
    </main>
  );
}
