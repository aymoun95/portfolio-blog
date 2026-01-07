import { Toaster } from "@/components/ui/sonner";
import { Navigation } from "@/components/web/Navigation";
import ColorThemeProvider from "@/context/color-theme-provider";
import { ThemeProvider } from "@/context/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const shared_open_graph = {
  url: process.env.METABASE_URL || "http://localhost:3000",
  siteName: "Technical Blog | Aymen Ben Zlaouia",
  locale: "en_US",
  type: "website",
  images: [
    {
      url: "/images/thumbnail.png",
      width: 1200,
      height: 630,
    },
  ],
};

export const shared_twitter = {
  card: "summary_large_image",
  images: [
    {
      url: "/images/thumbnail.png",
      width: 1200,
      height: 630,
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.METABASE_URL || "http://localhost:3000"),
  title: {
    default: "Software Engineer Portfolio & Technical Blog | Aymen Ben Zlaouia",
    template: "%s | Aymen Ben Zlaouia",
  },
  description:
    "Explore web development, modern programming, and scalable software architecture. Follow Aymen Ben Zlaouia for practical insights on React, Next.js, and real-world software engineering best practices.",

  keywords: [
    "software engineer",
    "web development",
    "technical blog",
    "React",
    "Next.js",
    "frontend engineering",
    "fullstack development",
    "modern web technologies",
  ],

  openGraph: {
    title: "Software Engineer Portfolio & Technical Blog | Aymen Ben Zlaouia",
    description:
      "Explore web development, modern programming, and scalable software architecture. Practical insights on React, Next.js, and real-world software engineering.",
    ...shared_open_graph,
  },

  twitter: {
    title: "Software Engineer Portfolio & Technical Blog | Aymen Ben Zlaouia",
    description:
      "Practical insights on web development, React, Next.js, and modern software engineering by Aymen Ben Zlaouia.",
    ...shared_twitter,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}  antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ColorThemeProvider>
            <Navigation />
            <main className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
              {children}
            </main>
            <Toaster closeButton />
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
