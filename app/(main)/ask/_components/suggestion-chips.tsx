interface SuggestionChipsProps {
  onSelect: (question: string) => void;
}

const suggestions = [
  "What projects did he build?",
  "Tell me about his experience",
  "What technologies does he use?",
  "Show me his best work",
];

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion)}
          className="cursor-pointer rounded-full border border-border/60 bg-background/50 backdrop-blur-sm px-4 py-2.5 text-sm text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/4 hover:text-foreground hover:shadow-[0_2px_12px_-4px_hsl(var(--primary)/0.15)] active:scale-[0.97]"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
