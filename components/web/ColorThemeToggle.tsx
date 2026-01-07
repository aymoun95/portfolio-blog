"use client";

import { useThemeContext } from "@/context/color-theme-provider";
import { ThemeColors } from "@/lib/colors-theme";

import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const availableThemeColors = [
  {
    name: "Purple",
    light: "262 83% 58%",
    dark: "263 70% 50%",
  },
  {
    name: "Blue",
    light: "217 91% 60%",
    dark: "217 91% 50%",
  },
  {
    name: "Teal",
    light: "173 80% 40%",
    dark: "173 80% 35%",
  },
  {
    name: "Green",
    light: "142 71% 45%",
    dark: "142 71% 40%",
  },
  {
    name: "Orange",
    light: "25 95% 53%",
    dark: "25 95% 48%",
  },
  {
    name: "Pink",
    light: "330 81% 60%",
    dark: "330 81% 50%",
  },
  {
    name: "Rose",
    light: "346 77% 60%",
    dark: "346 77% 50%",
  },
];

export function ColorThemeToggle() {
  const { themeColor, setThemeColor } = useThemeContext();
  const { theme } = useTheme();

  const handleThemeChange = (theme: string) => {
    setThemeColor(theme as ThemeColors);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Accent Color</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          defaultValue={themeColor}
          value={themeColor}
          onValueChange={handleThemeChange}
        >
          {availableThemeColors.map((color) => (
            <DropdownMenuRadioItem key={color.name} value={color.name}>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{
                    backgroundColor: `hsl(${
                      theme === "light" ? color.light : color.dark
                    })`,
                  }}
                />
                <span>{color.name}</span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
