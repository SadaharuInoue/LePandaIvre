import type { CSSProperties } from "react";
import Section from "./Section";
import { profile } from "@/data/profile";

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="space-y-5">
        {profile.about.map((paragraph, i) => (
          <p
            key={paragraph.slice(0, 20)}
            data-reveal
            style={{ "--reveal-delay": `${i * 60}ms` } as CSSProperties}
            className="leading-loose"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}
