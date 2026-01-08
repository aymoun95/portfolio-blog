import { Button } from "@/components/ui/button";
import { getAllFilesFrontMatter } from "@/lib/mdx";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BlogCard } from "./blog-card";

export const LatestBlogs = async () => {
  const posts = await getAllFilesFrontMatter();

  const latestPosts = posts
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )
    .slice(0, 3);
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">
          Latest Blog Posts
        </h2>
        <Link href="/blog">
          <Button variant="outline" className="gap-2">
            View All Posts <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
};
