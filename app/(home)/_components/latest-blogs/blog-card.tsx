import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface BlogCardProps {
  post: {
    readTime: string;
    slug: string;
    title: string;
    publishedAt: string;
    summary: string;
    tags: string[];
  };
}
export const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card key={post.slug} className="hover:shadow-md  transition-shadow">
      <CardHeader className="pb-3">
        <CardDescription className="ml-auto">
          {post.publishedAt}
        </CardDescription>
        <CardTitle className="text-xl">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{post.summary}</p>
      </CardContent>
      <CardFooter className="justify-end mt-auto">
        <Link
          href={`/blog/${post.slug}`}
          className="text-primary hover:underline"
          aria-label={`Read more about ${post.title}`}
        >
          Read more
          <span className="sr-only">Read more about {post.title}</span>
        </Link>
      </CardFooter>
    </Card>
  );
};
