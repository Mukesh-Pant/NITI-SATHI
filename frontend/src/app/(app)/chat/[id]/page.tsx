"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatContainer } from "@/components/chat/chat-container";
import { useChat } from "@/hooks/use-chat";
import { sessionsAPI } from "@/lib/api";
import { Loader2 } from "lucide-react";
import type { Message, Citation } from "@/types";

export default function ChatSessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [loading, setLoading] = useState(true);
  const { messages, setMessages, isStreaming, setSessionId, sendMessage, stopStreaming } =
    useChat();

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    setLoading(true);
    try {
      const { data } = await sessionsAPI.get(sessionId);
      const msgs: Message[] = data.messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        citations: m.citations || [],
        language: m.language as "en" | "ne",
        created_at: m.created_at,
      }));
      setMessages(msgs);
      setSessionId(sessionId);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ChatContainer
      messages={messages}
      isStreaming={isStreaming}
      sessionId={sessionId}
      onSend={(msg, lang) => sendMessage(msg, sessionId, lang)}
      onStop={stopStreaming}
    />
  );
}
