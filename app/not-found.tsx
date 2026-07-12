import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  const popular = getPublishedPosts().slice(0, 3);

  return (
    <>
      <Header />
      <div className="container-edit py-20 max-w-prose text-center mx-auto">
        <p className="eyebrow mb-2">404</p>
        <h1 className="text-4xl font-bold mb-4">This page burned on the stove.</h1>
        <p className="text-ink/70 mb-8">
          We couldn&apos;t find what you were looking for. Try one of these instead:
        </p>

        {popular.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-4 text-left mb-10">
            {popular.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card hover:border-clay/40">
                <h2 className="font-bold text-sm">{post.title}</h2>
              </Link>
            ))}
          </div>
        )}

        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
      <Footer />
    </>
  );
}
