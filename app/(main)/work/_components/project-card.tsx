import { AspectRatio } from "@/components/ui/aspect-ratio";
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
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

export type Project = {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl?: string;
  featured: boolean;
};

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card
      key={project.title}
      className="overflow-hidden hover:shadow-lg transition-shadow pt-0 "
    >
      <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-scale-down hover:scale-105 transition-transform duration-500"
        />
      </AspectRatio>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription className="leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto  justify-end gap-3 ">
        <Button
          asChild
          size="sm"
          variant={project.featured ? "default" : "outline"}
        >
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </a>
        </Button>
        {project.githubUrl && (
          <Button variant="outline" asChild size="sm">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
