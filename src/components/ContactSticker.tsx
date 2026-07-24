"use client";

import Script from "next/script";
import { createElement, useEffect, useMemo, useRef, useState } from "react";

type TextRun = {
  text: string;
  color: string;
  fontSize: number;
  fontWeight: number;
  underline: boolean;
};

type TextBlock = {
  align: "center";
  lineHeight: number;
  runs: TextRun[];
};

type TextStickerSource = {
  type: "text";
  text: string;
  fontFamily: string;
  fontWeight: number;
  color: string;
  richText: { blocks: TextBlock[] };
};

type ContactStickerOptions = {
  outline: { width: number; color: string };
  shadow: { opacity: number; blur: number; distance: number; angle: number; color: string };
  peel: { radius: number; stiffness: number; grabWidth: number; maxAngle: number; release: "snap" };
  sound: { enabled: boolean; volume: number };
  back: { color: string; gloss: number; roughness: number };
  tilt: number;
  wind: number;
  quality: "high";
};

type ContactStickerElement = HTMLElement & {
  setSource: (source: TextStickerSource) => Promise<void>;
  setOptions: (options: ContactStickerOptions) => void;
};

export function ContactSticker() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const source = useMemo<TextStickerSource>(() => {
    const contactColor = "rgb(31, 49, 74)";
    const meColor = "rgb(45, 140, 255)";
    const accountColor = "rgb(65, 103, 148)";

    return {
      type: "text",
      text: "Contact me\n@appdo_bot",
      fontFamily: "Arial Rounded MT Bold, Arial Black, sans-serif",
      fontWeight: 900,
      color: contactColor,
      richText: {
        blocks: [
          {
            align: "center",
            lineHeight: 1.2,
            runs: [
              { text: "Contact", color: contactColor, fontSize: 28, fontWeight: 900, underline: false },
              { text: " me", color: meColor, fontSize: 28, fontWeight: 900, underline: false },
            ],
          },
          {
            align: "center",
            lineHeight: 0.8,
            runs: [
              { text: "@appdo_bot", color: accountColor, fontSize: 10, fontWeight: 500, underline: false },
            ],
          },
        ],
      },
    };
  }, []);

  const options = useMemo<ContactStickerOptions>(() => ({
    outline: {
      width: 15,
      color: "#eef6ff",
    },
    shadow: {
      opacity: 0.25,
      blur: 22,
      distance: 16,
      angle: 42,
      color: "#101827",
    },
    peel: {
      radius: 0.09,
      stiffness: 0.72,
      grabWidth: 22,
      maxAngle: 3.55,
      release: "snap",
    },
    sound: {
      enabled: true,
      volume: 0.68,
    },
    back: {
      color: "#e7f1ff",
      gloss: 0.7,
      roughness: 0.3,
    },
    tilt: -12,
    wind: 0.25,
    quality: "high",
  }), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!("IntersectionObserver" in window)) {
      const fallbackTimer = globalThis.setTimeout(() => setShouldLoad(true), 0);
      return () => globalThis.clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "1000px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    let cancelled = false;

    async function initializeSticker() {
      await window.customElements.whenDefined("sticker-forge");
      if (cancelled) return;

      const sticker = document.querySelector<ContactStickerElement>("#contact-appdo-sticker");
      if (!sticker) return;

      await sticker.setSource(source);
      sticker.setOptions(options);
    }

    void initializeSticker();
    return () => {
      cancelled = true;
    };
  }, [options, shouldLoad, source]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-auto absolute right-0 -top-24 z-20 aspect-[640/420] w-[176px] sm:-top-28 sm:w-[209px] lg:right-0 lg:-top-12 lg:w-[231px]"
      aria-label="可拖拽翻起的 Contact me @appdo_bot 联系贴纸"
    >
      {shouldLoad ? (
        <>
          <Script
            id="appdo-contact-sticker-forge"
            src="https://sticker.oooo.so/embed/sticker-forge.es.js"
            type="module"
            strategy="lazyOnload"
          />
          <div className="absolute inset-0">
            {createElement("sticker-forge", {
              id: "contact-appdo-sticker",
              style: { display: "block", width: "100%", height: "100%" },
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
