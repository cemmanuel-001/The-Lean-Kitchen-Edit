import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with The Lean Kitchen Edit for questions, collaborations, or recipe requests.",
};

export default function ContactPage() {
  return (
    <div className="container-edit py-14 max-w-prose">
      <p className="eyebrow mb-2">Contact Us</p>
      <h1 className="text-4xl font-bold mb-4">Let&apos;s talk</h1>
      <p className="text-ink/70 mb-8">
        Questions about a recipe, a collab idea, or a press inquiry? Send a note below — we read
        every message.
      </p>

      {/*
        Wire this form up to a serverless handler compatible with static
        Vercel deploys — Formspree or Resend are both drop-in options.
        Replace the action URL below with your endpoint.
      */}
      <form action="https://api.web3forms.com/submit" method="POST" className="card space-y-4 mb-10">

     <input type="hidden" name="access_key" value="0044b634-cdb1-4570-b50a-18872e417463" />
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-1">Name</label>
          <input id="name" name="name" type="text" required className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1">Email</label>
          <input id="email" name="email" type="email" required className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold mb-1">Message</label>
          <textarea id="message" name="message" rows={5} required className="w-full rounded-soft border border-ink/20 px-4 py-3 text-sm" />
        </div>
        <button type="submit" className="btn-primary">Send Message</button>
      </form>

      <div className="text-sm text-ink/70 space-y-2">
        <p><strong>Email:</strong> hello@theleankitchenedit.com</p>
        <p><strong>Pinterest:</strong> <a href="https://pinterest.com" className="text-clay hover:underline">@theleankitchenedit</a></p>
        <p><strong>Instagram:</strong> <a href="https://instagram.com" className="text-clay hover:underline">@theleankitchenedit</a></p>
      </div>
    </div>
  );
}
