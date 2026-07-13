export default function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-5">
        <div data-reveal>
          <h2 className="text-2xl font-bold tracking-wide sm:text-3xl">
            <span className="mr-3 inline-block h-2 w-2 rounded-full bg-accent align-middle" />
            {title}
          </h2>
          {lead && <p className="mt-4 text-muted">{lead}</p>}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
