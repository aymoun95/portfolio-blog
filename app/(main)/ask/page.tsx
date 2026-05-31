"use client";

import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatInput } from "./_components/chat-input";
import { ChatMessage } from "./_components/chat-message";
import { TypingIndicator } from "./_components/typing-indicator";
import { WelcomeSection } from "./_components/welcome-section";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = useCallback(
    async (userMessage?: string) => {
      const text = (userMessage || inputValue).trim();
      if (!text || isLoading) return;

      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setInputValue("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });

        if (!response.ok) {
          let errorText = "Failed to get response";
          try {
            const err = await response.json();
            errorText = err.error || errorText;
          } catch {}
          throw new Error(errorText);
        }

        const answer = await response.text();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: answer },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              error instanceof Error
                ? error.message
                : "Something went wrong. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isLoading],
  );

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.04),transparent_60%)]" />

      <div className="relative mx-auto z-10 flex items-center gap-3 px-1 py-3">
        <div className="flex h-14 max-w-3xl px-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            Aymen AI Assistant
          </div>
        </div>
      </div>
      <p className="relative z-10 -mt-2 pb-3 text-center text-xs text-muted-foreground">
        No memory be precise and thorough with every question
      </p>

      <div className="relative z-10 flex flex-1 flex-col overflow-y-auto px-1">
        {!hasMessages ? (
          <WelcomeSection onSelectSuggestion={handleSend} />
        ) : (
          <div className="mx-auto w-full max-w-3xl flex-1 space-y-5 px-1 py-6">
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
            {/* TypingIndicator shows while waiting for the full invoke response */}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="relative z-10 pb-6">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => handleSend()}
          disabled={isLoading}
        />
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Trained on my projects and experience
        </p>
      </div>
    </div>
  );
}
