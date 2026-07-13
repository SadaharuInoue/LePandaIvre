import type { CSSProperties } from "react";
import Section from "./Section";
import { services, servicesIntro } from "@/data/services";

export default function Services() {
  return (
    <Section id="services" title="Services" lead={servicesIntro}>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service, i) => (
          <article
            key={service.title}
            data-reveal
            style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
            className="flex flex-col rounded-2xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg"
          >
            <h3 className="text-lg font-bold">
              <span className="mr-2">{service.emoji}</span>
              {service.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed">{service.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {service.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-0.5 text-accent">▹</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
