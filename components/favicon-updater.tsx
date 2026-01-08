"use client";
import { useThemeContext } from "@/context/color-theme-provider";
import { themes } from "@/lib/colors-theme";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function FaviconUpdater() {
  const { themeColor } = useThemeContext();
  const { theme } = useTheme();

  const color =
    themes[themeColor][theme as "light" | "dark"] || themes.Purple.light;

  useEffect(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <rect x="2" y="2" width="60" height="60" rx="12" ry="12" fill="hsl(${color.primary})" />
        <text x="32" y="42" font-size="32" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="bold">A</text>
      </svg>
    `;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [color]);

  return null;
}
