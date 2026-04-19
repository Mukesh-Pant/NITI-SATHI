"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { PanelLeft, ChevronRight, Share2, Settings } from "lucide-react";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { WelcomeScreen } from "./welcome-screen";
import { useSidebar } from "@/contexts/sidebar-context";
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
  sessionId,
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { open, setOpen } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Derive breadcrumb label from pathname
  const chatLabel = pathname.startsWith("/chat/") ? "session" : "new chat";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid var(--border-faint)",
          gap: 12,
          background: "color-mix(in oklch, var(--bg) 85%, transparent)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 5,
          flexShrink: 0,
        }}
      >
        {!open && (
          <button
            onClick={() => setOpen(true)}
            style={{
              padding: 8,
              borderRadius: 8,
              color: "var(--fg-muted)",
              transition: "background 0.15s var(--ease)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <PanelLeft size={16} />
          </button>
        )}

        {/* Breadcrumb */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--fg-faint)",
            display: "flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          <span style={{ color: "var(--fg-muted)" }}>niti-sathi</span>
          <ChevronRight size={11} />
          <span style={{ color: "var(--fg-muted)" }}>chat</span>
          <ChevronRight size={11} />
          <span style={{ color: "var(--fg)" }}>{chatLabel}</span>
        </div>

        {/* Right actions */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span className="chip" style={{ fontSize: 10.5 }}>
            <span
              className="dot"
              style={{ background: "#10b981" }}
            />
            Model: niti-v2
          </span>
          <button
            style={{
              padding: 8,
              borderRadius: 8,
              color: "var(--fg-muted)",
              transition: "background 0.15s var(--ease)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            title="Share"
          >
            <Share2 size={15} />
          </button>
          <button
            style={{
              padding: 8,
              borderRadius: 8,
              color: "var(--fg-muted)",
              transition: "background 0.15s var(--ease)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            title="Settings"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>

      {/* Scrollable message area */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", position: "relative" }}
      >
        {messages.length === 0 ? (
          <WelcomeScreen
            onSuggestionClick={(question, language) =>
              onSend(question, language)
            }
          />
        ) : (
          <div
            style={{
              padding: "32px 32px 160px",
              maxWidth: 820,
              margin: "0 auto",
            }}
          >
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
        )}
      </div>

      {/* Composer — absolutely positioned over scroll area */}
      <MessageInput
        onSend={onSend}
        onStop={onStop}
        isStreaming={isStreaming}
      />
    </div>
  );
}
