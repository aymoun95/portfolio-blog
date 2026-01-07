import { Metadata } from "next";
import { HeroSection } from "./_components/hero-section";
import { LatestBlogs } from "./_components/latest-blogs";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to my blog where I share thoughts on web development and technology.",
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
