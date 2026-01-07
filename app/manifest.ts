import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Portfolio Blog - Aymen Ben Zlouia",
    short_name: "Portfolio Blog - Aymen Ben Zlouia",
    description: "A blog about web development, programming, and technology.",
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
