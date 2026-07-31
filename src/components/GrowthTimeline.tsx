"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useLanguage } from "./LanguageProvider";
import type { Locale } from "@/lib/i18n";

type TimelineEntry = {
  date: string;
  title?: string;
  paragraphs: string[];
};

type TimelineCopy = {
  eyebrow: string;
  title: string;
  previous: string;
  next: string;
  entries: TimelineEntry[];
};

const timelineCopy: Record<Locale, TimelineCopy> = {
  zh: {
    eyebrow: "成长轨迹",
    title: "成长时间线",
    previous: "查看上一阶段",
    next: "查看下一阶段",
    entries: [
      {
        date: "2020 年 2 月 28 日",
        title: "频道正式创建，并发布第一篇内容。",
        paragraphs: ["从这一刻开始，这里专注分享互联网工具、数字生活、安全隐私、AI 与技术资讯，希望把复杂的内容整理成人人都能理解、能够真正解决问题的文章。"],
      },
      {
        date: "2021 年 1 月 22 日",
        title: "订阅人数突破 2,236 人。",
        paragraphs: ["频道成立后的 306 天，共发布 75 篇原创内容，收获 953 位早期订阅者。随后，越来越多读者主动分享和推荐，频道首次突破两千订阅。"],
      },
      {
        date: "2022 年 5 月 10 日",
        title: "订阅人数突破 8,234 人。",
        paragraphs: ["频道开始保持稳定更新，内容逐渐覆盖 VPN、网络安全、数字隐私、软件推荐、AI 工具等多个方向，影响力持续扩大。"],
      },
      {
        date: "2022 年 12 月 14 日",
        title: "订阅人数突破 18,602 人。",
        paragraphs: ["频道进入快速增长阶段，越来越多读者通过口碑推荐加入，也开始与更多开发者、品牌和社区建立合作。"],
      },
      {
        date: "2023 年",
        title: "累计阅读量突破 100 万。",
        paragraphs: ["原创教程、工具评测与行业观察持续获得传播，频道内容累计阅读量首次突破百万，逐步形成覆盖数字生活多个领域的内容资料库。"],
      },
      {
        date: "2025 年 1 月 23 日",
        title: "订阅人数突破 34,210 人。",
        paragraphs: ["频道持续保持高频原创更新，内容进一步扩展至 AI、大模型、数字金融、网络安全、跨境互联网、隐私保护等领域，逐渐发展成为中文互联网具有一定影响力的科技资讯频道。"],
      },
      {
        date: "2026 年 7 月",
        title: "主频道订阅突破 40,000 人。",
        paragraphs: ["与此同时，专注互联网历史、产品演变和数字文化内容的子频道也成长至 15,000 位订阅者。"],
      },
      {
        date: "展望未来",
        title: "继续记录技术如何改变世界。",
        paragraphs: [
          "截至目前，两个频道累计拥有 55,000+ 位订阅者，每天持续分享最新科技动态、深度教程与互联网观察，希望帮助更多人理解技术、用好技术。",
          "未来，我们仍将坚持原创和长期更新，继续带来值得阅读的内容，与大家一起记录互联网的发展。",
        ],
      },
    ],
  },
  ja: {
    eyebrow: "成長の軌跡",
    title: "成長タイムライン",
    previous: "前のステージを見る",
    next: "次のステージを見る",
    entries: [
      {
        date: "2020年2月28日",
        title: "チャンネルを開設し、最初の記事を公開。",
        paragraphs: ["インターネットツール、デジタルライフ、セキュリティとプライバシー、AI、テクノロジー情報を中心に、複雑なテーマを誰もが理解し、実際の課題解決に役立てられる記事へ整理する活動を始めました。"],
      },
      {
        date: "2021年1月22日",
        title: "購読者数が2,236人を突破。",
        paragraphs: ["開設から306日で75本のオリジナル記事を公開し、953人の初期購読者に支えられました。その後、読者からの共有と推薦が広がり、初めて2,000人を超えました。"],
      },
      {
        date: "2022年5月10日",
        title: "購読者数が8,234人を突破。",
        paragraphs: ["安定した更新を続け、VPN、ネットワークセキュリティ、デジタルプライバシー、ソフトウェア、AIツールへとテーマを広げ、影響力を伸ばしました。"],
      },
      {
        date: "2022年12月14日",
        title: "購読者数が18,602人を突破。",
        paragraphs: ["口コミによる参加が増え、急成長期へ。開発者、ブランド、コミュニティとの協業も広がり始めました。"],
      },
      {
        date: "2023年",
        title: "累計閲覧数が100万回を突破。",
        paragraphs: ["独自チュートリアル、ツールレビュー、業界考察が広く共有され、コンテンツの累計閲覧数が初めて100万回を突破。デジタルライフの幅広い領域を扱う知識アーカイブへと成長しました。"],
      },
      {
        date: "2025年1月23日",
        title: "購読者数が34,210人を突破。",
        paragraphs: ["高頻度の独自発信を続け、AI、大規模言語モデル、デジタル金融、サイバーセキュリティ、越境インターネット、プライバシー保護まで領域を拡大。中国語圏で存在感を持つテクノロジーチャンネルへ成長しました。"],
      },
      {
        date: "2026年7月",
        title: "メインチャンネルが40,000人を突破。",
        paragraphs: ["インターネット史、製品の変遷、デジタル文化を扱うサブチャンネルも15,000人まで成長しました。"],
      },
      {
        date: "これから",
        title: "技術が変える世界を記録し続けます。",
        paragraphs: [
          "2つのチャンネルは計55,000人以上へ成長しました。これからも独自のテック情報と実践ガイドを届け、皆さまとインターネットの変化を記録していきます。",
        ],
      },
    ],
  },
  en: {
    eyebrow: "Our journey",
    title: "Growth timeline",
    previous: "View previous milestone",
    next: "View next milestone",
    entries: [
      {
        date: "February 28, 2020",
        title: "The channel launched with its first story.",
        paragraphs: ["We began covering internet tools, digital life, security and privacy, AI, and technology—turning complex subjects into clear, useful articles that help people solve real problems."],
      },
      {
        date: "January 22, 2021",
        title: "Subscribers passed 2,236.",
        paragraphs: ["In the first 306 days, we published 75 original stories and welcomed 953 early subscribers. Reader recommendations and organic sharing then carried the channel past its first two-thousand-subscriber milestone."],
      },
      {
        date: "May 10, 2022",
        title: "Subscribers passed 8,234.",
        paragraphs: ["A consistent publishing rhythm expanded our coverage across VPNs, cybersecurity, digital privacy, software recommendations, and AI tools, steadily growing our reach."],
      },
      {
        date: "December 14, 2022",
        title: "Subscribers passed 18,602.",
        paragraphs: ["The channel entered a period of rapid growth through word-of-mouth recommendations and began building more partnerships with developers, brands, and communities."],
      },
      {
        date: "2023",
        title: "Cumulative reads passed one million.",
        paragraphs: ["Original tutorials, tool reviews, and industry observations continued to travel widely. Total readership passed one million, and the channel evolved into a growing knowledge archive across the digital-life landscape."],
      },
      {
        date: "January 23, 2025",
        title: "Subscribers passed 34,210.",
        paragraphs: ["Frequent original reporting expanded into AI, foundation models, digital finance, cybersecurity, the global internet, and privacy—establishing the channel as an influential Chinese-language technology publication."],
      },
      {
        date: "July 2026",
        title: "The main channel passed 40,000 subscribers.",
        paragraphs: ["Our companion channel on internet history, product evolution, and digital culture also grew to 15,000 subscribers."],
      },
      {
        date: "Looking ahead",
        title: "We will keep documenting a changing digital world.",
        paragraphs: [
          "Together, our channels reach 55,000+ subscribers. We will keep publishing original tech updates and practical guides while documenting the internet’s evolution.",
        ],
      },
    ],
  },
};

export function GrowthTimeline() {
  const reduceMotion = useReducedMotion();
  const { locale } = useLanguage();
  const copy = timelineCopy[locale];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.04, margin: "240px 0px" });

  function scrollTimeline(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const distance = Math.min(scroller.clientWidth * 0.82, 430);
    scroller.scrollBy({ left: direction * distance, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <section ref={sectionRef} className={`about-timeline-section mt-10 border-t border-white/[0.1] pt-10 sm:mt-12 sm:pt-12 lg:mt-14 lg:pt-14 ${isInView ? "is-in-view" : ""}`} aria-labelledby="growth-timeline-title">
      <div className="flex items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: reduceMotion ? 0 : 0.66, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm font-semibold tracking-[0.04em] text-[#4ea1ff]">{copy.eyebrow}</p>
          <h2 id="growth-timeline-title" className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">{copy.title}</h2>
        </motion.div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button type="button" onClick={() => scrollTimeline(-1)} className="timeline-control inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sky-100 transition hover:border-sky-300/35 hover:bg-white/[0.08]" aria-label={copy.previous} title={copy.previous}>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scrollTimeline(1)} className="timeline-control inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sky-100 transition hover:border-sky-300/35 hover:bg-white/[0.08]" aria-label={copy.next} title={copy.next}>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="timeline-scroll-shell relative mt-10 sm:mt-12">
        <div className="timeline-line-horizontal absolute left-0 right-0 top-[7px] h-px" aria-hidden="true" />
        <div ref={scrollerRef} className="timeline-horizontal flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 pt-0 sm:gap-6" aria-label={copy.title}>
          {copy.entries.map((entry, index) => (
            <div key={entry.date} className="relative w-[82vw] max-w-[390px] shrink-0 snap-start pt-10 sm:w-[380px]">
              <span className="timeline-dot absolute left-6 top-[1px] z-10 h-[13px] w-[13px] rounded-full" aria-hidden="true" />
              <motion.article
                initial={{ opacity: 0, x: reduceMotion ? 0 : 24, y: 14 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : Math.min(index, 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="timeline-card flex h-[380px] flex-col rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.14)] backdrop-blur-[20px] sm:h-[360px] sm:p-7"
              >
                <p className="inline-flex w-fit rounded-full border border-sky-300/20 bg-sky-400/[0.1] px-3 py-1 text-xs font-semibold tracking-[0.035em] text-sky-200">{entry.date}</p>
                {entry.title ? <h3 className="mt-5 text-xl font-bold leading-snug tracking-[-0.025em] text-white sm:text-2xl">{entry.title}</h3> : null}
                <div className="mt-4 space-y-4 text-sm leading-[1.85] text-white/75 sm:text-base">
                  {entry.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </motion.article>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
