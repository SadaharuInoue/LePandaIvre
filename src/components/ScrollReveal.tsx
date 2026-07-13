"use client";

import { useEffect } from "react";

// [data-reveal] 要素をスクロールに応じてフェードインさせる。
// JSが動かない環境では .js クラスが付かず、全要素が最初から表示される。
export default function ScrollReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    // 初期表示時点で画面内にある要素は、隠す前にrevealed扱いにしてチラつきを防ぐ
    const viewportBottom = window.innerHeight * 0.92;
    for (const el of elements) {
      if (el.getBoundingClientRect().top < viewportBottom) {
        el.classList.add("revealed");
      }
    }
    document.documentElement.classList.add("js");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    for (const el of elements) {
      if (!el.classList.contains("revealed")) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return null;
}
