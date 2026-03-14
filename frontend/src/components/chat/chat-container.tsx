"use client";

import { useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { WelcomeScreen } from "./welcome-screen";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/types";

interface ChatContainerProps {
  messages: Message[];
  isStreaming: boolean;
  onSend: (message: string, language: string) => void;
  onStop: () => void;
  sessionId?: string | null;
}

export function ChatContainer({
  messages,
  isStreaming,
  onSend,
  onStop,
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 ? (
        <>
          <WelcomeScreen
            onSuggestionClick={(question, language) => onSend(question, language)}
          />
          <MessageInput
            onSend={onSend}
            onStop={onStop}
            isStreaming={isStreaming}
          />
        </>
      ) : (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id || i}
                  message={msg}
                  isStreaming={
                    isStreaming &&
                    i === messages.length - 1 &&
                    msg.role === "assistant"
                  }
                />
              ))}
            </div>
          </div>
          <MessageInput
            onSend={onSend}
            onStop={onStop}
            isStreaming={isStreaming}
          />
        </>
      )}
    </div>
  );
}
