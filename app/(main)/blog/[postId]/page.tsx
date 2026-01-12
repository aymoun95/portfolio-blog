import { buttonVariants } from "@/components/ui/button";
import { getFileBySlug, getFiles } from "@/lib/mdx";
import "@/styles/md-theme.css";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{ postId: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { postId } = await params;
  const { frontMatter } = await getFileBySlug(postId);

  return {
    title: frontMatter.title,
    description: frontMatter.summary,
    keywords: frontMatter.tags,
    openGraph: {
      title: frontMatter.title,
      description: frontMatter.summary,
      type: "article",
      publishedTime: frontMatter.publishedAt,
      url: `${process.env.METABASE_URL || "http://localhost:3000"}/blog/${postId}`,
      images: [frontMatter.image],
    },
    twitter: {
      card: "summary_large_image",
      title: frontMatter.title,
      description: frontMatter.summary,
      images: [frontMatter.image],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId } = await params;
  const { frontMatter, content } = await getFileBySlug(postId);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative">
      <Link
        href="/blog"
        className={buttonVariants({ variant: "ghost", className: "mb-4" })}
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>
      <div className="flex flex-col md:flex-row justify-between items-center space-x-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground  mb-0 text-center md:text-left">
          {frontMatter.title}
        </h1>
        <div className="flex items-center shrink-0 ">
          <p className="text-sm text-muted-foreground text-center">
            {frontMatter.readTime} •1
            {new Date(frontMatter.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="mx-auto w-full px-2.5 md:px-20">
        <article className="prose dark:prose-invert">{content}</article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getFiles("articles");
  return posts.map((post) => ({
    postId: post.replace(/\.md/, ""),
  }));
}
