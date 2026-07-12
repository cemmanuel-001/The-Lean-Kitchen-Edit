"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/posts";

const CATEGORIES = [
  { value: "lean-recipes", label: "Lean Recipes" },
  { value: "meal-plans", label: "Meal Plans" },
  { value: "weight-loss-tips", label: "Weight Loss Tips" },
  { value: "kitchen-edit", label: "Kitchen Edit" },
];

type RecipeForm = {
  name: string;
  prep: string;
  servings: string;
  calories: string;
  ingredientsText: string;
  stepsText: string;
};

type FaqForm = { q: string; a: string };

/**
 * GitHub's Contents API rejects files over ~1MB. Phone camera photos are
 * routinely 2–10MB, so we downscale + re-encode as JPEG in the browser
 * before uploading. This keeps hero photos snappy on the live site too.
 */
async function compressImageToBase64(file: File, maxDimension = 1600, quality = 0.82): Promise<string> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Couldn't read the image file."));
    reader.readAsDataURL(file);
  });

  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Couldn't load the image."));
    el.src = dataUrl;
  });

  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image compression isn't supported in this browser.");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
  return compressedDataUrl.split(",")[1];
}

function postToFormState(post?: Post) {
  return {
    title: post?.title || "",
    slug: post?.slug || "",
    metaDescription: post?.metaDescription || "",
    category: post?.category || "lean-recipes",
    excerpt: post?.excerpt || "",
    published: post?.published ?? false,
    heroImage: post?.heroImage ?? null,
    prep: post?.quickFacts?.prep || "",
    servings: post?.quickFacts?.servings || "",
    calories: post?.quickFacts?.calories || "",
    tagsCsv: post?.quickFacts?.tags?.join(", ") || "",
    bodyMarkdown: post?.bodyMarkdown || "",
    recipes: (post?.recipes || []).map((r) => ({
      name: r.name,
      prep: r.prep,
      servings: r.servings,
      calories: r.calories,
      ingredientsText: r.ingredients.join("\n"),
      stepsText: r.steps.join("\n"),
    })) as RecipeForm[],
    faq: (post?.faq || []) as FaqForm[],
  };
}

export default function PostEditor({ mode, post }: { mode: "create" | "edit"; post?: Post }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(postToFormState(post));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const update = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const base64 = await compressImageToBase64(file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, dataBase64: base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      update({ heroImage: data.path });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const addRecipe = () =>
    update({
      recipes: [...form.recipes, { name: "", prep: "", servings: "", calories: "", ingredientsText: "", stepsText: "" }],
    });
  const removeRecipe = (i: number) => update({ recipes: form.recipes.filter((_, idx) => idx !== i) });
  const updateRecipe = (i: number, patch: Partial<RecipeForm>) =>
    update({ recipes: form.recipes.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) });

  const addFaq = () => update({ faq: [...form.faq, { q: "", a: "" }] });
  const removeFaq = (i: number) => update({ faq: form.faq.filter((_, idx) => idx !== i) });
  const updateFaq = (i: number, patch: Partial<FaqForm>) =>
    update({ faq: form.faq.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const category = CATEGORIES.find((c) => c.value === form.category);

    const payload = {
      title: form.title,
      slug: form.slug,
      metaDescription: form.metaDescription,
      category: form.category,
      categoryLabel: category?.label || form.category,
      excerpt: form.excerpt,
      published: form.published,
      heroImage: form.heroImage,
      quickFacts: {
        prep: form.prep,
        servings: form.servings,
        calories: form.calories,
        tags: form.tagsCsv.split(",").map((t) => t.trim()).filter(Boolean),
      },
      bodyMarkdown: form.bodyMarkdown,
      recipes: form.recipes.map((r) => ({
        name: r.name,
        prep: r.prep,
        servings: r.servings,
        calories: r.calories,
        ingredients: r.ingredientsText.split("\n").map((s) => s.trim()).filter(Boolean),
        steps: r.stepsText.split("\n").map((s) => s.trim()).filter(Boolean),
      })),
      faq: form.faq.filter((f) => f.q.trim() || f.a.trim()),
    };

    try {
      const res = await fetch(mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${post!.slug}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && <div className="card bg-rose/10 border-rose/30 text-sm text-rose">{error}</div>}

      {/* Basics */}
      <div className="card space-y-4">
        <h2 className="eyebrow">Basics</h2>

        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            required
            className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            URL slug {mode === "create" && <span className="font-normal text-ink/50">(leave blank to auto-generate from title)</span>}
          </label>
          <input
            value={form.slug}
            onChange={(e) => update({ slug: e.target.value })}
            placeholder="e.g. high-protein-breakfast-ideas"
            className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => update({ category: e.target.value })}
              className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => update({ published: e.target.checked })}
                className="h-4 w-4"
              />
              Published (visible on the live site)
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Excerpt / hook intro</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => update({ excerpt: e.target.value })}
            rows={3}
            className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Meta description (SEO, ~150 characters)</label>
          <textarea
            value={form.metaDescription}
            onChange={(e) => update({ metaDescription: e.target.value })}
            rows={2}
            className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm"
          />
        </div>
      </div>

      {/* Hero image */}
      <div className="card space-y-3">
        <h2 className="eyebrow">Hero Photo</h2>
        {form.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.heroImage} alt="Hero preview" className="w-full max-w-xs rounded-soft aspect-[4/3] object-cover" />
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
        {uploading && <p className="text-sm text-ink/60">Uploading...</p>}
        {form.heroImage && (
          <button type="button" onClick={() => update({ heroImage: null })} className="text-xs text-rose font-semibold">
            Remove photo
          </button>
        )}
      </div>

      {/* Quick facts */}
      <div className="card space-y-4">
        <h2 className="eyebrow">Quick Facts</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Prep time</label>
            <input value={form.prep} onChange={(e) => update({ prep: e.target.value })} className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Servings</label>
            <input value={form.servings} onChange={(e) => update({ servings: e.target.value })} className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Calories</label>
            <input value={form.calories} onChange={(e) => update({ calories: e.target.value })} className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Tags (comma-separated)</label>
          <input
            value={form.tagsCsv}
            onChange={(e) => update({ tagsCsv: e.target.value })}
            placeholder="High-Protein, Meal-Prep Friendly, Weight Loss"
            className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm"
          />
        </div>
      </div>

      {/* Body */}
      <div className="card space-y-2">
        <h2 className="eyebrow">Article Body</h2>
        <p className="text-xs text-ink/50">
          Use <code>## Heading</code> for section headings and <code>- item</code> for bullet lists.
        </p>
        <textarea
          value={form.bodyMarkdown}
          onChange={(e) => update({ bodyMarkdown: e.target.value })}
          rows={14}
          className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm font-mono"
        />
      </div>

      {/* Recipes */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="eyebrow">Recipe Cards</h2>
          <button type="button" onClick={addRecipe} className="text-sm font-semibold text-clay hover:underline">
            + Add recipe
          </button>
        </div>

        {form.recipes.length === 0 && <p className="text-sm text-ink/50">No recipe cards yet.</p>}

        {form.recipes.map((r, i) => (
          <div key={i} className="rounded-soft border border-ink/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink/50">Recipe {i + 1}</span>
              <button type="button" onClick={() => removeRecipe(i)} className="text-xs text-rose font-semibold">
                Remove
              </button>
            </div>
            <input
              value={r.name}
              onChange={(e) => updateRecipe(i, { name: e.target.value })}
              placeholder="Recipe name"
              className="w-full rounded-soft border border-ink/20 px-4 py-2 text-sm"
            />
            <div className="grid sm:grid-cols-3 gap-3">
              <input value={r.prep} onChange={(e) => updateRecipe(i, { prep: e.target.value })} placeholder="Prep time" className="rounded-soft border border-ink/20 px-3 py-2 text-sm" />
              <input value={r.servings} onChange={(e) => updateRecipe(i, { servings: e.target.value })} placeholder="Servings" className="rounded-soft border border-ink/20 px-3 py-2 text-sm" />
              <input value={r.calories} onChange={(e) => updateRecipe(i, { calories: e.target.value })} placeholder="Calories" className="rounded-soft border border-ink/20 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-ink/60">Ingredients (one per line)</label>
              <textarea
                value={r.ingredientsText}
                onChange={(e) => updateRecipe(i, { ingredientsText: e.target.value })}
                rows={4}
                className="w-full rounded-soft border border-ink/20 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-ink/60">Steps (one per line)</label>
              <textarea
                value={r.stepsText}
                onChange={(e) => updateRecipe(i, { stepsText: e.target.value })}
                rows={4}
                className="w-full rounded-soft border border-ink/20 px-3 py-2 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="eyebrow">FAQ</h2>
          <button type="button" onClick={addFaq} className="text-sm font-semibold text-clay hover:underline">
            + Add question
          </button>
        </div>

        {form.faq.length === 0 && <p className="text-sm text-ink/50">No FAQ items yet.</p>}

        {form.faq.map((item, i) => (
          <div key={i} className="rounded-soft border border-ink/10 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink/50">Question {i + 1}</span>
              <button type="button" onClick={() => removeFaq(i)} className="text-xs text-rose font-semibold">
                Remove
              </button>
            </div>
            <input
              value={item.q}
              onChange={(e) => updateFaq(i, { q: e.target.value })}
              placeholder="Question"
              className="w-full rounded-soft border border-ink/20 px-3 py-2 text-sm"
            />
            <textarea
              value={item.a}
              onChange={(e) => updateFaq(i, { a: e.target.value })}
              placeholder="Answer"
              rows={2}
              className="w-full rounded-soft border border-ink/20 px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pb-10">
        <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-60">
          {saving ? "Saving..." : "Save Post"}
        </button>
        <button type="button" onClick={() => router.push("/admin")} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
