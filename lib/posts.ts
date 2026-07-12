import fs from "fs";
import path from "path";

export type Recipe = {
  name: string;
  prep: string;
  servings: string;
  calories: string;
  ingredients: string[];
  steps: string[];
};

export type FaqItem = { q: string; a: string };

export type Post = {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  categoryLabel: string;
  excerpt: string;
  published: boolean;
  heroImage: string | null;
  quickFacts: { prep: string; servings: string; calories: string; tags: string[] };
  bodyMarkdown: string;
  recipes: Recipe[];
  faq: FaqItem[];
};

const POSTS_FILE = path.join(process.cwd(), "content", "posts.json");

/** Read all posts from content/posts.json. Server-side only (uses fs). */
export function getAllPosts(): Post[] {
  const raw = fs.readFileSync(POSTS_FILE, "utf-8");
  return JSON.parse(raw);
}

/** Posts marked published — what the public site should show. */
export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((p) => p.published);
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
