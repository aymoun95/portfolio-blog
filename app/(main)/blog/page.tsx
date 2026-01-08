import { shared_open_graph, shared_twitter } from "@/app/layout";
import { Button } from "@/components/ui/button";
import { getAllFilesFrontMatter } from "@/lib/mdx";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "./_components/blog-card";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical articles, tutorials, and deep dives on web development and modern software engineering.",
  openGraph: {
    title: "Blog | Aymen Ben Zlaouia",
    description:
      "Technical articles, tutorials, and deep dives on web development and modern software engineering.",
    ...shared_open_graph,
  },
  twitter: {
    title: "Blog | Aymen Ben Zlaouia",
    description:
      "Technical articles, tutorials, and deep dives on web development and modern software engineering.",
    ...shared_twitter,
  },
};

export default async function BlogPage() {
  const posts = await getAllFilesFrontMatter();

  const sortedPosts = posts.sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
  );
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-bold text-foreground  mb-4">Blog</h1>
            <p className="text-xl text-muted-foreground">
              Thoughts, tutorials, and insights on web development, programming,
              and technology.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {sortedPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
