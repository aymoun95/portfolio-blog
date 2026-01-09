"use client";
import { useThemeContext } from "@/context/color-theme-provider";
import { themes } from "@/lib/colors-theme";
import { useTheme } from "next-themes";
import { useEffect } from "react";

const generateSvg = (color: string) => {
  return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <rect x="2" y="2" width="60" height="60" rx="12" ry="12" fill="hsl(${color})" />
        <text x="32" y="42" font-size="32" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="bold">A</text>
      </svg>
    `;
};
export default function FaviconUpdater() {
  const { themeColor } = useThemeContext();
  const { theme } = useTheme();

  const color =
    themes[themeColor][theme as "light" | "dark"] || themes.Purple.light;

  useEffect(() => {
    const svg = generateSvg(color.primary);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const existingLinks =
      document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");

    if (existingLinks.length > 0) {
      existingLinks.forEach((link) => {
        link.href = url;
      });
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = url;
      document.head.appendChild(link);
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [color]);

  return null;
}
