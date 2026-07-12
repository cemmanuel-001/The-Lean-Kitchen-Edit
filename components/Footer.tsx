import Link from "next/link";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/blog", label: "All Recipes & Plans" },
      { href: "/blog?category=lean-recipes", label: "Lean Recipes" },
      { href: "/blog?category=meal-plans", label: "Meal Plans" },
      { href: "/blog?category=weight-loss-tips", label: "Weight Loss Tips" },
      { href: "/start-here", label: "Start Here" },
    ],
  },
  {
    title: "The Site",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Us" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/terms-of-use", label: "Terms of Use" },
      { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-linen">
      <div className="container-edit py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <span className="font-display text-lg font-bold">
              The Lean Kitchen <span className="italic text-clay">Edit</span>
            </span>
            <p className="mt-3 text-sm text-ink/70 max-w-xs">
              Simple, realistic recipes and lighter living — no diet-culture guilt, just food that fits your life.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink/60 hover:text-clay text-sm font-semibold"
              >
                Pinterest
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink/60 hover:text-clay text-sm font-semibold"
              >
                Instagram
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow mb-3">{col.title}</h4>
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-ink/75 hover:text-clay">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-ink/10 pt-6 text-xs text-ink/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} The Lean Kitchen Edit. All rights reserved.</p>
          <p>Content is for informational purposes only — see our <Link href="/disclaimer" className="underline">Disclaimer</Link>.</p>
        </div>
      </div>
    </footer>
  );
}
