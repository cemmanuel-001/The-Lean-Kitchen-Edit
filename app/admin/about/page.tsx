"use client";

import { useEffect, useState } from "react";

type AboutForm = { headline: string; bodyMarkdown: string };

export default function AdminAboutPage() {
  const [form, setForm] = useState<AboutForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/about")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load.");
        setForm(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/about", {
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
      <h1 className="font-display text-3xl font-bold mb-6">About Page</h1>

      {error && <div className="card bg-rose/10 border-rose/30 text-sm text-rose mb-6">{error}</div>}
      {!form && !error && <p className="text-ink/60">Loading...</p>}

      {form && (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Headline</label>
              <input
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Body</label>
              <p className="text-xs text-ink/50 mb-1">
                Use <code>## Heading</code> for section headings.
              </p>
              <textarea
                value={form.bodyMarkdown}
                onChange={(e) => setForm({ ...form, bodyMarkdown: e.target.value })}
                rows={16}
                className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm font-mono"
              />
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
