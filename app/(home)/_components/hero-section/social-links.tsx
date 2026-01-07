import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export const SocialLinks = () => {
  return (
    <>
      <div className="flex justify-center gap-4 mb-12">
        <a
          href="https://aymen-ben-zlaouia.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="lg" className="gap-2 font-semibold">
            Check My Resume <ExternalLink className="w-4 h-4" />
          </Button>
        </a>
        <Link href="/contact">
          <Button variant="outline" size="lg">
            Get In Touch
          </Button>
        </Link>
      </div>
      <div className="flex justify-center gap-4">
        <Button variant="ghost" size="icon">
          <a
            href="https://github.com/aymoun95"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-5 h-5" />
          </a>
        </Button>
        <Button variant="ghost" size="icon">
          <a
            href="https://www.linkedin.com/in/ben-zlaouia-aymen/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </Button>
        <Button variant="ghost" size="icon">
          <a
            href="mailto:aymenbenzlaouia@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Mail className="w-5 h-5" />
          </a>
        </Button>
      </div>
    </>
  );
};
