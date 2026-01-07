import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { shared_open_graph, shared_twitter } from "../layout";
import { ContactInfo } from "./_components/contact-info";
import { SendMessage } from "./_components/send-message";
import { WorkTogether } from "./_components/work-together";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch to discuss collaborations, projects, or opportunities in web development and software engineering.",
  openGraph: {
    title: "Contact | Aymen Ben Zlaouia",
    description:
      "Get in touch to discuss collaborations, projects, or opportunities in web development and software engineering.",
    ...shared_open_graph,
  },
  twitter: {
    title: "Contact | Aymen Ben Zlaouia",
    description:
      "Get in touch to discuss collaborations, projects, or opportunities in web development and software engineering.",
    ...shared_twitter,
  },
};

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              I'd love to hear from you! Whether you have a project in mind,
              want to collaborate, or just want to say hello, feel free to reach
              out.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <SendMessage />
          {/* Contact Information */}
          <div className="lg:order-1 space-y-6 ">
            <ContactInfo />
            <Separator className="my-6" />
            <WorkTogether />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
