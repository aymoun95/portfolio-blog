import { Bot } from "lucide-react";
import { SuggestionChips } from "./suggestion-chips";

interface WelcomeSectionProps {
  onSelectSuggestion: (question: string) => void;
}

export function WelcomeSection({
  onSelectSuggestion,
}: WelcomeSectionProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 animate-in fade-in duration-700">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.15)]">
          <Bot className="size-7 text-primary" />
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
          Hey, I&apos;m Aymen&apos;s AI Assistant
        </h1>
        <p className="mb-8 text-base text-muted-foreground/90 leading-relaxed">
          Ask me anything about his projects, experience, skills, and interests.
        </p>
        <SuggestionChips onSelect={onSelectSuggestion} />
      </div>
    </div>
  );
}
