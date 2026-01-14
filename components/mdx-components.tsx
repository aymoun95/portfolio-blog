import VideoPlayer from "@/components/video-player";
import Link from "next/link";
import React from "react";

const CustomLink = ({
  href = "",
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternal = href.startsWith("/") || href.startsWith("#");

  const className = "text-blue-600 dark:text-blue-400 hover:underline";

  if (isInternal) {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {children}
    </a>
  );
};

const Quote = ({
  children,
  ...props
}: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => {
  return (
    <blockquote
      className="
        mt-4 w-[98%]
        border-l-4 border-blue-500
        bg-blue-50 dark:bg-blue-900
        px-4 py-1
        text-sm 
      "
      {...props}
    >
      {children}
    </blockquote>
  );
};

type DocsHeadingProps = {
  as?: React.ElementType;
  className?: string;
  id?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

const DocsHeading = ({
  as: Tag = "h2",
  id,
  children,
  className = "",
  ...props
}: DocsHeadingProps) => {
  return (
    <Tag
      id={id}
      className={`
        group relative
        scroll-mt-24
        font-bold
        mt-8 mb-4
        ${className}
      `}
      {...props}
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label="Anchor link"
          className="
            ml-2
            opacity-0
            group-hover:opacity-100
            text-blue-500
            no-underline
          "
        >
          #
        </a>
      )}
    </Tag>
  );
};

const Table = ({
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="my-6 w-full overflow-y-auto">
    <table className="w-full text-left border-collapse" {...props}>
      {children}
    </table>
  </div>
);

const Thead = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className="bg-gray-100 dark:bg-gray-800" {...props}>
    {children}
  </thead>
);

const Tbody = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className="align-baseline" {...props}>
    {children}
  </tbody>
);

const Tr = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className="border-b border-gray-200 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800/50"
    {...props}
  >
    {children}
  </tr>
);

const Th = ({
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
  <th
    className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
    {...props}
  >
    {children}
  </th>
);

const Td = ({
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
  <td
    className="px-4 py-3 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
    {...props}
  >
    {children}
  </td>
);

const Hr = () => (
  <hr className="my-4 w-full border-gray-200 dark:border-gray-600" />
);

const MDXComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-4xl font-bold my-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <DocsHeading as="h2" className="text-2xl" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <DocsHeading as="h3" className="text-xl" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <DocsHeading as="h4" className="text-lg" {...props} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <DocsHeading as="h5" className="text-base" {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <DocsHeading as="h6" className="text-sm" {...props} />
  ),

  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-7 " {...props} />
  ),

  a: CustomLink,

  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const isCodeBlock = props.className?.startsWith("language-");

    if (isCodeBlock) {
      return <code {...props} />;
    }

    return (
      <code
        className="
          rounded
          bg-yellow-100 dark:bg-yellow-900
          text-yellow-900 dark:text-yellow-100
          px-1 py-0.5
          text-sm
        "
        {...props}
      />
    );
  },

  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="pt-2 pl-6 list-disc" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="pt-2 pl-6 list-decimal" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="" {...props} />
  ),

  blockquote: Quote,

  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      className="max-w-full rounded justify-self-center
"
      {...props}
    />
  ),

  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,

  hr: Hr,
  br: () => <br className="h-6" />,
  Video: (props: any) => <VideoPlayer {...props} />,
};

export default MDXComponents;
export { CustomLink };
