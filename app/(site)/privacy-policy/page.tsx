import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How The Lean Kitchen Edit collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-edit py-14 max-w-prose">
      <p className="eyebrow mb-2">Legal</p>
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-ink/50 mb-8">Last updated: [insert date]</p>

      <div className="prose-post">
        <p className="rounded-soft bg-butter/20 border border-butter/50 p-4 text-sm">
          <strong>Note for the site owner:</strong> this page is a starting template. Generate
          and customize your final Privacy Policy with a tool like{" "}
          <a href="https://termly.io" className="text-clay underline">Termly</a> or{" "}
          <a href="https://privacypolicies.com" className="text-clay underline">PrivacyPolicies.com</a>{" "}
          before applying for AdSense, then replace this content with the generated text.
        </p>

        <h2>What data we collect</h2>
        <p>
          We may collect data through website analytics (e.g. Google Analytics), cookies, email
          newsletter sign-ups, and any information you submit through our contact form.
        </p>

        <h2>Third-party services</h2>
        <p>
          This site uses Google AdSense for advertising and Google Analytics for site analytics.
          These services may use cookies to serve ads based on your prior visits to this or
          other websites. If we use an email service provider for the newsletter, that provider
          will process the email address you submit.
        </p>

        <h2>Cookies</h2>
        <p>
          Cookies are small files stored on your device that help the site function and help us
          understand how visitors use the site. You can disable cookies in your browser
          settings; some site features may not work as intended if you do.
        </p>

        <h2>Your rights (GDPR / CCPA)</h2>
        <p>
          If you are located in the EU, UK, or California, you may have rights to access,
          correct, or delete your personal data, and to opt out of certain data processing.
          Contact us using the details on our Contact page to exercise these rights.
        </p>

        <h2>Contact</h2>
        <p>Questions about this policy can be sent via our Contact page.</p>
      </div>
    </div>
  );
}
