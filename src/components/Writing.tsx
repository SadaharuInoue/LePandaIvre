import type { CSSProperties } from "react";
import Section from "./Section";
import { writingIntro, writingThemes } from "@/data/writing";

export default function Writing() {
  return (
    <Section id="writing" title="Writing" lead={writingIntro}>
      <div className="grid gap-6 md:grid-cols-2">
        {writingThemes.map((theme, i) => (
          <div
            key={theme.theme}
            data-reveal
            style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
            className="rounded-2xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg"
          >
            <h3 className="text-lg font-bold">
              <span className="mr-2">{theme.emoji}</span>
              {theme.theme}
            </h3>
            <p className="mt-3 text-sm text-muted">{theme.description}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {theme.examples.map((example) => (
                <li key={example} className="flex gap-2">
                  <span className="mt-0.5 text-accent">▹</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8" data-reveal>
        <a
          href="https://note.com/lepandaivre"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border border-accent px-6 py-2.5 text-sm font-semibold text-accent transition hover:-translate-y-0.5 hover:bg-accent hover:text-accent-contrast"
        >
          note「ガラムマサラ」で記事を読む →
        </a>
      </p>
    </Section>
  );
}
