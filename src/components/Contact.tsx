import type { CSSProperties } from "react";
import Section from "./Section";
import { links } from "@/data/links";

export default function Contact() {
  return (
    <Section
      id="contact"
      title="Contact"
      lead="仕事のご相談・執筆のご依頼・雑談まで、noteまたはXのDMからお気軽にどうぞ。"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {links.map((link, i) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
            className="rounded-2xl border border-line bg-card p-5 transition hover:-translate-y-1 hover:border-accent hover:shadow-lg"
          >
            <p className="font-bold text-accent">{link.label}</p>
            <p className="mt-2 text-sm text-muted">{link.description}</p>
          </a>
        ))}
      </div>
    </Section>
  );
}
