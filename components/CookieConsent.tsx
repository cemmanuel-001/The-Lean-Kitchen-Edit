"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "lke-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    window.localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-ink text-cream">
      <div className="container-edit flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-sm">
        <p className="text-cream/80">
          We use cookies for analytics and to serve relevant ads. See our{" "}
          <Link href="/privacy-policy" className="underline text-cream">Privacy Policy</Link>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={decline} className="rounded-soft border border-cream/30 px-4 py-2 text-xs font-semibold hover:bg-cream/10">
            Decline
          </button>
          <button onClick={accept} className="rounded-soft bg-clay px-4 py-2 text-xs font-semibold hover:bg-clayDark">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
