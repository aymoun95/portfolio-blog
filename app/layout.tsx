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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.METABASE_URL || "http://localhost:3000"),
  title: {
    default: "Portfolio Blog - Aymen Ben Zlouia",
    template: "%s | Aymen Ben Zlouia",
  },
  description: "A blog about web development, programming, and technology.",
  openGraph: {
    title: "Portfolio Blog - Aymen Ben Zlouia",
    description: "A blog about web development, programming, and technology.",
    url: process.env.METABASE_URL || "http://localhost:3000",
    siteName: "Portfolio Blog - Aymen Ben Zlouia",
    locale: "en_US",
    type: "website",
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
