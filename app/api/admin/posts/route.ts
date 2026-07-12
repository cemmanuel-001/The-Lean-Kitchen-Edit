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

export async function GET() {
  try {
    const posts = await readPosts();
    return NextResponse.json(posts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const posts = await readPosts();

    let slug = slugify(body.slug || body.title || "");
    if (!slug) {
      return NextResponse.json({ error: "Title or slug is required." }, { status: 400 });
    }
    if (posts.some((p) => p.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-5)}`;
    }

    const newPost: Post = {
      slug,
      title: body.title || "Untitled Post",
      metaDescription: body.metaDescription || "",
      category: body.category || "lean-recipes",
      categoryLabel: body.categoryLabel || "Lean Recipes",
      excerpt: body.excerpt || "",
      published: !!body.published,
      heroImage: body.heroImage || null,
      quickFacts: body.quickFacts || { prep: "", servings: "", calories: "", tags: [] },
      bodyMarkdown: body.bodyMarkdown || "",
      recipes: body.recipes || [],
      faq: body.faq || [],
    };

    posts.push(newPost);

    await putFile(POSTS_PATH, JSON.stringify(posts, null, 2), `Add post: ${newPost.title}`);

    return NextResponse.json(newPost, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
