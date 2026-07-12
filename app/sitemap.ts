import { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";

const BASE_URL = "https://theleankitchenedit.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/blog",
    "/start-here",
    "/about",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/disclaimer",
    "/terms-of-use",
    "/affiliate-disclosure",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const postPages = getPublishedPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...postPages];
}
