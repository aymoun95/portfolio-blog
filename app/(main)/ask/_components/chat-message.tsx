import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in slide-in-from-bottom-3 duration-500",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "flex items-start gap-3",
          isUser ? "flex-row-reverse" : "",
        )}
      >
        {!isUser && (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <span className="text-xs font-semibold text-primary">AI</span>
          </div>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-[15px] leading-relaxed max-w-[80%]",
            isUser
              ? "flex items-center justify-center bg-primary text-primary-foreground shadow-[0_4px_16px_-4px_hsl(var(--primary)/0.3)]"
              : "bg-muted/60 backdrop-blur-sm border border-border/40 text-foreground shadow-sm",
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
