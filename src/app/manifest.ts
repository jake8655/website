import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dominik Tóth",
    short_name: "Dominik Tóth",
    description:
      "Dominik Tóth's personal website. I am a student and web developer building modern software.",
    start_url: "/",
    display: "standalone",
    background_color: "#13151a",
    theme_color: "#6d9aee",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
