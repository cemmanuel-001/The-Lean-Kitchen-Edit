import { NextRequest, NextResponse } from "next/server";
import { getFile, putFile } from "@/lib/github";
import { slugify } from "@/lib/slugify";
import type { Post } from "@/lib/posts";

const POSTS_PATH = "content/posts.json";

async function readPosts(): Promise<Post[]> {
  const file = await getFile(POSTS_PATH);
  if (!file) return [];
  return JSON.parse(file.content);
}

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const posts = await readPosts();
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    return NextResponse.json(post);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json();
    const posts = await readPosts();
    const index = posts.findIndex((p) => p.slug === params.slug);
    if (index === -1) return NextResponse.json({ error: "Post not found." }, { status: 404 });

    let newSlug = body.slug ? slugify(body.slug) : params.slug;
    if (newSlug !== params.slug && posts.some((p) => p.slug === newSlug)) {
      return NextResponse.json({ error: "Another post already uses that slug." }, { status: 400 });
    }

    const updated: Post = {
      slug: newSlug,
      title: body.title || "Untitled Post",
      metaDescription: body.metaDescription || "",
      category: body.category || "lean-recipes",
      categoryLabel: body.categoryLabel || "Lean Recipes",
      excerpt: body.excerpt || "",
      published: !!body.published,
      heroImage: body.heroImage ?? null,
      quickFacts: body.quickFacts || { prep: "", servings: "", calories: "", tags: [] },
      bodyMarkdown: body.bodyMarkdown || "",
      recipes: body.recipes || [],
      faq: body.faq || [],
    };

    posts[index] = updated;

    await putFile(POSTS_PATH, JSON.stringify(posts, null, 2), `Update post: ${updated.title}`);

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const posts = await readPosts();
    const filtered = posts.filter((p) => p.slug !== params.slug);
    if (filtered.length === posts.length) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    await putFile(POSTS_PATH, JSON.stringify(filtered, null, 2), `Delete post: ${params.slug}`);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
