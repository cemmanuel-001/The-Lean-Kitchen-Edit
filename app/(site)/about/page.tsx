import type { Metadata } from "next";
import Link from "next/link";
import { getAboutContent } from "@/lib/site";
import Markdown from "@/components/Markdown";

export const metadata: Metadata = {
  title: "About Us",
  description: "Why The Lean Kitchen Edit exists, who it's for, and the story behind the recipes.",
};

export default function AboutPage() {
  const about = getAboutContent();

  return (
    <div className="container-edit py-14 max-w-prose">
      <p className="eyebrow mb-2">About Us</p>
      <h1 className="text-4xl font-bold mb-6">{about.headline}</h1>

      <Markdown content={about.bodyMarkdown} className="prose-post" />

      <div className="card bg-linen/70 mt-10">
        <p className="font-semibold mb-1">New here?</p>
        <p className="text-sm text-ink/70 mb-3">
          <Link href="/start-here" className="text-clay font-semibold hover:underline">Start Here</Link>{" "}
          is the fastest way to see what this blog is about and where to begin.
        </p>
      </div>
    </div>
  );
}
