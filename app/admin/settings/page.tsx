"use client";

import { useEffect, useState } from "react";

type SiteForm = {
  heroEyebrow: string;
  heroHeadlineMain: string;
  heroHeadlineItalic: string;
  heroHeadlineEnd: string;
  heroSubhead: string;
  newsletterHeadline: string;
  newsletterBlurb: string;
};

export default function SettingsPage() {
  const [form, setForm] = useState<SiteForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load.");
        setForm(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  const update = (patch: Partial<SiteForm>) => setForm((f) => (f ? { ...f, ...patch } : f));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Homepage Text</h1>

      {error && <div className="card bg-rose/10 border-rose/30 text-sm text-rose mb-6">{error}</div>}
      {!form && !error && <p className="text-ink/60">Loading...</p>}

      {form && (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="card space-y-4">
            <h2 className="eyebrow">Hero Section</h2>
            <div>
              <label className="block text-sm font-semibold mb-1">Eyebrow text (small line above the headline)</label>
              <input value={form.heroEyebrow} onChange={(e) => update({ heroEyebrow: e.target.value })} className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Headline part 1</label>
                <input value={form.heroHeadlineMain} onChange={(e) => update({ heroHeadlineMain: e.target.value })} className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Headline part 2 (italic)</label>
                <input value={form.heroHeadlineItalic} onChange={(e) => update({ heroHeadlineItalic: e.target.value })} className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Headline part 3</label>
                <input value={form.heroHeadlineEnd} onChange={(e) => update({ heroHeadlineEnd: e.target.value })} className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Subheading</label>
              <textarea value={form.heroSubhead} onChange={(e) => update({ heroSubhead: e.target.value })} rows={3} className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="eyebrow">Newsletter Section</h2>
            <div>
              <label className="block text-sm font-semibold mb-1">Headline</label>
              <input value={form.newsletterHeadline} onChange={(e) => update({ newsletterHeadline: e.target.value })} className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Blurb</label>
              <input value={form.newsletterBlurb} onChange={(e) => update({ newsletterBlurb: e.target.value })} className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && <span className="text-sm text-sage font-semibold">Saved — rebuilding now, live in ~1–2 min.</span>}
          </div>
        </form>
      )}
    </div>
  );
}
