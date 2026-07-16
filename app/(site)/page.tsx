import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { getSiteContent } from "@/lib/site";

const categories = [
  { slug: "lean-recipes", label: "Lean Recipes", blurb: "Simple, satisfying meals that don't taste like diet food." },
  { slug: "meal-plans", label: "Meal Plans", blurb: "Whole weeks planned out, grocery list included." },
  { slug: "weight-loss-tips", label: "Weight Loss Tips", blurb: "Sustainable habits — no calorie-counting spreadsheets." },
  { slug: "kitchen-edit", label: "Kitchen Edit", blurb: "Curated roundups worth pinning and coming back to." },
];

export default function HomePage() {
  const site = getSiteContent();
  const posts = getPublishedPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      {/* Hero */}
      <section className="container-edit pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="eyebrow mb-3">{site.heroEyebrow}</p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-[1.05] mb-5">
              {site.heroHeadlineMain}{" "}
              <span className="italic font-normal text-clay">{site.heroHeadlineItalic}</span> {site.heroHeadlineEnd}
            </h1>
            <p className="text-lg text-ink/75 max-w-lg mb-7">{site.heroSubhead}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/start-here" className="btn-primary">Start Here</Link>
              <Link href="/blog" className="btn-outline">Browse Recipes</Link>
            </div>
          </div>

          {featured && (
            <div className="card bg-linen/70">
              <p className="eyebrow mb-2">Featured</p>
              <h2 className="text-2xl font-bold mb-2">
                <Link href={`/blog/${featured.slug}`} className="hover:text-clay">
                  {featured.title}
                </Link>
              </h2>
              <p className="text-sm text-ink/70 mb-4">{featured.excerpt}</p>
              <Link href={`/blog/${featured.slug}`} className="text-sm font-bold text-clay hover:underline">
                Read the post →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="container-edit pb-20">
        <h2 className="text-2xl font-bold mb-6">Find what you&apos;re craving</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className="card hover:border-clay/40 hover:-translate-y-0.5 transition"
            >
              <h3 className="font-bold mb-1">{cat.label}</h3>
              <p className="text-sm text-ink/65">{cat.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="container-edit pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest on the blog</h2>
            <Link href="/blog" className="text-sm font-bold text-clay hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[featured, ...rest].filter(Boolean).slice(0, 6).map((post) => (
              <Link key={post!.slug} href={`/blog/${post!.slug}`} className="card flex flex-col hover:border-clay/40">
                <span className="eyebrow mb-2">{post!.categoryLabel}</span>
                <h3 className="font-bold mb-2 leading-snug">{post!.title}</h3>
                <p className="text-sm text-ink/65 flex-1">{post!.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="container-edit pb-24">
        <div className="card bg-sage/10 border-sage/30 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">{site.newsletterHeadline}</h2>
            <p className="text-sm text-ink/70">{site.newsletterBlurb}</p>
          </div>
          <form className="flex gap-2 w-full md:w-auto" action="https://buttondown.com/api/emails/embed-subscribe/leankitchenedit" method="post">
     <input
       type="email"
       name="email"
       required
       placeholder="you@example.com"
       className="rounded-soft border border-ink/20 bg-white px-4 py-3 text-sm flex-1 md:w-64"
     />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
