/**
 * Stand-in for a real photo. Per Section 6 of the writing brief, every post
 * image needs a descriptive, keyword-rich file name and alt text (never
 * IMG_0234.jpg) — this component surfaces both so it's obvious what to name
 * and shoot once real photography is dropped in at public/images/.
 */
export default function ImagePlaceholder({
  alt,
  filename,
  caption,
}: {
  alt: string;
  filename: string;
  caption?: string;
}) {
  return (
    <figure className="not-prose my-8">
      <div className="aspect-[4/3] w-full rounded-soft border-2 border-dashed border-clay/30 bg-linen flex flex-col items-center justify-center text-center px-6">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-clay/50 mb-2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <p className="text-xs font-semibold text-ink/50">Photo goes here — save as:</p>
        <code className="text-xs text-clay">{filename}</code>
      </div>
      {caption && <figcaption className="text-xs text-ink/50 mt-2">{caption}</figcaption>}
      {/* alt text kept in the DOM via aria-hidden description for reference */}
      <span className="sr-only">{alt}</span>
    </figure>
  );
}
