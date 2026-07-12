import type { Metadata } from "next";
import FaqBlock from "@/components/FaqBlock";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about recipes, nutrition estimates, meal plans, and using The Lean Kitchen Edit.",
};

const items = [
  {
    q: "Are the recipes and calorie counts accurate?",
    a: "Calorie and macro figures are estimates, calculated from standard ingredient databases (like the USDA FoodData Central). Actual values can vary by brand, portion, and preparation method, so treat every figure as a helpful estimate, not an exact number.",
  },
  {
    q: "Can I use these meal plans if I have a medical condition or allergy?",
    a: "Please check with a doctor or registered dietitian before starting any new eating plan, especially if you have a medical condition, allergy, or are pregnant or breastfeeding. See our Disclaimer for more.",
  },
  {
    q: "How often is new content published?",
    a: "New recipes, meal plans, and tips go up regularly. The best way to keep up is the newsletter on the homepage or following along on Pinterest.",
  },
  {
    q: "Can I republish or repin your recipes and images?",
    a: "You're welcome to pin and share links back to the original post. Please don't republish full recipe text or images elsewhere without permission — see our Terms of Use for details.",
  },
  {
    q: "How do I download the printable meal plans and grocery lists?",
    a: "Printables are linked directly inside the relevant post — look for the download link in the meal-plan sections.",
  },
];

export default function FaqPage() {
  return (
    <div className="container-edit py-14 max-w-prose">
      <p className="eyebrow mb-2">FAQ</p>
      <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
      <FaqBlock items={items} />
      <p className="text-sm text-ink/60 mt-8">
        Still have a question? <Link href="/contact" className="text-clay font-semibold hover:underline">Contact us</Link> — we&apos;re happy to help.
      </p>
    </div>
  );
}
