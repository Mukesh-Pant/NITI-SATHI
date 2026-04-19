"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Paperclip, Mic, Sparkles, BookOpen } from "lucide-react";

interface MessageInputProps {
  onSend: (message: string, language: string) => void;
  onStop?: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function MessageInput({ onSend, isStreaming, disabled }: MessageInputProps) {
  const [value, setValue] = useState("");
  const [lang, setLang] = useState<"EN" | "ने">("EN");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed, lang === "EN" ? "en" : "ne");
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = !!value.trim() && !isStreaming && !disabled;

  return (
    <div
      style={{
        padding: "16px 32px 24px",
        background: "linear-gradient(180deg, transparent, var(--bg) 40%)",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 20,
            background: "var(--bg-elev)",
            boxShadow: "var(--shadow-md)",
            padding: 10,
            display: "flex",
            flexDirection: "column",
            transition: "all 0.2s var(--ease)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
            {/* Lang toggle */}
            <button
              onClick={() => setLang((l) => (l === "EN" ? "ने" : "EN"))}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                fontFamily:
                  lang === "EN"
                    ? "var(--font-mono)"
                    : "var(--font-devanagari)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--accent)",
                background: "var(--accent-soft)",
                border: "1px solid var(--accent-ring)",
                height: 32,
                alignSelf: "center",
                cursor: "pointer",
                transition: "all 0.2s var(--ease)",
              }}
              title="Toggle language"
            >
              {lang}
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                lang === "EN"
                  ? "Ask about Nepali law, the Constitution, or a specific Act…"
                  : "कुनै पनि कानुनी प्रश्न सोध्नुहोस्…"
              }
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                border: "none",
                outline: "none",
                background: "transparent",
                padding: "8px 10px",
                fontSize: 14.5,
                lineHeight: 1.5,
                minHeight: 32,
                maxHeight: 200,
                fontFamily: "inherit",
                color: "var(--fg)",
              }}
            />

            {/* Attach */}
            <button
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                color: "var(--fg-muted)",
                display: "grid",
                placeItems: "center",
                transition: "background 0.15s var(--ease)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--bg-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              title="Attach"
            >
              <Paperclip size={15} />
            </button>

            {/* Mic */}
            <button
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                color: "var(--fg-muted)",
                display: "grid",
                placeItems: "center",
                transition: "background 0.15s var(--ease)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--bg-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              title="Voice"
            >
              <Mic size={15} />
            </button>

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={!canSend}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: canSend ? "var(--accent)" : "var(--bg-hover)",
                color: canSend ? "white" : "var(--fg-faint)",
                display: "grid",
                placeItems: "center",
                transition: "all 0.2s var(--ease)",
                boxShadow: canSend ? "var(--shadow-accent)" : "none",
                cursor: canSend ? "pointer" : "not-allowed",
              }}
            >
              <ArrowUp size={16} />
            </button>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px 2px",
              fontSize: 11.5,
              color: "var(--fg-faint)",
            }}
          >
            <span className="chip" style={{ fontSize: 10.5, padding: "3px 8px" }}>
              <Sparkles size={10} style={{ marginRight: 4 }} />
              Grounded mode
            </span>
            <span className="chip" style={{ fontSize: 10.5, padding: "3px 8px" }}>
              <BookOpen size={10} style={{ marginRight: 4 }} />
              10,482 clauses
            </span>
            <span
              style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}
            >
              {value.length} / 2000
            </span>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: 11.5,
            color: "var(--fg-faint)",
            marginTop: 10,
          }}
        >
          Niti-Sathi provides AI-generated legal information,{" "}
          <strong style={{ color: "var(--fg-muted)" }}>not legal advice</strong>
          . Verify with a licensed advocate for case-specific guidance.
        </div>
      </div>
    </div>
  );
}
