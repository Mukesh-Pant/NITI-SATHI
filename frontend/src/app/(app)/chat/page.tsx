"use client";

import { useRouter } from "next/navigation";
import { ChatContainer } from "@/components/chat/chat-container";
import { useChat } from "@/hooks/use-chat";
import { useEffect } from "react";

export default function NewChatPage() {
  const { messages, isStreaming, sessionId, sendMessage, stopStreaming } = useChat();
  const router = useRouter();

  // When a session is created from the first message, navigate to it
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      router.replace(`/chat/${sessionId}`);
    }
  }, [sessionId, messages.length, router]);

  return (
    <ChatContainer
      messages={messages}
      isStreaming={isStreaming}
      onSend={(msg, lang) => sendMessage(msg, undefined, lang)}
      onStop={stopStreaming}
    />
  );
}
