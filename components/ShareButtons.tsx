"use client";

import { useEffect, useState } from "react";

type ShareButtonsProps = {
  /** Full absolute URL of the page being shared. If omitted, uses window.location.href. */
  url?: string;
  title: string;
  description?: string;
  /** Absolute URL of the image to use for Pinterest's pin preview. */
  imageUrl?: string;
  /** "row" for inline under a hook/intro, "stack" for a sticky sidebar rail. */
  variant?: "row" | "stack";
  className?: string;
};

/**
 * Social share bar for The Lean Kitchen Edit.
 *
 * Pinterest is listed first on purpose — Pinterest is the brand's primary
 * discovery channel per the project brief, so it gets top billing ahead of
 * Facebook/X/email. All share links open in a small popup window rather
 * than navigating away from the post.
 */
export default function ShareButtons({
  url,
  title,
  description = "",
  imageUrl,
  variant = "row",
  className = "",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => url || (typeof window !== "undefined" ? window.location.href : "");

  const openPopup = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer,width=650,height=500");
  };

  const handlePinterest = () => {
    const shareUrl = getShareUrl();
    const params = new URLSearchParams({
      url: shareUrl,
      description: title,
      ...(imageUrl ? { media: imageUrl } : {}),
    });
    openPopup(`https://pinterest.com/pin/create/button/?${params.toString()}`);
  };

  const handleFacebook = () => {
    const shareUrl = getShareUrl();
    const params = new URLSearchParams({ u: shareUrl });
    openPopup(`https://www.facebook.com/sharer/sharer.php?${params.toString()}`);
  };

  const handleX = () => {
    const shareUrl = getShareUrl();
    const params = new URLSearchParams({ url: shareUrl, text: title });
    openPopup(`https://twitter.com/intent/tweet?${params.toString()}`);
  };

  const handleEmail = () => {
    const shareUrl = getShareUrl();
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description ? description + "\n\n" : ""}${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopy = async () => {
    const shareUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — silently ignore.
    }
  };

  const handleNativeShare = async () => {
    const shareUrl = getShareUrl();
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text: description, url: shareUrl });
      } catch {
        // User cancelled the native share sheet — no action needed.
      }
    }
  };

  const layout =
    variant === "stack"
      ? "flex-col items-stretch"
      : "flex-row flex-wrap items-center";

  return (
    <div className={`flex ${layout} gap-2 ${className}`}>
      <span className="eyebrow mr-1 self-center">Share this</span>

      <button
        onClick={handlePinterest}
        aria-label="Pin this to Pinterest"
        className="share-btn bg-[#E60023] hover:bg-[#c8001e]"
      >
        <PinterestIcon /> <span>Pin</span>
      </button>

      <button
        onClick={handleFacebook}
        aria-label="Share on Facebook"
        className="share-btn bg-[#1877F2] hover:bg-[#1461cc]"
      >
        <FacebookIcon /> <span>Facebook</span>
      </button>

      <button
        onClick={handleX}
        aria-label="Share on X"
        className="share-btn bg-ink hover:bg-black"
      >
        <XIcon /> <span>X</span>
      </button>

      <button
        onClick={handleEmail}
        aria-label="Share by email"
        className="share-btn bg-sage hover:bg-[#4a5941]"
      >
        <EmailIcon /> <span>Email</span>
      </button>

      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="share-btn bg-ink/80 hover:bg-ink"
      >
        <LinkIcon /> <span>{copied ? "Copied!" : "Copy link"}</span>
      </button>

      {/* Native share sheet — only rendered where navigator.share exists (mostly mobile) */}
      <NativeShareButton onClick={handleNativeShare} />

      <style>{`
        .share-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.85rem;
          border-radius: 0.6rem;
          color: #FBF7F0;
          font-size: 0.8rem;
          font-weight: 600;
          transition: background-color 0.15s ease;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

function NativeShareButton({ onClick }: { onClick: () => void }) {
  const [supported, setSupported] = useState(false);

  // Only show this button in browsers that support the Web Share API.
  useEffect(() => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      setSupported(true);
    }
  }, []);

  if (!supported) return null;

  return (
    <button onClick={onClick} aria-label="More share options" className="share-btn bg-clay hover:bg-clayDark">
      <ShareIcon /> <span>More</span>
    </button>
  );
}

function PinterestIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.017 0C5.396 0 0 5.396 0 12.017c0 5.081 3.163 9.416 7.627 11.164-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.024 0 1.518.769 1.518 1.69 0 1.03-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.883-5.014-4.883-3.415 0-5.418 2.561-5.418 5.207 0 1.031.397 2.137.893 2.738a.36.36 0 0 1 .083.345c-.091.38-.293 1.194-.333 1.361-.052.218-.173.264-.4.159-1.492-.694-2.424-2.875-2.424-4.627 0-3.769 2.738-7.229 7.892-7.229 4.144 0 7.365 2.953 7.365 6.899 0 4.116-2.595 7.431-6.199 7.431-1.211 0-2.348-.629-2.738-1.373 0 0-.599 2.282-.744 2.84-.269 1.037-.999 2.336-1.488 3.129 1.12.346 2.309.531 3.542.531 6.621 0 12.017-5.396 12.017-12.017C24.034 5.396 18.638 0 12.017 0z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.877h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98M15.41 6.51 8.59 10.49" />
    </svg>
  );
}
