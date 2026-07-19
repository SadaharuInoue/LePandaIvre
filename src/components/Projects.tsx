import type { CSSProperties } from "react";
import Section from "./Section";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <Section
      id="projects"
      title="Projects"
      lead="仕事の外でも手を動かしています。最近の取り組みから。"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <article
            key={project.title}
            data-reveal
            style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
            className="flex flex-col rounded-2xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg"
          >
            <h3 className="text-lg font-bold">
              <span className="mr-2">{project.emoji}</span>
              {project.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed">
              {project.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-strong"
                >
                  {tag}
                </li>
              ))}
            </ul>
            {project.link && (
              <a
                href={project.link.url}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-strong hover:underline"
              >
                {project.link.label}
                <span aria-hidden>→</span>
              </a>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
