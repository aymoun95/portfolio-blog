import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export const SocialLinks = () => {
  return (
    <>
      <div className="flex justify-center gap-4 mb-12">
        <Button
          asChild
          size="lg"
          className="gap-2 font-semibold dark:bg-primary/45 dark:hover:bg-primary/65
"
        >
          <a
            href="https://aymen-ben-zlaouia.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check My Resume <ExternalLink className="w-4 h-4 stroke-[2.5]" />
          </a>
        </Button>
        <Link href="/contact">
          <Button variant="outline" size="lg">
            Get In Touch
          </Button>
        </Link>
      </div>
      <div className="flex justify-center gap-4">
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="min-h-[44px] min-w-[44px]"
        >
          <a
            href="https://github.com/aymoun95"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub profile</span>
          </a>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="min-h-[44px] min-w-[44px]"
        >
          <a
            href="https://www.linkedin.com/in/ben-zlaouia-aymen/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="w-5 h-5" />
            <span className="sr-only">Linkedin profile</span>
          </a>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="min-h-[44px] min-w-[44px]"
        >
          <a
            href="mailto:aymenbenzlaouia@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Mail className="w-5 h-5" />
            <span className="sr-only">Send email</span>
          </a>
        </Button>
      </div>
    </>
  );
};
