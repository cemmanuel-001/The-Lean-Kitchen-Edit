import fs from "fs";
import path from "path";

export type SiteContent = {
  heroEyebrow: string;
  heroHeadlineMain: string;
  heroHeadlineItalic: string;
  heroHeadlineEnd: string;
  heroSubhead: string;
  newsletterHeadline: string;
  newsletterBlurb: string;
};

const SITE_FILE = path.join(process.cwd(), "content", "site.json");

export function getSiteContent(): SiteContent {
  const raw = fs.readFileSync(SITE_FILE, "utf-8");
  return JSON.parse(raw);
}

export type AboutContent = {
  headline: string;
  bodyMarkdown: string;
};

const ABOUT_FILE = path.join(process.cwd(), "content", "about.json");

export function getAboutContent(): AboutContent {
  const raw = fs.readFileSync(ABOUT_FILE, "utf-8");
  return JSON.parse(raw);
}
