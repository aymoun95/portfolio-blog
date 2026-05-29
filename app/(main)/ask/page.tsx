"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Sparkles } from "lucide-react";
import { ChatInput } from "./_components/chat-input";
import { ChatMessage } from "./_components/chat-message";
import { TypingIndicator } from "./_components/typing-indicator";
import { WelcomeSection } from "./_components/welcome-section";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const assistantResponses: Record<string, string> = {
  "What projects did you build?":
    "I've built several projects including a full-stack e-commerce platform, a real-time collaborative editor, and various open-source tools. Check out my /work page for details on each project, including tech stacks and live demos.",
  "Tell me about your experience":
    "I'm a software engineer with experience building modern web applications. I work primarily with TypeScript, React, and Node.js. My background includes full-stack development, system design, and architecture decisions. You can find more details on my LinkedIn profile.",
  "What technologies do you use?":
    "I work with a modern stack: React/Next.js for frontend, Node.js for backend, TypeScript throughout, and various databases. I'm also experienced with Docker, cloud services (AWS/Vercel), and CI/CD pipelines. My blog covers many of these technologies in depth.",
  "Show me your best work":
    "My portfolio highlights include a high-performance e-commerce platform handling thousands of requests per minute, and a real-time collaboration tool. Both demonstrate my ability to build scalable, production-grade applications. Visit the /work page to see them in detail.",
};

function getAssistantResponse(userMessage: string): string {
  const match = Object.entries(assistantResponses).find(([key]) =>
    userMessage.toLowerCase().includes(key.toLowerCase().slice(0, 10)),
  );
  if (match) return match[1];

  return `That's a great question! Based on my portfolio, I'd recommend checking out the relevant section. For specific details about "${userMessage}", feel free to browse my blog posts or work page — there's plenty of content that covers this topic.`;
}

export default function AskPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function handleSend(userMessage?: string) {
    const text = (userMessage || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const assistantMsg: Message = {
        role: "assistant",
        content: getAssistantResponse(text),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] flex-col overflow-hidden  ">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.04),transparent_60%)]" />

      <div className="relative mx-auto z-10 flex items-center gap-3   px-1 py-3">
        <div className="flex  h-14 max-w-3xl px-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            Aymen AI Assistant
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col overflow-y-auto px-1">
        {!hasMessages ? (
          <WelcomeSection onSelectSuggestion={handleSend} />
        ) : (
          <div className="mx-auto w-full max-w-3xl flex-1 space-y-5 px-1 py-6">
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
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
