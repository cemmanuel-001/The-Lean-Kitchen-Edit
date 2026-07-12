import Link from "next/link";

const navLinks = [
  { href: "/blog", label: "Recipes & Plans" },
  { href: "/start-here", label: "Start Here" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="border-b border-ink/10 bg-cream/95 backdrop-blur sticky top-0 z-40">
      <div className="container-edit flex items-center justify-between py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-xl font-bold tracking-tight">
            The Lean Kitchen <span className="italic text-clay">Edit</span>
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ink/50 mt-1">
            Eat Simple &middot; Live Lean &middot; Feel Good
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-clay">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/start-here" className="btn-primary hidden sm:inline-flex">
          Start Here
        </Link>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex items-center gap-4 overflow-x-auto px-5 pb-3 text-sm font-semibold">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap hover:text-clay">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
