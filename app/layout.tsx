import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theleankitchenedit.com"),
  title: {
    default: "The Lean Kitchen Edit — Eat Simple. Live Lean. Feel Good.",
    template: "%s | The Lean Kitchen Edit",
  },
  description:
    "Realistic recipes, simple meal plans, and no-fuss weight-loss tips for real life — no diet-culture guilt, just food that works.",
  openGraph: {
    siteName: "The Lean Kitchen Edit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
