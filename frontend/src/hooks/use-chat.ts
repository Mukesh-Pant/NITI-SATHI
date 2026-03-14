"use client";

import { useState, useCallback, useRef } from "react";
import { chatAPI } from "@/lib/api";
import { API_BASE_URL } from "@/lib/constants";
import type { Message, Citation } from "@/types";

/**
 * Custom hook for managing chat state and SSE streaming.
 *
 * Connects to the FastAPI SSE endpoint for real-time token streaming,
 * with automatic fallback to non-streaming API on connection failure.
 */
export function useChat(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const appendAssistantContent = useCallback(
    (content: string, citations?: Citation[]) => {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            content,
            ...(citations !== undefined && { citations }),
          };
        }
        return updated;
      });
    },
    []
  );

  const sendMessage = useCallback(
    async (content: string, existingSessionId?: string, language = "en") => {
      const sid = existingSessionId || sessionId;

      // Add user + placeholder assistant messages
      const userMsg: Message = {
        id: `temp-${Date.now()}`,
        role: "user",
        content,
        citations: [],
        language: language as "en" | "ne",
        created_at: new Date().toISOString(),
      };
      const assistantMsg: Message = {
        id: `temp-${Date.now() + 1}`,
        role: "assistant",
        content: "",
        citations: [],
        language: language as "en" | "ne",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      try {
        await streamFromSSE(content, sid, language);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        await fallbackToSync(content, sid, language);
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [sessionId]
  );

  async function streamFromSSE(content: string, sid: string | null, language: string) {
    const token = localStorage.getItem("access_token");
    const params = new URLSearchParams({
      message: content,
      language,
      ...(sid && { session_id: sid }),
    });

    abortRef.current = new AbortController();
    const response = await fetch(
      `${API_BASE_URL}/chat/stream?${params.toString()}`,
      {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        signal: abortRef.current.signal,
      }
    );

    if (!response.ok) throw new Error("Stream connection failed");
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let fullContent = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const parsed = JSON.parse(line.slice(6));

          if ("token" in parsed) {
            fullContent += parsed.token;
            appendAssistantContent(fullContent);
          }
          if ("citations" in parsed) {
            appendAssistantContent(fullContent, parsed.citations);
          }
          if ("session_id" in parsed) {
            setSessionId(parsed.session_id);
          }
        } catch {
          // Skip malformed JSON lines
        }
      }
    }
  }

  async function fallbackToSync(content: string, sid: string | null, language: string) {
    try {
      const { data } = await chatAPI.send(content, sid || undefined, language);
      appendAssistantContent(data.response, data.citations);
      setSessionId(data.session_id);
    } catch {
      appendAssistantContent("Sorry, something went wrong. Please try again later.");
    }
  }

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSessionId(null);
  }, []);

  return {
    messages,
    setMessages,
    isStreaming,
    sessionId,
    setSessionId,
    sendMessage,
    stopStreaming,
    clearMessages,
  };
}
