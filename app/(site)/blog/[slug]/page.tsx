import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/posts";
import ShareButtons from "@/components/ShareButtons";
import RecipeCard from "@/components/RecipeCard";
import FaqBlock from "@/components/FaqBlock";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import Markdown from "@/components/Markdown";

const SITE_URL = "https://theleankitchenedit.com";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url,
      type: "article",
      ...(post.heroImage ? { images: [`${SITE_URL}${post.heroImage}`] } : {}),
    },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.heroImage ? `${SITE_URL}${post.heroImage}` : undefined;

  return (
    <article className="container-edit py-14">
      <div className="max-w-prose">
        <p className="eyebrow mb-2">{post.categoryLabel}</p>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{post.title}</h1>

        <p className="text-lg text-ink/80 mb-6">{post.excerpt}</p>

        {post.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.heroImage}
            alt={post.title}
            className="w-full rounded-soft mb-8 aspect-[4/3] object-cover"
          />
        ) : (
          <ImagePlaceholder
            alt={post.title}
            filename={`${post.slug}.jpg`}
            caption="Upload a hero photo for this post from the admin panel"
          />
        )}

        {post.quickFacts && (post.quickFacts.prep || post.quickFacts.servings || post.quickFacts.calories) && (
          <div className="card flex flex-wrap gap-x-8 gap-y-2 text-sm mb-8">
            {post.quickFacts.prep && <span><strong>Prep:</strong> {post.quickFacts.prep}</span>}
            {post.quickFacts.servings && <span><strong>Servings:</strong> {post.quickFacts.servings}</span>}
            {post.quickFacts.calories && <span><strong>Calories:</strong> {post.quickFacts.calories}</span>}
            {post.quickFacts.tags?.length > 0 && (
              <span className="flex gap-2 flex-wrap">
                {post.quickFacts.tags.map((t) => (
                  <span key={t} className="rounded-full bg-sage/15 text-sage px-3 py-0.5 text-xs font-semibold">
                    {t}
                  </span>
                ))}
              </span>
            )}
          </div>
        )}

        <ShareButtons title={post.title} description={post.metaDescription} imageUrl={imageUrl} url={url} className="mb-10" />
      </div>

      <div className="prose-post">
        <Markdown content={post.bodyMarkdown} />

        {post.recipes.map((recipe, i) => (
          <RecipeCard key={i} recipe={recipe} />
        ))}

        {post.faq.length > 0 && (
          <>
            <h2>Frequently Asked Questions</h2>
            <FaqBlock items={post.faq} />
          </>
        )}
      </div>

      <div className="max-w-prose mt-10 space-y-6">
        <ShareButtons title={post.title} description={post.metaDescription} imageUrl={imageUrl} url={url} />

        <p className="text-xs text-ink/50">
          Nutrition figures are estimates based on standard ingredient values and will vary by
          brand and preparation. This post is for informational purposes only and isn&apos;t a
          substitute for professional medical advice — see our{" "}
          <Link href="/disclaimer" className="underline">Disclaimer</Link>.
        </p>
      </div>
    </article>
  );
}
