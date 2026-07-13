const navItems = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#writing", label: "Writing" },
  { href: "#interests", label: "Interests" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
        <a href="#top" className="text-base font-bold">
          🐼 LePandaIvre
        </a>
        <nav className="flex gap-3 text-sm text-muted sm:gap-5">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hidden transition-colors hover:text-accent sm:inline"
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" className="font-semibold text-accent sm:hidden">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
