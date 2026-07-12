"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import type { Post } from "@/lib/posts";

export default function EditPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/posts/${params.slug}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load post.");
        setPost(data);
      })
      .catch((err) => setError(err.message));
  }, [params.slug]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Edit Post</h1>
      {error && <div className="card bg-rose/10 border-rose/30 text-sm text-rose mb-6">{error}</div>}
      {!post && !error && <p className="text-ink/60">Loading...</p>}
      {post && <PostEditor mode="edit" post={post} />}
    </div>
  );
}
