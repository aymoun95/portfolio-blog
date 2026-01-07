# Portfolio Blog - Aymen Ben Zlouia

A modern, high-performance personal portfolio and technical blog built with **Next.js 16**, **React 19**, and **MDX**. This project focuses on developer experience, SEO, and a premium aesthetic with dynamic themes.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![pnpm](https://img.shields.io/badge/pnpm-9-orange?style=flat-square&logo=pnpm)

## ✨ Features

- **📝 MDX-Powered Blog**: Write articles in standard Markdown with frontmatter support.
  - Syntax highlighting via `rehype-highlight`.
  - GitHub Flavored Markdown (GFM) support.
  - Automatic reading time calculation.
- **🎨 Dynamic Design System**:
  - Dark and Light mode support using `next-themes`.
  - Custom **Color Theme** system to personalize the UI accent colors.
  - Responsive navigation and modern typography.
- **🚀 SEO & Meta**:
  - Dynamically generated `sitemap.xml` and `robots.txt`.
  - Automatic OpenGraph, Twitter cards, and meta tags for every blog post.
- **✉️ Contact Integration**: functional contact form powered by **Resend**.
- **📂 Portfolio Showcase**: Centralized project management in `data.ts`.
- **⚡ Performance**: Built with Next.js App Router for optimal loading times and Core Web Vitals.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Runtime**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Content**: [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- **Email**: [Resend](https://resend.com/)
- **Forms**: React Hook Form & Zod

## 🚀 Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) installed.
- Node.js 18.17 or later.

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd blog
    ```

2.  Install dependencies:

    ```bash
    pnpm install
    ```

3.  Configure environment variables:
    Create a `.env.local` file in the root directory:

    ```env
    METABASE_URL="http://localhost:3000"
    RESEND_API_KEY="your_resend_api_key_here"
    ```

4.  Run the development server:
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```text
├── actions/            # Server actions (e.g., Email sending)
├── app/                # Next.js App Router (pages and layouts)
├── articles/           # Markdown (.md) blog posts
├── components/         # Reusable UI and web components
├── context/            # React Context providers (Theme, ColorTheme)
├── lib/                # Utility functions and MDX processing
├── public/             # Static assets
├── schemas/            # Zod validation schemas
└── data.ts             # Centralized projects data
```

## 📝 Adding New Posts

Simply add a new `.md` file to the `articles/` directory. Ensure it has the required frontmatter:

```markdown
---
title: "Your Post Title"
publishedAt: "2024-01-01"
summary: "A brief description of the post."
tags: ["nextjs", "react"]
image: "http://domain.com/image.png"
---

Your content here...
```

## 📄 License

This project is personal. Feel free to use it for inspiration or for your own portfolio.
