import MDXComponents from "@/components/mdx-components";
import fs from "fs";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const root = process.cwd();

interface Frontmatter {
  title: string;
  publishedAt: string;
  summary: string;
  tags: string[];
  image: string;
}

export async function getFiles(dir: string) {
  return fs.readdirSync(path.join(root, dir));
}

export async function getFileBySlug(slug: string) {
  const filePath = path.join(root, "articles", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf8");

  const { frontmatter, content } = await compileMDX<Frontmatter>({
    source,
    components: MDXComponents,
    options: {
      parseFrontmatter: true,

      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, [rehypeHighlight]],
      },
    },
  });

  return {
    content,
    source,
    frontMatter: {
      wordCount: source.split(/\s+/gu).length,
      readTime: readingTime(source).text,
      slug: slug || null,
      ...frontmatter,
    },
  };
}

export async function getAllFilesFrontMatter() {
  const files = fs.readdirSync(path.join(root, "articles"));

  return Promise.all(
    files.map(async (postSlug) => {
      const source = fs.readFileSync(
        path.join(root, "articles", postSlug),
        "utf8",
      );
      const { frontmatter } = await compileMDX<Frontmatter>({
        source,
        options: {
          parseFrontmatter: true,
        },
      });
      return {
        ...frontmatter,
        readTime: readingTime(source).text,
        slug: postSlug.replace(".md", ""),
      };
    }),
  );
}
