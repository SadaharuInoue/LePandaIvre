import Section from "./Section";
import { interests } from "@/data/interests";

export default function Interests() {
  return (
    <Section
      id="interests"
      title="Interests"
      lead="興味を持ったら調べて、試して、書く。いま追いかけているテーマたち。"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {interests.map((interest) => (
          <div
            key={interest.title}
            className="rounded-2xl border border-line bg-card p-5"
          >
            <h3 className="font-bold">
              <span className="mr-2">{interest.emoji}</span>
              {interest.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{interest.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
