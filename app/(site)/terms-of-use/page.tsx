import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms and conditions for using The Lean Kitchen Edit.",
};

export default function TermsPage() {
  return (
    <div className="container-edit py-14 max-w-prose">
      <p className="eyebrow mb-2">Legal</p>
      <h1 className="text-4xl font-bold mb-2">Terms of Use</h1>
      <p className="text-sm text-ink/50 mb-8">Last updated: July 18, 2026</p>

      <div className="prose-post">
        <h2>Content ownership</h2>
        <p>
          All recipes, text, photos, and graphics on this site are the property of The Lean
          Kitchen Edit unless otherwise noted. You&apos;re welcome to link to or pin our content;
          please don&apos;t republish full posts, recipes, or images elsewhere without written
          permission. A single photo with a link back and a brief excerpt is generally fine.
        </p>

        <h2>Acceptable use</h2>
        <p>
          Don&apos;t scrape, systematically copy, or misuse this site&apos;s content, forms, or
          comment sections. Use the site only for its intended purpose: reading and enjoying the
          content.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          The Lean Kitchen Edit is provided &ldquo;as is.&rdquo; We aren&apos;t liable for any
          outcome, injury, or loss related to your use of recipes, meal plans, or advice found on
          this site. See our Disclaimer for more on health-related content.
        </p>

        <h2>Governing law</h2>
        <p>These terms are governed by the laws of [insert jurisdiction].</p>
      </div>
    </div>
  );
}
