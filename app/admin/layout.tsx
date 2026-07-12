"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Homepage Text" },
  { href: "/admin/about", label: "About Page" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-linen font-body text-ink">
      <header className="border-b border-ink/10 bg-ink text-cream">
        <div className="container-edit flex items-center justify-between py-4">
          <Link href="/admin" className="font-display font-bold text-lg">
            Lean Kitchen Edit <span className="text-clay">Admin</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-cream/70 hover:text-cream">
              View site ↗
            </a>
            <button onClick={handleLogout} className="rounded-soft border border-cream/30 px-3 py-1.5 hover:bg-cream/10">
              Log Out
            </button>
          </div>
        </div>
        <nav className="container-edit flex gap-5 pb-3 text-sm font-semibold overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap pb-1 border-b-2 ${
                pathname === item.href ? "border-clay text-cream" : "border-transparent text-cream/60 hover:text-cream"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="container-edit py-10">{children}</main>
    </div>
  );
}
