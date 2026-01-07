import { getAllFilesFrontMatter } from "@/lib/mdx";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.METABASE_URL || "http://localhost:3000";

  // Get all blog posts
  const posts = await getAllFilesFrontMatter();

  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
  }));

  const routes = ["", "/blog", "/work", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 0.9 : 0.8,
  }));

  return [...routes, ...blogPosts];
}
