import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  readTime: string;
  publishedAt: string;
  summary: string;
  tags: string[];
}

export const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <Card key={post.slug} className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex justify-between items-baseline">
        <CardTitle className="text-2xl">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 shrink-0 ">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 shrink-0" />
            <span className="text-xs sm:text-sm">{post.readTime}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="text-xs sm:text-sm">{post.publishedAt}</span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{post.summary}</p>
      </CardContent>
      <CardFooter className=" flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Link href={`/blog/${post.slug}`} className="w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
