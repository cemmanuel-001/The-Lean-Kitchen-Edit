import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Start Here",
  description: "New to The Lean Kitchen Edit? Start here for the top posts and how the site works.",
};

export default function StartHerePage() {
  const top = getPublishedPosts().slice(0, 3);

  return (
    <div className="container-edit py-14 max-w-prose">
      <p className="eyebrow mb-2">Start Here</p>
      <h1 className="text-4xl font-bold mb-6">New here? Start with these</h1>

      <p className="text-ink/75 mb-8">
        The Lean Kitchen Edit is built around three things: recipes that use ingredients you can
        actually find, meal plans that remove the guesswork, and habit-based tips instead of
        strict rules. Here&apos;s where most readers start:
      </p>

      {top.length === 0 ? (
        <p className="text-ink/60 mb-10">No posts published yet — check back soon.</p>
      ) : (
        <div className="space-y-4 mb-10">
          {top.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card flex items-start gap-4 hover:border-clay/40">
              <span className="font-display text-2xl text-clay/50 font-bold">{i + 1}</span>
              <div>
                <h2 className="font-bold mb-1">{post.title}</h2>
                <p className="text-sm text-ink/65">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="card bg-linen/70">
        <p className="font-semibold mb-1">Want it in your inbox?</p>
        <p className="text-sm text-ink/70">
          Head back to the <Link href="/" className="text-clay font-semibold hover:underline">homepage</Link> and sign up for the newsletter — new recipes, no spam.
        </p>
      </div>
    </div>
  );
}
