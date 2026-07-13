import type { CSSProperties } from "react";
import { profile } from "@/data/profile";

function rise(order: number): CSSProperties {
  return { "--rise-delay": `${order * 120}ms` } as CSSProperties;
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-line bg-accent-soft/60"
    >
      {/* ゆっくり漂う背景アクセント */}
      <div
        aria-hidden
        className="hero-blob pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden
        className="hero-blob-slow pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-5 py-20 sm:py-28">
        <p
          className="hero-rise text-sm font-semibold tracking-widest text-accent"
          style={rise(0)}
        >
          {profile.title}
        </p>
        <h1
          className="hero-rise mt-4 text-3xl font-bold leading-snug sm:text-5xl"
          style={rise(1)}
        >
          {profile.name}
          <span className="mt-2 block text-lg font-medium text-muted sm:text-2xl">
            {profile.handle}{" "}
            <span className="text-sm">（note: {profile.penName}）</span>
          </span>
        </h1>
        <p
          className="hero-rise mt-8 max-w-2xl text-base leading-relaxed sm:text-lg"
          style={rise(2)}
        >
          {profile.tagline}
        </p>
        <div className="hero-rise mt-10 flex flex-wrap gap-4" style={rise(3)}>
          <a
            href="#contact"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-contrast transition hover:-translate-y-0.5 hover:opacity-85"
          >
            仕事のご相談はこちら
          </a>
          <a
            href="#services"
            className="rounded-full border border-line bg-card px-6 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            できることを見る
          </a>
        </div>
      </div>
    </section>
  );
}
