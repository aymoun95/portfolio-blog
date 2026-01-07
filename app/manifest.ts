import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Technical Blog | Aymen Ben Zlaouia",
    short_name: "Aymen Ben Zlaouia",
    description:
      "Dive into web development, programming, and modern tech. Join Aymen Ben Zlaouia for insights on React, Next.js, and software engineering best practices.",
    start_url: "/",
    display: "browser",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
