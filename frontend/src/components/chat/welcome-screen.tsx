"use client";

import { useState } from "react";
import { FileText, User, BookOpen, Shield, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface WelcomeScreenProps {
  onSuggestionClick: (question: string, language: string) => void;
}

const PROMPTS = [
  {
    icon: FileText,
    title: "Fundamental rights",
    text: "What are my fundamental rights under the Constitution of Nepal?",
    cat: "Constitution",
    lang: "en",
  },
  {
    icon: User,
    title: "Citizenship",
    text: "How can I obtain Nepali citizenship?",
    cat: "Rights",
    lang: "en",
  },
  {
    icon: BookOpen,
    title: "Article 17",
    text: "What does Article 17 say about the right to freedom?",
    cat: "Constitution",
    lang: "en",
  },
  {
    icon: Shield,
    title: "Labor rights",
    text: "What are the labor rights of contract employees in Nepal?",
    cat: "Labor",
    lang: "en",
  },
];

const CATEGORIES = ["Popular", "Constitution", "Civil Code", "Labor", "Business", "Family"];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div
      style={{
        padding: "60px 32px 120px",
        maxWidth: 860,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Logo + greeting */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            width: 72,
            height: 72,
            margin: "0 auto 24px",
            borderRadius: 22,
            background:
              "linear-gradient(135deg, var(--accent), oklch(0.42 0.18 25))",
            display: "grid",
            placeItems: "center",
            boxShadow: "var(--shadow-accent)",
            position: "relative",
          }}
        >
          <Logo size={36} color="white" />
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: 26,
              border: "1px solid var(--accent-ring)",
              animation: "pulse-ring 2.6s ease-out infinite",
            }}
          />
        </div>
        <h1
          className="display"
          style={{ fontSize: "clamp(32px, 4vw, 46px)", marginBottom: 12 }}
        >
          <span style={{ fontFamily: "var(--font-devanagari)" }}>नमस्ते</span>{" "}
          — I&apos;m Niti-Sathi.
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--fg-muted)",
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Your AI legal assistant for Nepali law and governance. Ask me anything
          about the Constitution, Acts, legal rights, and procedures.
        </p>
      </div>

      {/* Category pills */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {CATEGORIES.map((c, i) => (
          <button
            key={c}
            onClick={() => setActiveCategory(i)}
            style={{
              padding: "6px 12px",
              borderRadius: 99,
              border: "1px solid var(--border)",
              background: activeCategory === i ? "var(--fg)" : "transparent",
              color: activeCategory === i ? "var(--bg)" : "var(--fg-muted)",
              fontSize: 13,
              transition: "all 0.2s var(--ease)",
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Prompt cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        {PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(p.text, p.lang)}
            style={{
              padding: 18,
              borderRadius: 14,
              border: "1px solid var(--border)",
              background: "var(--bg-elev)",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              transition: "all 0.25s var(--ease)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-strong)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <p.icon size={14} />
              </span>
              <span className="eyebrow" style={{ fontSize: 10.5 }}>
                {p.cat}
              </span>
              <ArrowUpRight
                size={14}
                style={{ color: "var(--fg-faint)", marginLeft: "auto" }}
              />
            </div>
            <div
              style={{
                fontSize: 14.5,
                color: "var(--fg)",
                lineHeight: 1.45,
                fontWeight: 500,
              }}
            >
              {p.text}
            </div>
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 32,
          textAlign: "center",
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
        }}
      >
        Grounded in 10,482 legal clauses · Updated recently
      </div>
    </div>
  );
}
