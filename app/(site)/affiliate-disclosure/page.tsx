import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How The Lean Kitchen Edit uses affiliate links.",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="container-edit py-14 max-w-prose">
      <p className="eyebrow mb-2">Legal</p>
      <h1 className="text-4xl font-bold mb-6">Affiliate Disclosure</h1>

      <div className="prose-post">
        <p>
          Some posts on The Lean Kitchen Edit may contain affiliate links, meaning we may earn a
          small commission if you make a purchase through them — at no extra cost to you.
        </p>
        <p>
          Any post containing affiliate links will include a short disclosure line at the top of
          the post, above the fold. We only link to products we&apos;d genuinely recommend.
        </p>
      </div>
    </div>
  );
}
