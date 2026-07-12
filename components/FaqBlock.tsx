type QA = { q: string; a: string };

export default function FaqBlock({ items }: { items: QA[] }) {
  return (
    <div className="not-prose divide-y divide-ink/10 rounded-soft border border-ink/10 bg-white/50">
      {items.map((item, i) => (
        <details key={i} className="group px-5 py-4">
          <summary className="cursor-pointer list-none font-semibold flex items-center justify-between gap-4">
            {item.q}
            <span className="text-clay text-lg leading-none group-open:rotate-45 transition-transform">+</span>
          </summary>
          <p className="mt-2 text-sm text-ink/75">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
