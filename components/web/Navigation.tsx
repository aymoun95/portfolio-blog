"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { ColorThemeToggle } from "./ColorThemeToggle";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
  { to: "/work", label: "Work" },
  { to: "/contact", label: "Contact" },
];

function NavLinks({ className }: { className: string }) {
  return (
    <>
      {navLinks.map(({ to, label }) => (
        <Link key={to} href={to} className={className}>
          {label}
        </Link>
      ))}
    </>
  );
}

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-background">
      <Collapsible open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-foreground cursor-pointer hover:text-primary">
              <Link href="/">Aymen Ben Zlaouia</Link>
            </h1>

            {isMobile ? (
              <div className="flex items-center gap-2">
                <ColorThemeToggle />
                <ThemeToggle />
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {mobileMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <NavLinks className="text-muted-foreground hover:text-foreground transition-colors" />

                <ColorThemeToggle />
                <ThemeToggle />
              </div>
            )}
          </div>
        </div>

        {isMobile && (
          <CollapsibleContent className="overflow-hidden border-border bg-background data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="py-4 flex flex-col items-center gap-3 md:flex-row  md:justify-center md:gap-6">
              <NavLinks className="font-semibold text-muted-foreground hover:text-foreground transition-colors" />
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </nav>
  );
}
