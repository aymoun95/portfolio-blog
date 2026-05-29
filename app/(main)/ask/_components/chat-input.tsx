"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-linear-to-t from-background via-background/95 to-transparent">
      <div className="mx-auto max-w-3xl px-4 pb-4 pt-2">
        <div className="relative flex items-end gap-2 rounded-2xl border border-border/60 bg-background/70 backdrop-blur-xl px-4 py-2.5 shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.08)] transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.18)]">
          <Textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something..."
            disabled={disabled}
            className={cn(
              "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent field-sizing-content max-h-32 min-h-32",
            )}
          />
          <Button
            size="icon"
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="mb-0.5 size-9 shrink-0 rounded-full shadow-sm disabled:shadow-none"
            aria-label="Send message"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
