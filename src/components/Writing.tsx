import Section from "./Section";
import { writingIntro, writingThemes } from "@/data/writing";

export default function Writing() {
  return (
    <Section id="writing" title="Writing" lead={writingIntro}>
      <div className="grid gap-6 md:grid-cols-2">
        {writingThemes.map((theme) => (
          <div
            key={theme.theme}
            className="rounded-2xl border border-line bg-card p-6"
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
      <p className="mt-8">
        <a
          href="https://note.com/lepandaivre"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border border-accent px-6 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-contrast"
        >
          note「ガラムマサラ」で記事を読む →
        </a>
      </p>
    </Section>
  );
}
