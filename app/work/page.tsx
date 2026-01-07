import { Button } from "@/components/ui/button";
import { getAllFiles } from "@/lib/file";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { shared_open_graph, shared_twitter } from "../layout";
import { Project, ProjectCard } from "./_components/project-card";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects and real-world work showcasing my experience in full-stack web development and software engineering.",
  openGraph: {
    title: "Work | Aymen Ben Zlaouia",
    description:
      "Selected projects and real-world work showcasing my experience in full-stack web development and software engineering.",
    ...shared_open_graph,
  },
  twitter: {
    title: "Work | Aymen Ben Zlaouia",
    description:
      "Selected projects and real-world work showcasing my experience in full-stack web development and software engineering.",
    ...shared_twitter,
  },
};

const Work = async () => {
  const projects = await getAllFiles<Project>("projects");

  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <div className="flex flex-col items-center text-center gap-4">
            <h1 className="text-4xl font-bold text-foreground mb-4">My Work</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Here's a collection of projects I've worked on, showcasing my
              skills in full-stack development, UI/UX design, and modern web
              technologies.
            </p>
          </div>
        </div>

        {/* Featured Projects */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Featured Projects
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        {/* Other Projects */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Other Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Work;
