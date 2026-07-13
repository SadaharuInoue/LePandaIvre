import Section from "./Section";
import { profile } from "@/data/profile";

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="space-y-5">
        {profile.about.map((paragraph) => (
          <p key={paragraph.slice(0, 20)} className="leading-loose">
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}
