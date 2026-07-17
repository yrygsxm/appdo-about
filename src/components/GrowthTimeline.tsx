"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
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
  entries: TimelineEntry[];
  closingTitle: string;
  closingParagraphs: string[];
};

const timelineCopy: Record<Locale, TimelineCopy> = {
  zh: {
    eyebrow: "成长轨迹",
    title: "成长时间线",
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
        date: "2022 年 9 月 19 日",
        title: "订阅人数突破 12,368 人。",
        paragraphs: ["随着内容体系逐渐完善，频道形成了以原创教程、热点解读、工具测评和行业观察为核心的更新风格，读者规模首次突破一万人。"],
      },
      {
        date: "2022 年 12 月 14 日",
        title: "订阅人数突破 18,602 人。",
        paragraphs: ["频道进入快速增长阶段，越来越多读者通过口碑推荐加入，也开始与更多开发者、品牌和社区建立合作。"],
      },
      {
        date: "2025 年 1 月 23 日",
        title: "订阅人数突破 34,210 人。",
        paragraphs: ["频道持续保持高频原创更新，内容进一步扩展至 AI、大模型、数字金融、网络安全、跨境互联网、隐私保护等领域，逐渐发展成为中文互联网具有一定影响力的科技资讯频道。"],
      },
      {
        date: "2026 年 7 月",
        title: "主频道订阅突破 39,000 人。",
        paragraphs: [
          "与此同时，专注互联网历史、产品演变和数字文化内容的子频道也成长至 15,000 位订阅者。",
          "截至目前，两个频道累计拥有 54,000+ 位订阅者，每天持续分享最新科技动态、深度教程与互联网观察，希望帮助更多人理解技术、用好技术。",
        ],
      },
    ],
    closingTitle: "感谢一路同行",
    closingParagraphs: [
      "从最初的几十位读者，到今天数万名订阅者，这一路的发展离不开每一位关注、转发、留言和建议的朋友。",
      "感谢每一次阅读、每一次分享、每一次讨论。",
      "未来，我们仍将坚持原创，坚持长期更新，继续带来值得阅读的内容，与大家一起记录互联网的发展，也一起见证技术不断改变世界。",
    ],
  },
  ja: {
    eyebrow: "成長の軌跡",
    title: "成長タイムライン",
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
        date: "2022年9月19日",
        title: "購読者数が12,368人を突破。",
        paragraphs: ["独自チュートリアル、ニュース解説、ツールレビュー、業界観察を軸とする編集スタイルが形になり、読者数が初めて1万人を超えました。"],
      },
      {
        date: "2022年12月14日",
        title: "購読者数が18,602人を突破。",
        paragraphs: ["口コミによる参加が増え、急成長期へ。開発者、ブランド、コミュニティとの協業も広がり始めました。"],
      },
      {
        date: "2025年1月23日",
        title: "購読者数が34,210人を突破。",
        paragraphs: ["高頻度の独自発信を続け、AI、大規模言語モデル、デジタル金融、サイバーセキュリティ、越境インターネット、プライバシー保護まで領域を拡大。中国語圏で存在感を持つテクノロジーチャンネルへ成長しました。"],
      },
      {
        date: "2026年7月",
        title: "メインチャンネルが39,000人を突破。",
        paragraphs: [
          "インターネット史、製品の変遷、デジタル文化を扱うサブチャンネルも15,000人まで成長しました。",
          "現在、2つのチャンネルは合計54,000人以上の購読者を持ち、最新テックニュース、実践ガイド、インターネット考察を毎日届けています。",
        ],
      },
    ],
    closingTitle: "ともに歩んでくださった皆さまへ",
    closingParagraphs: [
      "数十人の読者から始まった歩みが、今では数万人へ。フォロー、共有、コメント、提案を寄せてくださった一人ひとりに支えられています。",
      "すべての閲覧、共有、対話に心から感謝します。",
      "これからも独自性と長期的な発信を大切にし、読む価値のあるコンテンツを届けながら、インターネットとテクノロジーの変化を皆さまと記録していきます。",
    ],
  },
  en: {
    eyebrow: "Our journey",
    title: "Growth timeline",
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
        date: "September 19, 2022",
        title: "Subscribers passed 12,368.",
        paragraphs: ["Our editorial voice took shape around original tutorials, timely explainers, tool reviews, and industry observations, taking the readership beyond 10,000 for the first time."],
      },
      {
        date: "December 14, 2022",
        title: "Subscribers passed 18,602.",
        paragraphs: ["The channel entered a period of rapid growth through word-of-mouth recommendations and began building more partnerships with developers, brands, and communities."],
      },
      {
        date: "January 23, 2025",
        title: "Subscribers passed 34,210.",
        paragraphs: ["Frequent original reporting expanded into AI, foundation models, digital finance, cybersecurity, the global internet, and privacy—establishing the channel as an influential Chinese-language technology publication."],
      },
      {
        date: "July 2026",
        title: "The main channel passed 39,000 subscribers.",
        paragraphs: [
          "Our companion channel on internet history, product evolution, and digital culture also grew to 15,000 subscribers.",
          "Together, the two channels now reach more than 54,000 subscribers with daily technology updates, in-depth tutorials, and observations that help more people understand and use technology well.",
        ],
      },
    ],
    closingTitle: "Thank you for growing with us",
    closingParagraphs: [
      "From our first few dozen readers to tens of thousands today, every follow, share, comment, and suggestion has shaped this journey.",
      "Thank you for every read, every share, and every conversation.",
      "We will keep creating original work, publishing for the long term, and sharing stories worth reading—documenting the evolution of the internet and the ways technology continues to change our world.",
    ],
  },
};

export function GrowthTimeline() {
  const reduceMotion = useReducedMotion();
  const { locale } = useLanguage();
  const copy = timelineCopy[locale];

  return (
    <section className="about-timeline-section mt-10 border-t border-white/[0.1] pt-10 sm:mt-12 sm:pt-12 lg:mt-14 lg:pt-14" aria-labelledby="growth-timeline-title">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.22 }}
        transition={{ duration: reduceMotion ? 0 : 0.66, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-sm font-semibold tracking-[0.04em] text-[#4ea1ff]">{copy.eyebrow}</p>
        <h2 id="growth-timeline-title" className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">{copy.title}</h2>
      </motion.div>

      <div className="relative mt-12 sm:mt-16">
        <div className="timeline-line absolute bottom-0 left-[11px] top-0 w-px sm:left-1/2" aria-hidden="true" />
        <div className="space-y-7 sm:space-y-10">
          {copy.entries.map((entry, index) => {
            const alignLeft = index % 2 === 0;
            return (
              <div key={entry.date} className="relative grid sm:grid-cols-2">
                <span className="timeline-dot absolute left-[5px] top-7 z-10 h-[13px] w-[13px] rounded-full sm:left-1/2 sm:-translate-x-1/2" aria-hidden="true" />
                <motion.article
                  initial={{ opacity: 0, x: reduceMotion ? 0 : alignLeft ? -24 : 24, y: 14 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : Math.min(index, 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className={`timeline-card ml-9 rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.14)] backdrop-blur-[20px] sm:ml-0 sm:p-8 ${alignLeft ? "sm:mr-10" : "sm:col-start-2 sm:ml-10"}`}
                >
                  <p className="inline-flex rounded-full border border-sky-300/20 bg-sky-400/[0.1] px-3 py-1 text-xs font-semibold tracking-[0.035em] text-sky-200">{entry.date}</p>
                  {entry.title ? <h3 className="mt-5 text-xl font-bold leading-snug tracking-[-0.025em] text-white sm:text-2xl">{entry.title}</h3> : null}
                  <div className="mt-4 space-y-4 text-sm leading-[1.85] text-white/75 sm:text-base">
                    {entry.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </motion.article>
              </div>
            );
          })}
        </div>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: reduceMotion ? 0 : 0.66, ease: [0.16, 1, 0.3, 1] }}
        className="timeline-closing relative mt-10 overflow-hidden rounded-[28px] border border-sky-200/[0.14] bg-white/[0.04] p-7 shadow-[0_22px_64px_rgba(20,90,190,0.12)] backdrop-blur-[24px] sm:mt-14 sm:p-10"
      >
        <Sparkles className="h-6 w-6 text-sky-200" aria-hidden="true" />
        <h3 className="mt-5 text-2xl font-bold tracking-[-0.035em] text-white sm:text-3xl">{copy.closingTitle}</h3>
        <div className="mt-5 max-w-5xl space-y-4 text-base leading-[1.9] text-white/75">
          {copy.closingParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </motion.article>
    </section>
  );
}
