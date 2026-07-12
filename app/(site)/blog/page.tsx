import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipes & Meal Plans",
  description: "Browse every lean recipe, meal plan, and weight-loss tip on The Lean Kitchen Edit.",
};

export default function BlogIndex({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const category = searchParams?.category;
  const posts = getPublishedPosts();
  const filtered = category ? posts.filter((p) => p.category === category) : posts;

  return (
    <div className="container-edit py-14">
      <p className="eyebrow mb-2">The Archive</p>
      <h1 className="text-4xl font-bold mb-4">Recipes &amp; Meal Plans</h1>
      <p className="text-ink/70 max-w-lg mb-10">
        Every post here follows the same rule: realistic ingredients, exact measurements, and
        estimated calories — so you know exactly what you&apos;re making before you start.
      </p>

      {filtered.length === 0 ? (
        <p className="text-ink/60">No posts here yet — check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card flex flex-col hover:border-clay/40">
              <span className="eyebrow mb-2">{post.categoryLabel}</span>
              <h2 className="font-bold mb-2 leading-snug">{post.title}</h2>
              <p className="text-sm text-ink/65 flex-1">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
