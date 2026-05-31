export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
        <span className="text-xs font-semibold text-primary">AI</span>
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl bg-muted/60 backdrop-blur-sm border border-border/40 px-4 py-3.5 shadow-sm">
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms] animation-duration-[1.2s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:200ms] animation-duration-[1.2s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:400ms] animation-duration-[1.2s]" />
      </div>
    </div>
  );
}
