"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import {
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Share2,
  BookOpen,
  ArrowUpRight,
  Quote,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import type { Message, Citation } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

function CitationChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 6,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        background: "var(--gold-soft)",
        color: "var(--gold)",
        border: "1px solid color-mix(in oklch, var(--gold) 40%, transparent)",
      }}
    >
      <Quote size={11} />
      {label}
    </span>
  );
}

function SourceCard({ num, citation }: { num: number; citation: Citation }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 10,
        background: "var(--bg-elev)",
        border: "1px solid var(--border-faint)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        cursor: "pointer",
        transition: "all 0.2s var(--ease)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-ring)";
        e.currentTarget.style.transform = "translateX(2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-faint)";
        e.currentTarget.style.transform = "none";
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: "var(--gold-soft)",
          color: "var(--gold)",
          display: "grid",
          placeItems: "center",
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "var(--font-mono)",
          flexShrink: 0,
        }}
      >
        {num}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{citation.document_name}</div>
        <div
          style={{
            fontSize: 12,
            color: "var(--fg-muted)",
            marginTop: 2,
            fontFamily: "var(--font-mono)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {citation.article_section ||
            (citation.page_number ? `Page ${citation.page_number}` : "")}
        </div>
      </div>
      <div
        style={{
          fontSize: 11,
          color: "var(--fg-faint)",
          fontFamily: "var(--font-mono)",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {(citation.relevance_score * 100).toFixed(0)}% relevant
      </div>
      <ArrowUpRight size={14} style={{ color: "var(--fg-faint)" }} />
    </div>
  );
}

function MsgAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: "var(--fg-muted)",
        transition: "all 0.15s var(--ease)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-hover)";
        e.currentTarget.style.color = "var(--fg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--fg-muted)";
      }}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}
      >
        <div
          style={{
            maxWidth: "75%",
            padding: "12px 18px",
            background: "var(--user-bubble)",
            color: "var(--user-bubble-fg)",
            borderRadius: "18px 18px 4px 18px",
            fontSize: 15,
            lineHeight: 1.55,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
      {/* Avatar */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background:
            "linear-gradient(135deg, var(--accent), oklch(0.4 0.18 25))",
          display: "grid",
          placeItems: "center",
          color: "white",
          flexShrink: 0,
          boxShadow: "var(--shadow-accent)",
        }}
      >
        <Logo size={18} color="white" />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600 }}>Niti-Sathi</span>
          {isStreaming ? (
            <span
              className="chip chip-accent"
              style={{ fontSize: 10.5 }}
            >
              <span
                className="dot"
                style={{ animation: "pulse 1.2s infinite" }}
              />{" "}
              streaming
            </span>
          ) : (
            <span
              style={{
                fontSize: 12,
                color: "var(--fg-faint)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        {/* Message body */}
        <div
          style={{ fontSize: 15, color: "var(--fg)", lineHeight: 1.7 }}
          className="prose-niti"
        >
          {message.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
              components={{
                p: ({ children }) => (
                  <p style={{ marginBottom: 12, lineHeight: 1.7 }}>{children}</p>
                ),
                h4: ({ children }) => (
                  <h4
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 500,
                      margin: "20px 0 10px",
                    }}
                  >
                    {children}
                  </h4>
                ),
                strong: ({ children }) => (
                  <strong style={{ fontWeight: 600 }}>{children}</strong>
                ),
                code: ({ children }) => (
                  <code
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      background: "var(--code-bg)",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    {children}
                  </code>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : null}

          {/* Streaming cursor */}
          {isStreaming && message.content && (
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 16,
                background: "var(--accent)",
                verticalAlign: "-3px",
                marginLeft: 2,
                animation: "blink 1s step-end infinite",
              }}
            />
          )}

          {/* Streaming dots for empty content */}
          {isStreaming && !message.content && (
            <span style={{ display: "inline-flex", gap: 3 }}>
              {[0, 0.15, 0.3].map((delay, i) => (
                <span
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 99,
                    background: "var(--accent)",
                    display: "inline-block",
                    animation: `pulse 1.2s ${delay}s infinite`,
                  }}
                />
              ))}
            </span>
          )}
        </div>

        {/* Inline citation chips */}
        {!isStreaming && message.citations && message.citations.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
            {message.citations.slice(0, 3).map((c, i) => (
              <CitationChip
                key={i}
                label={c.article_section || c.document_name}
              />
            ))}
            {message.citations.length > 3 && (
              <span className="chip" style={{ fontSize: 11 }}>
                +{message.citations.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Source cards */}
        {!isStreaming && message.citations && message.citations.length > 0 && (
          <div
            style={{
              marginTop: 24,
              padding: 20,
              borderRadius: 14,
              border: "1px solid var(--border)",
              background: "var(--bg-sunken)",
            }}
          >
            <div
              className="eyebrow"
              style={{
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <BookOpen size={12} /> Sources consulted ({message.citations.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {message.citations.map((c, i) => (
                <SourceCard key={i} num={i + 1} citation={c} />
              ))}
            </div>
          </div>
        )}

        {/* Action row */}
        {!isStreaming && message.content && (
          <div
            style={{
              marginTop: 20,
              display: "flex",
              gap: 2,
              color: "var(--fg-muted)",
            }}
          >
            <MsgAction
              icon={copied ? Check : Copy}
              label={copied ? "Copied" : "Copy"}
              onClick={copyContent}
            />
            <MsgAction icon={RotateCcw} label="Regenerate" />
            <MsgAction icon={ThumbsUp} />
            <MsgAction icon={ThumbsDown} />
            <MsgAction icon={Share2} />
          </div>
        )}
      </div>
    </div>
  );
}
