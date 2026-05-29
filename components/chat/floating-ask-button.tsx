"use client";

import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingAskButton() {
  const pathname = usePathname();

  if (pathname === "/ask") return null;

  return (
    <Link
      href="/ask"
      aria-label="Ask AI"
      className={cn(
        "group fixed bottom-6 right-6 z-50 flex h-14 items-center gap-2 rounded-full",
        "bg-primary/90 text-primary-foreground shadow-lg backdrop-blur",
        "border border-primary/20 ring-1 ring-primary/30",
        "transition-all duration-300 ease-out",
        "hover:bg-primary hover:shadow-xl hover:scale-[1.03] hover:pr-5",
        "w-14 hover:w-auto overflow-hidden pl-3.5",
      )}
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center group-hover:justify-center">
        <span className="absolute inset-0 rounded-full bg-primary-foreground/10 animate-ping opacity-60 group-hover:opacity-0" />
        <Bot className="h-6 w-6 shrink-0" />
      </span>
      <span className="pr-1 whitespace-nowrap text-sm font-medium opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-30 transition-all duration-300">
        Ask AI
      </span>
    </Link>
  );
}
