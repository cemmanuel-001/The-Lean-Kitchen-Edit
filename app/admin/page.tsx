"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load posts.");
      setPosts(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/admin/posts/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete.");
      }
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">Posts</h1>
        <Link href="/admin/posts/new" className="btn-primary">
          + New Post
        </Link>
      </div>

      {error && (
        <div className="card bg-rose/10 border-rose/30 mb-6 text-sm text-rose">
          {error}
          {error.includes("GitHub configuration") && (
            <p className="mt-2 text-ink/70">
              See the README for how to set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in Vercel.
            </p>
          )}
        </div>
      )}

      {posts === null && !error && <p className="text-ink/60">Loading...</p>}

      {posts && posts.length === 0 && <p className="text-ink/60">No posts yet — create your first one.</p>}

      {posts && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.slug} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      post.published ? "bg-sage/20 text-sage" : "bg-butter/30 text-clayDark"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-ink/50">{post.categoryLabel}</span>
                </div>
                <h2 className="font-bold truncate">{post.title}</h2>
                <p className="text-xs text-ink/50">/blog/{post.slug}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/admin/posts/${post.slug}`} className="btn-outline !px-3 !py-2 text-xs">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.slug, post.title)}
                  disabled={deletingSlug === post.slug}
                  className="rounded-soft border-2 border-rose text-rose px-3 py-2 text-xs font-semibold hover:bg-rose hover:text-cream disabled:opacity-50"
                >
                  {deletingSlug === post.slug ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-ink/40 mt-8">
        Changes save straight to GitHub and your live site rebuilds automatically — usually within
        1–2 minutes.
      </p>
    </div>
  );
}
