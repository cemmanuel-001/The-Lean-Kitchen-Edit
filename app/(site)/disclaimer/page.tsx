import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "The Lean Kitchen Edit's health, nutrition, and results disclaimer.",
};

export default function DisclaimerPage() {
  return (
    <div className="container-edit py-14 max-w-prose">
      <p className="eyebrow mb-2">Legal</p>
      <h1 className="text-4xl font-bold mb-2">Disclaimer</h1>
      <p className="text-sm text-ink/50 mb-8">Last updated: July 18, 2026</p>

      <div className="prose-post">
        <p>
          The content on The Lean Kitchen Edit — including recipes, meal plans, and articles —
          is for informational and educational purposes only. It is not medical, dietary, or
          professional advice, and isn&apos;t a substitute for guidance from a qualified doctor
          or registered dietitian.
        </p>

        <h2>Talk to a professional first</h2>
        <p>
          Please consult a doctor or registered dietitian before starting any new weight-loss or
          diet program, especially if you are pregnant, breastfeeding, managing a medical
          condition, or have a food allergy.
        </p>

        <h2>Nutrition estimates</h2>
        <p>
          Calorie and macro figures on this site are estimates based on standard ingredient
          data. Actual values may vary depending on brand, portion size, and preparation method.
        </p>

        <h2>No guaranteed results</h2>
        <p>
          Individual results vary. We do not guarantee any specific outcome, weight-loss result,
          or timeline from following any recipe, meal plan, or tip published on this site.
        </p>
      </div>
    </div>
  );
}
