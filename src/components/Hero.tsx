import { profile } from "@/data/profile";

export default function Hero() {
  return (
    <section id="top" className="border-b border-line bg-accent-soft/60">
      <div className="mx-auto max-w-4xl px-5 py-20 sm:py-28">
        <p className="text-sm font-semibold tracking-widest text-accent">
          {profile.title}
        </p>
        <h1 className="mt-4 text-3xl font-bold leading-snug sm:text-5xl">
          {profile.name}
          <span className="mt-2 block text-lg font-medium text-muted sm:text-2xl">
            {profile.handle} <span className="text-sm">（note: {profile.penName}）</span>
          </span>
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed sm:text-lg">
          {profile.tagline}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#contact"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-contrast transition-opacity hover:opacity-85"
          >
            仕事のご相談はこちら
          </a>
          <a
            href="#projects"
            className="rounded-full border border-line bg-card px-6 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            やっていることを見る
          </a>
        </div>
      </div>
    </section>
  );
}
