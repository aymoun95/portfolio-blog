import { shared_open_graph, shared_twitter } from "@/app/layout";
import { Metadata } from "next";
import { HeroSection } from "./_components/hero-section";
import { LatestBlogs } from "./_components/latest-blogs";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Personal website and technical blog by Aymen Ben Zlaouia, sharing insights on web development, modern technologies, and software engineering.",
  openGraph: {
    title: "Home | Aymen Ben Zlaouia",
    description:
      "Personal website and technical blog by Aymen Ben Zlaouia, sharing insights on web development, modern technologies, and software engineering.",
    ...shared_open_graph,
  },
  twitter: {
    title: "Home | Aymen Ben Zlaouia",
    description:
      "Personal website and technical blog by Aymen Ben Zlaouia, sharing insights on web development, modern technologies, and software engineering.",
    ...shared_twitter,
  },
};

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Latest Blog Posts Preview */}
      <LatestBlogs />
    </div>
  );
};

export default Home;
