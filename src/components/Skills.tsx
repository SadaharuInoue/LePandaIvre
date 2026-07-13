import Section from "./Section";
import { skills } from "@/data/skills";

export default function Skills() {
  return (
    <Section
      id="skills"
      title="Skills"
      lead="医療ドメイン×上流工程を軸に、開発からAI活用まで。"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {skills.map((category) => (
          <div
            key={category.title}
            className="rounded-2xl border border-line bg-card p-6"
          >
            <h3 className="text-lg font-bold">
              <span className="mr-2">{category.emoji}</span>
              {category.title}
            </h3>
            <p className="mt-3 text-sm text-muted">{category.summary}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {category.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 text-accent">▹</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
